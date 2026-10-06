-- =============================================================================
-- Cloudflare D1 SQLite Database Schema for منصة إتقان (Etqan Platform)
-- =============================================================================

-- Drop tables if needed for clean re-migrations
DROP TABLE IF EXISTS challenge_submissions;
DROP TABLE IF EXISTS community_challenges;
DROP TABLE IF EXISTS bounties;
DROP TABLE IF EXISTS workshop_tickets;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS completed_lessons;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS sandboxes;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- 1. جدول المستخدمين والهوية المزدوجة (Users & Dual Identity)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('trainee', 'instructor', 'corporate', 'admin')),
    verification_type TEXT NOT NULL DEFAULT 'personal' CHECK(verification_type IN ('personal', 'academic_edu', 'academic_ocr')),
    academic_institution TEXT,
    student_id_number TEXT,
    is_verified INTEGER NOT NULL DEFAULT 0,
    avatar_url TEXT,
    points INTEGER NOT NULL DEFAULT 0,
    streak_days INTEGER NOT NULL DEFAULT 1,
    cqs_rating REAL DEFAULT 4.8,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول المسارات والدورات التدريبية (Courses & Tracks)
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    track TEXT NOT NULL CHECK(track IN ('programming', 'hardware', 'ai_robotics', 'security', 'design')),
    level TEXT NOT NULL CHECK(level IN ('beginner', 'intermediate', 'advanced')),
    instructor_id TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    cqs_score REAL NOT NULL DEFAULT 9.5,
    is_published INTEGER NOT NULL DEFAULT 1,
    total_duration_minutes INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. جدول الدروس المصغرة (<= 20 دقيقة) المحمية (Micro-lessons)
CREATE TABLE lessons (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    lesson_order INTEGER NOT NULL DEFAULT 1,
    video_r1_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK(duration_seconds <= 1200), -- شرط الحد الأقصى 20 دقيقة
    transcript TEXT,
    vtt_subtitles_ar TEXT,
    vtt_subtitles_en TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 4. جدول اختبارات الفهم السريعة بعد الدرس (Concept Quizzes)
CREATE TABLE quizzes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT UNIQUE NOT NULL,
    questions_json TEXT NOT NULL, -- JSON array of question, options, answer_index, explanation
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 5. جدول بيئات الكود والمحاكاة التفاعلية (In-browser Code/Simulation Sandbox)
CREATE TABLE sandboxes (
    id TEXT PRIMARY KEY,
    lesson_id TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL DEFAULT 'javascript',
    initial_code TEXT NOT NULL,
    solution_code TEXT NOT NULL,
    instructions TEXT NOT NULL,
    test_cases_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 6. جدول التسجيل في الدورات (Course Enrollments)
CREATE TABLE enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    progress_percent REAL NOT NULL DEFAULT 0,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 7. جدول سجل اجتياز الدروس والاختبارات (Completed Lessons Log)
CREATE TABLE completed_lessons (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    quiz_score INTEGER NOT NULL DEFAULT 100,
    sandbox_completed INTEGER NOT NULL DEFAULT 1,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);

-- 8. جدول الورش الواقعية الميدانية في حاضنة بوصلة الجيل التقني (Offline Workshops)
CREATE TABLE workshops (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    venue_name TEXT NOT NULL DEFAULT 'حاضنة بوصلة الجيل التقني - المقر الرئيسي',
    venue_address TEXT NOT NULL DEFAULT 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار',
    date_time DATETIME NOT NULL,
    total_seats INTEGER NOT NULL DEFAULT 30,
    booked_seats INTEGER NOT NULL DEFAULT 0,
    image_url TEXT NOT NULL,
    price_lyd REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول تذاكر الورش والـ QR Code (Workshop Tickets)
CREATE TABLE workshop_tickets (
    id TEXT PRIMARY KEY,
    ticket_code TEXT UNIQUE NOT NULL,
    workshop_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    attendee_name TEXT NOT NULL,
    attendee_email TEXT NOT NULL,
    qr_data TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'attended', 'cancelled')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workshop_id) REFERENCES workshops(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 10. جدول المكافآت والتحديات التنافسية للشركات (Corporate Sponsored Bounties)
CREATE TABLE bounties (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    company_logo TEXT NOT NULL,
    title TEXT NOT NULL,
    track TEXT NOT NULL,
    reward_amount TEXT NOT NULL,
    deadline DATETIME NOT NULL,
    description TEXT NOT NULL,
    requirements_json TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. جدول التحديات المجتمعية والهاكاثونات (Community Challenges)
CREATE TABLE community_challenges (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('daily', 'weekly', 'monthly_hackathon')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    track TEXT NOT NULL,
    points_reward INTEGER NOT NULL DEFAULT 100,
    deadline DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 12. جدول تسليمات التحديات والتقييم الذكي (Challenge Submissions & AI Rubric Scoring)
CREATE TABLE challenge_submissions (
    id TEXT PRIMARY KEY,
    challenge_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    team_name TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    repo_url TEXT,
    demo_url TEXT,
    ai_rubric_total INTEGER NOT NULL DEFAULT 0,
    originality_score INTEGER NOT NULL DEFAULT 0,
    feasibility_score INTEGER NOT NULL DEFAULT 0,
    depth_score INTEGER NOT NULL DEFAULT 0,
    impact_score INTEGER NOT NULL DEFAULT 0,
    ai_anti_plagiarism_pass INTEGER NOT NULL DEFAULT 1,
    ai_feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES community_challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for lightning fast queries
CREATE INDEX idx_courses_track ON courses(track);
CREATE INDEX idx_courses_cqs ON courses(cqs_score DESC);
CREATE INDEX idx_lessons_course ON lessons(course_id, lesson_order);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_workshop_tickets_user ON workshop_tickets(user_id);
CREATE INDEX idx_challenge_submissions_rubric ON challenge_submissions(ai_rubric_total DESC);
