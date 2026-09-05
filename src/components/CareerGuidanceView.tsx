import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Building,
  GraduationCap,
  Briefcase,
  Code,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TargetRole, ExperienceLevel, AcademicYear } from '../types';

export const CareerGuidanceView: React.FC = () => {
  const {
    studentProfile,
    updateStudentProfile,
    careerReport,
    isAnalyzingCareer,
    refreshCareerGuidance,
    setActiveTab,
    regenerateRoadmapForRole,
    aiStatus,
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    academicYear: studentProfile.academicYear,
    targetRole: studentProfile.targetRole,
    experienceLevel: studentProfile.experienceLevel,
    languages: studentProfile.languages.join(', '),
    frameworks: studentProfile.frameworks.join(', '),
    academicFocus: studentProfile.academicFocus,
  });

  const availableRoles: TargetRole[] = [
    'Full-Stack Developer',
    'AI / ML Engineer',
    'Cloud & DevOps Engineer',
    'Data Engineer',
    'Cybersecurity Analyst',
    'Mobile App Developer',
    'Backend Systems Engineer',
  ];

  const academicYears: AcademicYear[] = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    'Final Year',
    'Recent Graduate',
  ];

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile({
      academicYear: formData.academicYear as AcademicYear,
      targetRole: formData.targetRole as TargetRole,
      experienceLevel: formData.experienceLevel as ExperienceLevel,
      languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
      frameworks: formData.frameworks.split(',').map((s) => s.trim()).filter(Boolean),
      academicFocus: formData.academicFocus,
    });
    setIsEditingProfile(false);
    refreshCareerGuidance();
  };

  const handleGenerateRoadmapFromGuidance = async () => {
    await regenerateRoadmapForRole();
    setActiveTab('roadmap');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              FEATURE 1
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Powered by {aiStatus.label}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI Career Guidance & Industry Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Personalized career assessment based on your current CSE academic standing, coding proficiency, and market employability signals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="tune-profile-btn"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>{isEditingProfile ? 'Close Tuner' : 'Tune Input Profile'}</span>
          </button>

          <button
            id="refresh-ai-guidance-btn"
            onClick={refreshCareerGuidance}
            disabled={isAnalyzingCareer}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzingCareer ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingCareer ? 'Analyzing Profile...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Profile Tuner Form Modal / Drawer */}
      {isEditingProfile && (
        <form
          id="profile-tuning-form"
          onSubmit={handleProfileSubmit}
          className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-indigo-200/80 pb-3">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Adjust Student Parameters for AI Career Evaluation
            </h3>
            <span className="text-xs text-indigo-600 font-medium">Updates both Guidance and Roadmaps</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label htmlFor="target-role-select" className="block font-bold text-slate-700 mb-1">
                Target Role
              </label>
              <select
                id="target-role-select"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as TargetRole })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-indigo-500 font-medium"
              >
                {availableRoles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="academic-year-select" className="block font-bold text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                id="academic-year-select"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value as AcademicYear })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-indigo-500 font-medium"
              >
                {academicYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="exp-level-select" className="block font-bold text-slate-700 mb-1">
                Coding Experience
              </label>
              <select
                id="exp-level-select"
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-indigo-500 font-medium"
              >
                <option value="Beginner">Beginner (Basic Syntax)</option>
                <option value="Intermediate">Intermediate (Built 1-2 small projects)</option>
                <option value="Advanced">Advanced (Full-stack / DSA practice)</option>
              </select>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="languages-input" className="block font-bold text-slate-700 mb-1">
                Programming Languages (comma separated)
              </label>
              <input
                id="languages-input"
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-indigo-500"
                placeholder="Python, Java, JavaScript, C++"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="frameworks-input" className="block font-bold text-slate-700 mb-1">
                Known Frameworks & Tools (comma separated)
              </label>
              <input
                id="frameworks-input"
                type="text"
                value={formData.frameworks}
                onChange={(e) => setFormData({ ...formData, frameworks: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-indigo-500"
                placeholder="React, Node.js, Git, SQL, Docker"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-profile-reanalyze-btn"
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Save & Re-run AI Analysis
            </button>
          </div>
        </form>
      )}

      {/* Main Analysis Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Match Score & Market Demand */}
        <div className="space-y-6">
          {/* Match Score Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Primary Career Match
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {careerReport.marketDemand} Market Demand
              </span>
            </div>

            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-8 border-indigo-100 bg-indigo-50 relative mb-3">
                <span className="text-3xl font-black text-indigo-700 font-mono">
                  {careerReport.matchScore}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {careerReport.primaryRole}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Evaluated for {studentProfile.academicYear} graduation tier
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  Entry Salary Band:
                </span>
                <span className="font-bold text-slate-800">
                  {careerReport.salaryRange}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  Hiring Velocity:
                </span>
                <span className="font-bold text-emerald-600">
                  Strong Growth (2026-2028)
                </span>
              </div>
            </div>
          </div>

          {/* Alternative Pathways */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Alternative High-Affinity Tracks
            </h3>
            <div className="space-y-3">
              {careerReport.alternativePathways.map((alt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{alt.role}</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {alt.matchScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {alt.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Modern Tech Stack */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Target 2026 Production Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {careerReport.recommendedTechStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Executive Summary & Detailed Curriculum Gap Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                AI Career Appraisal & Readiness Diagnostic
              </h2>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {careerReport.summary}
            </p>
          </div>

          {/* Critical Problem Statement: College Syllabus vs Industry Demands */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  College Curriculum Gap Analysis
                </h3>
                <p className="text-xs text-slate-500">
                  Direct breakdown of university coursework deficiencies vs hiring expectations.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Critical Priority</span>
              </span>
            </div>

            <div className="space-y-3">
              {careerReport.industryCurriculumGaps.map((gap, i) => (
                <div
                  key={i}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Gap #{i + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        gap.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {gap.severity} Deficiency
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <span className="block font-bold text-slate-500 mb-0.5 text-[11px]">
                        What University Syllabus Teaches:
                      </span>
                      <span className="text-slate-700 font-medium">
                        {gap.collegeTeaches}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200">
                      <span className="block font-bold text-indigo-700 mb-0.5 text-[11px]">
                        What Industry Interviews Test For:
                      </span>
                      <span className="text-indigo-950 font-bold">
                        {gap.industryDemands}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 30-Day Step-by-Step Action Plan */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  30-Day Step-by-Step Bridge Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Immediate, weekly actionable milestones to close your competency gaps.
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                4 Weeks • 1 Month
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {careerReport.thirtyDayActionPlan.map((plan, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-indigo-900">{plan.week}: {plan.focus}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {plan.action}
                  </p>
                </div>
              ))}
            </div>

            {/* Seamless One-Click Integration into Feature 2 */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Ready to turn these insights into an interactive milestone checklist?
              </div>
              <button
                id="generate-roadmap-btn"
                onClick={handleGenerateRoadmapFromGuidance}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Generate Interactive Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
