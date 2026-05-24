"""
Authentication: SHA-256 password hashing + DB-backed sessions stored in a cookie.
Mirrors the original TypeScript implementation 1:1 (same SALT, same cookie name).
"""
import hashlib
import secrets
from datetime import datetime, timedelta
from functools import wraps

from flask import request, redirect, url_for, jsonify, g, current_app

from .db import get_db

SALT = 'byteegypt-salt-2026'
SESSION_COOKIE = 'be_session'
SESSION_TTL_SECONDS = 60 * 60 * 24 * 7  # 7 days


def hash_password(password: str) -> str:
    return hashlib.sha256((password + SALT).encode('utf-8')).hexdigest()


def generate_token() -> str:
    return secrets.token_hex(32)


def login_user(username: str, password: str):
    """Returns (user_dict, token) on success, or None."""
    db = get_db()
    pw_hash = hash_password(password)
    row = db.execute(
        'SELECT id, username FROM admin_users WHERE username = ? AND password_hash = ?',
        (username, pw_hash),
    ).fetchone()
    if not row:
        return None

    token = generate_token()
    expires_at = (datetime.utcnow() + timedelta(seconds=SESSION_TTL_SECONDS)).strftime('%Y-%m-%d %H:%M:%S')
    db.execute(
        'INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)',
        (token, row['id'], expires_at),
    )
    db.commit()
    return {'id': row['id'], 'username': row['username']}, token


def logout_user():
    token = request.cookies.get(SESSION_COOKIE)
    if token:
        db = get_db()
        db.execute('DELETE FROM sessions WHERE token = ?', (token,))
        db.commit()


def get_current_user():
    """Cached on flask.g for the request."""
    if hasattr(g, '_current_user'):
        return g._current_user

    token = request.cookies.get(SESSION_COOKIE)
    if not token:
        g._current_user = None
        return None

    db = get_db()
    row = db.execute(
        """
        SELECT s.token, s.expires_at, u.id AS user_id, u.username
        FROM sessions s
        INNER JOIN admin_users u ON u.id = s.user_id
        WHERE s.token = ? AND datetime(s.expires_at) > datetime('now')
        """,
        (token,),
    ).fetchone()

    if not row:
        g._current_user = None
        return None

    g._current_user = {'id': row['user_id'], 'username': row['username']}
    return g._current_user


def change_password(username: str, new_password: str):
    db = get_db()
    db.execute(
        'UPDATE admin_users SET password_hash = ? WHERE username = ?',
        (hash_password(new_password), username),
    )
    db.commit()


# ----- Decorators -----
def require_auth(view):
    """Page-style auth - redirects to login."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = get_current_user()
        if not user:
            return redirect('/admin/login')
        return view(*args, **kwargs)
    return wrapped


def require_auth_api(view):
    """API-style auth - returns 401 JSON."""
    @wraps(view)
    def wrapped(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'error': 'unauthorized'}), 401
        return view(*args, **kwargs)
    return wrapped
