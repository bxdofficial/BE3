"""
ByteEgypt | بايت مصر - Flask Application Factory
================================================
Pure Python (Flask) version - ready to deploy on PythonAnywhere or any WSGI host.

egybyte by Yousef Khames
"""
import os
from flask import Flask


def create_app(test_config=None):
    """Application factory - creates and configures a Flask app instance."""
    # Resolve instance path so SQLite DB lives at <project>/instance/byteegypt.sqlite3
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    instance_path = os.path.join(project_root, 'instance')
    os.makedirs(instance_path, exist_ok=True)

    app = Flask(
        __name__,
        instance_path=instance_path,
        static_folder='static',
        template_folder='templates',
    )

    # Default configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'byteegypt-default-secret-change-me-2026'),
        DATABASE=os.path.join(instance_path, 'byteegypt.sqlite3'),
        SESSION_COOKIE_NAME='be_session',
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # 16 MB max upload (we limit images to 1.5 MB in code)
    )

    if test_config:
        app.config.update(test_config)

    # Register database hooks
    from . import db
    db.init_app(app)

    # Auto-initialize DB + seed on first run (so user doesn't need a separate step on PythonAnywhere)
    with app.app_context():
        db.ensure_initialized()

    # Register blueprints
    from .routes_public import bp as public_bp
    from .routes_admin import bp as admin_bp
    from .routes_api import bp as api_bp

    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(api_bp, url_prefix='/api')

    return app
