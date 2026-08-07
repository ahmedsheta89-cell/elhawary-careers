/**
 * Mock Data for Development
 * Static data to simulate API responses
 */

import type { Job } from '@/types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: {
      ar: 'صيدلي أول',
      en: 'Senior Pharmacist',
    },
    description: {
      ar: 'نبحث عن صيدلي ذو خبرة للانضمام إلى فريقنا في صيدلية الهواري. المسؤوليات تشمل صرف الأدوية، تقديم الاستشارات الطبية للمرضى، وإدارة المخزون.',
      en: 'We are looking for an experienced pharmacist to join our team at El Hawary Pharmacy. Responsibilities include dispensing medications, providing medical consultations to patients, and managing inventory.',
    },
    requirements: {
      ar: [
        'بكالوريوس الصيدلة من جامعة معتمدة',
        'ترخيص مزاولة المهنة ساري المفعول',
        'خبرة لا تقل عن 3 سنوات في مجال الصيدلة',
        'مهارات تواصل ممتازة',
        'إجادة استخدام برامج الصيدلة',
      ],
      en: [
        'Bachelor of Pharmacy from accredited university',
        'Valid pharmacy license',
        'Minimum 3 years experience in pharmacy',
        'Excellent communication skills',
        'Proficiency in pharmacy software',
      ],
    },
    responsibilities: {
      ar: [
        'صرف الأدوية حسب الوصفات الطبية',
        'تقديم الاستشارات الدوائية للمرضى',
        'إدارة مخزون الأدوية والمنتجات الطبية',
        'التأكد من شروط التخزين المناسبة',
        'التعاون مع الفريق الطبي',
      ],
      en: [
        'Dispense medications according to prescriptions',
        'Provide pharmaceutical consultations to patients',
        'Manage medication and medical products inventory',
        'Ensure proper storage conditions',
        'Collaborate with medical team',
      ],
    },
    category: 'pharmacist',
    type: 'full-time',
    experienceLevel: 'senior',
    educationLevel: 'bachelor',
    location: {
      city: 'القاهرة',
      governorate: 'القاهرة',
      address: 'شارع التحرير، وسط البلد',
    },
    salaryRange: {
      min: 8000,
      max: 12000,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'تأمين صحي شامل',
      'بدل مواصلات',
      'مكافآت سنوية',
      'تطوير مهني مستمر',
      'بيئة عمل محفزة',
    ],
    postedDate: '2025-01-15',
    expiryDate: '2025-02-15',
    isActive: true,
    applicationCount: 45,
  },
  {
    id: '2',
    title: {
      ar: 'مساعد صيدلي',
      en: 'Pharmacy Assistant',
    },
    description: {
      ar: 'مطلوب مساعد صيدلي للعمل في فرعنا الجديد. التدريب متاح للمرشحين المؤهلين.',
      en: 'Pharmacy assistant needed for our new branch. Training available for qualified candidates.',
    },
    requirements: {
      ar: [
        'دبلوم صيدلة أو تمريض',
        'ترخيص مزاولة المهنة',
        'خبرة سنة على الأقل (مفضل)',
        'القدرة على العمل ضمن فريق',
      ],
      en: [
        'Pharmacy or Nursing diploma',
        'Professional license',
        'Minimum 1 year experience (preferred)',
        'Team player',
      ],
    },
    responsibilities: {
      ar: [
        'مساعدة الصيادلة في صرف الأدوية',
        'تنظيم الرفوف والمخزون',
        'خدمة العملاء',
        'إدخال البيانات',
      ],
      en: [
        'Assist pharmacists in dispensing medications',
        'Organize shelves and inventory',
        'Customer service',
        'Data entry',
      ],
    },
    category: 'assistant_pharmacist',
    type: 'full-time',
    experienceLevel: 'entry',
    educationLevel: 'diploma',
    location: {
      city: 'الإسكندرية',
      governorate: 'الإسكندرية',
      address: 'شارع فؤاد، سموحة',
    },
    salaryRange: {
      min: 4000,
      max: 6000,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'تأمين صحي',
      'تدريب مكثف',
      'فرص ترقية',
    ],
    postedDate: '2025-01-20',
    expiryDate: '2025-02-20',
    isActive: true,
    applicationCount: 78,
  },
  {
    id: '3',
    title: {
      ar: 'مدير متجر',
      en: 'Store Manager',
    },
    description: {
      ar: 'نبحث عن مدير متجر ذو خبرة قيادية عالية لإدارة عمليات الفرع وتحقيق الأهداف.',
      en: 'Looking for an experienced Store Manager with strong leadership skills to manage branch operations and achieve targets.',
    },
    requirements: {
      ar: [
        'بكالوريوس إدارة أعمال أو صيدلة',
        'خبرة 5 سنوات في إدارة المتاجر',
        'مهارات قيادية ممتازة',
        'خبرة في إدارة الميزانيات',
      ],
      en: [
        'Business Administration or Pharmacy degree',
        '5 years retail management experience',
        'Excellent leadership skills',
        'Budget management experience',
      ],
    },
    responsibilities: {
      ar: [
        'إدارة عمليات المتجر اليومية',
        'قيادة وتطوير فريق العمل',
        'تحقيق أهداف المبيعات',
        'إعداد التقارير الإدارية',
        'ضمان رضا العملاء',
      ],
      en: [
        'Manage daily store operations',
        'Lead and develop team',
        'Achieve sales targets',
        'Prepare management reports',
        'Ensure customer satisfaction',
      ],
    },
    category: 'store_manager',
    type: 'full-time',
    experienceLevel: 'lead',
    educationLevel: 'bachelor',
    location: {
      city: 'الجيزة',
      governorate: 'الجيزة',
      address: 'شارع الهرم',
    },
    salaryRange: {
      min: 10000,
      max: 15000,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'راتب تنافسي',
      'مكافآت أداء',
      'تأمين صحي للعائلة',
      'سيارة شركة',
      'أسهم سنوية',
    ],
    postedDate: '2025-01-10',
    expiryDate: '2025-02-10',
    isActive: true,
    applicationCount: 32,
  },
  {
    id: '4',
    title: {
      ar: 'مندوب مبيعات',
      en: 'Sales Representative',
    },
    description: {
      ar: 'مندوب مبيعات للترويج لمنتجاتنا الطبية والصيدلانية للعملاء المحتملين.',
      en: 'Sales representative to promote our medical and pharmaceutical products to potential clients.',
    },
    requirements: {
      ar: [
        'بكالوريوس تجارة أو صيدلة',
        'خبرة في المبيعات',
        'رخصة قيادة',
        'مهارات تفاوض ممتازة',
      ],
      en: [
        'Commerce or Pharmacy degree',
        'Sales experience',
        'Driving license',
        'Excellent negotiation skills',
      ],
    },
    responsibilities: {
      ar: [
        'زيارة العملاء المحتملين',
        'عرض المنتجات الطبية',
        'تحقيق أهداف المبيعات',
        'بناء علاقات طويلة الأمد',
      ],
      en: [
        'Visit potential clients',
        'Present medical products',
        'Achieve sales targets',
        'Build long-term relationships',
      ],
    },
    category: 'sales_representative',
    type: 'full-time',
    experienceLevel: 'mid',
    educationLevel: 'bachelor',
    location: {
      city: 'القاهرة',
      governorate: 'القاهرة',
      address: 'تغطية جميع المناطق',
    },
    salaryRange: {
      min: 5000,
      max: 8000,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'راتب أساسي + عمولات',
      'بدل وقود',
      'هاتف محمول',
      'تأمين صحي',
    ],
    postedDate: '2025-01-18',
    expiryDate: '2025-02-18',
    isActive: true,
    applicationCount: 56,
  },
  {
    id: '5',
    title: {
      ar: 'أخصائي مخازن',
      en: 'Inventory Specialist',
    },
    description: {
      ar: 'أخصائي مخازن لإدارة وتنظيم مخزون الأدوية والمنتجات الطبية.',
      en: 'Inventory specialist to manage and organize medication and medical products stock.',
    },
    requirements: {
      ar: [
        'دبلوم أو بكالوريوس',
        'خبرة في إدارة المخازن',
        'إجادة استخدام الحاسوب',
        'دقة في التنظيم',
      ],
      en: [
        'Diploma or Bachelor degree',
        'Warehouse management experience',
        'Computer proficiency',
        'Attention to detail',
      ],
    },
    responsibilities: {
      ar: [
        'إدارة المخزون اليومي',
        'متابعة تواريخ الصلاحية',
        'إعداد تقارير الجرد',
        'تنظيم المستودع',
      ],
      en: [
        'Manage daily inventory',
        'Track expiration dates',
        'Prepare inventory reports',
        'Organize warehouse',
      ],
    },
    category: 'inventory_specialist',
    type: 'full-time',
    experienceLevel: 'mid',
    educationLevel: 'diploma',
    location: {
      city: 'القاهرة',
      governorate: 'القاهرة',
      address: 'المخزن المركزي - مدينة نصر',
    },
    salaryRange: {
      min: 5000,
      max: 7000,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'تأمين صحي',
      'بدل مواصلات',
      'وجبات مجانية',
    ],
    postedDate: '2025-01-22',
    expiryDate: '2025-02-22',
    isActive: true,
    applicationCount: 41,
  },
  {
    id: '6',
    title: {
      ar: 'ممثل خدمة عملاء',
      en: 'Customer Service Representative',
    },
    description: {
      ar: 'ممثل خدمة عملاء للرد على استفسارات العملاء وتقديم الدعم اللازم.',
      en: 'Customer service representative to handle customer inquiries and provide necessary support.',
    },
    requirements: {
      ar: [
        'بكالوريوس أي تخصص',
        'مهارات تواصل ممتازة',
        'الصبر واللباقة',
        'إجادة اللغة الإنجليزية (مفضل)',
      ],
      en: [
        'Bachelor any major',
        'Excellent communication skills',
        'Patience and courtesy',
        'English proficiency (preferred)',
      ],
    },
    responsibilities: {
      ar: [
        'الرد على استفسارات العملاء',
        'حل الشكاوى والمشاكل',
        'توجيه العملاء للمنتجات المناسبة',
        'إدخال بيانات العملاء',
      ],
      en: [
        'Respond to customer inquiries',
        'Resolve complaints and issues',
        'Guide customers to suitable products',
        'Enter customer data',
      ],
    },
    category: 'customer_service',
    type: 'full-time',
    experienceLevel: 'entry',
    educationLevel: 'bachelor',
    location: {
      city: 'القاهرة',
      governorate: 'القاهرة',
      address: 'مقر الشركة - الزمالك',
    },
    salaryRange: {
      min: 4000,
      max: 5500,
      currency: 'EGP',
      period: 'monthly',
    },
    benefits: [
      'تأمين صحي',
      'تدريب على خدمة العملاء',
      'بيئة عمل ودية',
    ],
    postedDate: '2025-01-25',
    expiryDate: '2025-02-25',
    isActive: true,
    applicationCount: 89,
  },
];

// Category labels for display
export const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  pharmacist: { ar: 'صيادلة', en: 'Pharmacists' },
  assistant_pharmacist: { ar: 'مساعدي صيادلة', en: 'Pharmacy Assistants' },
  store_manager: { ar: 'مديرو متاجر', en: 'Store Managers' },
  sales_representative: { ar: 'مندوبو مبيعات', en: 'Sales Representatives' },
  inventory_specialist: { ar: 'أخصائيو مخازن', en: 'Inventory Specialists' },
  customer_service: { ar: 'خدمة عملاء', en: 'Customer Service' },
  administration: { ar: 'إدارة', en: 'Administration' },
};

// Experience level labels
export const EXPERIENCE_LABELS: Record<string, { ar: string; en: string }> = {
  entry: { ar: 'مبتدئ', en: 'Entry Level' },
  mid: { ar: 'متوسط', en: 'Mid Level' },
  senior: { ar: 'خبير', en: 'Senior Level' },
  lead: { ar: 'قيادي', en: 'Lead/Management' },
};

// Job type labels
export const JOB_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  'full-time': { ar: 'دوام كامل', en: 'Full Time' },
  'part-time': { ar: 'دوام جزئي', en: 'Part Time' },
  contract: { ar: 'عقد', en: 'Contract' },
  internship: { ar: 'تدريب', en: 'Internship' },
};

// Stats for homepage
export const STATS = [
  { value: '50+', label: { ar: 'فرعاً', en: 'Branches' } },
  { value: '200+', label: { ar: 'موظف', en: 'Employees' } },
  { value: '15+', label: { ar: 'سنة خبرة', en: 'Years Experience' } },
  { value: '100K+', label: { ar: 'عميل سعيد', en: 'Happy Customers' } },
];

// Testimonials
export const TESTIMONIALS = [
  {
    name: { ar: 'أحمد محمد', en: 'Ahmed Mohamed' },
    role: { ar: 'صيدلي أول', en: 'Senior Pharmacist' },
    image: '/assets/testimonial-1.jpg',
    content: {
      ar: 'بيئة عمل رائعة وداعمة. صيدلية الهواري وفرت لي فرص تطوير مهني مستمرة وساعدتني في بناء مساري المهني.',
      en: 'Great and supportive work environment. El Hawary Pharmacy provided me with continuous professional development opportunities and helped me build my career path.',
    },
  },
  {
    name: { ar: 'فاطمة علي', en: 'Fatima Ali' },
    role: { ar: 'مديرة متجر', en: 'Store Manager' },
    image: '/assets/testimonial-2.jpg',
    content: {
      ar: 'انضممت كمساعدة صيدلي وترقيت لمديرة متجر خلال 3 سنوات. الشركة تؤمن بالاستثمار في موظفيها.',
      en: 'I joined as a pharmacy assistant and was promoted to store manager within 3 years. The company believes in investing in its employees.',
    },
  },
  {
    name: { ar: 'محمد إبراهيم', en: 'Mohamed Ibrahim' },
    role: { ar: 'مندوب مبيعات', en: 'Sales Representative' },
    image: '/assets/testimonial-3.jpg',
    content: {
      ar: 'نظام العمولات مجزي جداً والفريق داعم. أرشح الجميع للتقدم للوظائف المتاحة.',
      en: 'The commission system is very rewarding and the team is supportive. I recommend everyone to apply for available positions.',
    },
  },
];

// Hiring process steps
export const HIRING_PROCESS = [
  {
    step: 1,
    title: { ar: 'قدم طلبك', en: 'Submit Application' },
    description: {
      ar: 'أرسل سيرتك الذاتية وطلب التوظيف للوظيفة المناسبة',
      en: 'Send your CV and application for the suitable position',
    },
    icon: 'document',
  },
  {
    step: 2,
    title: { ar: 'مراجعة الطلب', en: 'Application Review' },
    description: {
      ar: 'فريق الموارد البشرية يراجع طلبك خلال 5 أيام عمل',
      en: 'HR team reviews your application within 5 business days',
    },
    icon: 'review',
  },
  {
    step: 3,
    title: { ar: 'المقابلة', en: 'Interview' },
    description: {
      ar: 'مقابلة شخصية أو عبر الفيديو لتقييم مهاراتك',
      en: 'Personal or video interview to assess your skills',
    },
    icon: 'interview',
  },
  {
    step: 4,
    title: { ar: 'الاختبار العملي', en: 'Practical Test' },
    description: {
      ar: 'اختبار عملي لتقييم خبراتك الميدانية',
      en: 'Practical test to evaluate your field experience',
    },
    icon: 'test',
  },
  {
    step: 5,
    title: { ar: 'عرض التوظيف', en: 'Job Offer' },
    description: {
      ar: 'تقديم عرض التوظيف الرسمي ومناقشة التفاصيل',
      en: 'Official job offer and discussion of details',
    },
    icon: 'offer',
  },
];

// Benefits list
export const BENEFITS_LIST = [
  {
    icon: 'health',
    title: { ar: 'تأمين صحي شامل', en: 'Comprehensive Health Insurance' },
    description: {
      ar: 'تغطية صحية لك ولعائلتك في أفضل المستشفيات',
      en: 'Health coverage for you and your family in top hospitals',
    },
  },
  {
    icon: 'growth',
    title: { ar: 'تطوير مهني', en: 'Professional Development' },
    description: {
      ar: 'برامج تدريبية مستمرة وفرص advancement',
      en: 'Continuous training programs and advancement opportunities',
    },
  },
  {
    icon: 'bonus',
    title: { ar: 'مكافآت وحوافز', en: 'Bonuses & Incentives' },
    description: {
      ar: 'مكافآت أداء سنوية وعمولات مجزية',
      en: 'Annual performance bonuses and rewarding commissions',
    },
  },
  {
    icon: 'balance',
    title: { ar: 'توازن الحياة', en: 'Work-Life Balance' },
    description: {
      ar: 'ساعات عمل مرنة وإجازات مدفوعة',
      en: 'Flexible working hours and paid leaves',
    },
  },
  {
    icon: 'transport',
    title: { ar: 'بدل مواصلات', en: 'Transportation Allowance' },
    description: {
      ar: 'بدل مواصلات شهري أو خدمة نقل',
      en: 'Monthly transportation allowance or shuttle service',
    },
  },
  {
    icon: 'environment',
    title: { ar: 'بيئة عمل محفزة', en: 'Motivating Environment' },
    description: {
      ar: 'ثقافة تنظيمية داعمة وتقدير للإنجازات',
      en: 'Supportive organizational culture and recognition',
    },
  },
];

// FAQ items
export const FAQ_ITEMS = [
  {
    question: {
      ar: 'ما هي المؤهلات المطلوبة للتقدم؟',
      en: 'What qualifications are required to apply?',
    },
    answer: {
      ar: 'تعتمد المؤهلات على الوظيفة. بشكل عام، نطلب مؤهلاً دراسياً مناسباً وترخيص مزاولة المهنة إن وجد. يرجى مراجعة متطلبات كل وظيفة بعناية.',
      en: 'Qualifications depend on the position. Generally, we require appropriate educational credentials and professional license if applicable. Please review each job requirements carefully.',
    },
  },
  {
    question: {
      ar: 'كم تستغرق عملية التوظيف؟',
      en: 'How long does the hiring process take?',
    },
    answer: {
      ar: 'عادة ما تستغرق العملية من 2-4 أسابيع من تقديم الطلب حتى عرض التوظيف. قد تختلف المدة حسب عدد المتقدمين وطبيعة الوظيفة.',
      en: 'The process usually takes 2-4 weeks from application to job offer. Duration may vary based on number of applicants and position nature.',
    },
  },
  {
    question: {
      ar: 'هل تقبلون خريجين جدد؟',
      en: 'Do you accept fresh graduates?',
    },
    answer: {
      ar: 'نعم، لدينا برامج خاصة للخريجين الجدد مع تدريب مكثف وتأهيل شامل. تابع صفحة الوظائف للإعلانات عن برامج الخريجين.',
      en: 'Yes, we have special programs for fresh graduates with intensive training and comprehensive preparation. Follow our careers page for graduate program announcements.',
    },
  },
  {
    question: {
      ar: 'ما هي المزايا المقدمة للموظفين؟',
      en: 'What benefits are offered to employees?',
    },
    answer: {
      ar: 'نقدم حزمة شاملة تشمل تأمين صحي، مكافآت أداء، بدلات، فرص تدريب وترقية، وبيئة عمل محفزة. التفاصيل تختلف حسب المستوى الوظيفي.',
      en: 'We offer comprehensive package including health insurance, performance bonuses, allowances, training and promotion opportunities, and motivating work environment. Details vary by job level.',
    },
  },
  {
    question: {
      ar: 'كيف يمكنني متابعة حالة طلبي؟',
      en: 'How can I track my application status?',
    },
    answer: {
      ar: 'ستصلك تحديثات عبر البريد الإلكتروني في كل مرحلة. يمكنك أيضاً التواصل مع فريق الموارد البشرية للاستفسار عن حالة طلبك.',
      en: 'You will receive email updates at each stage. You can also contact HR team to inquire about your application status.',
    },
  },
];
