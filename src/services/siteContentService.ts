import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseInstances, isDemoMode } from '@/lib/firebase';

export type SiteText = {
  ar: string;
  en: string;
};

export type PageAppearance = {
  heroFrom: string;
  heroTo: string;
  heroText: string;
  heroMuted: string;
  sectionBackground: string;
  cardBackground: string;
  cardBorder: string;
  accent: string;
  ctaFrom: string;
  ctaTo: string;
  ctaText: string;
  showStory: boolean;
  showStats: boolean;
  showValues: boolean;
  showAdditional: boolean;
  showGrowth: boolean;
  showCta: boolean;
};

export type SiteContent = {
  site: {
    phone: string;
    email: string;
  };
  brand: {
    nameAr: string;
    nameEn: string;
    tagline: string;
    logoUrl: string;
  };
  header: {
    homeLabel: SiteText;
    careersLabel: SiteText;
    aboutLabel: SiteText;
    benefitsLabel: SiteText;
    contactLabel: SiteText;
    applyLabel: SiteText;
    loginLabel: SiteText;
  };
  home: {
    heroEyebrow: SiteText;
    heroTitle: SiteText;
    heroHighlight: SiteText;
    heroDescription: SiteText;
    heroPrimaryCta: SiteText;
    heroSecondaryCta: SiteText;
    stats: Array<{ value: string; label: SiteText }>;
    whyTitle: SiteText;
    whyDescription: SiteText;
    whyItems: Array<{ title: SiteText; description: SiteText }>;
    jobsTitle: SiteText;
    jobsDescription: SiteText;
    jobsCta: SiteText;
    processTitle: SiteText;
    processDescription: SiteText;
    faqTitle: SiteText;
    faqDescription: SiteText;
    finalCtaTitle: SiteText;
    finalCtaDescription: SiteText;
    finalCtaButton: SiteText;
  };
  pages: {
    careers: { eyebrow: SiteText; title: SiteText; description: SiteText; emptyTitle: SiteText; emptyDescription: SiteText };
    about: {
      eyebrow: SiteText;
      title: SiteText;
      description: SiteText;
      storyBadge: SiteText;
      storyTitle: SiteText;
      storyParagraphs: SiteText[];
      foundationLabel: SiteText;
      foundationDescription: SiteText;
      valuesTitle: SiteText;
      valuesDescription: SiteText;
      values: Array<{ title: SiteText; description: SiteText }>;
      ctaTitle: SiteText;
      ctaDescription: SiteText;
      ctaPrimary: SiteText;
      ctaSecondary: SiteText;
      appearance: PageAppearance;
    };
    benefits: {
      eyebrow: SiteText;
      title: SiteText;
      description: SiteText;
      items: Array<{ icon: string; title: SiteText; description: SiteText }>;
      additionalTitle: SiteText;
      additionalDescription: SiteText;
      additionalItems: Array<{ title: SiteText; description: SiteText }>;
      growthTitle: SiteText;
      growthDescription: SiteText;
      growthStages: Array<{ level: SiteText; time: SiteText }>;
      growthHighlightTitle: SiteText;
      growthHighlightDescription: SiteText;
      ctaTitle: SiteText;
      ctaDescription: SiteText;
      ctaPrimary: SiteText;
      ctaSecondary: SiteText;
      appearance: PageAppearance;
    };
    contact: { eyebrow: SiteText; title: SiteText; description: SiteText; infoTitle: SiteText; infoDescription: SiteText; whatsappLabel: SiteText; formTitle: SiteText; hours: SiteText; address: SiteText };
  };
  legal: {
    privacy: {
      eyebrow: SiteText;
      title: SiteText;
      description: SiteText;
      updatedLabel: SiteText;
      updatedAt: string;
      sections: Array<{ title: SiteText; body: SiteText }>;
    };
    terms: {
      eyebrow: SiteText;
      title: SiteText;
      description: SiteText;
      updatedLabel: SiteText;
      updatedAt: string;
      sections: Array<{ title: SiteText; body: SiteText }>;
    };
  };
  footer: {
    description: SiteText;
    copyright: SiteText;
    privacyLabel: SiteText;
    termsLabel: SiteText;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    surfaceColor: string;
    logoUrl: string;
    customCss: string;
  };
};

const text = (ar: string, en = ar): SiteText => ({ ar, en });

export const defaultSiteContent: SiteContent = {
  site: {
    phone: '01000753375',
    email: 'careers@elhawarypharmacy.com',
  },
  brand: {
    nameAr: 'صيدلية الهواري',
    nameEn: 'El Hawary Pharmacy',
    tagline: 'منصة التوظيف',
    logoUrl: '/assets/logo.svg',
  },
  header: {
    homeLabel: text('الرئيسية', 'Home'),
    careersLabel: text('الوظائف', 'Careers'),
    aboutLabel: text('من نحن', 'About Us'),
    benefitsLabel: text('المزايا', 'Benefits'),
    contactLabel: text('اتصل بنا', 'Contact'),
    applyLabel: text('قدم الآن', 'Apply Now'),
    loginLabel: text('تسجيل الدخول', 'Login'),
  },
  home: {
    heroEyebrow: text('انضم إلى فريقنا الطبي المتميز'),
    heroTitle: text('ابنِ مستقبلك المهني مع'),
    heroHighlight: text('صيدلية الهواري'),
    heroDescription: text('نبحث عن الكوادر الطبية والخدمية الطموحة للانضمام إلى واحدة من أكبر سلاسل الصيدليات في مصر. فرص نمو لا محدودة وبيئة عمل محفزة.'),
    heroPrimaryCta: text('تصفح الوظائف المتاحة'),
    heroSecondaryCta: text('اعرف المزيد عنا'),
    stats: [
      { value: '50+', label: text('فرعاً', 'Branches') },
      { value: '200+', label: text('موظف', 'Employees') },
      { value: '15+', label: text('سنة خبرة', 'Years Experience') },
      { value: '100K+', label: text('عميل سعيد', 'Happy Customers') },
    ],
    whyTitle: text('لماذا تنضم إلينا؟'),
    whyDescription: text('نقدم بيئة عمل استثنائية تدعم نموك المهني والشخصي'),
    whyItems: [
      { title: text('تأمين صحي شامل'), description: text('تغطية صحية متكاملة لك ولعائلتك في أفضل المستشفيات والمراكز الطبية') },
      { title: text('نمو مهني مستمر'), description: text('برامج تدريبية متطورة وفرص ترقية واضحة لمسارك المهني') },
      { title: text('مكافآت مجزية'), description: text('نظام مكافآت وحوافز تنافسي يعكس تقديرك وجهودك') },
      { title: text('فريق متميز'), description: text('انضم إلى عائلة مهنية داعمة تقدر التعاون والإنجاز') },
      { title: text('فروع متعددة'), description: text('فرص عمل في أكثر من 50 فرعاً في جميع أنحاء جمهورية مصر العربية') },
      { title: text('شهادات معتمدة'), description: text('برامج تدريب معتمدة محلياً ودولياً لتطوير مهاراتك') },
    ],
    jobsTitle: text('أحدث الوظائف'),
    jobsDescription: text('اكتشف الفرص المتاحة وانضم لفريقنا'),
    jobsCta: text('عرض كل الوظائف'),
    processTitle: text('خطوات التوظيف'),
    processDescription: text('رحلة واضحة وشفافة من التقديم حتى الانضمام إلى فريقنا'),
    faqTitle: text('الأسئلة الشائعة'),
    faqDescription: text('إجابات عن أكثر الأسئلة التي تصلنا من المتقدمين'),
    finalCtaTitle: text('هل أنت مستعد للخطوة التالية؟'),
    finalCtaDescription: text('استكشف الوظائف المتاحة وابدأ رحلتك المهنية معنا اليوم.'),
    finalCtaButton: text('شاهد الوظائف المتاحة'),
  },
  pages: {
    careers: { eyebrow: text('الفرص الحالية'), title: text('الوظائف المتاحة'), description: text('اكتشف فرص عملك التالية في صيدلية الهواري'), emptyTitle: text('لا توجد وظائف متاحة حالياً'), emptyDescription: text('تابعنا باستمرار لمعرفة الفرص الجديدة') },
    about: {
      eyebrow: text('قصتنا'),
      title: text('عن صيدلية الهواري'),
      description: text('من أكبر سلاسل الصيدليات في مصر، نقدم رعاية صحية متميزة منذ أكثر من 15 عاماً'),
      storyBadge: text('قصتنا'),
      storyTitle: text('رحلة النجاح والتميز'),
      storyParagraphs: [
        text('بدأت صيدلية الهواري رحلتها عام 2008 بفرع واحد صغير، والإيمان بأن الرعاية الصحية الجيدة حق للجميع. من خلال الالتزام بالجودة والخدمة المتميزة، نمونا لنصبح واحدة من أكبر سلاسل الصيدليات في جمهورية مصر العربية.'),
        text('اليوم، نضم أكثر من 50 فرعاً منتشراً في مختلف المحافظات، وفريقاً يتجاوز 200 موظف متخصص، نخدم يومياً آلاف العملاء بثقة واهتمام.'),
        text('رؤيتنا واضحة: أن نكون الخيار الأول للرعاية الصحية المجتمعية، وأن نوفر بيئة عمل محفزة تجذب أفضل الكوادر الطبية والخدمية.'),
      ],
      foundationLabel: text('منذ 2008'),
      foundationDescription: text('نخدم المجتمع المصري'),
      valuesTitle: text('قيمنا الأساسية'),
      valuesDescription: text('المبادئ التي نؤمن بها ونطبقها في كل ما نفعله'),
      values: [
        { title: text('الرعاية والإنسانية'), description: text('نضع صحة وراحة عملائنا في المقام الأول، ونتعامل معهم بكل احترام وتعاطف') },
        { title: text('الجودة والسلامة'), description: text('نلتزم بأعلى معايير الجودة في المنتجات والخدمات لضمان سلامة الجميع') },
        { title: text('العمل الجماعي'), description: text('نؤمن بقوة الفريق والتعاون لتحقيق الأهداف المشتركة') },
        { title: text('التميز المستمر'), description: text('نسعى دائماً للتطوير والتحسين في جميع جوانب عملنا') },
        { title: text('النزاهة والشفافية'), description: text('نتصرف بصدق وشفافية في تعاملاتنا مع الجميع') },
        { title: text('الابتكار والنمو'), description: text('نشجع الأفكار الجديدة ونستثمر في تطوير مهارات فريقنا') },
      ],
      ctaTitle: text('انضم إلى عائلتنا'),
      ctaDescription: text('نحن نبحث دائماً عن المواهب الطموحة للانضمام إلى فريقنا. اكتشف فرص عملك التالية معنا'),
      ctaPrimary: text('تصفح الوظائف'),
      ctaSecondary: text('اعرف المزايا'),
      appearance: {
        heroFrom: '#0f4c81',
        heroTo: '#0b2f4f',
        heroText: '#ffffff',
        heroMuted: '#dbeafe',
        sectionBackground: '#ffffff',
        cardBackground: '#ffffff',
        cardBorder: '#dbeafe',
        accent: '#2563eb',
        ctaFrom: '#0ea5e9',
        ctaTo: '#0284c7',
        ctaText: '#ffffff',
        showStory: true,
        showStats: true,
        showValues: true,
        showAdditional: true,
        showGrowth: true,
        showCta: true,
      },
    },
    benefits: {
      eyebrow: text('المزايا والعوائد'),
      title: text('لماذا تنضم إلى صيدلية الهواري؟'),
      description: text('نقدم حزمة شاملة من المزايا والعوائد لدعمك أنت وعائلتك'),
      items: [
        { icon: 'health', title: text('تأمين صحي شامل'), description: text('تغطية صحية لك ولعائلتك في أفضل المستشفيات') },
        { icon: 'growth', title: text('تطوير مهني'), description: text('برامج تدريبية مستمرة وفرص للنمو والتطور المهني') },
        { icon: 'bonus', title: text('مكافآت وحوافز'), description: text('مكافآت أداء سنوية وعمولات مجزية') },
        { icon: 'balance', title: text('توازن الحياة'), description: text('ساعات عمل مرنة وإجازات مدفوعة') },
        { icon: 'transport', title: text('بدل مواصلات'), description: text('بدل مواصلات شهري أو خدمة نقل') },
        { icon: 'environment', title: text('بيئة عمل محفزة'), description: text('ثقافة تنظيمية داعمة وتقدير للإنجازات') },
      ],
      additionalTitle: text('مزايا إضافية'),
      additionalDescription: text('المزيد من العوائد التي نقدمها لموظفينا'),
      additionalItems: [
        { title: text('منح دراسية'), description: text('دعم مالي للدراسات العليا والدورات المتخصصة') },
        { title: text('تأمين على الحياة'), description: text('حماية مالية إضافية لك ولعائلتك') },
        { title: text('أنشطة فريق'), description: text('فعاليات ترفيهية واجتماعية دورية') },
        { title: text('برنامج الإحالة'), description: text('مكافآت عند ترشيح كوادر متميزة') },
        { title: text('عيادة داخلية'), description: text('خدمات طبية مجانية في المقر الرئيسي') },
        { title: text('خصومات خاصة'), description: text('خصومات على منتجات الصيدلية للموظفين') },
        { title: text('إجازة أمومة/أبوة'), description: text('إجازات عائلية مدفوعة الأجر') },
        { title: text('خطة تقاعد'), description: text('برنامج ادخار للتقاعد المبكر') },
      ],
      growthTitle: text('مسار النمو المهني'),
      growthDescription: text('نؤمن بالاستثمار في موظفينا ونوفر مسارات ترقية واضحة ومعتمدة. من خلال برامج التدريب والتطوير المستمر، يمكنك التقدم في مسارك المهني وتحقيق أهدافك.'),
      growthStages: [
        { level: text('مبتدئ'), time: text('0-2 سنة') },
        { level: text('متوسط'), time: text('2-4 سنوات') },
        { level: text('خبير'), time: text('4-6 سنوات') },
        { level: text('قيادي'), time: text('6+ سنوات') },
      ],
      growthHighlightTitle: text('نمو لا محدود'),
      growthHighlightDescription: text('فرص الترقية متاحة للجميع بناءً على الأداء والكفاءة'),
      ctaTitle: text('جاهز للانضمام؟'),
      ctaDescription: text('اكتشف الوظائف المتاحة وقدم طلبك اليوم لتصبح جزءاً من عائلتنا'),
      ctaPrimary: text('تصفح الوظائف'),
      ctaSecondary: text('تواصل معنا'),
      appearance: {
        heroFrom: '#0f766e',
        heroTo: '#134e4a',
        heroText: '#ffffff',
        heroMuted: '#ccfbf1',
        sectionBackground: '#ffffff',
        cardBackground: '#ffffff',
        cardBorder: '#ccfbf1',
        accent: '#0f766e',
        ctaFrom: '#14b8a6',
        ctaTo: '#0f766e',
        ctaText: '#ffffff',
        showStory: true,
        showStats: true,
        showValues: true,
        showAdditional: true,
        showGrowth: true,
        showCta: true,
      },
    },
    contact: { eyebrow: text('نحن هنا لمساعدتك'), title: text('تواصل معنا'), description: text('فريق التوظيف جاهز للإجابة عن استفساراتك'), infoTitle: text('معلومات التواصل'), infoDescription: text('يمكنك التواصل معنا عبر أي من القنوات التالية، وسنرد عليك في أقرب وقت ممكن'), whatsappLabel: text('ابدأ المحادثة'), formTitle: text('أرسل لنا رسالة'), hours: text('من السبت إلى الخميس، من 9 صباحاً إلى 5 مساءً'), address: text('جمهورية مصر العربية') },
  },
  legal: {
    privacy: {
      eyebrow: text('حماية بياناتك', 'Your Data Matters'),
      title: text('سياسة الخصوصية', 'Privacy Policy'),
      description: text('نوضح هنا كيف نتعامل مع البيانات التي ترسلها عند التقدم إلى وظائف صيدلية الهواري.', 'This page explains how we handle information submitted when you apply for a position at El Hawary Pharmacy.'),
      updatedLabel: text('آخر تحديث', 'Last updated'),
      updatedAt: '15 أغسطس 2026',
      sections: [
        { title: text('البيانات التي نجمعها', 'Information we collect'), body: text('قد نجمع البيانات التي تكتبها في نموذج التقديم، مثل الاسم وتاريخ الميلاد والبريد الإلكتروني وأرقام الهاتف والعنوان والتعليم والخبرات والنبذة الشخصية. نستخدم هذه البيانات لأغراض التوظيف والتواصل المرتبط بالطلب فقط.', 'We may collect the information you provide in the application form, including your name, birth date, email, phone numbers, address, education, experience, and biography. We use it for recruitment and application-related communication only.') },
        { title: text('كيفية استخدام البيانات', 'How we use information'), body: text('نستخدم بياناتك لمراجعة مؤهلاتك، والتواصل معك بشأن طلبك، وإدارة مراحل التوظيف، وتحسين تجربة التقديم. لا نبيع بيانات المتقدمين ولا نستخدمها لأغراض تسويقية غير مرتبطة بالتوظيف.', 'We use your information to review your qualifications, contact you about your application, manage recruitment stages, and improve the application experience. We do not sell applicant information or use it for unrelated marketing.') },
        { title: text('السيرة الذاتية عبر واتساب', 'CV submission through WhatsApp'), body: text('لا يتم رفع السيرة الذاتية داخل الموقع. بعد إرسال الطلب، يمكنك اختيار إرسال السيرة الذاتية إلى رقم واتساب التوظيف الظاهر في الموقع. عند استخدام واتساب، تنطبق أيضاً سياسات وشروط خدمة واتساب.', 'CV files are not uploaded to this website. After submitting an application, you may choose to send your CV to the recruitment WhatsApp number shown on the website. WhatsApp terms and policies also apply when you use that service.') },
        { title: text('حماية البيانات والاحتفاظ بها', 'Security and retention'), body: text('نطبق ضوابط وصول مناسبة على بيانات طلبات التوظيف، ويقتصر الاطلاع الإداري على المدير والموظفين المصرح لهم. نحتفظ بالبيانات للمدة اللازمة لإدارة فرص التوظيف والالتزامات التشغيلية، ثم نراجع الحاجة إلى الاحتفاظ بها.', 'We apply appropriate access controls to application data, limiting administrative access to the administrator and authorized staff. We retain information for as long as needed to manage recruitment opportunities and operational obligations, then review whether continued retention is necessary.') },
        { title: text('حقوقك والتواصل معنا', 'Your choices and contact'), body: text('إذا أردت الاستفسار عن بياناتك أو طلب تصحيحها أو حذفها، تواصل مع فريق التوظيف عبر careers@elhawarypharmacy.com أو رقم واتساب المعلن في الموقع، وسنراجع طلبك وفق الإجراءات المعمول بها.', 'To ask about, correct, or request deletion of your information, contact the recruitment team at careers@elhawarypharmacy.com or the WhatsApp number shown on the website. We will review your request under our applicable procedures.') },
      ],
    },
    terms: {
      eyebrow: text('استخدام المنصة', 'Using the platform'),
      title: text('الشروط والأحكام', 'Terms and Conditions'),
      description: text('تنظم هذه الشروط استخدام منصة التوظيف وإرسال طلبات العمل إلى صيدلية الهواري.', 'These terms govern the use of the recruitment platform and the submission of applications to El Hawary Pharmacy.'),
      updatedLabel: text('آخر تحديث', 'Last updated'),
      updatedAt: '15 أغسطس 2026',
      sections: [
        { title: text('الغرض من المنصة', 'Platform purpose'), body: text('توفر المنصة معلومات عن الوظائف المتاحة وتتيح للمرشحين إرسال بياناتهم للتقييم الوظيفي. نشر الوظيفة لا يمثل ضماناً بالتعيين أو وعداً بإجراء مقابلة.', 'The platform provides information about available positions and allows candidates to submit information for recruitment review. Publishing a position does not guarantee employment or an interview.') },
        { title: text('دقة المعلومات', 'Accuracy of information'), body: text('يتحمل المتقدم مسؤولية تقديم بيانات صحيحة ومحدثة وكاملة. يجب عدم إرسال بيانات تخص شخصاً آخر أو مستندات غير صحيحة أو مضللة.', 'Applicants are responsible for providing accurate, current, and complete information. Do not submit information belonging to another person or false or misleading documents.') },
        { title: text('إرسال الطلبات', 'Application submissions'), body: text('إرسال الطلب لا يعني القبول النهائي. يحتفظ فريق التوظيف بحق مراجعة الطلبات والتواصل مع المرشحين المناسبين وتحديث حالة الطلب وفق احتياجات العمل.', 'Submitting an application does not mean final acceptance. The recruitment team may review applications, contact suitable candidates, and update application status according to business needs.') },
        { title: text('السلوك المقبول', 'Acceptable use'), body: text('يُمنع استخدام المنصة لإرسال محتوى مسيء أو ضار أو مخالف للقانون، أو لمحاولة تعطيل الموقع أو الوصول غير المصرح به إلى بياناته أو خدماته.', 'You may not use the platform to submit abusive, harmful, or unlawful content, disrupt the website, or attempt unauthorized access to its data or services.') },
        { title: text('التعديلات والتواصل', 'Updates and contact'), body: text('قد يتم تحديث الوظائف أو المحتوى أو هذه الشروط عند الحاجة. استمرارك في استخدام المنصة بعد نشر التحديثات يعني اطلاعك عليها. للاستفسارات، تواصل مع careers@elhawarypharmacy.com.', 'Jobs, content, or these terms may be updated when necessary. Continued use after an update indicates that you have reviewed it. For questions, contact careers@elhawarypharmacy.com.') },
      ],
    },
  },
  footer: {
    description: text('نبني فريقاً متميزاً لخدمة مجتمعنا وتطوير الرعاية الصحية.'),
    copyright: text('جميع الحقوق محفوظة لصيدلية الهواري'),
    privacyLabel: text('سياسة الخصوصية'),
    termsLabel: text('الشروط والأحكام'),
  },
  theme: {
    primaryColor: '#2563eb',
    secondaryColor: '#14b8a6',
    accentColor: '#f59e0b',
    surfaceColor: '#f4f8fb',
    logoUrl: '/assets/logo.svg',
    customCss: '',
  },
};

function mergeContent(value: Partial<SiteContent> | undefined): SiteContent {
  return {
    ...defaultSiteContent,
    ...value,
    site: { ...defaultSiteContent.site, ...value?.site },
    brand: { ...defaultSiteContent.brand, ...value?.brand },
    header: { ...defaultSiteContent.header, ...value?.header },
    home: { ...defaultSiteContent.home, ...value?.home },
    pages: {
      ...defaultSiteContent.pages,
      ...value?.pages,
      careers: { ...defaultSiteContent.pages.careers, ...value?.pages?.careers },
      about: {
        ...defaultSiteContent.pages.about,
        ...value?.pages?.about,
        appearance: {
          ...defaultSiteContent.pages.about.appearance,
          ...value?.pages?.about?.appearance,
        },
      },
      benefits: {
        ...defaultSiteContent.pages.benefits,
        ...value?.pages?.benefits,
        appearance: {
          ...defaultSiteContent.pages.benefits.appearance,
          ...value?.pages?.benefits?.appearance,
        },
      },
      contact: { ...defaultSiteContent.pages.contact, ...value?.pages?.contact },
    },
    legal: {
      ...defaultSiteContent.legal,
      ...value?.legal,
      privacy: { ...defaultSiteContent.legal.privacy, ...value?.legal?.privacy },
      terms: { ...defaultSiteContent.legal.terms, ...value?.legal?.terms },
    },
    footer: { ...defaultSiteContent.footer, ...value?.footer },
    theme: { ...defaultSiteContent.theme, ...value?.theme },
  };
}

export async function getPublicSiteContent(): Promise<SiteContent> {
  if (isDemoMode()) return defaultSiteContent;
  try {
    const { db } = getFirebaseInstances();
    const snapshot = await getDoc(doc(db, 'settings', 'content'));
    return mergeContent(snapshot.exists() ? (snapshot.data() as Partial<SiteContent>) : undefined);
  } catch (error) {
    console.warn('Falling back to default site content.', error);
    return defaultSiteContent;
  }
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const normalized = mergeContent(content);
  const { db } = getFirebaseInstances();
  await setDoc(doc(db, 'settings', 'content'), normalized, { merge: true });
  return normalized;
}

export function getSiteText(value?: SiteText): string {
  return value?.ar || value?.en || '';
}

export function mergeSiteContent(value: Partial<SiteContent> | undefined): SiteContent {
  return mergeContent(value);
}
