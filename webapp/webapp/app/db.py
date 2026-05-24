"""
Database layer - SQLite via stdlib sqlite3.
Compatible with PythonAnywhere (no external DB needed - SQLite file lives on disk).
"""
import os
import sqlite3
from flask import g, current_app


# ----- Connection helpers -----
def get_db() -> sqlite3.Connection:
    """Get a per-request DB connection (stored on flask.g)."""
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        g.db.row_factory = sqlite3.Row
        # Enforce foreign keys
        g.db.execute('PRAGMA foreign_keys = ON;')
    return g.db


def close_db(_exc=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()


def init_app(app):
    app.teardown_appcontext(close_db)


# ----- Schema & seed bootstrap -----
def _project_root() -> str:
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def init_db():
    """Apply schema.sql (idempotent)."""
    db = get_db()
    schema_path = os.path.join(_project_root(), 'schema.sql')
    with open(schema_path, 'r', encoding='utf-8') as f:
        db.executescript(f.read())
    db.commit()


def seed_db():
    """Apply seed.sql + create default admin user + seed default community logo."""
    db = get_db()
    seed_path = os.path.join(_project_root(), 'seed.sql')
    if os.path.exists(seed_path):
        with open(seed_path, 'r', encoding='utf-8') as f:
            db.executescript(f.read())

    # Create default admin user if none exists
    from .auth import hash_password
    cur = db.execute('SELECT COUNT(*) AS n FROM admin_users')
    row = cur.fetchone()
    if row and row['n'] == 0:
        db.execute(
            'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
            ('admin', hash_password('admin123')),
        )

    # Seed default community logo image (if not present yet)
    _seed_default_logo(db)

    db.commit()


def _seed_default_logo(db):
    """Copy community-logo.png into the images table as 'logo' on first boot."""
    import base64
    existing = db.execute("SELECT id FROM images WHERE id = 'logo'").fetchone()
    if existing:
        return
    logo_path = os.path.join(_project_root(), 'app', 'static', 'community-logo.png')
    if not os.path.exists(logo_path):
        return
    with open(logo_path, 'rb') as f:
        raw = f.read()
    b64 = base64.b64encode(raw).decode('ascii')
    data_url = f'data:image/png;base64,{b64}'
    db.execute(
        """
        INSERT OR REPLACE INTO images (id, name, description, data_url, mime_type, size_bytes, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        """,
        ('logo', 'شعار المجتمع', 'الصورة الأساسية للمجتمع ByteEgypt', data_url, 'image/png', len(raw)),
    )


def ensure_initialized():
    """Run once on app boot: create schema + seed if DB is brand-new or empty."""
    db_path = current_app.config['DATABASE']
    needs_init = not os.path.exists(db_path) or os.path.getsize(db_path) == 0

    # Even if DB file exists, make sure tables are there (handles partial wipes)
    db = get_db()
    has_tables = db.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='admin_users'"
    ).fetchone()

    if needs_init or not has_tables:
        init_db()
        seed_db()


# ----- Generic helpers used by routes/data layer -----
def query_all(sql: str, params: tuple = ()) -> list:
    db = get_db()
    return [dict(r) for r in db.execute(sql, params).fetchall()]


def query_one(sql: str, params: tuple = ()):
    db = get_db()
    row = db.execute(sql, params).fetchone()
    return dict(row) if row else None


def execute(sql: str, params: tuple = ()) -> sqlite3.Cursor:
    db = get_db()
    cur = db.execute(sql, params)
    db.commit()
    return cur
