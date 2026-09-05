export type AcademicYear = '1st Year' | '2nd Year' | '3rd Year' | 'Final Year' | 'Recent Graduate';

export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type TargetRole =
  | 'Full-Stack Developer'
  | 'AI / ML Engineer'
  | 'Cloud & DevOps Engineer'
  | 'Data Engineer'
  | 'Cybersecurity Analyst'
  | 'Mobile App Developer'
  | 'Backend Systems Engineer';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  college: string;
  academicYear: AcademicYear;
  targetRole: TargetRole;
  experienceLevel: ExperienceLevel;
  languages: string[];
  frameworks: string[];
  academicFocus: string;
  weeklyHours: number;
  githubUrl?: string;
  linkedinUrl?: string;
  resumeSummary?: string;
  avatarSeed?: string;
}

export interface CurriculumGap {
  collegeTeaches: string;
  industryDemands: string;
  severity: 'Critical' | 'Important' | 'Moderate';
}

export interface CareerGuidanceReport {
  primaryRole: TargetRole;
  matchScore: number;
  marketDemand: 'Very High' | 'High' | 'Moderate';
  salaryRange: string;
  summary: string;
  industryCurriculumGaps: CurriculumGap[];
  recommendedTechStack: string[];
  alternativePathways: {
    role: string;
    matchScore: number;
    reason: string;
  }[];
  thirtyDayActionPlan: {
    week: string;
    focus: string;
    action: string;
  }[];
  generatedAt: string;
  provider?: string;
}

export interface RoadmapTopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  topics: RoadmapTopic[];
  recommendedResource: string;
  deliverable: string;
  isCustom?: boolean;
}

export interface RoadmapPhase {
  phaseNumber: number;
  title: string;
  tagline: string;
  estimatedDuration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  milestones: RoadmapMilestone[];
}

export interface SkillRoadmap {
  id: string;
  role: TargetRole;
  totalEstimatedWeeks: number;
  phases: RoadmapPhase[];
  lastUpdated: string;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  instructor?: string;
  roleTrack: TargetRole | 'Foundations & DSA' | 'All Tracks';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  rating: number;
  enrolledCount: number;
  url: string;
  freeTierType: '100% Free Open Source' | 'Free Audit Available' | 'Open Courseware (MIT/Harvard)';
  description: string;
  skillsCovered: string[];
  enrolled?: boolean;
  progressPercent?: number;
  completed?: boolean;
}

export type MentorPersonaId = 'tech-lead' | 'interview-coach' | 'campus-pivot' | 'resume-recruiter';

export interface MentorPersona {
  id: MentorPersonaId;
  name: string;
  title: string;
  badge: string;
  avatar: string;
  tagline: string;
  accentColor: string;
  starterPrompts: string[];
}

export interface MentorMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  personaId: MentorPersonaId;
  keyTakeaway?: string;
  actionItem?: string;
}

export interface SkillScore {
  category: string;
  current: number; // 0 to 100
  industryTarget: number; // typically 80-95
}

export interface DiagnosticQuestion {
  id: string;
  question: string;
  category: string;
  options: {
    label: string;
    score: number;
    explanation: string;
  }[];
}

export interface DiagnosticResult {
  score: number;
  level: 'Novice' | 'Emerging Talent' | 'Industry-Ready' | 'Advanced Contributor';
  strengths: string[];
  priorityGaps: string[];
  completedAt: string;
}

export interface StudyDayLog {
  date: string; // YYYY-MM-DD
  minutes: number;
  topic: string;
}

export interface StudentGrowthMetrics {
  readinessScore: number;
  completedMilestonesCount: number;
  totalMilestonesCount: number;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
  streakDays: number;
  weeklyStudyHoursLogged: number;
  skillScores: SkillScore[];
  diagnosticResult?: DiagnosticResult;
  studyLogs: StudyDayLog[];
}
