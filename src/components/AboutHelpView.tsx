import React, { useState } from 'react';
import {
  HelpCircle,
  ShieldCheck,
  Github,
  Cloud,
  Terminal,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
  GraduationCap,
  Layers,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutHelpView: React.FC = () => {
  const { aiStatus, showToast } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    showToast('Copied command to clipboard');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelSteps = [
    {
      step: '1',
      title: 'Push Code to GitHub',
      cmd: 'git init && git add . && git commit -m "feat: learnpath ai MVP" && git push origin main',
      desc: 'Create a free GitHub repository and push your project files.',
    },
    {
      step: '2',
      title: 'Import to Vercel (100% Free Hobby Plan)',
      cmd: 'npx vercel',
      desc: 'Link your GitHub repo to vercel.com or run the Vercel CLI. Framework Preset auto-detects as "Vite".',
    },
    {
      step: '3',
      title: 'Zero Environment Variables Required',
      cmd: '# Optional: GEMINI_API_KEY=your_key_here',
      desc: 'The application operates with full functionality out of the box via its built-in intelligent open-source engine. Adding a free Gemini API key is optional.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            HACKATHON DOCUMENTATION
          </span>
          <span className="text-xs text-slate-500 font-medium">
            AI Vibe Coding CSE Project Submission
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          About learnpath.ai & Vercel Deployment Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
          Everything you need to evaluate the architecture, run it locally, and deploy it to a live production URL on Vercel without paying a single cent.
        </p>
      </div>

      {/* Problem Statement & Academic Context */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-base">
          <GraduationCap className="w-5 h-5 text-indigo-600" />
          <h2>Problem Statement & Engineering Motivation</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Traditional engineering curricula across universities suffer from a pronounced multi-year lag compared to modern industry practices. While university students are graded on outdated textbook theory, tech firms evaluate candidates on containerized microservices, automated CI/CD pipelines, production TypeScript, and system resilience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 mb-1">Curriculum Lag</h3>
            <p className="text-slate-600">
              Colleges rarely teach modern frameworks, version control hygiene, or cloud deployment environments.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 mb-1">Generic Roadmaps</h3>
            <p className="text-slate-600">
              Generic internet tutorials overwhelm students with thousands of videos rather than actionable deliverables.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h3 className="font-bold text-slate-900 mb-1">Mentorship Gap</h3>
            <p className="text-slate-600">
              Students lack access to experienced senior engineers who can review their code architectures and interview prep.
            </p>
          </div>
        </div>
      </div>

      {/* 100% Free & Open-Source Guarantee Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2.5 text-emerald-950 font-bold text-base mb-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h2>100% Free & Open-Source Architecture</h2>
        </div>

        <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed mb-4">
          Strictly engineered according to the user specification: <strong>Zero paid dependencies</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white border border-emerald-200/80">
            <span className="font-bold text-emerald-800 block">No Credit Card</span>
            <span className="text-slate-600 text-[11px]">Free tier forever</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-200/80">
            <span className="font-bold text-emerald-800 block">No Paid Database</span>
            <span className="text-slate-600 text-[11px]">LocalStorage persistence</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-200/80">
            <span className="font-bold text-emerald-800 block">Dual AI Strategy</span>
            <span className="text-slate-600 text-[11px]">Free Gemini + Offline logic</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-emerald-200/80">
            <span className="font-bold text-emerald-800 block">Free Hosting</span>
            <span className="text-slate-600 text-[11px]">Deployable on Vercel / Cloud Run</span>
          </div>
        </div>
      </div>

      {/* Vercel Deployment Guide */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Cloud className="w-5 h-5 text-indigo-600" />
            <h2>Vercel Deployment Walkthrough</h2>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            3-Step Process
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Vercel deploys the application as a fast static single-page application with automatic caching and zero configuration.
        </p>

        <div className="space-y-4 pt-2">
          {vercelSteps.map((item) => (
            <div
              key={item.step}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono text-[11px]">
                    {item.step}
                  </span>
                  {item.title}
                </span>
                <button
                  onClick={() => copyToClipboard(item.cmd, item.step)}
                  className="text-slate-400 hover:text-slate-700 p-1 rounded"
                  title="Copy command"
                >
                  {copiedKey === item.step ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-xs overflow-x-auto flex items-center justify-between">
                <code>{item.cmd}</code>
              </div>

              <p className="text-xs text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          Technical Architecture Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Frontend Framework</span>
            <span className="font-bold text-slate-900 text-sm">React 18 & TypeScript</span>
            <p className="text-slate-500 mt-1">Strict typed interfaces with zero runtime type leaks.</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Styling Engine</span>
            <span className="font-bold text-slate-900 text-sm">Tailwind CSS</span>
            <p className="text-slate-500 mt-1">High-contrast, responsive mathematical design system.</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Backend Server</span>
            <span className="font-bold text-slate-900 text-sm">Node.js & Express</span>
            <p className="text-slate-500 mt-1">Server-side proxy routes keep keys safe and handle SSR asset delivery.</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Client Persistence</span>
            <span className="font-bold text-slate-900 text-sm">HTML5 LocalStorage</span>
            <p className="text-slate-500 mt-1">Saves student progress, roadmaps, and chat transcripts across refreshes.</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">AI Foundation</span>
            <span className="font-bold text-slate-900 text-sm">Hybrid AI Strategy</span>
            <p className="text-slate-500 mt-1">Works seamlessly online or offline with zero required configuration.</p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block font-bold text-[10px] uppercase">Build & Bundling</span>
            <span className="font-bold text-slate-900 text-sm">Vite & esbuild</span>
            <p className="text-slate-500 mt-1">Sub-second build times and production bundles optimized for web.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
