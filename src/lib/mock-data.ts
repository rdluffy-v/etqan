import { Course, OfflineWorkshop, CorporateBounty, CommunityChallenge, UserProfile, TraineeSkillBadge } from './types';

export const TRACKS_INFO = [
  {
    id: 'programming',
    title: 'البرمجة وهندسة الأنظمة',
    description: 'تطوير البرمجيات الحديثة، البنية التحتية السحابية وتطبيقات الويب والأنظمة الموزعة.',
    icon: 'Code2',
    color: 'emerald',
    badge: 'الأكثر طلباً',
  },
  {
    id: 'hardware',
    title: 'صيانة العتاد واللوحات الإلكترونية',
    description: 'تشخيص الأعطال الدقيقة، لحام المكونات المجهرية SMD، وبرمجة وحدات التحكم الصناعية.',
    icon: 'Cpu',
    color: 'amber',
    badge: 'تطبيق عملي ميداني',
  },
  {
    id: 'ai_robotics',
    title: 'الروبوتات والذكاء الاصطناعي',
    description: 'الأنظمة الذاتية، معالجة اللغات الطبيعية، الرؤية الحاسوبية، وتطبيقات إنترنت الأشياء (IoT).',
    icon: 'Bot',
    color: 'purple',
    badge: 'تقنية المستقبل',
  },
  {
    id: 'security',
    title: 'الأمن السيبراني والدفاع الرقمي',
    description: 'اختبار الاختراق الأخلاقي، التحقيق الجنائي الرقمي، حماية الشبكات وتحصين المنظومات.',
    icon: 'ShieldAlert',
    color: 'red',
    badge: 'درع رقمي',
  },
  {
    id: 'design',
    title: 'التصميم الرقمي وتجربة المستخدم',
    description: 'هندسة واجهات المستخدم الحديثة، الأنظمة التصميمية وتجارب المنتجات الرقمية العالمية.',
    icon: 'Palette',
    color: 'cyan',
    badge: 'إبداع تقني',
  },
];

export const MOCK_USERS: Record<string, UserProfile> = {
  trainee_personal: {
    id: 'usr_trainee_01',
    email: 'ahmed.alfituri@gmail.com',
    fullName: 'أحمد الفيتوري',
    role: 'trainee',
    verificationType: 'personal',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    points: 1850,
    streakDays: 14,
    createdAt: '2026-01-15T10:00:00Z',
  },
  trainee_academic: {
    id: 'usr_academic_02',
    email: 'fatima.derbali@uot.edu.ly',
    fullName: 'فاطمة الدربالي',
    role: 'trainee',
    verificationType: 'academic_edu',
    academicInstitution: 'جامعة طرابلس - كلية تقنية المعلومات',
    studentIdNumber: 'IT-2023-8891',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    points: 2940,
    streakDays: 28,
    createdAt: '2026-02-01T12:00:00Z',
  },
  instructor_lead: {
    id: 'usr_inst_03',
    email: 'm.khalil@tech-compass.ly',
    fullName: 'م. خليل الزواوي',
    role: 'instructor',
    verificationType: 'personal',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    points: 8400,
    streakDays: 45,
    cqsRating: 9.8,
    createdAt: '2025-11-10T08:00:00Z',
  },
  corporate_partner: {
    id: 'usr_corp_04',
    email: 'recruitment@libyantech.ly',
    fullName: 'شركة المدار التقني للحلول الذكية',
    role: 'corporate',
    verificationType: 'personal',
    isVerified: true,
    avatarUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=250',
    points: 12000,
    streakDays: 60,
    createdAt: '2025-08-20T14:00:00Z',
  },
};

export const MOCK_COURSES: Course[] = [
  {
    id: 'course-arch-nextjs',
    title: 'معمارية النظم الموزعة وتطبيقات الويب السريعة',
    slug: 'distributed-systems-nextjs',
    description: 'بناء تطبيقات الإنتاج القابلة للتوسع باستخدام Next.js 15 و Cloudflare Workers و Edge Databases بأسلوب هندسي دقيق.',
    track: 'programming',
    level: 'intermediate',
    instructorId: 'usr_inst_03',
    instructorName: 'م. خليل الزواوي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    instructorRole: 'كبير مهندسي البرمجيات - بوصلة الجيل التقني',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    cqsScore: 9.8,
    isPublished: true,
    totalDurationMinutes: 54,
    lessonsCount: 3,
    enrolledStudentsCount: 428,
    createdAt: '2026-02-10T10:00:00Z',
    lessons: [
      {
        id: 'lesson-01-edge-computing',
        courseId: 'course-arch-nextjs',
        title: 'الدرس 1: معمارية الحوسبة الطرفية (Edge Computing) وقواعد بيانات D1',
        lessonOrder: 1,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        durationSeconds: 960, // 16 min (<= 20 min)
        transcript: 'مرحباً بكم في منصة إتقان. في هذا الدرس العملي سنتعلم كيفية تصميم النظم الموزعة ونشر قواعد البيانات الخفيفة SQLite على الأطراف الجغرافية القريبة من المستخدم لتقليل وقت الاستجابة إلى ما دون 15 ميلي ثانية.',
        chapters: [
          { title: 'مقدمة وهندسة النظم الموزعة', timeSeconds: 0 },
          { title: 'مقارنة الخوادم المركزية مع شبكات Edge', timeSeconds: 180 },
          { title: 'إعداد وتكوين Cloudflare D1', timeSeconds: 420 },
          { title: 'اختبار زمن الاستجابة (Latency Benchmark)', timeSeconds: 680 },
          { title: 'الخلاصة وحلقة التطبيق والمختبر', timeSeconds: 850 }
        ],
        vttSubtitlesAr: `WEBVTT

00:00:01.000 --> 00:00:05.000
مرحباً بكم في منصة إتقان التدريبية.

00:00:05.500 --> 00:00:11.000
في هذا الدرس العملي، نستكشف الحوسبة الطرفية Edge Computing وقواعد بيانات D1.

00:00:11.500 --> 00:00:18.000
الهدف الأساسي هو خفض زمن الاستجابة إلى أجزاء من الميلي ثانية مع ضمان حماية البيانات.`,
        vttSubtitlesEn: `WEBVTT

00:00:01.000 --> 00:00:05.000
Welcome to the Etqan learning platform.

00:00:05.500 --> 00:00:11.000
In this hands-on lesson, we explore Edge Computing and D1 SQLite databases.

00:00:11.500 --> 00:00:18.000
Our goal is sub-15ms global latency combined with hardened security.`,
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'ما هي الميزة الجوهرية لاستخدام Cloudflare D1 مقارنة بقواعد البيانات المركزية التقليدية؟',
              options: [
                'تنفيذ الاستعلامات بالقرب من متصفح العميل عبر شبكة الخوادم الطرفية الموزعة عالمياً',
                'عدم الحاجة لأي حماية أو مصادقة للمستخدمين',
                'زيادة حجم استهلاك المعالج بنسبة 100%',
                'إلغاء الحاجة للغة SQL كلياً'
              ],
              correctAnswer: 0,
              explanation: 'تعتمد D1 على توزيع قراءة البيانات على شبكة Cloudflare العالمية بحيث تتم الاستجابة من أقرب نقطة تواجد للمستخدم النهائي بسرعة فائقة.'
            },
            {
              id: 'q2',
              question: 'ما هو الحد الأقصى للمدة الموصى بها للدرس المصغر وفق معايير جودة إتقان (CQS)؟',
              options: [
                '60 دقيقة',
                '20 دقيقة لضمان التركيز الذهني والتدريب العملي الفوري',
                'ساعتان متواصلتان',
                'لا يوجد أي حد زمني'
              ],
              correctAnswer: 1,
              explanation: 'تعتمد إتقان حلقة التعلم المصغر (Micro-learning Loop) التي تشترط أن تكون مدة الشرح المركز 20 دقيقة أو أقل يتبعها مباشرة تطبيق وتحدي برمجي.'
            }
          ]
        },
        sandbox: {
          id: 'sb-01',
          language: 'javascript',
          instructions: 'قم بكتابة دالة `calculateLatency(pingArray)` تستقبل مصفوفة من أزمنة الاستجابة بالميلي ثانية، وترجع متوسط وقت الاستجابة مقرباً لأقرب عدد صحيح.',
          initialCode: `// منصة إتقان - بيئة المحاكاة التفاعلية المباشرة
function calculateLatency(pingArray) {
  // اكتب كودك هنا لحساب متوسط زمن الاستجابة
  
}

// اختبار الدالة
console.log(calculateLatency([12, 18, 15, 24, 11]));
`,
          solutionCode: `function calculateLatency(pingArray) {
  if (!pingArray || pingArray.length === 0) return 0;
  const total = pingArray.reduce((acc, val) => acc + val, 0);
  return Math.round(total / pingArray.length);
}

console.log(calculateLatency([12, 18, 15, 24, 11]));`,
          testCases: [
            {
              description: 'حساب متوسط القيم: [12, 18, 15, 24, 11]',
              inputCode: 'calculateLatency([12, 18, 15, 24, 11])',
              expectedOutput: '16'
            },
            {
              description: 'التعامل مع مصفوفة ذات زمن استجابة سريع: [4, 6, 5]',
              inputCode: 'calculateLatency([4, 6, 5])',
              expectedOutput: '5'
            }
          ]
        }
      },
      {
        id: 'lesson-02-forensic-security',
        courseId: 'course-arch-nextjs',
        title: 'الدرس 2: حماية المحتوى والعلامات المائية الجنائية (Forensic Watermarking)',
        lessonOrder: 2,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        durationSeconds: 1140, // 19 min (<= 20 min)
        transcript: 'في هذا الدرس سنتعلم كيف تحمي منصة إتقان المواد التعليمية الرقمية بحقن معرفات رقمية ديناميكية متحركة عشوائياً تمنع التقاط الشاشة أو التسجيل الخارجي بكاميرات الهواتف.',
        chapters: [
          { title: 'أهمية حماية المحتوى والملكية الفكرية', timeSeconds: 0 },
          { title: 'تقنية العلامات المائية الجنائية العشوائية', timeSeconds: 260 },
          { title: 'كشف محاولات التسجيل وتعتيم Canvas', timeSeconds: 610 },
          { title: 'التطبيق العملي والتشفير الطرفي', timeSeconds: 920 }
        ],
        quiz: {
          questions: [
            {
              id: 'q3',
              question: 'ما هو الدور الأمني للعلامة المائية الجنائية المتحركة عشوائياً داخل مشغل إتقان؟',
              options: [
                'تزيين واجهة الفيديو فقط',
                'ردع التسجيل عبر الكاميرات الخارجية وتتبع هوية الحساب المسرب بدقة متناهية',
                'تسريع تشغيل الفيديو',
                'تقليل حجم استهلاك الإنترنت'
              ],
              correctAnswer: 1,
              explanation: 'العلامة المائية تطبع رقم المستخدم وهويته مشفرة وتتحرك بتردد عشوائي مما يجعل إخفاءها في التسجيل مستحيلاً.'
            }
          ]
        },
        sandbox: {
          id: 'sb-02',
          language: 'javascript',
          instructions: 'اكتب دالة `maskUserId(userId)` تخفي منتصف معرف المستخدم وتظهر أول 3 رموز وآخر 3 رموز فقط وتضع بينهما 4 نجوم `****`. مثال: `usr_trainee_01` تصبح `usr****_01`',
          initialCode: `function maskUserId(userId) {
  // اكتب حلك هنا
}

console.log(maskUserId("usr_trainee_01"));
`,
          solutionCode: `function maskUserId(userId) {
  if (!userId || userId.length <= 6) return userId;
  return userId.slice(0, 3) + '****' + userId.slice(-3);
}

console.log(maskUserId("usr_trainee_01"));`,
          testCases: [
            {
              description: 'إخفاء المعرف: usr_trainee_01',
              inputCode: 'maskUserId("usr_trainee_01")',
              expectedOutput: 'usr****_01'
            },
            {
              description: 'إخفاء المعرف: usr_inst_99',
              inputCode: 'maskUserId("usr_inst_99")',
              expectedOutput: 'usr****_99'
            }
          ]
        }
      },
      {
        id: 'lesson-03-s3-r1-pipeline',
        courseId: 'course-arch-nextjs',
        title: 'الدرس 3: هندسة التخزين الآمن عبر Cloudflare R1 وبروتوكول S3',
        lessonOrder: 3,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        durationSeconds: 1020, // 17 min
        transcript: 'تعلم كيفية إعداد روابط الرفع المؤقتة Presigned URLs وحماية البث المباشر دون دفع تكاليف Egress الباهظة.',
        chapters: [
          { title: 'مقدمة في بروتوكول S3 المتوافق مع R1', timeSeconds: 0 },
          { title: 'إنشاء الـ Bucket وإعداد سياسات CORS', timeSeconds: 300 },
          { title: 'الرفع المباشر وتوزيع HLS', timeSeconds: 650 },
          { title: 'إدارة أذونات الوصول والروابط المشفرة', timeSeconds: 880 }
        ]
      }
    ]
  },
  {
    id: 'course-hardware-smd',
    title: 'إتقان صيانة اللوحات الإلكترونية وتشخيص الدوائر الدقيقة',
    slug: 'hardware-micro-soldering',
    description: 'كورس عملي مكثف يشمل قراءة المخططات الإلكترونية (Schematics)، فحص مسارات الطاقة وتغيير شرائح الـ BGA والـ SMD.',
    track: 'hardware',
    level: 'advanced',
    instructorId: 'usr_inst_03',
    instructorName: 'م. طارق القرقني',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    instructorRole: 'خبير هندسة العتاد الدقيق ومستشار الصيانة الصناعية',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    cqsScore: 9.7,
    isPublished: true,
    totalDurationMinutes: 40,
    lessonsCount: 2,
    enrolledStudentsCount: 312,
    createdAt: '2026-02-15T09:00:00Z',
    lessons: [
      {
        id: 'lesson-hw-01',
        courseId: 'course-hardware-smd',
        title: 'الدرس 1: استخدام الميكروسكوب ومحطة اللحام بالهواء الساخن',
        lessonOrder: 1,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        durationSeconds: 1100, // 18.3 min
        transcript: 'أساسيات درجات الحرارة المناسبة لرفع المكونات دون إتلاف طبقات اللوحة المطبوعة PCB.',
      },
      {
        id: 'lesson-hw-02',
        courseId: 'course-hardware-smd',
        title: 'الدرس 2: حقن الفولتية وتحديد الشورت الكهربائي عبر الكاميرا الحرارية',
        lessonOrder: 2,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        durationSeconds: 980, // 16.3 min
        transcript: 'طريقة الكشف عن المكثفات التالفة بالحرارة الفورية لتفادي استبدال العناصر السليمة عبثاً.',
      }
    ]
  },
  {
    id: 'course-ai-embedded',
    title: 'تطبيقات الذكاء الاصطناعي على المعالجات المدمجة والروبوتات',
    slug: 'embedded-ai-robotics',
    description: 'تشغيل نماذج TinyML على وحدات ESP32 و Raspberry Pi لتنفيذ الرؤية الحاسوبية واستشعار البيئة المادية بدقة فائقة.',
    track: 'ai_robotics',
    level: 'intermediate',
    instructorId: 'usr_inst_03',
    instructorName: 'د. سارة المحجوب',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    instructorRole: 'باحثة في نظم الذكاء الاصطناعي والروبوتات',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    cqsScore: 9.6,
    isPublished: true,
    totalDurationMinutes: 38,
    lessonsCount: 2,
    enrolledStudentsCount: 289,
    createdAt: '2026-02-18T11:00:00Z',
    lessons: [
      {
        id: 'lesson-ai-01',
        courseId: 'course-ai-embedded',
        title: 'الدرس 1: تحويل النماذج العصبية إلى صيغة TensorFlow Lite المدمجة',
        lessonOrder: 1,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
        durationSeconds: 1050,
        transcript: 'تقنيات التكميم (Quantization) لتقليص حجم النماذج الذكية للعمل بذاكرة أقل من 512 كيلوبايت.',
      }
    ]
  },
  {
    id: 'course-cyber-defense',
    title: 'الدفاع السيبراني المتقدم واكتشاف الثغرات في المنظومات',
    slug: 'advanced-cyber-defense',
    description: 'محاكاة هجمات حقيقية، اختبار أمان الواجهات البرمجية APIs، وتحليل السجلات الجنائية لكشف التسلل.',
    track: 'security',
    level: 'advanced',
    instructorId: 'usr_inst_03',
    instructorName: 'م. عمر الترهوني',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    instructorRole: 'مستشار الأمن السيبراني واختبار الاختراق',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
    cqsScore: 9.9,
    isPublished: true,
    totalDurationMinutes: 35,
    lessonsCount: 2,
    enrolledStudentsCount: 510,
    createdAt: '2026-02-22T14:00:00Z',
    lessons: [
      {
        id: 'lesson-sec-01',
        courseId: 'course-cyber-defense',
        title: 'الدرس 1: تحليل هجمات حقن الأوامر وتأمين استعلامات D1 من SQL Injection',
        lessonOrder: 1,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        durationSeconds: 1120,
        transcript: 'أفضل الممارسات لاستخدام Prepared Statements ومنع أي استغلال للبيانات الحساسة في السيرفرات السحابية.',
      }
    ]
  },
  {
    id: 'course-ui-ux-design',
    title: 'هندسة الأنظمة التصميمية (Design Systems) والمنتجات الرقمية',
    slug: 'design-systems-engineering',
    description: 'بناء مكونات تفاعلية متناسقة، التحكم بمتغيرات الألوان والتفاعلات الحركية الناعمة وفق معايير الجودة العالمية.',
    track: 'design',
    level: 'beginner',
    instructorId: 'usr_inst_03',
    instructorName: 'أ. مروة البوسيفي',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    instructorRole: 'رئيسة قسم التصميم وتجربة المستخدم',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    cqsScore: 9.5,
    isPublished: true,
    totalDurationMinutes: 32,
    lessonsCount: 2,
    enrolledStudentsCount: 380,
    createdAt: '2026-02-25T16:00:00Z',
    lessons: [
      {
        id: 'lesson-ds-01',
        courseId: 'course-ui-ux-design',
        title: 'الدرس 1: التناغم البصري وبناء لوحة الألوان للوضع الداكن والفاتح',
        lessonOrder: 1,
        videoR1Url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        durationSeconds: 940,
        transcript: 'كيفية إنشاء نظام ألوان مريح للعين مع احترام التباين وسهولة الوصول (Accessibility WCAG).',
      }
    ]
  }
];

export const MOCK_WORKSHOPS: OfflineWorkshop[] = [
  {
    id: 'ws-compass-01',
    title: 'ورشة عملية: صيانة وتشخيص لوحات التحكم الصناعية الميدانية',
    description: 'تدريب تفاعلي مباشر داخل مختبرات بوصلة الجيل التقني المجهزة بأحدث أجهزة القياس والفحص المجهري.',
    instructorName: 'م. طارق القرقني',
    instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    venueName: 'حاضنة بوصلة الجيل التقني - القاعة الهندسية 102',
    venueAddress: 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي',
    dateTime: '2026-10-18T16:00:00Z',
    totalSeats: 25,
    bookedSeats: 19,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
    priceLyd: 0, // مجانية للمتدربين الموثقين
    topics: ['فحص الجهد والتيار المجهري', 'استبدال رقائق الـ SMD بدون حرارة مفرطة', 'مخططات البورد الصناعي'],
  },
  {
    id: 'ws-compass-02',
    title: 'معسكر التطوير السحابي والأمن الموزع (Cloud & Edge Bootcamp)',
    description: 'يوم تدريبي مكثف لبناء ونشر خدمات كاملة على Cloudflare Workers و D1 و Firebase وربطها بنظام مراقبة.',
    instructorName: 'م. خليل الزواوي',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    venueName: 'حاضنة بوصلة الجيل التقني - مسرح الابتكار',
    venueAddress: 'طرابلس، شارع النصر، الطابق الثالث',
    dateTime: '2026-10-25T10:00:00Z',
    totalSeats: 40,
    bookedSeats: 34,
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    priceLyd: 0,
    topics: ['نشر قواعد البيانات الموزعة', 'إعداد المصادقة المتعددة', 'حماية البنية التحتية من هجمات DDoS'],
  },
  {
    id: 'ws-compass-03',
    title: 'هاكاثون الروبوتات والأنظمة الذاتية التحكم (IoT Sprint)',
    description: 'تحدي الفرق لتجميع وبرمجة روبوت مسح ذاتي قادر على اكتشاف وتفادي العقبات باستخدام خوارزميات الذكاء الاصطناعي.',
    instructorName: 'د. سارة المحجوب',
    instructorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    venueName: 'حاضنة بوصلة الجيل التقني - مختبر الروبوتات المتقدم',
    venueAddress: 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار',
    dateTime: '2026-11-05T09:00:00Z',
    totalSeats: 30,
    bookedSeats: 12,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    priceLyd: 0,
    topics: ['حساسات LiDAR ومستشعرات المسافة', 'تحكم المحركات الدقيق', 'تكامل ROS2 مع المعالجات'],
  }
];

export const MOCK_BOUNTIES: CorporateBounty[] = [
  {
    id: 'bounty-01',
    companyName: 'شركة المدار التقني للحلول الذكية',
    companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150',
    title: 'تطوير وحدة توجيه ذكية للطرود اللوجستية في ليبيا',
    track: 'programming',
    rewardAmount: '4,500 د.ل + مقابلة توظيف مباشرة',
    deadline: '2026-10-30T23:59:59Z',
    description: 'نبحث عن خوارزمية ذكية لاختيار أفضل مسار توصيل في المدن الليبية مع مراعاة حالة الطرق وتوفير الوقود.',
    requirements: ['معمارية برمجية نظيفة', 'دعم خرائط غير متصلة بالإنترنت', 'اختبارات وحدة لا تقل عن 85% تغطية'],
    applicantsCount: 14,
    isActive: true,
  },
  {
    id: 'bounty-02',
    companyName: 'مؤسسة البيانات الآمنة (CyberVault)',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=150',
    title: 'فحص أمان واجهات REST وتحليل ثغرات الـ IDOR',
    track: 'security',
    rewardAmount: '3,000 د.ل + شهادة اعتماد',
    deadline: '2026-11-10T23:59:59Z',
    description: 'تحدي لاكتشاف أي تسريب صلاحيات بين مستخدمي النظام وتقديم تقرير تدقيق أمني احترافي.',
    requirements: ['تقرير فحص مفصل بالخطوات', 'Proof of Concept تجريبي', 'توصيات الترقيع الفوري'],
    applicantsCount: 9,
    isActive: true,
  },
  {
    id: 'bounty-03',
    companyName: 'مصنع الأفق للأجهزة والأنظمة الذكية',
    companyLogo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150',
    title: 'تصميم دائرة مراقبة استهلاك الطاقة لخطوط الإنتاج',
    track: 'hardware',
    rewardAmount: '5,000 د.ل + تمويل النموذج الأولي',
    deadline: '2026-11-20T23:59:59Z',
    description: 'تصميم لوحة إلكترونية تستند إلى متحكم STM32 أو ESP32 لقراءة حساسات CT وحساب استهلاك الكيلوواط لحظياً.',
    requirements: ['ملفات Gerbers و Schematics', 'مخطط 3D للمكونات', 'محاكاة Proteus / KiCAD'],
    applicantsCount: 6,
    isActive: true,
  }
];

export const MOCK_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'ch-daily-01',
    type: 'daily',
    title: 'تحدي اليوم: تحسين أداء استعلامات D1 في شبكة الحافة',
    description: 'اكتب استعلام SQL فعال يجمع بيانات أفضل 5 طلاب بحسب النقاط دون عمل Full Table Scan.',
    track: 'programming',
    pointsReward: 75,
    deadline: '2026-10-03T23:59:59Z',
    submissionsCount: 88,
  },
  {
    id: 'ch-weekly-02',
    type: 'weekly',
    title: 'تحدي الأسبوع: نظام فك تشفير وتتبع العلامة المائية الرقمية',
    description: 'ابنِ خوارزمية ذكية لاكتشاف علامة مائية مضمنة داخل إطارات الفيديو حتى بعد محاولات الاقتصاص والضغط.',
    track: 'security',
    pointsReward: 300,
    deadline: '2026-10-09T23:59:59Z',
    submissionsCount: 42,
  },
  {
    id: 'ch-hack-03',
    type: 'monthly_hackathon',
    title: 'هاكاثون إتقان الشهري: حلول الذكاء الاصطناعي للأتمتة الميدانية',
    description: 'منافسة الفرق الكبرى لتطوير منظومة روبوتية أو برمجية تخدم مجالات التعليم أو الطاقة أو الرعاية الصحية في ليبيا.',
    track: 'ai_robotics',
    pointsReward: 1200,
    deadline: '2026-10-31T23:59:59Z',
    submissionsCount: 19,
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'فاطمة الدربالي', university: 'جامعة طرابلس', points: 2940, badges: 12, streak: 28, isAcademic: true },
  { rank: 2, name: 'صهيب المقريف', university: 'جامعة بنغازي', points: 2710, badges: 10, streak: 21, isAcademic: true },
  { rank: 3, name: 'أحمد الفيتوري', university: 'مستقل / مسار مهني', points: 1850, badges: 8, streak: 14, isAcademic: false },
  { rank: 4, name: 'ياسمين الورفلي', university: 'الجامعة الليبية الدولية', points: 1680, badges: 7, streak: 12, isAcademic: true },
  { rank: 5, name: 'عبد المهيمن التاجوري', university: 'جامعة مصراتة', points: 1540, badges: 6, streak: 9, isAcademic: true },
];

export const MOCK_SKILL_BADGES: TraineeSkillBadge[] = [
  { id: 'b1', name: 'معمارية الويب السحابي Edge', track: 'programming', iconName: 'Globe', verifiedBy: 'بوصلة الجيل التقني', issuedAt: '2026-02-12', level: 'محترف' },
  { id: 'b2', name: 'حماية وتأمين الفيديو HLS', track: 'security', iconName: 'ShieldCheck', verifiedBy: 'إتقان CQS', issuedAt: '2026-02-14', level: 'خبير' },
  { id: 'b3', name: 'لحام وتشخيص الدوائر SMD', track: 'hardware', iconName: 'Cpu', verifiedBy: 'حاضنة بوصلة الجيل التقني', issuedAt: '2026-02-18', level: 'مبتدئ' },
  { id: 'b4', name: 'تصميم واجهات المستخدم العصرية', track: 'design', iconName: 'Layout', verifiedBy: 'إتقان الأكاديمي', issuedAt: '2026-02-25', level: 'محترف' },
];
