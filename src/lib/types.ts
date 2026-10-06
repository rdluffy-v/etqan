export type UserRole = 'trainee' | 'instructor' | 'corporate' | 'admin';
export type VerificationType = 'personal' | 'academic_edu' | 'academic_ocr';
export type TrackType = 'programming' | 'hardware' | 'ai_robotics' | 'security' | 'design';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  verificationType: VerificationType;
  academicInstitution?: string;
  studentIdNumber?: string;
  isVerified: boolean;
  avatarUrl: string;
  points: number;
  streakDays: number;
  cqsRating?: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface VideoChapter {
  title: string;
  timeSeconds: number;
}

export interface SandboxEnvironment {
  id: string;
  language: 'javascript' | 'python' | 'html';
  initialCode: string;
  solutionCode: string;
  instructions: string;
  testCases: {
    description: string;
    inputCode?: string;
    expectedOutput: string;
  }[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  lessonOrder: number;
  videoR1Url: string;
  durationSeconds: number; // Max 1200 seconds (20 mins)
  transcript?: string;
  vttSubtitlesAr?: string;
  vttSubtitlesEn?: string;
  chapters?: VideoChapter[];
  quiz?: {
    questions: QuizQuestion[];
  };
  sandbox?: SandboxEnvironment;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  track: TrackType;
  level: CourseLevel;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  instructorRole: string;
  thumbnailUrl: string;
  cqsScore: number; // 0 - 10
  isPublished: boolean;
  totalDurationMinutes: number;
  lessonsCount: number;
  enrolledStudentsCount: number;
  lessons: Lesson[];
  createdAt: string;
}

export interface OfflineWorkshop {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  instructorAvatar: string;
  venueName: string;
  venueAddress: string;
  dateTime: string;
  totalSeats: number;
  bookedSeats: number;
  imageUrl: string;
  priceLyd: number;
  topics: string[];
}

export interface WorkshopTicket {
  id: string;
  ticketCode: string;
  workshopId: string;
  workshopTitle: string;
  workshopDate: string;
  venueName: string;
  userId: string;
  attendeeName: string;
  attendeeEmail: string;
  qrData: string;
  status: 'confirmed' | 'attended' | 'cancelled';
  createdAt: string;
}

export interface CorporateBounty {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  track: TrackType;
  rewardAmount: string;
  deadline: string;
  description: string;
  requirements: string[];
  applicantsCount: number;
  isActive: boolean;
}

export interface CommunityChallenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly_hackathon';
  title: string;
  description: string;
  track: TrackType;
  pointsReward: number;
  deadline: string;
  submissionsCount: number;
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  teamName?: string;
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  aiRubricTotal: number; // 0 - 100
  originalityScore: number; // 0 - 25
  feasibilityScore: number; // 0 - 25
  depthScore: number; // 0 - 25
  impactScore: number; // 0 - 25
  aiAntiPlagiarismPass: boolean;
  aiFeedback: string;
  createdAt: string;
}

export interface TraineeSkillBadge {
  id: string;
  name: string;
  track: TrackType;
  iconName: string;
  verifiedBy: string;
  issuedAt: string;
  level: 'مبتدئ' | 'محترف' | 'خبير';
}
