import React, { useState, useRef } from 'react';
import {
  Map,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Code2,
  BookOpen,
  LayoutGrid,
  GitFork,
  CheckSquare,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TargetRole } from '../types';
import { RoadmapGraphVisualization } from './RoadmapGraphVisualization';

const COURSE_TRACKS: { role: TargetRole; label: string; icon: string; desc: string }[] = [
  {
    role: 'Full-Stack Developer',
    label: 'Full-Stack Web Dev',
    icon: '🌐',
    desc: 'React 19, TypeScript, Express, PostgreSQL & Docker',
  },
  {
    role: 'AI / ML Engineer',
    label: 'AI & Machine Learning',
    icon: '🤖',
    desc: 'Python, PyTorch, RAG/LLMs, Vector DBs & MLOps',
  },
  {
    role: 'Cloud & DevOps Engineer',
    label: 'Cloud & DevOps',
    icon: '☁️',
    desc: 'Linux, Docker, Kubernetes, CI/CD & Terraform',
  },
  {
    role: 'Data Engineer',
    label: 'Data Engineering',
    icon: '📊',
    desc: 'Advanced SQL, Apache Airflow, PySpark & dbt',
  },
  {
    role: 'Backend Systems Engineer',
    label: 'Backend Systems',
    icon: '⚙️',
    desc: 'Go/Java, Concurrency, gRPC, Redis & System Design',
  },
  {
    role: 'Cybersecurity Analyst',
    label: 'Cybersecurity',
    icon: '🛡️',
    desc: 'Wireshark, OWASP Top 10, SIEM & DevSecOps',
  },
  {
    role: 'Mobile App Developer',
    label: 'Mobile Engineering',
    icon: '📱',
    desc: 'React Native, Offline DBs, Push Alerts & Fastlane',
  },
];

export const SkillRoadmapView: React.FC = () => {
  const {
    roadmap,
    toggleRoadmapTopic,
    addCustomMilestone,
    regenerateRoadmapForRole,
    isGeneratingRoadmap,
    studentProfile,
    selectCourseTrack,
    growthMetrics,
  } = useApp();

  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const [viewMode, setViewMode] = useState<'split' | 'graph' | 'checklist'>('split');
  const [highlightedPhase, setHighlightedPhase] = useState<number>(1);
  const phaseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMilestoneData, setNewMilestoneData] = useState({
    phaseNumber: 1,
    title: '',
    description: '',
    deliverable: '',
  });

  const togglePhase = (phaseNumber: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNumber]: !prev[phaseNumber],
    }));
  };

  const scrollToPhase = (phaseNumber: number) => {
    setHighlightedPhase(phaseNumber);
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseNumber]: true,
    }));
    const element = phaseRefs.current[phaseNumber];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneData.title.trim()) return;
    addCustomMilestone(
      Number(newMilestoneData.phaseNumber),
      newMilestoneData.title.trim(),
      newMilestoneData.description.trim() || 'Custom student learning milestone',
      newMilestoneData.deliverable.trim() || 'Public GitHub commit or live demo link'
    );
    setNewMilestoneData({
      phaseNumber: 1,
      title: '',
      description: '',
      deliverable: '',
    });
    setIsAddModalOpen(false);
  };

  const totalTopics = roadmap.phases.reduce(
    (acc, phase) => acc + phase.milestones.reduce((mAcc, m) => mAcc + m.topics.length, 0),
    0
  );
  const completedTopics = roadmap.phases.reduce(
    (acc, phase) =>
      acc + phase.milestones.reduce((mAcc, m) => mAcc + m.topics.filter((t) => t.completed).length, 0),
    0
  );

  const completionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              FEATURE 2
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Active Track: {roadmap.role} • {roadmap.totalEstimatedWeeks} Weeks
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Personalized Skill Roadmap & Pipeline Flow
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Select any course track to visualize the stage-by-stage progression, core skills, deliverables, and interactive milestone checklist.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="open-add-milestone-modal-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-600" />
            <span>Add Custom Milestone</span>
          </button>

          <button
            id="regenerate-roadmap-ai-btn"
            onClick={regenerateRoadmapForRole}
            disabled={isGeneratingRoadmap}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 ${isGeneratingRoadmap ? 'animate-spin' : ''}`} />
            <span>{isGeneratingRoadmap ? 'Generating...' : 'Regenerate via AI'}</span>
          </button>
        </div>
      </div>

      {/* Select Course / Learning Track Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Course Type / Engineering Track:
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            Switch tracks anytime to visualize its complete industry curriculum
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
          {COURSE_TRACKS.map((track) => {
            const isSelected = roadmap.role === track.role;
            return (
              <button
                key={track.role}
                id={`select-course-track-${track.role.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => selectCourseTrack(track.role)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="text-xl mb-1">{track.icon}</div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {track.label}
                  </div>
                </div>
                <div className={`text-[10px] mt-2 line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {track.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Switcher & Progress Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Progress Display */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-mono font-bold text-sm shrink-0 border border-indigo-100">
            {completionPercent}%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">
              {roadmap.role} Mastery Progress
            </div>
            <div className="text-xs text-slate-500">
              {completedTopics} of {totalTopics} competency topics checked ({growthMetrics.completedMilestonesCount} complete milestones)
            </div>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shrink-0">
          <button
            id="view-mode-split-btn"
            onClick={() => setViewMode('split')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Interactive Split View</span>
          </button>

          <button
            id="view-mode-graph-btn"
            onClick={() => setViewMode('graph')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'graph'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Graphical Pipeline Only</span>
          </button>

          <button
            id="view-mode-checklist-btn"
            onClick={() => setViewMode('checklist')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'checklist'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Topic Checklist</span>
          </button>
        </div>
      </div>

      {/* 1. Graphical Representation (when viewMode is 'split' or 'graph') */}
      {(viewMode === 'split' || viewMode === 'graph') && (
        <RoadmapGraphVisualization
          roadmap={roadmap}
          activePhaseNumber={highlightedPhase}
          onSelectPhase={scrollToPhase}
        />
      )}

      {/* 2. Structured Detailed Milestone Checklist (when viewMode is 'split' or 'checklist') */}
      {(viewMode === 'split' || viewMode === 'checklist') && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Detailed Topic Checkpoints & Deliverables</span>
            </h3>
            <span className="text-xs text-slate-500">
              Click checkboxes to record mastery and update your Readiness Score
            </span>
          </div>

          {roadmap.phases.map((phase) => {
            const isExpanded = expandedPhases[phase.phaseNumber] ?? true;

            const phaseTopics = phase.milestones.flatMap((m) => m.topics);
            const phaseCompletedTopics = phaseTopics.filter((t) => t.completed).length;
            const phaseAllDone = phaseTopics.length > 0 && phaseCompletedTopics === phaseTopics.length;

            return (
              <div
                key={phase.phaseNumber}
                ref={(el) => {
                  phaseRefs.current[phase.phaseNumber] = el;
                }}
                id={`phase-container-${phase.phaseNumber}`}
                className={`bg-white border rounded-2xl overflow-hidden shadow-xs transition-all ${
                  highlightedPhase === phase.phaseNumber
                    ? 'border-indigo-500 ring-2 ring-indigo-500/10'
                    : 'border-slate-200'
                }`}
              >
                {/* Phase Accordion Header */}
                <button
                  id={`phase-header-btn-${phase.phaseNumber}`}
                  onClick={() => togglePhase(phase.phaseNumber)}
                  className="w-full text-left p-5 sm:p-6 bg-slate-50/70 hover:bg-slate-50 border-b border-slate-200 flex items-start sm:items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                        phaseAllDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {phaseAllDone ? '✓' : `0${phase.phaseNumber}`}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Phase {phase.phaseNumber} • {phase.estimatedDuration}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            phase.difficulty === 'Beginner'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : phase.difficulty === 'Intermediate'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {phase.difficulty}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                        {phase.title}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {phase.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                      {phaseCompletedTopics}/{phaseTopics.length} done
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Milestones inside Phase */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Phase Skills Bar */}
                    <div className="flex items-center gap-2 flex-wrap text-xs pb-4 border-b border-slate-100">
                      <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                        Target Competencies:
                      </span>
                      {phase.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {phase.milestones.map((milestone) => {
                        const mTopics = milestone.topics;
                        const mDoneCount = mTopics.filter((t) => t.completed).length;
                        const isMilestoneDone = mTopics.length > 0 && mDoneCount === mTopics.length;

                        return (
                          <div
                            key={milestone.id}
                            id={`milestone-card-${milestone.id}`}
                            className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                              isMilestoneDone
                                ? 'border-emerald-200 bg-emerald-50/20'
                                : 'border-slate-200 bg-white hover:border-indigo-300'
                            }`}
                          >
                            <div>
                              {/* Milestone Header */}
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                                  {milestone.title}
                                </h3>
                                {milestone.isCustom && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                                    Custom
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                                {milestone.description}
                              </p>

                              {/* Topics Interactive Checklist */}
                              <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Topic Checkpoints ({mDoneCount}/{mTopics.length})
                                </span>
                                {mTopics.map((topic) => (
                                  <button
                                    key={topic.id}
                                    id={`topic-checkbox-${topic.id}`}
                                    type="button"
                                    onClick={() =>
                                      toggleRoadmapTopic(phase.phaseNumber, milestone.id, topic.id)
                                    }
                                    className="w-full flex items-start gap-2 text-left text-xs p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                  >
                                    {topic.completed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    )}
                                    <span
                                      className={
                                        topic.completed
                                          ? 'line-through text-slate-400'
                                          : 'text-slate-800 font-medium'
                                      }
                                    >
                                      {topic.title}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Milestone Footer Deliverable & Resource */}
                            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                              <div className="flex items-start gap-2 text-slate-600 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                                <Code2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-slate-900 block text-[11px]">
                                    Portfolio Proof Deliverable:
                                  </span>
                                  <span className="text-[11px] text-slate-700">
                                    {milestone.deliverable}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span className="flex items-center gap-1 font-medium">
                                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="truncate max-w-[200px]">
                                    {milestone.recommendedResource}
                                  </span>
                                </span>
                                <span className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1">
                                  Free Guide <ExternalLink className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Milestone Modal */}
      {isAddModalOpen && (
        <div
          id="add-milestone-modal"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Add Custom Industry Milestone
              </h3>
              <button
                id="close-add-milestone-modal-btn"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Customize your learning roadmap with personal projects, specific research topics, or certifications.
            </p>

            <form onSubmit={handleAddMilestoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Phase
                </label>
                <select
                  id="custom-milestone-phase-select"
                  value={newMilestoneData.phaseNumber}
                  onChange={(e) =>
                    setNewMilestoneData({ ...newMilestoneData, phaseNumber: Number(e.target.value) })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {roadmap.phases.map((p) => (
                    <option key={p.phaseNumber} value={p.phaseNumber}>
                      Phase {p.phaseNumber}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Milestone Title
                </label>
                <input
                  id="custom-milestone-title-input"
                  type="text"
                  required
                  placeholder="e.g., Build a Distributed Redis Cache with Go"
                  value={newMilestoneData.title}
                  onChange={(e) =>
                    setNewMilestoneData({ ...newMilestoneData, title: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  id="custom-milestone-desc-input"
                  rows={2}
                  placeholder="Explain the scope and industry skills practiced..."
                  value={newMilestoneData.description}
                  onChange={(e) =>
                    setNewMilestoneData({ ...newMilestoneData, description: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Deliverable / Artifact
                </label>
                <input
                  id="custom-milestone-deliverable-input"
                  type="text"
                  placeholder="e.g., GitHub repo with benchmarks, unit tests & Dockerfile"
                  value={newMilestoneData.deliverable}
                  onChange={(e) =>
                    setNewMilestoneData({ ...newMilestoneData, deliverable: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-custom-milestone-btn"
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs cursor-pointer"
                >
                  Add to Roadmap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
