import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Star,
  Clock,
  Users,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TargetRole } from '../types';

export const CoursesCatalogView: React.FC = () => {
  const {
    courses,
    toggleCourseEnrollment,
    updateCourseProgress,
    studentProfile,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skillsCovered.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTrack =
        selectedTrack === 'All' ||
        c.roleTrack === selectedTrack ||
        c.roleTrack === 'All Tracks';

      const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;

      return matchesSearch && matchesTrack && matchesLevel;
    });
  }, [courses, searchQuery, selectedTrack, selectedLevel]);

  const tracks = ['All', 'Full-Stack Developer', 'AI / ML Engineer', 'Cloud & DevOps Engineer', 'Foundations & DSA'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
              FEATURE 3
            </span>
            <span className="text-xs text-slate-500 font-medium">
              100% Free & Open-Access Verified • No Credit Card Required
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Industry-Aligned Free Courses & Curricula
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            World-class open-source curricula from Harvard, MIT, University of Helsinki, and top engineering communities that replace obsolete university lectures.
          </p>
        </div>

        <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3 text-xs text-teal-900">
          <div className="font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-teal-700" />
            <span>Zero Paywalls Guarantee</span>
          </div>
          <p className="text-[11px] text-teal-800 mt-0.5">
            Every listed curriculum is permanently free to audit, study, and complete.
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="course-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, or provider (e.g. React, CS50, Docker, PyTorch)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-indigo-500 text-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Track Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {tracks.map((t) => (
              <button
                key={t}
                id={`track-filter-${t.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setSelectedTrack(t)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTrack === t
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Level Filter & Count */}
        <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
              Difficulty:
            </span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <div className="text-slate-500 text-xs">
            Showing <strong className="text-slate-900">{filteredCourses.length}</strong> verified courses
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your search query or choosing "All" tracks.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTrack('All');
              setSelectedLevel('All');
            }}
            className="mt-4 text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const isEnrolled = course.enrolled;
            const progress = course.progressPercent || 0;
            const isCompleted = course.completed || progress >= 100;

            return (
              <div
                key={course.id}
                id={`course-card-${course.id}`}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all hover:shadow-md ${
                  isEnrolled ? 'border-teal-300 ring-1 ring-teal-100' : 'border-slate-200'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {course.freeTierType}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {course.level}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h2>

                  <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                    <span>{course.provider}</span>
                    {course.instructor && (
                      <>
                        <span>•</span>
                        <span className="truncate">{course.instructor}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Skills Covered Chips */}
                  <div className="flex flex-wrap gap-1.5 my-4">
                    {course.skillsCovered.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Course Details Footer & Enrollment Actions */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {course.durationHours} hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {course.rating}
                      </span>
                    </div>

                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {(course.enrolledCount / 1000).toFixed(0)}k learners
                    </span>
                  </div>

                  {/* Interactive Progress Slider when Enrolled */}
                  {isEnrolled && (
                    <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-teal-900">
                          Your Course Progress:
                        </span>
                        <span className="font-mono font-bold text-teal-800">
                          {progress}% {isCompleted && '🎉 Completed'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          id={`progress-slider-${course.id}`}
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={progress}
                          onChange={(e) =>
                            updateCourseProgress(course.id, Number(e.target.value))
                          }
                          className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                        />
                        <button
                          onClick={() => updateCourseProgress(course.id, 100)}
                          className="shrink-0 text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer"
                        >
                          Mark 100%
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Open Free Syllabus</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      id={`enroll-btn-${course.id}`}
                      onClick={() => toggleCourseEnrollment(course.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isEnrolled
                          ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled (Drop)' : 'Enroll Free'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
