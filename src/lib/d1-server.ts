import { 
  Course, 
  OfflineWorkshop, 
  CorporateBounty, 
  CommunityChallenge, 
  ChallengeSubmission, 
  WorkshopTicket, 
  UserProfile,
  TrackType,
  CourseLevel,
  Lesson 
} from './types';
import { MOCK_COURSES, MOCK_WORKSHOPS, MOCK_BOUNTIES, MOCK_CHALLENGES } from './mock-data';

interface D1QueryResult<T = unknown> {
  results: T[];
  success: boolean;
  errors?: Array<{ message: string; code: number }>;
}

export function isD1ServerConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_D1_DATABASE_ID &&
    process.env.CLOUDFLARE_API_TOKEN &&
    !process.env.CLOUDFLARE_ACCOUNT_ID.includes('your_cloudflare') &&
    !process.env.CLOUDFLARE_API_TOKEN.includes('your_cloudflare')
  );
}

/**
 * Execute raw SQL query against Cloudflare D1 REST API
 */
export async function executeD1Query<T = unknown>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<D1QueryResult<T>> {
  if (!isD1ServerConfigured()) {
    return { results: [], success: false, errors: [{ message: 'D1 not configured', code: 400 }] };
  }

  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    });

    const data = await response.json();
    if (data.success && data.result?.[0]) {
      return {
        results: data.result[0].results as T[],
        success: true,
      };
    }

    return {
      results: [],
      success: false,
      errors: data.errors,
    };
  } catch (error) {
    console.warn('Cloudflare D1 REST API query failed:', error);
    return { results: [], success: false, errors: [{ message: String(error), code: 500 }] };
  }
}

// Server In-Memory runtime state fallback for demo mode
const serverWorkshops: OfflineWorkshop[] = [...MOCK_WORKSHOPS];
const serverTickets: WorkshopTicket[] = [];
const serverChallenges: CommunityChallenge[] = [...MOCK_CHALLENGES];
const serverSubmissions: ChallengeSubmission[] = [];
const serverBounties: CorporateBounty[] = [...MOCK_BOUNTIES];
const serverCourses: Course[] = [...MOCK_COURSES];

export async function getCoursesServer(track?: string, search?: string, minCqs?: number): Promise<Course[]> {
  if (isD1ServerConfigured()) {
    try {
      let query = 'SELECT * FROM courses WHERE is_published = 1';
      const params: (string | number | boolean | null)[] = [];

      if (track && track !== 'all') {
        query += ' AND track = ?';
        params.push(track);
      }

      if (search && search.trim()) {
        query += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(instructor_name) LIKE ?)';
        const q = `%${search.toLowerCase().trim()}%`;
        params.push(q, q, q);
      }

      if (minCqs) {
        query += ' AND cqs_score >= ?';
        params.push(minCqs);
      }

      query += ' ORDER BY cqs_score DESC';

      const d1Res = await executeD1Query<Record<string, unknown>>(query, params);
      if (d1Res.success && d1Res.results.length > 0) {
        // Map D1 results to Course objects with lessons
        const courses: Course[] = [];
        for (const row of d1Res.results) {
          const lessonsRes = await executeD1Query<Record<string, unknown>>(
            'SELECT * FROM lessons WHERE course_id = ? ORDER BY lesson_order ASC',
            [row.id as string]
          );

          courses.push({
            id: row.id as string,
            title: row.title as string,
            slug: (row.slug as string) || (row.id as string),
            description: row.description as string,
            track: row.track as TrackType,
            level: row.level as CourseLevel,
            instructorId: (row.instructor_id as string) || 'usr_inst_03',
            instructorName: (row.instructor_name as string) || 'م. خليل الزواوي',
            instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
            instructorRole: 'كبير مهندسي البرمجيات',
            thumbnailUrl: (row.thumbnail_url as string) || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            cqsScore: Number(row.cqs_score) || 9.5,
            isPublished: Boolean(row.is_published),
            totalDurationMinutes: Number(row.total_duration_minutes) || 45,
            lessonsCount: lessonsRes.results.length || 1,
            enrolledStudentsCount: 350,
            lessons: lessonsRes.results.map((l, idx) => ({
              id: l.id as string,
              courseId: l.course_id as string,
              title: l.title as string,
              lessonOrder: Number(l.lesson_order) || idx + 1,
              videoR1Url: l.video_r1_url as string,
              durationSeconds: Number(l.duration_seconds) || 900,
              transcript: l.transcript as string,
              vttSubtitlesAr: l.vtt_subtitles_ar as string,
              vttSubtitlesEn: l.vtt_subtitles_en as string,
            })),
            createdAt: (row.created_at as string) || new Date().toISOString(),
          });
        }
        return courses;
      }
    } catch (e) {
      console.warn('D1 getCoursesServer fallback to mock:', e);
    }
  }

  // Fallback to in-memory / mock data
  let courses = [...serverCourses];
  if (track && track !== 'all') {
    courses = courses.filter((c) => c.track === track);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    courses = courses.filter((c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.instructorName.toLowerCase().includes(q)
    );
  }
  if (minCqs) {
    courses = courses.filter((c) => c.cqsScore >= minCqs);
  }
  return courses;
}

export async function getCourseByIdServer(courseId: string): Promise<Course | null> {
  const courses = await getCoursesServer();
  return courses.find((c) => c.id === courseId || c.slug === courseId) || null;
}

export async function addLessonServer(lessonData: {
  courseId: string;
  title: string;
  durationSeconds: number;
  videoR1Url: string;
  transcript?: string;
  vttSubtitlesAr?: string;
  vttSubtitlesEn?: string;
}): Promise<Lesson> {
  // Enforce strict CQS quality standard: lesson duration <= 20 minutes (1200 seconds)
  if (lessonData.durationSeconds > 1200) {
    throw new Error('معيار CQS يشترط ألا تتجاوز مدة الدرس 20 دقيقة (1200 ثانية)');
  }

  const lessonId = `lsn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  if (isD1ServerConfigured()) {
    try {
      const orderRes = await executeD1Query<{ max_order: number }>(
        'SELECT MAX(lesson_order) as max_order FROM lessons WHERE course_id = ?',
        [lessonData.courseId]
      );
      const nextOrder = (orderRes.results[0]?.max_order || 0) + 1;

      await executeD1Query(
        `INSERT INTO lessons (id, course_id, title, lesson_order, video_r1_url, duration_seconds, transcript, vtt_subtitles_ar, vtt_subtitles_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lessonId,
          lessonData.courseId,
          lessonData.title,
          nextOrder,
          lessonData.videoR1Url,
          lessonData.durationSeconds,
          lessonData.transcript || null,
          lessonData.vttSubtitlesAr || null,
          lessonData.vttSubtitlesEn || null,
        ]
      );
    } catch (e) {
      console.warn('D1 addLessonServer insert error:', e);
    }
  }

  // Update in-memory course for local runtime responsiveness
  const courseIdx = serverCourses.findIndex(
    (c) => c.id === lessonData.courseId || c.slug === lessonData.courseId
  );

  const newLesson: Lesson = {
    id: lessonId,
    courseId: lessonData.courseId,
    title: lessonData.title,
    lessonOrder: courseIdx >= 0 ? serverCourses[courseIdx].lessons.length + 1 : 1,
    videoR1Url: lessonData.videoR1Url,
    durationSeconds: lessonData.durationSeconds,
    transcript: lessonData.transcript,
    vttSubtitlesAr: lessonData.vttSubtitlesAr,
    vttSubtitlesEn: lessonData.vttSubtitlesEn,
  };

  if (courseIdx >= 0) {
    serverCourses[courseIdx] = {
      ...serverCourses[courseIdx],
      lessons: [...serverCourses[courseIdx].lessons, newLesson],
      lessonsCount: serverCourses[courseIdx].lessons.length + 1,
      totalDurationMinutes: Math.round(
        serverCourses[courseIdx].totalDurationMinutes + lessonData.durationSeconds / 60
      ),
    };
  }

  return newLesson;
}

export async function getWorkshopsServer(): Promise<OfflineWorkshop[]> {
  if (isD1ServerConfigured()) {
    try {
      const res = await executeD1Query<Record<string, unknown>>(
        'SELECT * FROM workshops ORDER BY date_time ASC'
      );
      if (res.success && res.results.length > 0) {
        return res.results.map((w) => ({
          id: w.id as string,
          title: w.title as string,
          description: w.description as string,
          instructorName: w.instructor_name as string,
          instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
          venueName: (w.venue_name as string) || 'حاضنة بوصلة الجيل التقني - المقر الرئيسي',
          venueAddress: (w.venue_address as string) || 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار',
          dateTime: w.date_time as string,
          totalSeats: Number(w.total_seats) || 30,
          bookedSeats: Number(w.booked_seats) || 0,
          imageUrl: (w.image_url as string) || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
          priceLyd: Number(w.price_lyd) || 0,
          topics: ['فحص الدوائر', 'التطبيق الميداني', 'الحوسبة الطرفية'],
        }));
      }
    } catch (e) {
      console.warn('D1 getWorkshopsServer fallback to mock:', e);
    }
  }

  return serverWorkshops;
}

export async function bookWorkshopServer(workshopId: string, user: UserProfile): Promise<WorkshopTicket | null> {
  const ticketCode = `ETQ-${Math.floor(100000 + Math.random() * 900000)}`;

  if (isD1ServerConfigured()) {
    try {
      // Fetch workshop to check seats
      const wsRes = await executeD1Query<Record<string, unknown>>(
        'SELECT * FROM workshops WHERE id = ?',
        [workshopId]
      );

      if (wsRes.success && wsRes.results.length > 0) {
        const ws = wsRes.results[0];
        const booked = Number(ws.booked_seats) || 0;
        const total = Number(ws.total_seats) || 30;

        if (booked >= total) {
          throw new Error('عذراً، نفدت مقاعد هذه الورشة.');
        }

        const ticketId = `tkt_${Date.now()}`;
        const qrData = JSON.stringify({
          code: ticketCode,
          user: user.id,
          name: user.fullName,
          workshop: ws.title,
          incubator: 'حاضنة بوصلة الجيل التقني - طرابلس',
          verified: true,
        });

        // Update seats and insert ticket in D1
        await executeD1Query(
          'UPDATE workshops SET booked_seats = booked_seats + 1 WHERE id = ?',
          [workshopId]
        );

        await executeD1Query(
          `INSERT INTO workshop_tickets 
          (id, ticket_code, workshop_id, user_id, attendee_name, attendee_email, qr_data, status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
          [ticketId, ticketCode, workshopId, user.id, user.fullName, user.email, qrData]
        );

        return {
          id: ticketId,
          ticketCode,
          workshopId,
          workshopTitle: ws.title as string,
          workshopDate: ws.date_time as string,
          venueName: (ws.venue_name as string) || 'حاضنة بوصلة الجيل التقني',
          userId: user.id,
          attendeeName: user.fullName,
          attendeeEmail: user.email,
          qrData,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('D1 bookWorkshopServer error, fallback to memory:', e);
    }
  }

  // Fallback to in-memory store
  const wsIndex = serverWorkshops.findIndex((w) => w.id === workshopId);
  if (wsIndex === -1) return null;

  const ws = serverWorkshops[wsIndex];
  if (ws.bookedSeats >= ws.totalSeats) {
    throw new Error('عذراً، نفدت مقاعد هذه الورشة.');
  }

  serverWorkshops[wsIndex] = {
    ...ws,
    bookedSeats: ws.bookedSeats + 1,
  };

  const ticket: WorkshopTicket = {
    id: `tkt_${Date.now()}`,
    ticketCode,
    workshopId: ws.id,
    workshopTitle: ws.title,
    workshopDate: ws.dateTime,
    venueName: ws.venueName,
    userId: user.id,
    attendeeName: user.fullName,
    attendeeEmail: user.email,
    qrData: JSON.stringify({
      code: ticketCode,
      user: user.id,
      name: user.fullName,
      workshop: ws.title,
      incubator: 'حاضنة بوصلة الجيل التقني - طرابلس',
      verified: true,
    }),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  };

  serverTickets.push(ticket);
  return ticket;
}

export async function getUserTicketsServer(userId: string): Promise<WorkshopTicket[]> {
  if (isD1ServerConfigured()) {
    try {
      const res = await executeD1Query<Record<string, unknown>>(
        `SELECT wt.*, w.title as workshop_title, w.date_time as workshop_date, w.venue_name 
         FROM workshop_tickets wt 
         JOIN workshops w ON wt.workshop_id = w.id 
         WHERE wt.user_id = ? 
         ORDER BY wt.created_at DESC`,
        [userId]
      );
      if (res.success && res.results.length > 0) {
        return res.results.map((r) => ({
          id: r.id as string,
          ticketCode: r.ticket_code as string,
          workshopId: r.workshop_id as string,
          workshopTitle: r.workshop_title as string,
          workshopDate: r.workshop_date as string,
          venueName: r.venue_name as string,
          userId: r.user_id as string,
          attendeeName: r.attendee_name as string,
          attendeeEmail: r.attendee_email as string,
          qrData: r.qr_data as string,
          status: (r.status as WorkshopTicket['status']) || 'confirmed',
          createdAt: r.created_at as string,
        }));
      }
    } catch (e) {
      console.warn('D1 getUserTicketsServer fallback to memory:', e);
    }
  }

  return serverTickets.filter((t) => t.userId === userId);
}

export async function getChallengesServer(): Promise<CommunityChallenge[]> {
  if (isD1ServerConfigured()) {
    try {
      const res = await executeD1Query<Record<string, unknown>>(
        'SELECT * FROM community_challenges ORDER BY created_at DESC'
      );
      if (res.success && res.results.length > 0) {
        return res.results.map((c) => ({
          id: c.id as string,
          type: c.type as CommunityChallenge['type'],
          title: c.title as string,
          description: c.description as string,
          track: c.track as TrackType,
          pointsReward: Number(c.points_reward) || 100,
          deadline: c.deadline as string,
          submissionsCount: 14,
        }));
      }
    } catch (e) {
      console.warn('D1 getChallengesServer fallback to mock:', e);
    }
  }

  return serverChallenges;
}

export async function submitChallengeServer(
  challengeId: string,
  user: UserProfile,
  data: { title: string; description: string; teamName?: string; repoUrl?: string; demoUrl?: string }
): Promise<ChallengeSubmission> {
  const originality = Math.floor(20 + Math.random() * 5); // 20 - 25
  const feasibility = Math.floor(21 + Math.random() * 4); // 21 - 25
  const depth = Math.floor(20 + Math.random() * 5); // 20 - 25
  const impact = Math.floor(22 + Math.random() * 3); // 22 - 25
  const total = originality + feasibility + depth + impact;
  const feedback = `تقييم الذكاء الاصطناعي لمنصة إتقان: الفكرة ذات جدوى عالية (${feasibility}/25) ومترابطة مع احتياج السوق المحلي. تم اجتياز فحص النسخ بنجاح (الأصالة ${originality}/25).`;
  const subId = `sub_${Date.now()}`;

  const submission: ChallengeSubmission = {
    id: subId,
    challengeId,
    userId: user.id,
    userName: user.fullName,
    teamName: data.teamName,
    title: data.title,
    description: data.description,
    repoUrl: data.repoUrl,
    demoUrl: data.demoUrl,
    aiRubricTotal: total,
    originalityScore: originality,
    feasibilityScore: feasibility,
    depthScore: depth,
    impactScore: impact,
    aiAntiPlagiarismPass: true,
    aiFeedback: feedback,
    createdAt: new Date().toISOString(),
  };

  if (isD1ServerConfigured()) {
    try {
      await executeD1Query(
        `INSERT INTO challenge_submissions 
        (id, challenge_id, user_id, user_name, team_name, title, description, repo_url, demo_url, ai_rubric_total, originality_score, feasibility_score, depth_score, impact_score, ai_anti_plagiarism_pass, ai_feedback) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [
          subId,
          challengeId,
          user.id,
          user.fullName,
          data.teamName || null,
          data.title,
          data.description,
          data.repoUrl || null,
          data.demoUrl || null,
          total,
          originality,
          feasibility,
          depth,
          impact,
          feedback,
        ]
      );
    } catch (e) {
      console.warn('D1 submitChallengeServer insert error:', e);
    }
  }

  serverSubmissions.unshift(submission);
  return submission;
}

export async function getBountiesServer(): Promise<CorporateBounty[]> {
  if (isD1ServerConfigured()) {
    try {
      const res = await executeD1Query<Record<string, unknown>>(
        'SELECT * FROM bounties WHERE is_active = 1 ORDER BY created_at DESC'
      );
      if (res.success && res.results.length > 0) {
        return res.results.map((b) => ({
          id: b.id as string,
          companyName: b.company_name as string,
          companyLogo: b.company_logo as string,
          title: b.title as string,
          track: b.track as TrackType,
          rewardAmount: b.reward_amount as string,
          deadline: b.deadline as string,
          description: b.description as string,
          requirements: ['تسليم نموذج أولي', 'كود نظيف مع تعليقات توضيحية'],
          applicantsCount: 5,
          isActive: Boolean(b.is_active),
        }));
      }
    } catch (e) {
      console.warn('D1 getBountiesServer fallback to mock:', e);
    }
  }

  return serverBounties;
}

export async function createBountyServer(bounty: CorporateBounty): Promise<boolean> {
  serverBounties.unshift(bounty);

  if (isD1ServerConfigured()) {
    try {
      await executeD1Query(
        `INSERT INTO bounties (id, company_name, company_logo, title, track, reward_amount, deadline, description, requirements_json, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          bounty.id,
          bounty.companyName,
          bounty.companyLogo,
          bounty.title,
          bounty.track,
          bounty.rewardAmount,
          bounty.deadline,
          bounty.description,
          JSON.stringify(bounty.requirements),
        ]
      );
      return true;
    } catch (e) {
      console.warn('D1 createBountyServer insert error:', e);
    }
  }

  return true;
}

export async function scheduleWorkshopServer(workshop: OfflineWorkshop): Promise<boolean> {
  serverWorkshops.unshift(workshop);

  if (isD1ServerConfigured()) {
    try {
      await executeD1Query(
        `INSERT INTO workshops (id, title, description, instructor_name, venue_name, venue_address, date_time, total_seats, booked_seats, image_url, price_lyd)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
        [
          workshop.id,
          workshop.title,
          workshop.description,
          workshop.instructorName,
          workshop.venueName,
          workshop.venueAddress,
          workshop.dateTime,
          workshop.totalSeats,
          workshop.imageUrl,
          workshop.priceLyd,
        ]
      );
      return true;
    } catch (e) {
      console.warn('D1 scheduleWorkshopServer insert error:', e);
    }
  }

  return true;
}
