import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScorecardModal } from './ScorecardModal';
import { DiagnosticResult } from '../types';

interface DiagnosticQuestion {
  id: number;
  question: string;
  category: string;
  options: { label: string; text: string; correct: boolean }[];
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    category: 'Backend & APIs',
    question:
      'In a production microservices architecture, what is the primary architectural purpose of an API Gateway?',
    options: [
      { label: 'A', text: 'To store relational database tables in memory.', correct: false },
      { label: 'B', text: 'To provide unified routing, SSL termination, authentication, and rate limiting across services.', correct: true },
      { label: 'C', text: 'To automatically convert JavaScript code into binary machine code.', correct: false },
      { label: 'D', text: 'To replace all frontend client-side rendering engines.', correct: false },
    ],
    explanation:
      'API Gateways act as the single entry point for external traffic, managing cross-cutting concerns like rate limiting, JWT token validation, and service routing.',
  },
  {
    id: 2,
    category: 'Testing & CI/CD',
    question:
      'Why do senior engineers prioritize automated unit tests and continuous integration over manual QA testing before merging code?',
    options: [
      { label: 'A', text: 'Because automated tests prevent regressions and verify code contracts instantly on every commit.', correct: true },
      { label: 'B', text: 'Because compilers refuse to build without 100% test files.', correct: false },
      { label: 'C', text: 'Because unit tests make cloud server hosting free of cost.', correct: false },
      { label: 'D', text: 'Because manual testing is banned in open-source software.', correct: false },
    ],
    explanation:
      'CI/CD pipelines run automated test suites on pull requests to ensure that changes do not break existing features or introduce regressions.',
  },
  {
    id: 3,
    category: 'Databases & Performance',
    question:
      'What happens when you add a B-Tree index to a frequently queried column like `user_id` in PostgreSQL or MySQL?',
    options: [
      { label: 'A', text: 'It slows down all SELECT queries by encrypting rows.', correct: false },
      { label: 'B', text: 'It changes query lookup time from O(N) table scans to O(log N) indexed searches, trading slight write overhead for massive read speed.', correct: true },
      { label: 'C', text: 'It deletes all duplicate database rows automatically.', correct: false },
      { label: 'D', text: 'It forces the database to run in the client web browser.', correct: false },
    ],
    explanation:
      'Indexes create an auxiliary sorted lookup structure (usually a B-Tree) that allows the database engine to jump directly to matching records instead of scanning millions of rows.',
  },
  {
    id: 4,
    category: 'Cloud & DevOps',
    question:
      'What core production problem does Docker containerization solve that virtual machines struggle with?',
    options: [
      { label: 'A', text: 'It guarantees an identical, lightweight execution environment across dev, staging, and cloud production with minimal kernel overhead.', correct: true },
      { label: 'B', text: 'It eliminates the need for software licenses.', correct: false },
      { label: 'C', text: 'It rewrites backend code into WebAssembly.', correct: false },
      { label: 'D', text: 'It makes all databases run faster without configuration.', correct: false },
    ],
    explanation:
      'Containers package the application code alongside its specific system dependencies and runtime binaries, eliminating the classic "it worked on my laptop" defect.',
  },
  {
    id: 5,
    category: 'System Architecture',
    question:
      'When your web server is experiencing sudden 10x traffic spikes, which pattern prevents database starvation?',
    options: [
      { label: 'A', text: 'Implementing in-memory caching (e.g. Redis) and message queuing (e.g. RabbitMQ/BullMQ) for async tasks.', correct: true },
      { label: 'B', text: 'Running an infinite while-loop on the backend.', correct: false },
      { label: 'C', text: 'Increasing CSS animations on the client.', correct: false },
      { label: 'D', text: 'Removing all API authentication checks.', correct: false },
    ],
    explanation:
      'Caching hot read queries and offloading heavy writes into asynchronous message queues decouples spikes from persistent database storage.',
  },
];

export const GrowthTrackingView: React.FC = () => {
  const {
    growthMetrics,
    studentProfile,
    saveDiagnosticResult,
    logStudySession,
    resetAllProgress,
  } = useApp();

  const [isScorecardOpen, setIsScorecardOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Quick Study Log state
  const [customStudyMinutes, setCustomStudyMinutes] = useState(45);
  const [customStudyTopic, setCustomStudyTopic] = useState('TypeScript & System Design');

  const handleSelectAnswer = (qId: number, label: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: label }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const strengths: string[] = [];
    const priorityGaps: string[] = [];

    DIAGNOSTIC_QUESTIONS.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const correctOption = q.options.find((o) => o.correct);
      if (selected === correctOption?.label) {
        correctCount += 1;
        strengths.push(q.category);
      } else {
        priorityGaps.push(q.category);
      }
    });

    const calculatedScore = Math.round((correctCount / DIAGNOSTIC_QUESTIONS.length) * 100);
    let level: 'Novice' | 'Emerging Talent' | 'Industry-Ready' | 'Advanced Contributor' =
      'Emerging Talent';

    if (calculatedScore >= 85) level = 'Advanced Contributor';
    else if (calculatedScore >= 70) level = 'Industry-Ready';
    else if (calculatedScore >= 50) level = 'Emerging Talent';
    else level = 'Novice';

    const result: DiagnosticResult = {
      score: calculatedScore,
      level,
      strengths: Array.from(new Set(strengths)),
      priorityGaps: Array.from(new Set(priorityGaps)),
      completedAt: new Date().toISOString(),
    };

    saveDiagnosticResult(result);
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const maxMinutesInWeek = Math.max(...growthMetrics.studyLogs.map((l) => l.minutes), 120);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              FEATURE 5
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Real-Time Dynamic Employability Analytics
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Growth & Career Readiness Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Synthesizes your milestone achievements, open-course completions, study hours, and technical diagnostic results into a verifiable readiness scorecard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="open-scorecard-modal-btn"
            onClick={() => setIsScorecardOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Official Scorecard</span>
          </button>

          <button
            id="open-diagnostic-quiz-btn"
            onClick={() => setIsDiagnosticOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Take Diagnostic Quiz</span>
          </button>
        </div>
      </div>

      {/* Top 4 Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Readiness Index</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {growthMetrics.readinessScore}
            <span className="text-sm font-normal text-slate-400">/100</span>
          </div>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {growthMetrics.readinessScore >= 80 ? 'Production Ready' : 'Fast Accelerating'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Milestones Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {growthMetrics.completedMilestonesCount}
            <span className="text-sm font-normal text-slate-400">
              /{growthMetrics.totalMilestonesCount}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Across 4 structured phases
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Study Hours Logged</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {growthMetrics.weeklyStudyHoursLogged}
            <span className="text-sm font-normal text-slate-400"> hrs</span>
          </div>
          <p className="text-xs text-teal-600 font-medium mt-1">
            {growthMetrics.streakDays}-day active learning streak
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Diagnostic Assessment</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">
            {growthMetrics.diagnosticResult?.score ?? 72}%
          </div>
          <p className="text-xs text-amber-600 font-semibold mt-1 truncate">
            {growthMetrics.diagnosticResult?.level ?? 'Emerging Talent'}
          </p>
        </div>
      </div>

      {/* Main Grid: Competency Vector + Study Time Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Competency Vector (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Industry Competency Benchmark Breakdown
              </h2>
              <p className="text-xs text-slate-500">
                Your current proficiency vs industry hiring standards for {studentProfile.targetRole}.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg hidden sm:inline">
              6 Dimensions
            </span>
          </div>

          <div className="space-y-4">
            {growthMetrics.skillScores.map((skill, idx) => {
              const delta = skill.current - skill.industryTarget;
              const isTargetMet = delta >= 0;

              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{skill.category}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500">
                        Target: <strong className="text-slate-700">{skill.industryTarget}%</strong>
                      </span>
                      <span className="font-mono font-bold text-indigo-600">
                        Current: {skill.current}%
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isTargetMet
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isTargetMet ? `+${delta}%` : `${delta}%`}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar (Current vs Benchmark line) */}
                  <div className="relative w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isTargetMet ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${skill.current}%` }}
                    ></div>
                    {/* Benchmark vertical marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-slate-900 z-10"
                      style={{ left: `${skill.industryTarget}%` }}
                      title={`Target Benchmark: ${skill.industryTarget}%`}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span>Your Current Mastery</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ml-3"></span>
              <span>Industry Benchmark (80-88%)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Updated in real time</span>
          </div>
        </div>

        {/* Weekly Study Activity & Quick Logger (1 col) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              7-Day Study Time Log
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Consistent focus hours build technical muscle memory.
            </p>
          </div>

          {/* Mini Bar Chart */}
          <div className="flex items-end justify-between h-32 pt-4 px-2 border-b border-slate-100">
            {growthMetrics.studyLogs.map((log, lIdx) => {
              const heightPercent = Math.min(100, Math.round((log.minutes / maxMinutesInWeek) * 100));
              const dayLabel = new Date(log.date).toLocaleDateString('en-US', { weekday: 'narrow' });

              return (
                <div key={lIdx} className="flex flex-col items-center gap-1.5 flex-1 group">
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-600 font-bold">
                    {log.minutes}m
                  </span>
                  <div className="w-6 bg-slate-100 rounded-t-md h-24 flex items-end overflow-hidden">
                    <div
                      className="w-full bg-indigo-600 group-hover:bg-indigo-500 rounded-t-md transition-all duration-300"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{dayLabel}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Study Logger Form */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-slate-800 block">
              Log Today&apos;s Focus Session:
            </span>

            <div className="flex gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setCustomStudyMinutes(mins)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                    customStudyMinutes === mins
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  +{mins}m
                </button>
              ))}
            </div>

            <input
              id="study-topic-input"
              type="text"
              value={customStudyTopic}
              onChange={(e) => setCustomStudyTopic(e.target.value)}
              placeholder="Topic studied (e.g. Docker, React, LeetCode)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-indigo-500"
            />

            <button
              id="log-study-session-btn"
              onClick={() => {
                logStudySession(customStudyMinutes, customStudyTopic || 'Self Study');
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
            >
              Add {customStudyMinutes} Mins to Study Log
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={resetAllProgress}
              className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Demo Progress</span>
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostic Assessment Quiz Modal */}
      {isDiagnosticOpen && (
        <div
          id="diagnostic-quiz-modal-backdrop"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Technical Diagnostic Assessment
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Production Engineering Readiness Test
                </h3>
              </div>
              <button
                onClick={() => setIsDiagnosticOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between text-slate-500 pb-2 border-b border-slate-100">
                  <span>
                    Question {currentQuizIdx + 1} of {DIAGNOSTIC_QUESTIONS.length}
                  </span>
                  <span className="font-semibold text-indigo-600">
                    {DIAGNOSTIC_QUESTIONS[currentQuizIdx].category}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 leading-snug">
                  {DIAGNOSTIC_QUESTIONS[currentQuizIdx].question}
                </div>

                <div className="space-y-2 pt-2">
                  {DIAGNOSTIC_QUESTIONS[currentQuizIdx].options.map((option) => {
                    const isSelected =
                      selectedAnswers[DIAGNOSTIC_QUESTIONS[currentQuizIdx].id] === option.label;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() =>
                          handleSelectAnswer(DIAGNOSTIC_QUESTIONS[currentQuizIdx].id, option.label)
                        }
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/70 text-indigo-950 font-semibold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md font-bold text-[11px] flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {option.label}
                        </span>
                        <span className="text-xs leading-relaxed">{option.text}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    disabled={currentQuizIdx === 0}
                    onClick={() => setCurrentQuizIdx((p) => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                  >
                    Previous
                  </button>

                  {currentQuizIdx < DIAGNOSTIC_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuizIdx((p) => p + 1)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-1.5 rounded-lg cursor-pointer"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      id="submit-diagnostic-quiz-btn"
                      type="button"
                      onClick={handleSubmitQuiz}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg cursor-pointer shadow-xs"
                    >
                      Complete & Grade Assessment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Quiz Results Summary */
              <div className="space-y-5 text-xs text-slate-800">
                <div className="text-center py-4 bg-indigo-50/60 rounded-2xl border border-indigo-200">
                  <div className="text-3xl font-black text-indigo-700 font-mono">
                    {growthMetrics.diagnosticResult?.score}%
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-1">
                    Assessment Level: {growthMetrics.diagnosticResult?.level}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your dynamic Career Readiness Score has been recalibrated.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span className="font-bold text-emerald-800 block mb-1">
                      Demonstrated Strengths:
                    </span>
                    <ul className="list-disc list-inside text-emerald-950 space-y-0.5 text-[11px]">
                      {growthMetrics.diagnosticResult?.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                    <span className="font-bold text-amber-800 block mb-1">
                      Recommended Focus Gaps:
                    </span>
                    <ul className="list-disc list-inside text-amber-950 space-y-0.5 text-[11px]">
                      {growthMetrics.diagnosticResult?.priorityGaps.map((g, idx) => (
                        <li key={idx}>{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Retake Quiz
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDiagnosticOpen(false);
                      setIsScorecardOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    View Official Scorecard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Printable Scorecard Modal */}
      <ScorecardModal
        isOpen={isScorecardOpen}
        onClose={() => setIsScorecardOpen(false)}
      />
    </div>
  );
};
