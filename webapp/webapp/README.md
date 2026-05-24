# ByteEgypt | بايت مصر — Python Edition

موقع رسمي + لوحة تحكم احترافية كاملة لمجتمع **ByteEgypt** — مجتمع طلاب كليات الحاسبات والمعلومات والذكاء الاصطناعي في مصر.

> 🔧 **egybyte by Yousef Khames**

> ⚡ **النسخة الحالية**: Python + Flask + SQLite — جاهزة للرفع على **PythonAnywhere** أو أي WSGI host.

---

## ✨ نظرة عامة
- **الاسم**: ByteEgypt | بايت مصر
- **الهدف**: لوحة تحكم تتيح للمسؤول التعديل على **كل المحتوى والصور** في الموقع بدون لمس الكود.
- **التقنيات**: **Python 3.10+** + **Flask** + **SQLite (stdlib)** + Jinja2 + TailwindCSS (CDN) + Font Awesome + AOS

---

## 🌐 الروابط
| المسار | الوصف |
|--------|--------|
| `/` | الصفحة الرئيسية الديناميكية |
| `/admin/login` | تسجيل الدخول |
| `/admin` | لوحة التحكم (تتطلب دخول) |
| `/api/*` | API محمي بـ session cookie |
| `/images/<id>` | تقديم أي صورة مخزّنة |
| `/static/*` | ملفات CSS/JS/الشعار |

### 🔑 بيانات الدخول الافتراضية
| المستخدم | كلمة السر |
|----------|-----------|
| `admin`  | `admin123` |

> ⚠️ **مهم**: غيّر كلمة السر فوراً بعد أول دخول من قسم "تغيير كلمة السر" داخل اللوحة.

---

## 📦 بنية المشروع

```
webapp/
├── app/                         # حزمة التطبيق الرئيسية
│   ├── __init__.py              # Application factory (create_app)
│   ├── db.py                    # طبقة SQLite + init/seed تلقائي
│   ├── auth.py                  # تسجيل دخول + sessions + decorators
│   ├── data.py                  # طبقة الوصول للبيانات
│   ├── routes_public.py         # الصفحة الرئيسية + /images/<id>
│   ├── routes_admin.py          # /admin/login + /admin/logout + /admin
│   ├── routes_api.py            # /api/* (CRUD كامل)
│   ├── templates/
│   │   ├── home.html            # الصفحة الرئيسية (Jinja2)
│   │   └── admin/
│   │       ├── login.html
│   │       └── dashboard.html
│   └── static/
│       ├── style.css            # ستايل الموقع العام
│       ├── admin.css            # ستايل لوحة التحكم
│       ├── admin.js             # كود JavaScript للداش بورد
│       ├── app.js               # كود JS للموقع العام
│       ├── community-logo.png   # 🎨 الصورة الأساسية للمجتمع
│       └── logo.svg             # شعار SVG قديم (اختياري)
├── instance/
│   └── byteegypt.sqlite3        # 💾 قاعدة البيانات (تتولّد تلقائياً)
├── schema.sql                   # هيكل قاعدة البيانات
├── seed.sql                     # البيانات الأولية (مرة واحدة)
├── requirements.txt             # Flask
├── run.py                       # تشغيل محلي (python run.py)
├── wsgi.py                      # نقطة الدخول لـ PythonAnywhere / Gunicorn
├── README.md
└── .gitignore
```

---

## 🚀 التشغيل المحلي (Local)

```bash
# 1) ثبّت المتطلبات
pip install -r requirements.txt

# 2) شغّل السيرفر
python run.py

# 3) افتح في المتصفح
#    http://localhost:5000           ← الموقع
#    http://localhost:5000/admin     ← لوحة التحكم
```

> ✨ **مفيش خطوات تهيئة قاعدة البيانات**: أول ما تشغّل التطبيق، يقوم بإنشاء `instance/byteegypt.sqlite3` تلقائياً ويملأها بالبيانات الأولية + يضيف مستخدم `admin`.

---

## ☁️ النشر على PythonAnywhere

### الطريقة الكاملة:

1. **سجّل حساب** على [pythonanywhere.com](https://www.pythonanywhere.com) (الحساب المجاني كافي).

2. **ارفع المشروع**:
   - من تبويب **Files** ارفع كل المجلد، أو
   - من تبويب **Consoles** افتح Bash console ثم:
     ```bash
     cd ~
     git clone <your-repo-url> webapp
     cd webapp
     pip install --user -r requirements.txt
     ```

3. **أنشئ Web App**:
   - من تبويب **Web** → **Add a new web app** → **Manual configuration** → اختر **Python 3.10** أو أعلى.

4. **عدّل ملف الـ WSGI** (الرابط ظاهر في تبويب Web):
   ```python
   import sys
   path = '/home/YOUR_USERNAME/webapp'
   if path not in sys.path:
       sys.path.insert(0, path)
   from wsgi import application
   ```
   (استبدل `YOUR_USERNAME` باسم حسابك)

5. **اضبط الـ Static Files** (مهم!) — في تبويب Web → قسم Static files أضف:
   | URL | Directory |
   |-----|-----------|
   | `/static/` | `/home/YOUR_USERNAME/webapp/app/static` |

6. **اضغط Reload** على تبويب Web. خلاص الموقع شغّال على:
   ```
   https://YOUR_USERNAME.pythonanywhere.com
   ```

### 🔒 نصائح أمان للنشر:
- غيّر `SECRET_KEY` من تبويب Web → **Environment variables**:
  ```
  SECRET_KEY=<اكتب-أي-سلسلة-طويلة-عشوائية>
  ```
- غيّر كلمة سر `admin` فوراً بعد أول دخول.
- قاعدة البيانات SQLite تُحفظ في `~/webapp/instance/byteegypt.sqlite3` — اعمل backup دوري لها.

---

## 🎨 المميزات

### إدارة الصور
- رفع الشعار وأي صور بالسحب أو النقر
- إنشاء صور مخصصة بـ ID (تُعرض على `/images/<id>`)
- معاينة فورية + معلومات الحجم والصيغة
- حد أقصى ~1.5 MB لكل صورة (تُخزّن كـ data URL في SQLite)

### إدارة المحتوى
يمكنك تعديل **كل** نص في الموقع من اللوحة:
- قسم **Hero**، **About**، **Features**, **Future**, **Steps**, **FAQs**, **Roles**, **Stats**, **Safety**, **Marquee**
- لكل عنصر: إضافة / تعديل / إخفاء / حذف
- ترتيب العناصر عبر `sort_order`

### الحساب
- تغيير كلمة السر (يتطلب كلمة السر الحالية)
- جلسة آمنة بـ HTTP-only cookies لمدة 7 أيام
- خروج آمن

---

## 💾 الجداول في قاعدة البيانات

| الجدول | الوصف |
|--------|-------|
| `site_settings` | كل النصوص العامة (key/value) |
| `images` | الصور المرفوعة (Data URLs أو روابط) |
| `features` | كروت المميزات |
| `future_cards` | كروت الرؤية المستقبلية |
| `steps` | خطوات الانضمام |
| `faqs` | الأسئلة الشائعة |
| `roles` | الرتب |
| `stats` | إحصائيات قسم About |
| `safety_points` | نقاط الأمان |
| `marquee_items` | عناصر الشريط المتحرك |
| `onestop_items` | بطاقات قسم "كل اللي محتاجه في مكان واحد" |
| `admin_users` | حسابات الإدارة |
| `sessions` | جلسات الدخول |

---

## 🗺️ خريطة الـ API

| Method | المسار | الوصف |
|--------|--------|-------|
| GET    | `/api/overview` | إحصائيات سريعة |
| GET    | `/api/settings` | جلب كل الإعدادات |
| PUT    | `/api/settings` | تحديث إعدادات (bulk) |
| GET    | `/api/list/<table>` | عناصر القسم |
| POST   | `/api/list/<table>` | إضافة عنصر |
| PUT    | `/api/list/<table>/<id>` | تعديل |
| DELETE | `/api/list/<table>/<id>` | حذف |
| POST   | `/api/list/<table>/reorder` | إعادة ترتيب |
| GET    | `/api/images` | قائمة الصور |
| GET    | `/api/images/<id>` | بيانات صورة |
| PUT    | `/api/images/<id>` | رفع/تعديل صورة |
| DELETE | `/api/images/<id>` | حذف صورة |
| POST   | `/api/account/password` | تغيير كلمة السر |

الجداول المتاحة في `/api/list/<table>`:
`features`, `future_cards`, `steps`, `faqs`, `roles`, `stats`, `safety_points`, `marquee_items`, `onestop_items`

---

## 🔄 إعادة قاعدة البيانات من الصفر

```bash
rm -f instance/byteegypt.sqlite3
python run.py   # سيُعاد إنشاؤها + ملؤها تلقائياً
```

---

## 🧪 اختبار الـ Endpoints (cURL)

```bash
# تسجيل الدخول
curl -c cookies.txt -X POST http://localhost:5000/admin/login \
  -d "username=admin&password=admin123"

# جلب الإعدادات
curl -b cookies.txt http://localhost:5000/api/settings

# جلب نظرة عامة
curl -b cookies.txt http://localhost:5000/api/overview
```

---

## 📊 الحالة
- **اللغة**: Python 3.10+
- **الإطار**: Flask 2.3+
- **قاعدة البيانات**: SQLite (stdlib — مفيش dependencies إضافية)
- **النشر**: ✅ جاهز لـ PythonAnywhere / Gunicorn / mod_wsgi / أي WSGI server
- **آخر تحديث**: 2026-05-22

---

<div align="center">

**Made with ❤️ in Egypt 🇪🇬**

`egybyte by Yousef Khames`

</div>
