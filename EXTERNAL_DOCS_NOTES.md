# External documentation notes

## Firebase custom claims
Source: https://firebase.google.com/docs/auth/admin/custom-claims

Firebase Admin SDK يجب أن يعيّن custom claims من بيئة خادمية موثوقة فقط. المثال المستخدم للمشروع هو `setCustomUserClaims(uid, { admin: true })`. العملية تستبدل custom claims الموجودة، والحمولة يجب أن تكون JSON وقيمتها أقل من 1000 bytes. لا تظهر claims الجديدة في ID token الحالي إلا بعد تسجيل الدخول من جديد أو تحديث الرمز عبر `currentUser.getIdToken(true)`. يجب فرض الصلاحية في قواعد Firebase عبر `request.auth.token.admin == true`، وليس الاعتماد على إخفاء عناصر الواجهة فقط.

## Firebase Admin SDK setup
Source: https://firebase.google.com/docs/admin/setup

Firebase Admin SDK مخصص لبيئة خادمية ذات صلاحيات عالية، ويتطلب Firebase project وservice account credentials عند تشغيله خارج بيئة Google المُدارة. لا يجب وضع service-account JSON أو مفاتيح Admin داخل Vite frontend أو متغيرات `VITE_*`.

## Firebase Hosting
Source: https://firebase.google.com/docs/hosting

Firebase Hosting مناسب للمواقع الثابتة وSingle Page Apps، ويقدم SSL ونطاقات مجانية `web.app` و`firebaseapp.com`. التدفق الرسمي هو تثبيت Firebase CLI، ربط مجلد المشروع عبر `firebase init`، اختبار محلياً اختيارياً، ثم `firebase deploy`. يجب إضافة rewrite إلى `index.html` لتطبيق SPA عند استخدام React Router.

## Vercel + Vite
Sources: https://vercel.com/docs/frameworks/frontend/vite and https://vercel.com/kb/guide/deploying-react-with-vercel

Vercel يكتشف تطبيق Vite غالباً تلقائياً. أمر البناء لهذا المشروع هو `npm run build` ومجلد الناتج `dist`. تطبيق Vite SPA يحتاج `vercel.json` يحتوي rewrite من `/(.*)` إلى `/index.html` حتى تعمل الروابط العميقة مثل `/admin` و`/jobs/1` مباشرة. متغيرات البيئة التي يحتاجها المتصفح يجب أن تبدأ بـ `VITE_`.

## Firebase Trigger Email
Source: https://firebase.google.com/docs/extensions/official/firestore-send-email

إضافة Trigger Email تراقب مجموعة Firestore وتُرسل بريداً عند إنشاء مستند جديد. يجب إعداد SMTP provider مثل SendGrid أو Mailgun أو مزود إرسال معاملات. مستند البريد يحتوي حقولاً مثل `to` و`replyTo` و`message.subject` و`message.text/html`. يجب تقييد صلاحيات مجموعة البريد حتى لا يستطيع العميل إرسال رسائل عشوائية. الوثيقة الرسمية الحالية تنبه إلى أن Firebase Extensions service سيُغلق في 31 مارس 2027، لذلك يجب اعتبار الإضافة حلاً انتقالياً، ويفضل تصميم طبقة إشعارات قابلة للاستبدال بـ Cloud Functions/مزود بريد مباشر.
