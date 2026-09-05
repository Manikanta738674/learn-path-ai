import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Building,
  Eye,
  EyeOff,
  BookOpen,
  Map,
  MessageSquareCode,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TargetRole, AcademicYear } from '../types';

export const LoginPage: React.FC = () => {
  const {
    login,
    registerUser,
    setActiveTab,
    availableDemoProfiles,
    studentProfile,
    authUser,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('National Institute of Technology');
  const [targetRole, setTargetRole] = useState<TargetRole>('Full-Stack Developer');
  const [academicYear, setAcademicYear] = useState<AcademicYear>('Final Year');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your student email address.');
      return;
    }
    setErrorMsg('');
    login(email.trim(), password);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMsg('Please provide your name and email.');
      return;
    }
    setErrorMsg('');
    registerUser(name.trim(), email.trim(), college, targetRole, academicYear);
  };

  const roles: TargetRole[] = [
    'Full-Stack Developer',
    'AI / ML Engineer',
    'Cloud & DevOps Engineer',
    'Data Engineer',
    'Cybersecurity Analyst',
    'Mobile App Developer',
  ];

  const years: AcademicYear[] = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    'Final Year',
    'Recent Graduate',
  ];

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto">
      {/* Return to Dashboard Link */}
      <div className="mb-6">
        <button
          id="back-to-dashboard-from-login"
          onClick={() => setActiveTab('overview')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <span>← Return to Platform Dashboard</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Platform Value Props & Credibility */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-4 shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Digital Career Accelerator</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
              Step Into Production Engineering.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Bridge the gap between theoretical classroom assignments and the production architectures tested by top tech firms.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">Curriculum Gap Diagnostics: </span>
                  <span className="text-slate-300">
                    Know exactly where university syllabus lags behind 2026 industry requirements.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">Deliverable Roadmaps: </span>
                  <span className="text-slate-300">
                    Concrete GitHub proof-of-work checkpoints rather than endless video loops.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-white">24/7 AI Mentors: </span>
                  <span className="text-slate-300">
                    Get system architecture and interview feedback tailored to your exact year.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Free & Open-Access</span>
              </span>
              <span>Zero Paywalls</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card & One-Click Demo Logins */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            {/* Tab Switcher: Sign In vs Create Account */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl mb-6">
              <button
                id="tab-sign-in"
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In to Account
              </button>
              <button
                id="tab-create-account"
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Student Account
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Mode 1: Sign In Form */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4 text-xs">
                <div>
                  <label htmlFor="login-email" className="block font-bold text-slate-700 mb-1">
                    Student Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. sravya.chilla@university.edu"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-indigo-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">
                      Demo mode: any password works
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-indigo-500 focus:bg-white transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="submit-signin-btn"
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Mode 2: Sign Up / Register Form */
              <form onSubmit={handleSignUpSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="register-name" className="block font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="register-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sravya Chilla"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="block font-bold text-slate-700 mb-1">
                      Student Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="register-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="sravyachilla123@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="register-college" className="block font-bold text-slate-700 mb-1">
                    College / University
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="register-college"
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="register-year" className="block font-bold text-slate-700 mb-1">
                      Graduation Standing
                    </label>
                    <select
                      id="register-year"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value as AcademicYear)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-indigo-500 font-medium"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="register-role" className="block font-bold text-slate-700 mb-1">
                      Target Career Role
                    </label>
                    <select
                      id="register-role"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-indigo-500 font-medium"
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  id="submit-register-btn"
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <span>Create Account & Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Demo Sign-In Selector */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Or Instant 1-Click Demo Login
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold">
                  Pre-configured sample profiles
                </span>
              </div>

              <div className="space-y-2">
                {availableDemoProfiles.map((p) => (
                  <button
                    key={p.id}
                    id={`quick-login-${p.id}`}
                    type="button"
                    onClick={() =>
                      login(`${p.name.toLowerCase().replace(/\s+/g, '.')}@university.edu`, '', p.id)
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-left text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.academicYear} • {p.targetRole}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <span>Select</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}

                {/* Continue as Guest */}
                <button
                  id="continue-as-guest-btn"
                  type="button"
                  onClick={() => {
                    setActiveTab('overview');
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Continue Browsing as Guest Student →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
