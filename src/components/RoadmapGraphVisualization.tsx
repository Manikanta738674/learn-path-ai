import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  ExternalLink,
  Code2,
  Cpu,
  Clock,
  ChevronRight,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { SkillRoadmap, RoadmapPhase, Course } from '../types';
import { useApp } from '../context/AppContext';

interface RoadmapGraphVisualizationProps {
  roadmap: SkillRoadmap;
  onSelectPhase?: (phaseNumber: number) => void;
  activePhaseNumber?: number;
}

export const RoadmapGraphVisualization: React.FC<RoadmapGraphVisualizationProps> = ({
  roadmap,
  onSelectPhase,
  activePhaseNumber = 1,
}) => {
  const { courses, toggleCourseEnrollment } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<number>(activePhaseNumber);

  const handlePhaseClick = (phaseNum: number) => {
    setSelectedPhase(phaseNum);
    if (onSelectPhase) {
      onSelectPhase(phaseNum);
    }
  };

  const activePhase =
    roadmap.phases.find((p) => p.phaseNumber === selectedPhase) || roadmap.phases[0];

  // Map courses to roadmap tracks
  const relevantCourses = courses.filter((c) => {
    if (c.roleTrack === 'All Tracks' || c.roleTrack === 'Foundations & DSA') return true;
    return c.roleTrack === roadmap.role;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 font-mono">
              Graphical Learning Architecture
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
            {roadmap.role} Learning Pipeline
          </h2>
          <p className="text-xs text-slate-500">
            Interactive progression flow. Click any milestone node below to examine prerequisites, key skills, and industry deliverables.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Complete</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Graphical Node Pipeline Flow (Desktop & Mobile Responsive) */}
      <div className="relative">
        {/* Horizontal Connector Line for Desktop */}
        <div className="hidden lg:block absolute top-14 left-12 right-12 h-1 bg-slate-200 z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-indigo-600 to-indigo-300 transition-all duration-700"
            style={{
              width: `${Math.min(100, Math.max(15, (selectedPhase / roadmap.phases.length) * 100))}%`,
            }}
          />
        </div>

        {/* Grid of Phase Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {roadmap.phases.map((phase, idx) => {
            const isSelected = selectedPhase === phase.phaseNumber;
            const phaseTopics = phase.milestones.flatMap((m) => m.topics);
            const completedCount = phaseTopics.filter((t) => t.completed).length;
            const totalCount = phaseTopics.length;
            const isDone = totalCount > 0 && completedCount === totalCount;
            const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <button
                key={phase.phaseNumber}
                id={`roadmap-node-phase-${phase.phaseNumber}`}
                onClick={() => handlePhaseClick(phase.phaseNumber)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                    : isDone
                    ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Top Badge & Node Step Number */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl font-mono font-black text-xs flex items-center justify-center shadow-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {isDone ? '✓' : `0${phase.phaseNumber}`}
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-800'
                        : isSelected
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {phase.estimatedDuration}
                  </span>
                </div>

                {/* Node Title & Description */}
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Stage {phase.phaseNumber} • {phase.difficulty}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 mt-0.5 leading-snug line-clamp-2">
                    {phase.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {phase.tagline}
                  </p>
                </div>

                {/* Node Bottom Progress & Deliverable Hint */}
                <div className="mt-4 pt-3 border-t border-slate-100/80">
                  <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-600">
                    <span>{progress}% Competency</span>
                    <span>{completedCount}/{totalCount} Topics</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isDone ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Arrow indicator between nodes on mobile/tablets */}
                {idx < roadmap.phases.length - 1 && (
                  <div className="hidden sm:flex lg:hidden justify-center my-2 text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Phase Detail Breakdown: Visual Blueprint */}
      {activePhase && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                P0{activePhase.phaseNumber}
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">
                  {activePhase.title}
                </h4>
                <p className="text-xs text-slate-600">
                  {activePhase.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                Duration: <strong className="text-slate-900">{activePhase.estimatedDuration}</strong>
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                Difficulty: <strong className="text-slate-900">{activePhase.difficulty}</strong>
              </span>
            </div>
          </div>

          {/* Key Competency Skills Unlocked */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Core Industry Competencies Mastered in this Stage</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activePhase.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-800 shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Milestones & Deliverables Visual Cards */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Milestones & Concrete Public Deliverables</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activePhase.milestones.map((m) => {
                const total = m.topics.length;
                const completed = m.topics.filter((t) => t.completed).length;
                const isAllDone = total > 0 && total === completed;

                return (
                  <div
                    key={m.id}
                    className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        {isAllDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {m.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                            {m.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded shrink-0">
                        {completed}/{total}
                      </span>
                    </div>

                    {/* Deliverable Box */}
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 text-[11px] text-slate-700">
                      <div className="font-bold text-indigo-900 flex items-center gap-1 mb-0.5">
                        <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Public Portfolio Artifact</span>
                      </div>
                      <p className="text-slate-600">{m.deliverable}</p>
                    </div>

                    {/* Recommended Resource */}
                    {m.recommendedResource && (
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{m.recommendedResource}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Free Courses Aligned with this Phase */}
          {relevantCourses.length > 0 && (
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Courses Aligned with Stage {activePhase.phaseNumber}</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  100% Free / Open Source
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {relevantCourses.slice(0, 2).map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider truncate">
                        {course.provider}
                      </div>
                      <h6 className="text-xs font-bold text-slate-900 truncate">
                        {course.title}
                      </h6>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {course.durationHours} hrs • {course.level} • ★ {course.rating}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        id={`enroll-btn-${course.id}`}
                        onClick={() => toggleCourseEnrollment(course.id)}
                        className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          course.enrolled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-600 text-white hover:bg-indigo-500'
                        }`}
                      >
                        {course.enrolled ? 'Enrolled' : 'Enroll'}
                      </button>
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                        title="Open course in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
