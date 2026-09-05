import React, { useState } from 'react';
import {
  Compass,
  Map,
  BookOpen,
  MessageSquareCode,
  TrendingUp,
  HelpCircle,
  Sparkles,
  User,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  LogIn,
  LogOut,
  Sliders,
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    studentProfile,
    loadDemoProfile,
    availableDemoProfiles,
    growthMetrics,
    aiStatus,
    authUser,
    logout,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Dashboard', icon: Compass },
    { id: 'career-guidance', label: 'Career Guide', icon: Sparkles },
    { id: 'roadmap', label: 'Roadmap', icon: Map },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'mentor', label: 'AI Mentors', icon: MessageSquareCode },
    { id: 'growth', label: 'Growth & Scorecard', icon: TrendingUp },
    { id: 'about', label: 'About', icon: HelpCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/90">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              100% Free & Open-Source
            </span>
            <span className="hidden sm:inline text-slate-400">
              Final-Year CSE Career Accelerator • No Paywalls • Vercel-Ready
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[11px]">{aiStatus.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            id="brand-logo-btn"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 font-mono">
                  learnpath<span className="text-indigo-600">.ai</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  CSE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Digital Student Success Platform
              </p>
            </div>
          </button>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Readiness Badge & Auth / Profile */}
          <div className="flex items-center gap-2.5">
            {/* Readiness Badge */}
            <button
              id="header-readiness-badge"
              onClick={() => setActiveTab('growth')}
              className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              title="Click to view Career Readiness Scorecard"
            >
              <span className="text-[11px] font-bold text-indigo-700">
                {growthMetrics.readinessScore}%
              </span>
              <span className="text-slate-600 font-medium">Readiness</span>
            </button>

            {/* Auth / Profile Area */}
            {authUser.isLoggedIn ? (
              <div className="relative">
                <button
                  id="profile-dropdown-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1.5 rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                    {authUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight">
                      {authUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[85px]">
                      {studentProfile.targetRole}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <div className="text-xs font-bold text-slate-900">{authUser.name}</div>
                      <div className="text-[11px] text-slate-500">{authUser.email || studentProfile.college}</div>
                      <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                        {studentProfile.academicYear} • {studentProfile.targetRole}
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      Switch Demo Student
                    </div>
                    {availableDemoProfiles.map((p) => (
                      <button
                        key={p.id}
                        id={`switch-profile-${p.id}`}
                        onClick={() => {
                          loadDemoProfile(p.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          p.id === studentProfile.id
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-[10px] text-slate-500">{p.targetRole}</div>
                        </div>
                        {p.id === studentProfile.id && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </button>
                    ))}

                    <div className="border-t border-slate-100 mt-2 pt-1 space-y-1">
                      <button
                        id="tune-profile-menu-btn"
                        onClick={() => {
                          setActiveTab('career-guidance');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-indigo-600 rounded hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Tune Target Role & Skills</span>
                      </button>

                      <button
                        id="signout-menu-btn"
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out (Guest Mode)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => setActiveTab('login')}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {!authUser.isLoggedIn && (
            <button
              onClick={() => setActiveTab('login')}
              className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
