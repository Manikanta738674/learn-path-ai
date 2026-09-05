import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { CareerGuidanceView } from './components/CareerGuidanceView';
import { SkillRoadmapView } from './components/SkillRoadmapView';
import { CoursesCatalogView } from './components/CoursesCatalogView';
import { AiMentorshipView } from './components/AiMentorshipView';
import { GrowthTrackingView } from './components/GrowthTrackingView';
import { AboutHelpView } from './components/AboutHelpView';
import { LoginPage } from './components/LoginPage';
import { GraduationCap, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'career-guidance' && <CareerGuidanceView />}
        {activeTab === 'roadmap' && <SkillRoadmapView />}
        {activeTab === 'courses' && <CoursesCatalogView />}
        {activeTab === 'mentor' && <AiMentorshipView />}
        {activeTab === 'growth' && <GrowthTrackingView />}
        {activeTab === 'about' && <AboutHelpView />}
        {activeTab === 'login' && <LoginPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-extrabold font-mono text-slate-800 text-sm">
              learnpath<span className="text-indigo-600">.ai</span>
            </span>
            <span className="text-slate-400">•</span>
            <span>Final-Year CSE AI Vibe Coding MVP</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('career-guidance')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Career Guidance
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Roadmap
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Free Courses
            </button>
            <button
              onClick={() => setActiveTab('mentor')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Mentorship
            </button>
            <button
              onClick={() => setActiveTab('growth')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Readiness Scorecard
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Vercel Guide
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="hover:text-indigo-600 text-indigo-600 font-semibold transition-colors cursor-pointer"
            >
              Student Sign In
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            100% Free & Open-Source • Zero Paywalls
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
