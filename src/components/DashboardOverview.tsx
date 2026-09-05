import React from 'react';
import {
  Sparkles,
  Map,
  BookOpen,
  MessageSquareCode,
  TrendingUp,
  ArrowRight,
  Clock,
  Target,
  Flame,
  Award,
  BookMarked,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardOverview: React.FC = () => {
  const {
    setActiveTab,
    studentProfile,
    careerReport,
    roadmap,
    growthMetrics,
    courses,
    authUser,
  } = useApp();

  const nextActionItem = careerReport.thirtyDayActionPlan[0] || {
    week: 'Week 1',
    focus: 'TypeScript Generics & Interfaces',
    action: 'Audit your core project and add strict type definitions.',
  };

  const featureCards = [
    {
      tab: 'career-guidance' as const,
      num: '01',
      title: 'AI Career Guidance',
      badge: `${careerReport.matchScore}% Match`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: `Analysis for ${studentProfile.targetRole}. Market demand is ${careerReport.marketDemand} with ${careerReport.industryCurriculumGaps.length} critical syllabus gaps identified.`,
      icon: Sparkles,
      iconColor: 'text-indigo-600 bg-indigo-50',
      actionText: 'View Career Guide',
    },
    {
      tab: 'roadmap' as const,
      num: '02',
      title: 'Personalized Skill Roadmap',
      badge: `${growthMetrics.completedMilestonesCount}/${growthMetrics.totalMilestonesCount} Milestones`,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: `Structured 4-phase technical roadmap covering Foundations, Architecture, Docker CI/CD, and Placement prep.`,
      icon: Map,
      iconColor: 'text-indigo-600 bg-indigo-50',
      actionText: 'Explore Milestones',
    },
    {
      tab: 'courses' as const,
      num: '03',
      title: 'Industry-Aligned Courses',
      badge: `${courses.filter((c) => c.enrolled).length} Enrolled`,
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      description: `Curated 100% free open-access courses from Harvard CS50, Helsinki Full Stack Open, MIT OCW, and fast.ai.`,
      icon: BookOpen,
      iconColor: 'text-teal-600 bg-teal-50',
      actionText: 'Browse Free Courses',
    },
    {
      tab: 'mentor' as const,
      num: '04',
      title: 'AI Mentorship & Guidance',
      badge: '4 Expert Personas',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: `Conversational mentorship from Tech Leads, DSA Coaches, and Technical Recruiters.`,
      icon: MessageSquareCode,
      iconColor: 'text-purple-600 bg-purple-50',
      actionText: 'Chat with Mentors',
    },
    {
      tab: 'growth' as const,
      num: '05',
      title: 'Growth & Readiness Scorecard',
      badge: `${growthMetrics.readinessScore}% Score`,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: `Multi-dimensional skill metrics, study streak log, diagnostic assessment quiz, and printable certificate.`,
      icon: TrendingUp,
      iconColor: 'text-amber-600 bg-amber-50',
      actionText: 'View Scorecard',
    },
  ];

  const displayName = authUser.isLoggedIn ? authUser.name.split(' ')[0] : studentProfile.name.split(' ')[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Guest Mode Banner if not signed in */}
      {!authUser.isLoggedIn && (
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>You are browsing in Guest Mode. Sign in or create a student account to customize your profile.</span>
          </div>
          <button
            onClick={() => setActiveTab('login')}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Create Account</span>
          </button>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{studentProfile.academicYear} CSE Career Accelerator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {displayName}.
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
            Accelerate your trajectory to become an industry-ready{' '}
            <strong className="text-white underline decoration-indigo-400 underline-offset-4">
              {studentProfile.targetRole}
            </strong>
            . Track syllabus gaps, build production portfolio artifacts, and pass technical placement interviews.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-go-roadmap-btn"
              onClick={() => setActiveTab('roadmap')}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>Continue Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-go-mentor-btn"
              onClick={() => setActiveTab('mentor')}
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4 text-indigo-400" />
              <span>Ask AI Mentors</span>
            </button>
          </div>
        </div>

        {/* Quick Readiness Score Gauge Widget */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Readiness Score</span>
            </div>
            <div className="text-xl font-black text-white">
              {growthMetrics.readinessScore}
              <span className="text-xs font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              Target: 85+ (Hireable)
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Milestones</span>
            </div>
            <div className="text-xl font-black text-white">
              {growthMetrics.completedMilestonesCount}
              <span className="text-xs font-normal text-slate-400">
                /{growthMetrics.totalMilestonesCount}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              {roadmap.phases.length} Phases Active
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <BookMarked className="w-3.5 h-3.5 text-teal-400" />
              <span>Free Courses</span>
            </div>
            <div className="text-xl font-black text-white">
              {growthMetrics.enrolledCoursesCount}
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              {growthMetrics.completedCoursesCount} completed
            </div>
          </div>

          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Study Streak</span>
            </div>
            <div className="text-xl font-black text-white">
              {growthMetrics.streakDays}
              <span className="text-xs font-normal text-slate-400"> days</span>
            </div>
            <div className="text-[11px] text-amber-400 font-medium mt-0.5">
              {growthMetrics.weeklyStudyHoursLogged} hrs logged
            </div>
          </div>
        </div>
      </section>

      {/* Priority Action Highlight */}
      <section className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                Recommended 30-Day Step for Today
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-200/60 text-indigo-900">
                {nextActionItem.week || 'Week 1 Focus'}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">
              {nextActionItem.focus}
            </h3>
            <p className="text-slate-600 text-xs mt-0.5">
              {nextActionItem.action}
            </p>
          </div>
        </div>

        <button
          id="overview-action-plan-btn"
          onClick={() => setActiveTab('career-guidance')}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 hover:border-indigo-300 px-3.5 py-2 rounded-xl transition-all self-start md:self-auto cursor-pointer"
        >
          <span>View 30-Day Plan</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Five Core Features Navigation Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Core Learning Modules</h2>
          <p className="text-xs text-slate-500">
            Select any capability to accelerate your engineering preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.tab}
                id={`feature-card-${feat.tab}`}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-all hover:border-indigo-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${feat.iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {feat.num}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${feat.badgeColor}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">Ready</span>
                  <button
                    onClick={() => setActiveTab(feat.tab)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                  >
                    <span>{feat.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* College vs Industry Curriculum Gap Sneak Peek */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Curriculum Reality Check
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Why Traditional Syllabi Leave Students Unprepared
            </h3>
            <p className="text-xs text-slate-500">
              Top engineering companies test production architectures while college exams test theoretical memorization.
            </p>
          </div>

          <button
            id="view-full-gap-analysis-btn"
            onClick={() => setActiveTab('career-guidance')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3.5 py-2 rounded-xl self-start sm:self-auto cursor-pointer"
          >
            Full Gap Analysis →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {careerReport.industryCurriculumGaps.slice(0, 2).map((gap, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200/80 p-3.5 bg-slate-50/70 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Gap #{idx + 1}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                    {gap.severity} Gap
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">College Teaches: </span>
                  <span className="text-slate-700 font-semibold">{gap.collegeTeaches}</span>
                </div>
                <div className="text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-indigo-600 font-bold">Industry Demands: </span>
                  <span className="text-slate-900 font-bold">{gap.industryDemands}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
