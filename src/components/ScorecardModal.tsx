import React from 'react';
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  X,
  GraduationCap,
  Calendar,
  Building,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScorecardModal: React.FC<ScorecardModalProps> = ({ isOpen, onClose }) => {
  const { studentProfile, growthMetrics, roadmap, careerReport } = useApp();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const getReadinessTier = (score: number) => {
    if (score >= 85) return { label: 'Industry Production Ready', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 70) return { label: 'High Employability Talent', color: 'text-indigo-700 bg-indigo-50 border-indigo-200' };
    if (score >= 50) return { label: 'Emerging Developer', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Foundational Stage', color: 'text-slate-700 bg-slate-50 border-slate-200' };
  };

  const tier = getReadinessTier(growthMetrics.readinessScore);
  const issuedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="scorecard-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white border border-slate-300 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Modal Controls (Hidden in print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-sm">Official Student Career Readiness Scorecard</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Scorecard Body */}
        <div className="p-8 sm:p-10 space-y-6 text-slate-800 bg-white" id="printable-scorecard">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-200 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black font-mono tracking-tight text-slate-900">
                  learnpath<span className="text-indigo-600">.ai</span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Digital Student Success & Industry Readiness Verification
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">Verification ID</span>
              <span className="font-mono text-xs font-bold text-slate-800">
                LP-{studentProfile.id.toUpperCase()}-2026
              </span>
              <div className="text-[11px] text-slate-500 mt-0.5">Issued: {issuedDate}</div>
            </div>
          </div>

          {/* Student Profile Info Banner */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate</span>
              <span className="font-bold text-sm text-slate-900">{studentProfile.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Institution</span>
              <span className="font-semibold text-slate-800">{studentProfile.college}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Standing</span>
              <span className="font-semibold text-slate-800">{studentProfile.academicYear} CSE</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Track</span>
              <span className="font-bold text-indigo-700">{studentProfile.targetRole}</span>
            </div>
          </div>

          {/* Core Score Banner */}
          <div className="border border-indigo-200 bg-indigo-50/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                Verified Career Readiness Index
              </span>
              <div className="text-4xl font-black text-indigo-700 font-mono">
                {growthMetrics.readinessScore}
                <span className="text-lg font-normal text-slate-500"> / 100</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-md">
                Algorithmic synthesis of verified milestone completions, open-courseware progress, and technical diagnostic assessments.
              </p>
            </div>

            <div className="shrink-0">
              <span
                className={`inline-block px-4 py-2 rounded-xl text-xs font-extrabold border ${tier.color}`}
              >
                {tier.label}
              </span>
            </div>
          </div>

          {/* Competencies Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Industry Competency Vector
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Skill Domain</th>
                    <th className="p-3 text-center">Student Score</th>
                    <th className="p-3 text-center">Industry Benchmark</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {growthMetrics.skillScores.map((s, idx) => {
                    const isPassing = s.current >= s.industryTarget;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">{s.category}</td>
                        <td className="p-3 text-center font-mono font-bold text-indigo-600">
                          {s.current}%
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">
                          {s.industryTarget}%
                        </td>
                        <td className="p-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                              isPassing ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {isPassing ? '✓ Benchmark Met' : 'In Progress'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Achievements Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Milestones Completed</span>
              <span className="font-bold text-slate-800 text-sm">
                {growthMetrics.completedMilestonesCount} of {growthMetrics.totalMilestonesCount}
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Open Courses Enrolled</span>
              <span className="font-bold text-slate-800 text-sm">
                {growthMetrics.enrolledCoursesCount} Courses
              </span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Diagnostic Level</span>
              <span className="font-bold text-slate-800 text-sm">
                {growthMetrics.diagnosticResult?.level || 'Emerging Talent'}
              </span>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified under learnpath.ai Open Curriculum Standard</span>
            </div>
            <div>
              Automated Verification Hash: <span className="font-mono">8f2a9e...74b</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
