# دليل إعداد وإطلاق El Hawary Careers

هذا الدليل يشرح إعداد حساب المدير، نشر الواجهة، وتفعيل إشعارات البريد للمشروع الحالي. المشروع يستخدم React + Vite في الواجهة، وFirebase Authentication وFirestore وStorage في الخلفية. أسماء متغيرات البيئة الموجودة فعلياً في المشروع هي `VITE_FIREBASE_*`.

## 1. إعداد حساب المدير وصلاحية `admin=true`

### 1.1 إنشاء المستخدم

1. افتح [Firebase Console](https://console.firebase.google.com/) واختر المشروع.
2. افتح **Build → Authentication → Sign-in method**، ثم فعّل **Email/Password**.
3. افتح **Authentication → Users** واضغط **Add user**.
4. أنشئ بريداً خاصاً بالإدارة، مثل `admin@your-domain.com`، واستخدم كلمة مرور قوية وفريدة.
5. انسخ **UID** للمستخدم. ستحتاجه إذا عيّنت الصلاحية بالـ UID بدلاً من البريد.

لا تنشئ المدير من الواجهة العامة للموقع، ولا تضع أي مفتاح Admin SDK أو service-account JSON داخل React أو في متغير يبدأ بـ `VITE_`.

### 1.2 تعيين الـ custom claim بطريقة آمنة

الـ custom claims لا تُعيّن من المتصفح؛ يجب تعيينها من بيئة خادمية موثوقة عبر Firebase Admin SDK. وثائق Firebase توضح أن `setCustomUserClaims` يستبدل كائن claims الموجود، لذلك يحافظ السكربت التالي على أي claims سابقة ثم يضيف `admin: true` [1].

أنشئ مجلداً محلياً خارج مجلد الواجهة، أو مجلداً داخل المشروع لا ترفعه إلى Git، ثم نفّذ:

```bash
mkdir firebase-admin-tools
cd firebase-admin-tools
npm init -y
npm install firebase-admin
```

من Firebase Console افتح **Project settings → Service accounts → Firebase Admin SDK → Generate new private key**، ونزّل ملف JSON. احفظه خارج المستودع، ثم أضف مساره إلى متغير النظام.

على Linux أو macOS:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/service-account.json"
```

على Windows PowerShell:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS="C:\absolute\path\service-account.json"
```

أنشئ ملفاً اسمه `set-admin.cjs`:

```js
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp({ credential: applicationDefault() });

const email = process.argv[2];
if (!email) {
  console.error('Usage: node set-admin.cjs admin@example.com');
  process.exit(1);
}

(async () => {
  const auth = getAuth();
  const user = await auth.getUserByEmail(email);
  const currentClaims = user.customClaims || {};

  await auth.setCustomUserClaims(user.uid, {
    ...currentClaims,
    admin: true,
  });

  const updated = await auth.getUser(user.uid);
  console.log({ uid: updated.uid, email: updated.email, customClaims: updated.customClaims });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

شغّله هكذا:

```bash
node set-admin.cjs admin@your-domain.com
```

بعد نجاح العملية، احذف ملف service account من جهاز مشترك، ولا ترفعه إلى GitHub. إن كان الحساب قد سجّل دخوله قبل تعيين claim، سجّل الخروج ثم الدخول مرة أخرى، أو نفّذ في الواجهة `currentUser.getIdToken(true)` لتحديث ID token. السبب أن claim الجديدة لا تظهر في الرمز الحالي إلا عند إصدار رمز جديد أو عمل refresh إجباري [1].

### 1.3 التحقق من الصلاحيات

قواعد المشروع الحالية تستخدم الشرط التالي:

```text
request.auth != null && request.auth.token.admin == true
```

وهذا هو الشرط الصحيح لحماية قراءة وتعديل الوظائف والطلبات. إخفاء رابط `/admin` في الواجهة ليس حماية؛ الحماية الفعلية تأتي من Firestore وStorage Rules. اختبر حساب المدير بفتح `/admin`، ثم جرّب قراءة الطلبات وتغيير حالة طلب. إذا ظهر `permission-denied`، فغالباً السبب أن الجلسة لم تُحدّث بعد تعيين claim أو أن القواعد لم تُنشر.

نشر القواعد:

```bash
firebase login
firebase use YOUR_FIREBASE_PROJECT_ID
firebase deploy --only firestore:rules,storage
```

## 2. نشر المشروع على Firebase Hosting

Firebase Hosting مناسب لهذا المشروع لأنه تطبيق Vite/React ثابت وSingle Page App، ويوفر SSL ونطاقاً مجانياً على `web.app` و`firebaseapp.com` [2]. أما Firestore وStorage ووظائف الخلفية فقد تكون لها متطلبات خطة فوترة منفصلة؛ لا تفترض أن كل خدمة ستبقى بلا تكلفة لمجرد أن نطاق Hosting مجاني.

### 2.1 تجهيز Firebase CLI

من جذر المشروع:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

اختر مشروع Firebase الصحيح. ملف `firebase.json` الحالي يربط Firestore وStorage، لكنه يحتاج إلى قسم Hosting. أسهل طريقة هي:

```bash
firebase init hosting
```

اختر الإجابات التالية:

| السؤال | الاختيار |
|---|---|
| Use an existing project | اختر مشروع Firebase الحالي |
| Public directory | `dist` |
| Configure as a single-page app | `Yes` |
| Set up automatic builds with GitHub | `No` في البداية، أو `Yes` إذا أردت CI لاحقاً |
| Overwrite `dist/index.html` | `No` إذا كان مجلد `dist` مبنياً بالفعل |

يجب أن ينتج إعداد Hosting قريباً من التالي، مع الحفاظ على قسمي Firestore وStorage الموجودين:

```json
{
  "firestore": { "rules": "firestore.rules" },
  "storage": { "rules": "storage.rules" },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

### 2.2 بناء الواجهة وإضافة متغيرات البيئة

أنشئ `.env` محلياً من `.env.example`، وأدخل قيم Web App من **Project settings → Your apps → Web app**:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

ثم ابنِ وانشر:

```bash
npm ci
npm run lint
npm run build
firebase deploy --only hosting,firestore:rules,storage
```

بعد النشر اختبر الروابط العميقة مباشرة، وليس الصفحة الرئيسية فقط:

```text
https://YOUR_PROJECT_ID.web.app/
https://YOUR_PROJECT_ID.web.app/careers
https://YOUR_PROJECT_ID.web.app/jobs/1
https://YOUR_PROJECT_ID.web.app/admin
```

إعادة التوجيه إلى `index.html` ضرورية حتى لا يظهر 404 عند فتح `/admin` أو `/jobs/1` مباشرة [2].

## 3. نشر الواجهة على Vercel مع إبقاء Firebase للخلفية

يمكن استخدام Vercel للواجهة وFirebase لـ Authentication وFirestore وStorage. في هذه الحالة لا تنشر قواعد Firebase عبر Vercel؛ انشرها من Firebase CLI كما سبق.

### 3.1 إعداد `vercel.json`

أنشئ في جذر المشروع ملف `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

هذه القاعدة مطلوبة لتطبيق Vite SPA حتى تعمل الروابط العميقة في React Router [3].

### 3.2 النشر من GitHub

1. ادفع فرع الإطلاق إلى GitHub إذا لم يكن موجوداً:

```bash
git push -u origin launch-readiness
```

2. افتح [Vercel](https://vercel.com/)، اختر **Add New Project**، ثم استورد مستودع GitHub.
3. اختر الفرع `launch-readiness` أو الفرع الذي ستعتمده للإنتاج.
4. استخدم الإعدادات التالية:

| الإعداد | القيمة |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

5. من **Settings → Environment Variables** أضف جميع متغيرات `VITE_FIREBASE_*` لبيئة Production، وأضفها أيضاً لـ Preview إذا أردت اختبار Pull Requests.
6. اضغط **Deploy**.

قيم Firebase Web config ليست مفاتيح Admin سرية، لكنها لا تزال تحتاج إلى Rules صحيحة. السر الحقيقي هو service-account key أو أي مفتاح SMTP/API خاص بالبريد؛ لا تضع أياً منها في `VITE_*`.

بديل النشر من الطرفية:

```bash
npm install -g vercel
vercel login
vercel --prod
```

Vercel يكتشف Vite غالباً تلقائياً، وتظل قاعدة `vercel.json` مطلوبة للـ SPA [3].

## 4. تفعيل إشعارات البريد عند وصول طلب جديد

حالياً خدمة التقديم تنشئ مستنداً في مجموعة `applications` بعد رفع الملفات. لكنها لا ترسل بريداً تلقائياً، لأن المشروع لا يحتوي حالياً على Cloud Functions أو حزمة إرسال بريد. الحل الصحيح هو تشغيل الإرسال في الخلفية بعد إنشاء مستند Firestore، وليس من المتصفح.

### الخيار الموصى به: Cloud Function + مزود بريد معاملات

استخدم مزوداً مثل Resend أو SendGrid أو Mailgun أو Postmark، مع نطاق موثّق وSPF/DKIM. لا تستخدم كلمة مرور Gmail عادية داخل الواجهة. يجب حفظ مفتاح المزود كـ Secret في بيئة Functions.

من جذر المشروع:

```bash
firebase init functions
```

اختر المشروع الحالي، ثم TypeScript، واختر Node.js 22 إن ظهر الخيار. داخل مجلد `functions`:

```bash
npm install resend
```

مثال `functions/src/index.ts` باستخدام Resend:

```ts
import { initializeApp } from 'firebase-admin/app';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineSecret } from 'firebase-functions/params';
import { Resend } from 'resend';

initializeApp();

const resendApiKey = defineSecret('RESEND_API_KEY');
const adminEmail = 'admin@your-domain.com';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export const notifyNewApplication = onDocumentCreated(
  {
    document: 'applications/{applicationId}',
    region: 'europe-west1',
    secrets: [resendApiKey],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const application = snapshot.data();
    const id = event.params.applicationId;
    const name = escapeHtml(application.fullName);
    const email = escapeHtml(application.email);
    const phone = escapeHtml(application.phone);
    const jobId = escapeHtml(application.jobId);

    const resend = new Resend(resendApiKey.value());
    await resend.emails.send({
      from: 'El Hawary Careers <noreply@your-domain.com>',
      to: [adminEmail],
      replyTo: String(application.email || ''),
      subject: `طلب توظيف جديد: ${String(application.fullName || '')}`,
      html: `
        <h2>تم استلام طلب توظيف جديد</h2>
        <p><strong>رقم الطلب:</strong> ${escapeHtml(id)}</p>
        <p><strong>الاسم:</strong> ${name}</p>
        <p><strong>البريد:</strong> ${email}</p>
        <p><strong>الهاتف:</strong> ${phone}</p>
        <p><strong>معرّف الوظيفة:</strong> ${jobId}</p>
        <p>افتح لوحة الإدارة لمراجعة الطلب والمرفقات.</p>
      `,
    });
  },
);
```

لا تضع رابطاً عاماً للسيرة الذاتية في البريد. المشروع الحالي يخزن مسار المرفق داخل Storage، وقراءة الملفات محصورة بالمدير. يمكن لاحقاً إضافة زر تنزيل آمن يولّد رابطاً موقّعاً لفترة قصيرة.

احفظ المفتاح ثم انشر الوظيفة:

```bash
firebase functions:secrets:set RESEND_API_KEY
firebase deploy --only functions:notifyNewApplication
```

بعد ذلك، أنشئ طلباً تجريبياً من الموقع وتحقق من سجلات الوظيفة:

```bash
firebase functions:log --only notifyNewApplication
```

ينبغي أيضاً إضافة منع التكرار أو سجل إرسال مثل `applicationNotifications/{applicationId}` في النسخة الإنتاجية، لأن وظائف الخلفية قد تعيد المحاولة عند حدوث فشل مؤقت. كما يجب إضافة إشعار آخر عند تغيير حالة الطلب، باستخدام `onDocumentUpdated`، إذا أردت إخطار المرشح بالنتيجة.

### خيار سريع: Trigger Email Extension

توجد إضافة Firebase الرسمية `firestore-send-email` تراقب مجموعة مثل `mail`، ثم ترسل رسالة عند إنشاء مستند فيها. مستند البريد يكون بهذا الشكل:

```ts
{
  to: ['admin@your-domain.com'],
  replyTo: application.email,
  message: {
    subject: 'طلب توظيف جديد',
    text: 'تم استلام طلب جديد. افتح لوحة الإدارة للمراجعة.',
    html: '<p>تم استلام طلب جديد.</p>'
  }
}
```

تحتاج الإضافة إلى SMTP provider، وتحتاج إلى حماية مجموعة `mail` حتى لا يستطيع أي زائر إرسال رسائل عشوائية من نطاقك [4]. لا تجعل المتصفح يكتب مباشرة إلى `mail`; اجعل Cloud Function هي التي تنشئ مستند البريد بعد إنشاء `applications`.

يمكن تثبيتها عبر:

```bash
firebase ext:install firebase/firestore-send-email --project=YOUR_PROJECT_ID
```

لكن وثائق Firebase الحالية تنبه إلى أن خدمة Firebase Extensions ستتوقف في 31 مارس 2027؛ لذلك لا أوصي بجعلها التصميم النهائي لمشروع جديد، بل استخدم Cloud Function مباشرة مع مزود بريد أو خطط لترحيل الإضافة لاحقاً [4].

## 5. قائمة التحقق قبل الإعلان عن الموقع

| البند | حالة النجاح المطلوبة |
|---|---|
| المدير | تسجيل الدخول يعمل، و`admin=true` ظاهر بعد إعادة تسجيل الدخول. |
| القواعد | الزائر يستطيع إنشاء طلب فقط، والمدير يستطيع القراءة والتحديث؛ لا يستطيع الزائر قراءة الطلبات أو السير الذاتية. |
| التقديم | طلب حقيقي يصل إلى `applications`، والملفات تصل إلى Storage، ولا توجد روابط عامة للمرفقات. |
| النشر | `/careers` و`/jobs/:id` و`/admin` تعمل عند فتحها مباشرة. |
| البريد | تصل رسالة إلى بريد الإدارة بعد إنشاء طلب جديد، و`replyTo` يساوي بريد المرشح. |
| الأسرار | لا يوجد service-account JSON أو SMTP/API key داخل المستودع أو متغيرات `VITE_*`. |
| المحتوى | الوظائف وبيانات الاتصال وسياسة الخصوصية حقيقية، مع موافقة واضحة على معالجة السيرة الذاتية. |
| الفوترة | تم التأكد من خطة Firebase المطلوبة لـ Storage وCloud Functions ومزود البريد قبل الإطلاق. |

## المراجع

[1]: https://firebase.google.com/docs/auth/admin/custom-claims — Firebase: Control Access with Custom Claims and Security Rules.

[2]: https://firebase.google.com/docs/hosting — Firebase Hosting documentation.

[3]: https://vercel.com/docs/frameworks/frontend/vite — Vite on Vercel documentation.

[4]: https://firebase.google.com/docs/extensions/official/firestore-send-email — Firebase: Using the Trigger Email extension.

[5]: https://firebase.google.com/docs/admin/setup — Firebase Admin SDK setup.
