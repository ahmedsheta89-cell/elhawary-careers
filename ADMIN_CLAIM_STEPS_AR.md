# تعيين صلاحية مدير Firebase للحساب الأول

المشروع: `elhawary-careers-2026`

الحساب: `ahmed.sheta89@gmail.com`

UID: `TcufKTgsWPbydBw2moPxdQcvfDE2`

## الطريقة الموصى بها: Cloud Shell

1. افتح مشروع Firebase، ثم اضغط أيقونة **Activate Cloud Shell** في أعلى الصفحة.
2. انتظر حتى تظهر نافذة الطرفية.
3. أنشئ مجلداً مؤقتاً:

```bash
mkdir -p ~/elhawary-admin
cd ~/elhawary-admin
npm init -y
npm install firebase-admin
```

4. ارفع ملف `SET_ADMIN_CLAIM.cjs` المرفق إلى Cloud Shell من قائمة **More / Upload file**.
5. داخل Cloud Shell شغّل:

```bash
cd ~/elhawary-admin
gcloud auth application-default login
gcloud config set project elhawary-careers-2026
node SET_ADMIN_CLAIM.cjs
```

إذا فتح رابط تسجيل دخول، أكمل تسجيل الدخول بنفس حساب Google الذي يملك مشروع Firebase. لا تلصق أي كلمة مرور داخل الطرفية أو في المحادثة.

## النتيجة المتوقعة

يجب أن يظهر إخراج شبيه بهذا:

```json
{
  "projectId": "elhawary-careers-2026",
  "uid": "TcufKTgsWPbydBw2moPxdQcvfDE2",
  "email": "ahmed.sheta89@gmail.com",
  "customClaims": {
    "admin": true
  }
}
```

## بعد النجاح

1. افتح Firebase Authentication → Users، وتأكد أن المستخدم موجود.
2. سجّل الخروج من الموقع ثم سجّل الدخول مرة أخرى، حتى يحصل المتصفح على ID token جديد.
3. افتح مسار `/admin` في الموقع.
4. يجب أن تتمكن من قراءة طلبات التوظيف وإدارة الوظائف.

## إذا ظهر خطأ

- `Cannot find module 'firebase-admin'`: نفّذ `npm install firebase-admin` داخل نفس المجلد.
- `Could not load the default credentials`: نفّذ `gcloud auth application-default login` ثم أعد الأمر.
- `Permission denied`: تأكد أن حساب Google الذي سجلت به يملك صلاحية على مشروع `elhawary-careers-2026`.
- `UID does not belong to the expected email`: توقف ولا تعدّل السكربت؛ فهذا يعني أن UID لا يخص البريد المتوقع.

لا ترفع ملف service account JSON إلى GitHub، ولا تضعه في المشروع أو داخل متغير يبدأ بـ `VITE_`.
