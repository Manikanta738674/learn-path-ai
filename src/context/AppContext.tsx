import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  TargetRole,
  CareerGuidanceReport,
  SkillRoadmap,
  Course,
  MentorPersonaId,
  MentorMessage,
  StudentGrowthMetrics,
  DiagnosticResult,
  StudyDayLog,
} from '../types';
import {
  INITIAL_STUDENT_PROFILE,
  ALTERNATE_STUDENT_PROFILES,
  INITIAL_CAREER_REPORT,
  DEFAULT_ROADMAPS,
  INDUSTRY_COURSES,
  MENTOR_PERSONAS,
} from '../data/mockData';
import {
  analyzeCareerGuidance,
  generateRoadmap,
  sendMentorMessage,
  getAiServiceStatus,
  AiServiceStatus,
} from '../services/aiEngine';

export type ActiveTab =
  | 'overview'
  | 'career-guidance'
  | 'roadmap'
  | 'courses'
  | 'mentor'
  | 'growth'
  | 'about'
  | 'login';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  authUser: AuthUser;
  login: (email: string, password?: string, profileId?: string) => void;
  registerUser: (name: string, email: string, college: string, targetRole: any, academicYear: any) => void;
  logout: () => void;
  studentProfile: StudentProfile;
  updateStudentProfile: (updated: Partial<StudentProfile>) => void;
  loadDemoProfile: (profileId: string) => void;
  availableDemoProfiles: StudentProfile[];

  // Feature 1
  careerReport: CareerGuidanceReport;
  isAnalyzingCareer: boolean;
  refreshCareerGuidance: () => Promise<void>;

  // Feature 2
  roadmap: SkillRoadmap;
  isGeneratingRoadmap: boolean;
  selectCourseTrack: (role: TargetRole) => void;
  toggleRoadmapTopic: (phaseNumber: number, milestoneId: string, topicId: string) => void;
  addCustomMilestone: (phaseNumber: number, title: string, description: string, deliverable: string) => void;
  regenerateRoadmapForRole: () => Promise<void>;

  // Feature 3
  courses: Course[];
  toggleCourseEnrollment: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;

  // Feature 4
  selectedMentorId: MentorPersonaId;
  setSelectedMentorId: (id: MentorPersonaId) => void;
  mentorMessages: MentorMessage[];
  isMentorTyping: boolean;
  sendMessageToMentor: (text: string) => Promise<void>;
  clearMentorChat: () => void;

  // Feature 5
  growthMetrics: StudentGrowthMetrics;
  saveDiagnosticResult: (result: DiagnosticResult) => void;
  logStudySession: (minutes: number, topic: string) => void;
  resetAllProgress: () => void;

  // AI & System Info
  aiStatus: AiServiceStatus;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const STORAGE_KEYS = {
  AUTH: 'learnpath_auth_user_v1',
  PROFILE: 'learnpath_student_profile_v1',
  REPORT: 'learnpath_career_report_v1',
  ROADMAP: 'learnpath_skill_roadmap_v1',
  COURSES: 'learnpath_courses_v1',
  CHAT: 'learnpath_mentor_chat_v1',
  GROWTH: 'learnpath_growth_metrics_v1',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Auth User State
  const [authUser, setAuthUser] = useState<AuthUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      id: INITIAL_STUDENT_PROFILE.id,
      name: INITIAL_STUDENT_PROFILE.name,
      email: 'alex.chen@university.edu',
      isLoggedIn: true,
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authUser));
  }, [authUser]);

  // 1. Profile State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
    } catch {
      return INITIAL_STUDENT_PROFILE;
    }
  });

  // 2. Career Report State
  const [careerReport, setCareerReport] = useState<CareerGuidanceReport>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORT);
      return saved ? JSON.parse(saved) : INITIAL_CAREER_REPORT;
    } catch {
      return INITIAL_CAREER_REPORT;
    }
  });
  const [isAnalyzingCareer, setIsAnalyzingCareer] = useState(false);

  // 3. Roadmap State
  const [roadmap, setRoadmap] = useState<SkillRoadmap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      return saved ? JSON.parse(saved) : DEFAULT_ROADMAPS['Full-Stack Developer'];
    } catch {
      return DEFAULT_ROADMAPS['Full-Stack Developer'];
    }
  });
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);

  // 4. Courses State
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INDUSTRY_COURSES;
    } catch {
      return INDUSTRY_COURSES;
    }
  });

  // 5. Mentor Chat State
  const [selectedMentorId, setSelectedMentorId] = useState<MentorPersonaId>('tech-lead');
  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'init-msg-1',
        sender: 'mentor',
        text: "Hello Alex! I'm Arun, your Senior Tech Lead mentor. I'm here to guide you on software architecture, clean code standards, and how industry teams actually build systems. What technical challenge are you tackling today?",
        timestamp: '10:00 AM',
        personaId: 'tech-lead',
        keyTakeaway: 'Focus on production patterns, test coverage, and clear system boundaries.',
        actionItem: 'Ask about how college projects differ from production repositories or how to structure your backend.',
      },
    ];
  });
  const [isMentorTyping, setIsMentorTyping] = useState(false);

  // 6. Growth & Analytics State
  const [studyLogs, setStudyLogs] = useState<StudyDayLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROWTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.studyLogs) return parsed.studyLogs;
      }
    } catch {
      // ignore
    }
    const today = new Date();
    const result: StudyDayLog[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      result.push({
        date: d.toISOString().split('T')[0],
        minutes: [45, 60, 90, 30, 80, 110, 75][6 - i],
        topic: ['TypeScript Generics', 'React Hooks', 'Express REST API', 'SQL Joins', 'Docker Compose', 'LeetCode Trees', 'Unit Tests'][6 - i],
      });
    }
    return result;
  });

  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | undefined>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GROWTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.diagnosticResult;
      }
    } catch {
      // ignore
    }
    return {
      score: 72,
      level: 'Emerging Talent',
      strengths: ['Modern Frontend Frameworks', 'Core Logic', 'Curiosity'],
      priorityGaps: ['Automated Testing (CI/CD)', 'Database Query Optimization', 'Docker Containerization'],
      completedAt: new Date().toISOString(),
    };
  });

  // AI System Status State
  const [aiStatus, setAiStatus] = useState<AiServiceStatus>({
    provider: 'local-heuristic',
    label: 'Intelligent Knowledge Engine (100% Free & Open-Source)',
    isFreeAndOpenSource: true,
    model: 'learnpath-vibe-heuristic-v1',
  });

  // Check AI health on mount
  useEffect(() => {
    getAiServiceStatus().then(setAiStatus);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORT, JSON.stringify(careerReport));
  }, [careerReport]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(roadmap));
  }, [roadmap]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(mentorMessages));
  }, [mentorMessages]);

  // Derived Growth Metrics
  const growthMetrics: StudentGrowthMetrics = useMemo(() => {
    let completedMilestones = 0;
    let totalMilestones = 0;

    roadmap.phases.forEach((phase) => {
      phase.milestones.forEach((m) => {
        totalMilestones += 1;
        const allDone = m.topics.length > 0 && m.topics.every((t) => t.completed);
        if (allDone) completedMilestones += 1;
      });
    });

    const enrolled = courses.filter((c) => c.enrolled);
    const completedCourses = courses.filter((c) => c.completed || (c.progressPercent && c.progressPercent >= 100));

    const totalMinutesLogged = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);
    const weeklyHours = Math.round((totalMinutesLogged / 60) * 10) / 10;

    // Calculate readiness score
    const roadmapWeight = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 45 : 20;
    const courseWeight = enrolled.length > 0 ? (completedCourses.length / enrolled.length) * 25 : 10;
    const diagnosticWeight = diagnosticResult ? (diagnosticResult.score / 100) * 20 : 15;
    const profileCompletenessWeight = (studentProfile.languages.length >= 2 ? 5 : 2) + (studentProfile.frameworks.length >= 2 ? 5 : 2);

    const readinessScore = Math.min(99, Math.max(25, Math.round(roadmapWeight + courseWeight + diagnosticWeight + profileCompletenessWeight)));

    const skillScores = [
      { category: 'Frontend Engineering', current: Math.min(95, 60 + completedMilestones * 5), industryTarget: 88 },
      { category: 'Backend & APIs', current: Math.min(92, 55 + completedMilestones * 6), industryTarget: 85 },
      { category: 'DSA & Problem Solving', current: Math.min(90, 50 + (enrolled.length > 0 ? 15 : 5)), industryTarget: 85 },
      { category: 'Testing & CI/CD', current: Math.min(88, 40 + completedMilestones * 4), industryTarget: 80 },
      { category: 'Cloud & Containerization', current: Math.min(85, 35 + completedMilestones * 5), industryTarget: 80 },
      { category: 'System Architecture', current: Math.min(82, 45 + completedMilestones * 3), industryTarget: 78 },
    ];

    return {
      readinessScore,
      completedMilestonesCount: completedMilestones,
      totalMilestonesCount: totalMilestones,
      enrolledCoursesCount: enrolled.length,
      completedCoursesCount: completedCourses.length,
      streakDays: 7,
      weeklyStudyHoursLogged: weeklyHours,
      skillScores,
      diagnosticResult,
      studyLogs,
    };
  }, [roadmap, courses, studyLogs, diagnosticResult, studentProfile]);

  // Sync growth storage
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.GROWTH,
      JSON.stringify({
        studyLogs,
        diagnosticResult,
      })
    );
  }, [studyLogs, diagnosticResult]);

  // Profile management
  const updateStudentProfile = (updated: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...updated }));
    showToast('Student profile updated successfully');
  };

  const loadDemoProfile = (profileId: string) => {
    const found = ALTERNATE_STUDENT_PROFILES.find((p) => p.id === profileId);
    if (found) {
      setStudentProfile(found);
      // Auto-load matching default roadmap if available
      if (DEFAULT_ROADMAPS[found.targetRole]) {
        setRoadmap(DEFAULT_ROADMAPS[found.targetRole]);
      }
      showToast(`Loaded profile for ${found.name} (${found.targetRole})`);
    }
  };

  const login = (email: string, password?: string, profileId?: string) => {
    let studentName = 'Student';
    if (profileId) {
      const demo = ALTERNATE_STUDENT_PROFILES.find((p) => p.id === profileId);
      if (demo) {
        setStudentProfile(demo);
        if (DEFAULT_ROADMAPS[demo.targetRole]) {
          setRoadmap(DEFAULT_ROADMAPS[demo.targetRole]);
        }
        studentName = demo.name;
        setAuthUser({
          id: demo.id,
          name: demo.name,
          email: `${demo.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`,
          isLoggedIn: true,
        });
        showToast(`Welcome back, ${demo.name}!`);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setActiveTab('overview');
        return;
      }
    }

    // Custom email login
    studentName = email.split('@')[0].replace(/[._]/g, ' ');
    studentName = studentName.charAt(0).toUpperCase() + studentName.slice(1);
    
    setAuthUser({
      id: `user-${Date.now()}`,
      name: studentName,
      email,
      isLoggedIn: true,
    });
    setStudentProfile((prev) => ({
      ...prev,
      name: studentName,
    }));

    confetti({ particleCount: 45, spread: 60, origin: { y: 0.7 } });
    showToast(`Signed in successfully as ${studentName}!`);
    setActiveTab('overview');
  };

  const registerUser = (
    name: string,
    email: string,
    college: string,
    targetRole: any,
    academicYear: any
  ) => {
    const newProfile: StudentProfile = {
      id: `std-${Date.now()}`,
      name,
      email,
      college: college || 'Engineering University',
      academicYear: academicYear || 'Final Year',
      targetRole: targetRole || 'Full-Stack Developer',
      experienceLevel: 'Intermediate',
      languages: ['TypeScript', 'JavaScript', 'Python'],
      frameworks: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
      academicFocus: 'Computer Science & Engineering',
      weeklyHours: 12,
    };

    setStudentProfile(newProfile);
    if (DEFAULT_ROADMAPS[newProfile.targetRole]) {
      setRoadmap(DEFAULT_ROADMAPS[newProfile.targetRole]);
    }
    setAuthUser({
      id: newProfile.id,
      name,
      email,
      isLoggedIn: true,
    });

    confetti({ particleCount: 65, spread: 70, origin: { y: 0.6 } });
    showToast(`Account created! Welcome to learnpath.ai, ${name}!`);
    setActiveTab('overview');
  };

  const logout = () => {
    setAuthUser({
      id: 'guest',
      name: 'Guest Student',
      email: '',
      isLoggedIn: false,
    });
    showToast('Signed out. You are viewing in guest mode.');
  };

  // Feature 1 Action
  const refreshCareerGuidance = async () => {
    setIsAnalyzingCareer(true);
    try {
      const report = await analyzeCareerGuidance(studentProfile);
      setCareerReport(report);
      showToast('AI Career Guidance report refreshed with latest analysis');
    } catch {
      showToast('Failed to refresh career guidance. Using local analysis.');
    } finally {
      setIsAnalyzingCareer(false);
    }
  };

  // Feature 2 Actions
  const toggleRoadmapTopic = (phaseNumber: number, milestoneId: string, topicId: string) => {
    setRoadmap((prev) => {
      let newlyCompleted = false;
      const newPhases = prev.phases.map((phase) => {
        if (phase.phaseNumber !== phaseNumber) return phase;
        return {
          ...phase,
          milestones: phase.milestones.map((milestone) => {
            if (milestone.id !== milestoneId) return milestone;
            return {
              ...milestone,
              topics: milestone.topics.map((topic) => {
                if (topic.id !== topicId) return topic;
                const nextVal = !topic.completed;
                if (nextVal) newlyCompleted = true;
                return { ...topic, completed: nextVal };
              }),
            };
          }),
        };
      });

      if (newlyCompleted) {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
        showToast('Milestone topic checked! Growth metrics updated.');
      }

      return {
        ...prev,
        phases: newPhases,
        lastUpdated: new Date().toISOString(),
      };
    });
  };

  const addCustomMilestone = (phaseNumber: number, title: string, description: string, deliverable: string) => {
    setRoadmap((prev) => {
      const newPhases = prev.phases.map((phase) => {
        if (phase.phaseNumber !== phaseNumber) return phase;
        const newMilestone = {
          id: `custom-m-${Date.now()}`,
          title,
          description,
          recommendedResource: 'Student Curated Resource',
          deliverable,
          isCustom: true,
          topics: [
            { id: `ct-${Date.now()}-1`, title: 'Initial Implementation', completed: false },
            { id: `ct-${Date.now()}-2`, title: 'Testing & Verification', completed: false },
          ],
        };
        return {
          ...phase,
          milestones: [...phase.milestones, newMilestone],
        };
      });

      showToast(`Added custom milestone: "${title}"`);
      return { ...prev, phases: newPhases, lastUpdated: new Date().toISOString() };
    });
  };

  const selectCourseTrack = (role: TargetRole) => {
    setStudentProfile((prev) => ({ ...prev, targetRole: role }));
    if (DEFAULT_ROADMAPS[role]) {
      setRoadmap(DEFAULT_ROADMAPS[role]);
    } else {
      generateRoadmap(role, studentProfile.experienceLevel, studentProfile.weeklyHours).then((newRoadmap) => {
        setRoadmap(newRoadmap);
      });
    }
    showToast(`Switched learning track to ${role}`);
  };

  const regenerateRoadmapForRole = async () => {
    setIsGeneratingRoadmap(true);
    try {
      const newRoadmap = await generateRoadmap(studentProfile.targetRole, studentProfile.experienceLevel, studentProfile.weeklyHours);
      setRoadmap(newRoadmap);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
      showToast(`Personalized roadmap generated for ${studentProfile.targetRole}!`);
    } catch {
      showToast('Roadmap update completed using curated role curriculum.');
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  // Feature 3 Actions
  const toggleCourseEnrollment = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const nextEnrolled = !c.enrolled;
        const nextProgress = nextEnrolled ? (c.progressPercent || 15) : 0;
        showToast(nextEnrolled ? `Enrolled in ${c.title}! (100% Free)` : `Removed enrollment for ${c.title}`);
        return {
          ...c,
          enrolled: nextEnrolled,
          progressPercent: nextProgress,
          completed: nextProgress >= 100,
        };
      })
    );
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const isFinished = progress >= 100;
        if (isFinished && !c.completed) {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
          showToast(`Congratulations! You completed ${c.title}! 🎉`);
        }
        return {
          ...c,
          progressPercent: Math.min(100, Math.max(0, progress)),
          completed: isFinished,
        };
      })
    );
  };

  // Feature 4 Actions
  const sendMessageToMentor = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaId: selectedMentorId,
    };

    setMentorMessages((prev) => [...prev, userMsg]);
    setIsMentorTyping(true);

    try {
      const reply = await sendMentorMessage(selectedMentorId, text.trim(), mentorMessages, studentProfile);
      setMentorMessages((prev) => [...prev, reply]);
    } catch {
      const fallbackReply: MentorMessage = {
        id: `mentor-fb-${Date.now()}`,
        sender: 'mentor',
        text: 'That is an excellent topic. In production engineering, the best approach is to start with a minimal working proof of concept, write automated unit tests to verify edge cases, and deploy a live working prototype.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: selectedMentorId,
        keyTakeaway: 'Always validate assumptions with a small working prototype.',
        actionItem: 'Document your implementation plan before writing the first line of code.',
      };
      setMentorMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setIsMentorTyping(false);
    }
  };

  const clearMentorChat = () => {
    const activePersona = MENTOR_PERSONAS.find((p) => p.id === selectedMentorId);
    setMentorMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'mentor',
        text: `Hello ${studentProfile.name.split(' ')[0]}! I'm ${activePersona?.name || 'your mentor'}. Chat history has been cleared. What would you like to discuss today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        personaId: selectedMentorId,
      },
    ]);
    showToast('Conversation reset.');
  };

  // Feature 5 Actions
  const saveDiagnosticResult = (result: DiagnosticResult) => {
    setDiagnosticResult(result);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast(`Diagnostic assessment completed! Readiness Score: ${result.score}/100`);
  };

  const logStudySession = (minutes: number, topic: string) => {
    const today = new Date().toISOString().split('T')[0];
    setStudyLogs((prev) => {
      const existingIdx = prev.findIndex((l) => l.date === today);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          date: today,
          minutes: updated[existingIdx].minutes + minutes,
          topic: `${updated[existingIdx].topic}, ${topic}`,
        };
        return updated;
      }
      return [...prev.slice(-6), { date: today, minutes, topic }];
    });
    showToast(`Logged ${minutes} minutes of study for "${topic}"!`);
  };

  const resetAllProgress = () => {
    localStorage.clear();
    setStudentProfile(INITIAL_STUDENT_PROFILE);
    setCareerReport(INITIAL_CAREER_REPORT);
    setRoadmap(DEFAULT_ROADMAPS['Full-Stack Developer']);
    setCourses(INDUSTRY_COURSES);
    setMentorMessages([]);
    showToast('All progress reset to default state.');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        authUser,
        login,
        registerUser,
        logout,
        studentProfile,
        updateStudentProfile,
        loadDemoProfile,
        availableDemoProfiles: ALTERNATE_STUDENT_PROFILES,

        careerReport,
        isAnalyzingCareer,
        refreshCareerGuidance,

        roadmap,
        isGeneratingRoadmap,
        selectCourseTrack,
        toggleRoadmapTopic,
        addCustomMilestone,
        regenerateRoadmapForRole,

        courses,
        toggleCourseEnrollment,
        updateCourseProgress,

        selectedMentorId,
        setSelectedMentorId,
        mentorMessages,
        isMentorTyping,
        sendMessageToMentor,
        clearMentorChat,

        growthMetrics,
        saveDiagnosticResult,
        logStudySession,
        resetAllProgress,

        aiStatus,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-800 text-sm font-medium animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-3 text-slate-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
