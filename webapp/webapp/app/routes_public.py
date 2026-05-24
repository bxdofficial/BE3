"""
Public routes - homepage + public image serving.
"""
import base64
import re
from flask import Blueprint, render_template, abort, redirect, Response, url_for

from . import data

bp = Blueprint('public', __name__)


@bp.route('/')
def home():
    page = data.get_page_data()
    logo = data.get_image('logo')
    if logo and logo.get('data_url'):
        logo_url = logo['data_url']
    else:
        # Fallback to community PNG (the one the user provided)
        logo_url = url_for('static', filename='community-logo.png')
    return render_template('home.html', **page, logo_url=logo_url)


@bp.route('/images/<image_id>')
def serve_image(image_id):
    """Serve image by id - if it's a data URL we decode and stream the bytes."""
    img = data.get_image(image_id)
    if not img:
        return abort(404)

    data_url = img.get('data_url') or ''
    if data_url.startswith('data:'):
        match = re.match(r'^data:([^;]+);base64,(.+)$', data_url)
        if match:
            mime = match.group(1)
            b64 = match.group(2)
            try:
                payload = base64.b64decode(b64)
                return Response(
                    payload,
                    mimetype=mime,
                    headers={'Cache-Control': 'public, max-age=300'},
                )
            except Exception:
                return abort(500)
    # Otherwise treat it as a regular URL and redirect
    return redirect(data_url)
