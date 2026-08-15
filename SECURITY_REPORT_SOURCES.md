# مصادر تقرير حماية لوحة الإدارة

1. Firebase — Get started with Cloud Firestore Security Rules: https://firebase.google.com/docs/firestore/security/get-started
2. Firebase — Authentication State Persistence: https://firebase.google.com/docs/auth/web/auth-state-persistence
3. Firebase — Firebase App Check: https://firebase.google.com/docs/app-check
4. Firebase — Security Rules overview: https://firebase.google.com/docs/rules

ملاحظات مرتبطة بالتقرير:
- قواعد Firestore هي طبقة التحكم في الوصول والتحقق من البيانات، ويجب اختبارها وعدم الاعتماد على إخفاء الواجهة فقط.
- Firebase Authentication يتيح اختيار مدة حفظ جلسة المستخدم؛ تم ضبط دخول لوحة الإدارة في الكود على browserSessionPersistence حتى لا تبقى الجلسة بعد إغلاق جلسة المتصفح.
- App Check مكمل للمصادقة، لكنه يحتاج إعداداً واختباراً منفصلاً قبل فرضه على الإنتاج حتى لا تُحجب الطلبات المشروعة.
- الخطة المجانية لا توفر تلقائياً كل وظائف الخادم مثل البريد المجدول أو النسخ الاحتياطي السحابي المجدول؛ التقرير يميز بين ما هو مطبق وما هو حد تشغيلي.
