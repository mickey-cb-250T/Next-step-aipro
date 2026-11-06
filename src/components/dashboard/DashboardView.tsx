import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FolderGit2,
  GitFork,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import { UserProfile, RoadmapTask, ProjectRecommendation } from '../../types';
import { CAREER_TRACKS } from '../../data/seedData';
import { SkillGraphEngine } from '../../lib/graphEngine';
import { NavTab } from '../navigation/Sidebar';

interface DashboardViewProps {
  profile: UserProfile;
  tasks: RoadmapTask[];
  projects: ProjectRecommendation[];
  onNavigate: (tab: NavTab) => void;
  onOpenProfile: () => void;
  onToggleTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  tasks,
  projects,
  onNavigate,
  onOpenProfile,
  onToggleTask,
}) => {
  const currentTrack = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];
  const graphResult = SkillGraphEngine.computeGraph(profile);

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const remainingTasks = tasks.filter(t => t.status !== 'completed');
  const totalRemainingHours = remainingTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const estimatedWeeksLeft = Math.ceil(totalRemainingHours / (profile.weeklyHoursBudget || 10));

  const activeProject = projects.find(p => p.status === 'in_progress') || projects[0];
  const nextActionTask = remainingTasks[0] || tasks[0];

  return (
    <div className="space-y-6">
      {/* 1. Target Career & Readiness Command Banner */}
      <div className="p-6 lg:p-7 rounded-xl bg-gradient-to-r from-[#14161C] to-[#121316] border border-[#23262E] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded">
                Active Career Track
              </span>
              <span className="text-xs text-[#71717A]">•</span>
              <span className="text-xs font-mono text-[#A1A1AA]">
                {profile.weeklyHoursBudget} hours / week budget
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {profile.targetRole || currentTrack.name}
            </h2>
            <p className="text-xs text-[#9599A4] leading-relaxed">
              Track focus: <span className="text-[#C4C7D2]">{currentTrack.marketFocus}</span>. 
              {graphResult.evidencedSkillsCount} of {graphResult.totalTrackSkillsCount} core competencies have verified project evidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('roadmap')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-900/30"
            >
              <span>Resume Active Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenProfile}
              className="px-3 py-2.5 bg-[#18191E] hover:bg-[#202228] text-[#C4C7D0] border border-[#292D36] rounded-lg text-xs font-medium transition-colors"
            >
              Reassess Profile
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Derived Progress Metric Cards (Real Computed Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Track Competency Match */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="flex items-center justify-between text-[#8E9099] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Track Readiness</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {graphResult.readinessPercentage}%
          </div>
          <div className="w-full bg-[#1F2128] h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${graphResult.readinessPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-[#71717A] mt-2">
            Weighted across {graphResult.totalTrackSkillsCount} required track competencies
          </p>
        </div>

        {/* Roadmap Task Progress */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="flex items-center justify-between text-[#8E9099] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Roadmap Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {completedTasks.length} <span className="text-xs font-normal text-[#71717A]">/ {tasks.length}</span>
          </div>
          <div className="w-full bg-[#1F2128] h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[10px] text-[#71717A] mt-2">
            {remainingTasks.length} milestone modules remaining
          </p>
        </div>

        {/* Remaining Effort */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="flex items-center justify-between text-[#8E9099] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Remaining Effort</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {totalRemainingHours} <span className="text-xs font-normal text-[#71717A]">hours</span>
          </div>
          <div className="text-[11px] text-amber-400 mt-2 font-mono">
            ~{estimatedWeeksLeft} weeks at {profile.weeklyHoursBudget}h/wk
          </div>
          <p className="text-[10px] text-[#71717A] mt-1">
            Adapts automatically as tasks are completed
          </p>
        </div>

        {/* Evidenced Skills */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="flex items-center justify-between text-[#8E9099] mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider">Evidenced Skills</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {graphResult.evidencedSkillsCount} <span className="text-xs font-normal text-[#71717A]">skills</span>
          </div>
          <p className="text-[11px] text-teal-400 mt-2">
            Backed by projects or code repos
          </p>
          <p className="text-[10px] text-[#71717A] mt-1">
            Zero reliance on empty self-claims
          </p>
        </div>
      </div>

      {/* 3. Recommended Next Step & Active Project Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Next Action Card (High Priority) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-4">
          <div className="flex items-center justify-between border-b border-[#212328] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                Recommended Immediate Next Action
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#71717A]">Highest Impact</span>
          </div>

          {nextActionTask ? (
            <div className="p-4 rounded-lg bg-[#17191E] border border-[#272A33] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202229] text-indigo-400">
                    {nextActionTask.category}
                  </span>
                  <h4 className="text-base font-semibold text-white mt-1.5">
                    {nextActionTask.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-[#8E9099] bg-[#121316] px-2 py-1 rounded shrink-0">
                  {nextActionTask.estimatedHours} hrs
                </span>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                <strong className="text-white">Objective: </strong>{nextActionTask.objective}
              </p>

              <div className="p-3 bg-[#111215] border border-[#212328] rounded text-xs text-[#C4C7D0]">
                <strong className="text-amber-400">Deliverable Exercise: </strong>
                {nextActionTask.practicalExercise}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onToggleTask(nextActionTask.id)}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Task Complete
                </button>
                <button
                  onClick={() => onNavigate('roadmap')}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  Open in Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#71717A]">
              All roadmap milestones completed! Reassess profile or explore advanced projects.
            </div>
          )}
        </div>

        {/* Active Project Card */}
        <div className="p-5 rounded-xl bg-[#131417] border border-[#212328] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#212328] pb-3 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Active Portfolio Project
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                In Progress
              </span>
            </div>

            <h4 className="text-sm font-semibold text-white mb-1">
              {activeProject.title}
            </h4>
            <p className="text-xs text-[#8E9099] line-clamp-3 leading-relaxed mb-3">
              {activeProject.problemStatement}
            </p>

            <div className="space-y-1.5 mb-4">
              <div className="text-[11px] font-mono text-[#71717A] uppercase">Active Milestone</div>
              <div className="p-2.5 rounded bg-[#17191E] border border-[#252830] text-xs text-amber-300 font-medium">
                {activeProject.milestones[0]?.title || 'System Core Architecture'}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {activeProject.techStack.map((tech, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1E23] text-[#A1A1AA]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-[#212328] pt-3 flex items-center justify-between">
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              View Project Lab <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {activeProject.githubUrl && (
              <button
                onClick={() => onNavigate('github')}
                className="text-xs font-mono text-[#8E9099] hover:text-white"
                title="Inspect repository"
              >
                Inspect Repo
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Quick Gateway Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigate('skills')}
          className="p-4 rounded-xl bg-[#131417] border border-[#212328] hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
              <GitFork className="w-4 h-4 text-indigo-400" />
              Skill Intelligence Graph
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-indigo-400 transition-colors" />
          </div>
          <p className="text-xs text-[#71717A]">
            Inspect topological prerequisite trees, unlock locked modules, and see why each skill matters.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('resume')}
          className="p-4 rounded-xl bg-[#131417] border border-[#212328] hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              Resume vs Job Description Gap
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-teal-400 transition-colors" />
          </div>
          <p className="text-xs text-[#71717A]">
            Scan your resume against real target postings with zero retention and evidence checks.
          </p>
        </div>

        <div 
          onClick={() => onNavigate('interview')}
          className="p-4 rounded-xl bg-[#131417] border border-[#212328] hover:border-indigo-500/50 cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              Technical Interview Studio
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#52525B] group-hover:text-amber-400 transition-colors" />
          </div>
          <p className="text-xs text-[#71717A]">
            Rehearse core engineering questions with rubric evaluations, key concepts, and revision notes.
          </p>
        </div>
      </div>
    </div>
  );
};
