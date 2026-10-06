# 🌟 منصة «إتقان» للتعليم التقني وبناء الكفاءات الوطنية
### Etqan Technical Learning Platform
**برعاية وتنظيم رسمي من «حاضنة بوصلة الجيل التقني» - طرابلس، ليبيا**

---

## 📌 نبذة عامة (Overview)
منصة **«إتقان»** هي المنظومة الوطنية الأولى المتكاملة لتدريب وتمكين الكوادر الشبابية في أحدث التخصصات الهندسية والتقنية:
1. **البرمجة وهندسة النظم الموزعة (Programming & Edge Architecture)**
2. **صيانة العتاد والشرائح الدقيقة (Hardware Micro-soldering & SMD)**
3. **الروبوتات والذكاء الاصطناعي والأنظمة المدمجة (AI, Robotics & IoT)**
4. **الأمن السيبراني والدفاع الرقمي (Cyber Defense & Forensics)**
5. **التصميم الرقمي والأنظمة التفاعلية (Design Systems & UI/UX)**

تم تصميم المنصة معمارياً لتعمل بكفاءة فائقة على السحابة مع **Next.js 15 (App Router)**، ومجهزة للربط المباشر مع:
* **Firebase Authentication:** لإدارة الهوية المزدوجة وتسجيل الدخول.
* **Cloudflare D1:** قاعدة بيانات SQLite سحابية موزعة على أطراف شبكة الحافة (Edge Database).
* **Cloudflare R1 / R2:** لتخزين وبث الفيديوهات والملفات المتوافقة مع S3 دون تكاليف Egress.
* **Vercel:** النشر والاستضافة السحابية بضغطة زر واحدة مع سرعة فائقة.

> 💡 **وضع المحاكاة الذكي الفوري (Demo Mode Fallback):**
> تعمل المنصة بكامل ميزاتها وخاصياتها حتى قبل إدخال أي مفاتيح سحابية، مع توفير زر **1-Click Demo Switcher** للتنقل الفوري بين أدوار (متدرب أكاديمي، متدرب شخصي، مدرب معتمد CQS، شريك شركات B2B).

---

## 🚀 المميزات الرئيسية للمنصة (Core Features)

### 1. مشغل الفيديو فائق الحماية (YouTube-Class Protected Player)
* **دعم بث HLS التكيفي (.m3u8):** مدمج عبر `hls.js` مع دعم البث المباشر وجودات الفيديو المتعددة (`Auto`, `1080p`, `720p`, `360p`).
* **فصول الدرس التفاعلية (Video Chapters):** علامات فصول تفاعلية على شريط التقدم وقائمة تنقل سريع بين المحطات الزمنية.
* **طبقة حماية Canvas الجنائية (HTML5 Canvas Protection):** طبقة رسومية مشفرة على Canvas تمنع نسخ الشاشة وتطبع الرموز الدقيقة.
* **العلامة المائية الجنائية الديناميكية (Dynamic Forensic Watermark):** تتحرك عشوائياً وتطبع معرف المستخدم وعنوان الـ IP المشفر والوقت اللحظي لردع تصوير الشاشة بكاميرات خارجية.
* **درع منع التسجيل والتقاط الشاشة (Anti-Recording Shield):** اعتراض فوري لمفاتيح تصوير الشاشة (`PrintScreen`) وتعتيم الفيديو فور فقدان التركيز.
* التحكم بالسرعات (`0.5x` إلى `2.0x`) والترجمات المتعددة (عربي / إنجليزي VTT).

### 2. حلقة التعلم المصغر (Micro-learning Loop)
* **معيار الجودة CQS الصارم:** تقييد الدرس بمدة لا تزيد عن 20 دقيقة (1200 ثانية).
* **اختبار الفهم السريع (Concept Quiz):** يظهر فور إنهاء الفيديو لقياس الاستيعاب.
* **محرر الكود والمحاكاة المدمج (In-Browser Sandbox):** تطبيق عملي تفاعلي مع تشغيل فوري وفحص حقيقي لحالات الاختبار البرمجية (Real Assertion Engine).

### 3. منظومة الهوية المزدوجة (Dual Identity Verification)
* حساب شخصي حر (Personal).
* حساب أكاديمي موثق (Academic): بالبريد الجامعي (`.edu.ly`) أو عبر **المسح الذكي للبطاقة الجامعية (OCR Verification Fallback)**.

### 4. جواز المهارات الرقمي الموثق (Live Skill Passport)
* صفحة عامة لكل متدرب برابط دائم ورمز **QR Code** تفاعلي.
* اعتماد رسمي وختم رقمي صادر عن حاضنة «بوصلة الجيل التقني».

### 5. حجز ورش العمل الميدانية بالحاضنة (Offline Workshops & QR Ticketing)
* استعراض الورش المقامة في مقر المؤسسة بطرابلس (شارع النصر).
* حجز المقاعد وإصدار تذكرة فورية برمز QR وتصدير دعوة التقويم بصيغة `.ics`.

### 6. مجتمع التحديات ونظام التقييم الذكي (AI Rubric Scoring)
* تحديات يومية وأسبوعية وهاكاثونات شهرية.
* محرك ذكاء اصطناعي يقيم الحلول برمجياً على 4 محاور (الأصالة، الجدوى، العمق، الأثر) مع فحص مكافحة النسخ.

### 7. بوابة الشركات وبنك الكوادر (Corporate & B2B Portal)
* استعراض وتصفية الكفاءات المعتمدة بناءً على درجات CQS والمشاريع.
* طرح مسابقات الباونتي (Sponsored Bounties) بجوائز مالية وفرص توظيف.

---

## 🛠️ دليل التشغيل المحلي (Local Quick Start)

### 1. المتطلبات الأساسية
* Node.js v18.18+ أو v20+ أو v24+
* npm أو pnpm

### 2. التثبيت والتشغيل الفوري
```bash
# 1. الدخول إلى مجلد المشروع
cd etqan

# 2. تشغيل السيرفر المحلي في وضع التطوير
npm run dev
```
افتح المتصفح على الرابط: `http://localhost:3000`، وستعمل المنصة مباشرة بكامل محتواها التجريبي!

### 3. تشغيل الاختبارات الآلية (Automated Tests)
```bash
npm test
```
ينفذ فحصاً شاملاً لمعيار CQS ومخطط D1 وتكوين Vercel ومحرك الفحص ومسارات الـ API.

### 4. فحص البناء والإنتاج
```bash
npm run build
```

---

## ☁️ دليل ربط الخدمات السحابية (Cloud Integration Guide)

عندما ترغب في الانتقال من وضع الـ Demo إلى الإنتاج الفعلي، قم بإنشاء ملف `.env.local` مستنداً إلى `.env.example`:

### 1. ربط Firebase Authentication
1. أنشئ مشروعاً جديداً في [Firebase Console](https://console.firebase.google.com/).
2. فعّل خدمة **Authentication** وخيار تسجيل الدخول عبر **Email/Password**.
3. انسخ إعدادات الويب (Web App Config) وأضفها إلى `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-app"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:..."
```

### 2. ربط Cloudflare D1 (Database)
1. من لوحة [Cloudflare Dashboard](https://dash.cloudflare.com/)، انتقل إلى **Workers & Pages > D1 SQL Databases**.
2. أنشئ قاعدة بيانات جديدة باسم `etqan-production`.
3. طبق مخطط الجداول الجاهز الموجود في `d1/schema.sql` عبر لوحة Cloudflare Console أو عبر Wrangler:
```bash
npx wrangler d1 execute etqan-production --file=d1/schema.sql --remote
```
4. أنشئ API Token بصلاحية D1، واملأ المتغيرات في `.env.local`:
```env
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_D1_DATABASE_ID="your_d1_database_uuid"
CLOUDFLARE_API_TOKEN="your_cloudflare_api_token"
```

### 3. ربط Cloudflare R1 / R2 (Video Storage)
1. من لوحة Cloudflare، انتقل إلى **R2 Object Storage**.
2. أنشئ Bucket جديد باسم `etqan-protected-videos`.
3. أنشئ **R2 API Token** بصلاحية Read & Write لتحصل على `Access Key ID` و `Secret Access Key`.
4. أضف المفاتيح إلى `.env.local`:
```env
CLOUDFLARE_R1_ACCOUNT_ID="your_account_id"
CLOUDFLARE_R1_ACCESS_KEY_ID="your_access_key_id"
CLOUDFLARE_R1_SECRET_ACCESS_KEY="your_secret_access_key"
CLOUDFLARE_R1_BUCKET_NAME="etqan-protected-videos"
NEXT_PUBLIC_R1_PUBLIC_URL="https://your-custom-r2-domain.com"
```

---

## 🚀 دليل النشر على Vercel (Deploy to Vercel)

### الخيار أ: عبر Vercel CLI المباشر
```bash
# تثبيت Vercel CLI إذا لم يكن مثبتاً
npm i -g vercel

# النشر الفوري
vercel
```

### الخيار ب: عبر GitHub / GitLab
1. ارفع المشروع إلى مستودع GitHub الخاص بك.
2. توجه إلى [Vercel Dashboard](https://vercel.com/) واضغط **Add New Project**.
3. اختر المستودع، وتأكد من أن Framework Preset هو **Next.js**.
4. أضف متغيرات البيئة من ملف `.env.example` في قسم **Environment Variables**.
5. اضغط **Deploy**.

---

## 🔥 دليل النشر على Firebase Hosting و App Hosting

تم تجهيز المشروع بالكامل بملفات التكوين الرسمية لـ Firebase:
- `.firebaserc` (معين لمشروع `etqan-1ez88`)
- `firebase.json` (دعم Next.js Web Frameworks التلقائي مع CDN)
- `apphosting.yaml` (دعم Next.js SSR مع Google Cloud Run)

### 1. النشر المباشر عبر Firebase Hosting:
```bash
# تسجيل الدخول إلى Firebase
npx -y firebase-tools@latest login

# تفعيل دعم أطر الويب الحديثة (Web Frameworks)
npx -y firebase-tools@latest experiments:enable webframeworks

# نشر الموقع بالكامل بضغطة واحدة
npm run deploy:hosting
```
أو عبر الأمر المباشر:
```bash
npx -y firebase-tools@latest deploy --only hosting
```

### 2. النشر عبر Firebase App Hosting (Cloud Run):
```bash
npm run deploy:apphosting
```
أو عبر ربط مستودع GitHub في [Firebase App Hosting Console](https://console.firebase.google.com/project/etqan-1ez88/apphosting).


---

## 📁 هيكلية المشروع البرمجية (Project Architecture)

```
etqan/
├── d1/
│   └── schema.sql                 # مخطط قاعدة البيانات الشامل لـ Cloudflare D1
├── src/
│   ├── app/
│   │   ├── layout.tsx             # الغلاف العام ودعم الثيم والمصادقة
│   │   ├── page.tsx               # الصفحة الرئيسية الشاملة
│   │   ├── globals.css            # أنماط Tailwind CSS ودعم RTL والوضع الداكن
│   │   ├── auth/page.tsx          # شاشة تسجيل الدخول والتحقق الأكاديمي والـ OCR
│   │   ├── courses/page.tsx       # فهرس الكورسات والفلترة بمعيار CQS
│   │   ├── watch/[courseId]/      # مشغل الفيديو المحمي وحلقة التعلم المصغر
│   │   ├── dashboard/page.tsx     # لوحة تحكم المتدرب وجواز المهارات والتذاكر
│   │   ├── passport/[userId]/     # صفحة التحقق العامة لجواز المهارات مع QR
│   │   ├── instructor/page.tsx    # بوابة المدرب ورفع الدروس لـ R1 وإدارة الورش
│   │   ├── workshops/page.tsx     # حجز الورش الميدانية بالحاضنة وتذاكر الـ QR
│   │   ├── community/page.tsx     # مجتمع التحديات والتقييم بالذكاء الاصطناعي
│   │   └── corporate/page.tsx     # بوابة الشركات والبحث في الكفاءات والباونتي
│   ├── components/
│   │   ├── Navbar.tsx             # شريط التنقل ومبدل الأدوار السريع
│   │   ├── Footer.tsx             # تذييل المنصة واعتمادات الحاضنة
│   │   ├── VideoPlayer.tsx        # مشغل الفيديو المحمي بالعلامة المائية والدرع
│   │   ├── QuizModal.tsx          # اختبار الفهم السريع بعد الدرس
│   │   ├── SandboxEditor.tsx      # محرر الكود والمحاكاة التفاعلية المباشرة
│   │   ├── SkillPassportCard.tsx  # بطاقة جواز المهارات مع QR Code المعتمد
│   │   └── WorkshopTicketModal.tsx # نافذة تذكرة الورشة الواقعية وتصدير .ics
│   └── lib/
│       ├── types.ts               # الواجهات وأنواع TypeScript لكافة النماذج
│       ├── mock-data.ts           # بيانات نموذجية غنية للمسارات والتحديات
│       ├── firebase.ts            # تكامل Firebase مع وضع المحاكاة التلقائي
│       ├── auth-context.tsx       # موزع سياق المصادقة وتبديل الجلسات
│       ├── d1.ts                  # عميل Cloudflare D1 مع مخزن محلي بديل
│       ├── r1.ts                  # عميل Cloudflare R1 S3 لرفع الفيديوهات
│       └── theme-context.tsx      # موزع الثيم الداكن والفاتح
├── vercel.json                    # إعدادات النشر على Vercel والترويسات الأمنية
├── .env.example                   # دليل وتوثيق كافة المتغيرات والمفاتيح
├── package.json                   # التبعيات ومكتبات التشغيل
└── tsconfig.json                  # إعدادات TypeScript
```

---

## 🏛️ الاعتماد والشراكة
مشروع **«إتقان»** تم تطويره وتنسيق معاييره بإشراف مباشر من:
**حاضنة ومختبرات بوصلة الجيل التقني (Tech Compass Incubator)**  
طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي.
