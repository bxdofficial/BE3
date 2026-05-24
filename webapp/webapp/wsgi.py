"""
WSGI entry point for production deployment (PythonAnywhere, Gunicorn, mod_wsgi, ...)

PythonAnywhere setup
====================
1. Upload this project to: /home/<YOUR_USER>/webapp/
2. In PythonAnywhere → Web → Add a new web app → Manual configuration → Python 3.10+
3. Edit the WSGI config file (link on the Web tab) and replace its content with:

        import sys
        path = '/home/<YOUR_USER>/webapp'
        if path not in sys.path:
            sys.path.insert(0, path)
        from wsgi import application

4. Set the "Static files" mapping on the Web tab:
        URL:       /static/
        Directory: /home/<YOUR_USER>/webapp/app/static
5. Reload the web app. Done.
"""
from app import create_app

# PythonAnywhere / WSGI servers look for `application`
application = create_app()
app = application  # alias

if __name__ == '__main__':
    application.run(host='0.0.0.0', port=5000, debug=False)
