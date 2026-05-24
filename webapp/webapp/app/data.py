"""
Data access layer - pulls all dynamic content from SQLite.
Mirrors src/lib/data.ts from the original TypeScript project.
"""
from .db import get_db, query_all, query_one, execute


# ----- Settings (key-value) -----
def get_all_settings() -> dict:
    rows = query_all('SELECT key, value FROM site_settings')
    return {r['key']: r['value'] for r in rows}


def get_setting(key: str, fallback: str = '') -> str:
    row = query_one('SELECT value FROM site_settings WHERE key = ?', (key,))
    return row['value'] if row else fallback


def set_setting(key: str, value: str):
    execute(
        """
        INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
        """,
        (key, value if value is not None else ''),
    )


def set_settings_bulk(settings: dict) -> int:
    db = get_db()
    count = 0
    for k, v in settings.items():
        db.execute(
            """
            INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')
            """,
            (k, v if v is not None else ''),
        )
        count += 1
    db.commit()
    return count


# ----- Generic list helpers -----
def list_visible(table: str) -> list:
    return query_all(
        f'SELECT * FROM {table} WHERE is_visible = 1 ORDER BY sort_order ASC, id ASC'
    )


def list_all(table: str) -> list:
    return query_all(f'SELECT * FROM {table} ORDER BY sort_order ASC, id ASC')


# ----- Images -----
def get_image(image_id: str):
    return query_one('SELECT * FROM images WHERE id = ?', (image_id,))


def list_images() -> list:
    return query_all(
        'SELECT id, name, description, mime_type, size_bytes, updated_at FROM images ORDER BY id'
    )


def save_image(image_id, name, description, data_url, mime_type, size_bytes):
    execute(
        """
        INSERT INTO images (id, name, description, data_url, mime_type, size_bytes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          data_url = excluded.data_url,
          mime_type = excluded.mime_type,
          size_bytes = excluded.size_bytes,
          updated_at = datetime('now')
        """,
        (image_id, name, description, data_url, mime_type, size_bytes),
    )


def delete_image_row(image_id: str):
    execute('DELETE FROM images WHERE id = ?', (image_id,))


# ----- Aggregate for homepage -----
def get_page_data() -> dict:
    settings = get_all_settings()
    features = list_visible('features')
    future = list_visible('future_cards')
    steps = list_visible('steps')
    faqs = list_visible('faqs')
    roles = list_visible('roles')
    stats = list_visible('stats')
    safety = list_visible('safety_points')
    marquee = list_visible('marquee_items')

    roles_by_group = {}
    for r in roles:
        roles_by_group.setdefault(r['group_name'], []).append(r)

    return {
        'settings': settings,
        'features': features,
        'future': future,
        'steps': steps,
        'faqs': faqs,
        'roles_by_group': roles_by_group,
        'stats': stats,
        'safety': safety,
        'marquee': marquee,
    }
