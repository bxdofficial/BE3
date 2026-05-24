"""
JSON API for the admin dashboard. All endpoints require auth.
Prefix: /api
"""
from flask import Blueprint, jsonify, request

from . import data
from .db import get_db, execute
from .auth import require_auth_api, get_current_user, login_user, change_password

bp = Blueprint('api', __name__)

# Whitelist of editable list-style tables + their allowed columns.
LIST_TABLES = {
    'features':      ['icon', 'gradient', 'title', 'description', 'sort_order', 'is_visible'],
    'future_cards':  ['icon', 'title', 'description', 'badge', 'sort_order', 'is_visible'],
    'steps':         ['step_num', 'icon', 'title', 'description', 'sort_order', 'is_visible'],
    'faqs':          ['question', 'answer', 'sort_order', 'is_visible'],
    'roles':         ['group_name', 'label', 'color', 'sort_order', 'is_visible'],
    'stats':         ['icon', 'number', 'label', 'sort_order', 'is_visible'],
    'safety_points': ['icon', 'text', 'sort_order', 'is_visible'],
    'marquee_items': ['icon', 'label', 'sort_order', 'is_visible'],
    'onestop_items': ['icon', 'gradient', 'title', 'description', 'sort_order', 'is_visible'],
}


# ============ Settings ============
@bp.route('/settings', methods=['GET'])
@require_auth_api
def get_settings():
    return jsonify({'settings': data.get_all_settings()})


@bp.route('/settings', methods=['PUT'])
@require_auth_api
def put_settings():
    body = request.get_json(silent=True) or {}
    settings = body.get('settings')
    if not isinstance(settings, dict):
        return jsonify({'error': 'missing settings'}), 400
    count = data.set_settings_bulk(settings)
    return jsonify({'ok': True, 'count': count})


# ============ Generic CRUD on list tables ============
@bp.route('/list/<table>', methods=['GET'])
@require_auth_api
def list_table(table):
    if table not in LIST_TABLES:
        return jsonify({'error': 'unknown table'}), 404
    return jsonify({'items': data.list_all(table)})


@bp.route('/list/<table>', methods=['POST'])
@require_auth_api
def create_row(table):
    if table not in LIST_TABLES:
        return jsonify({'error': 'unknown table'}), 404
    fields = LIST_TABLES[table]
    body = request.get_json(silent=True) or {}
    cols = [f for f in fields if f in body]
    if not cols:
        return jsonify({'error': 'no fields'}), 400
    placeholders = ','.join(['?'] * len(cols))
    values = tuple(body[f] for f in cols)
    cur = execute(
        f'INSERT INTO {table} ({",".join(cols)}) VALUES ({placeholders})',
        values,
    )
    return jsonify({'ok': True, 'id': cur.lastrowid})


@bp.route('/list/<table>/<int:row_id>', methods=['PUT'])
@require_auth_api
def update_row(table, row_id):
    if table not in LIST_TABLES:
        return jsonify({'error': 'unknown table'}), 404
    fields = LIST_TABLES[table]
    body = request.get_json(silent=True) or {}
    cols = [f for f in fields if f in body]
    if not cols:
        return jsonify({'error': 'no fields'}), 400
    set_clause = ','.join(f'{c} = ?' for c in cols)
    values = tuple(body[f] for f in cols) + (row_id,)
    execute(f'UPDATE {table} SET {set_clause} WHERE id = ?', values)
    return jsonify({'ok': True})


@bp.route('/list/<table>/<int:row_id>', methods=['DELETE'])
@require_auth_api
def delete_row(table, row_id):
    if table not in LIST_TABLES:
        return jsonify({'error': 'unknown table'}), 404
    execute(f'DELETE FROM {table} WHERE id = ?', (row_id,))
    return jsonify({'ok': True})


@bp.route('/list/<table>/reorder', methods=['POST'])
@require_auth_api
def reorder_rows(table):
    if table not in LIST_TABLES:
        return jsonify({'error': 'unknown table'}), 404
    body = request.get_json(silent=True) or {}
    order = body.get('order')
    if not isinstance(order, list):
        return jsonify({'error': 'bad order'}), 400
    db = get_db()
    for idx, row_id in enumerate(order):
        db.execute(
            f'UPDATE {table} SET sort_order = ? WHERE id = ?', (idx + 1, row_id)
        )
    db.commit()
    return jsonify({'ok': True})


# ============ Images ============
@bp.route('/images', methods=['GET'])
@require_auth_api
def images_list():
    return jsonify({'items': data.list_images()})


@bp.route('/images/<image_id>', methods=['GET'])
@require_auth_api
def image_get(image_id):
    img = data.get_image(image_id)
    if not img:
        return jsonify({'error': 'not found'}), 404
    return jsonify({'item': img})


@bp.route('/images/<image_id>', methods=['PUT'])
@require_auth_api
def image_put(image_id):
    body = request.get_json(silent=True) or {}
    existing = data.get_image(image_id)

    name = body.get('name') or (existing['name'] if existing else image_id)
    description = body.get('description') if 'description' in body else (existing['description'] if existing else None)
    data_url = body.get('data_url') or (existing['data_url'] if existing else '')

    if not data_url:
        return jsonify({'error': 'data_url required'}), 400

    # Limit data URL size (~ 2.5MB after base64 = 1.8MB binary)
    if len(data_url) > 2_500_000:
        return jsonify({'error': 'image too large (max ~1.5MB)'}), 413

    mime = body.get('mime_type') or (existing['mime_type'] if existing else None)
    size = body.get('size_bytes') or (existing['size_bytes'] if existing else len(data_url))

    data.save_image(image_id, name, description, data_url, mime, size)
    return jsonify({'ok': True})


@bp.route('/images/<image_id>', methods=['DELETE'])
@require_auth_api
def image_delete(image_id):
    data.delete_image_row(image_id)
    return jsonify({'ok': True})


# ============ Account ============
@bp.route('/account/password', methods=['POST'])
@require_auth_api
def account_password():
    body = request.get_json(silent=True) or {}
    current = body.get('current') or ''
    nxt = body.get('next') or ''
    if not current or not nxt or len(nxt) < 6:
        return jsonify({'error': 'كلمة السر الجديدة لازم 6 أحرف على الأقل'}), 400

    user = get_current_user()
    if not user:
        return jsonify({'error': 'unauthorized'}), 401

    # Verify current password by trying to log in (this creates a throwaway session - fine)
    check = login_user(user['username'], current)
    if not check:
        return jsonify({'error': 'كلمة السر الحالية غير صحيحة'}), 400

    change_password(user['username'], nxt)
    return jsonify({'ok': True})


# ============ Overview (counts for dashboard home) ============
@bp.route('/overview', methods=['GET'])
@require_auth_api
def overview():
    db = get_db()
    def count(table):
        row = db.execute(f'SELECT COUNT(*) AS n FROM {table}').fetchone()
        return row['n'] if row else 0
    return jsonify({
        'features': count('features'),
        'future':   count('future_cards'),
        'steps':    count('steps'),
        'faqs':     count('faqs'),
        'roles':    count('roles'),
        'images':   count('images'),
        'marquee':  count('marquee_items'),
    })
