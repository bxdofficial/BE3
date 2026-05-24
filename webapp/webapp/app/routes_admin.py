"""
Admin authentication + dashboard routes.
Prefix: /admin
"""
from flask import Blueprint, render_template, request, redirect, make_response

from .auth import (
    SESSION_COOKIE,
    SESSION_TTL_SECONDS,
    get_current_user,
    login_user,
    logout_user,
    require_auth,
)

bp = Blueprint('admin', __name__)


@bp.route('/login', methods=['GET'])
def login_page():
    if get_current_user():
        return redirect('/admin')
    return render_template('admin/login.html', error=None)


@bp.route('/login', methods=['POST'])
def login_submit():
    username = (request.form.get('username') or '').strip()
    password = request.form.get('password') or ''

    if not username or not password:
        return render_template('admin/login.html', error='من فضلك أدخل اسم المستخدم وكلمة المرور')

    result = login_user(username, password)
    if not result:
        return render_template('admin/login.html', error='اسم المستخدم أو كلمة المرور غير صحيحة')

    user, token = result
    resp = make_response(redirect('/admin'))
    resp.set_cookie(
        SESSION_COOKIE,
        token,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        samesite='Lax',
        secure=False,
        path='/',
    )
    return resp


@bp.route('/logout', methods=['POST'])
def logout_submit():
    logout_user()
    resp = make_response(redirect('/admin/login'))
    resp.delete_cookie(SESSION_COOKIE, path='/')
    return resp


@bp.route('', methods=['GET'])
@bp.route('/', methods=['GET'])
@require_auth
def dashboard():
    user = get_current_user()
    return render_template('admin/dashboard.html', username=user['username'])
