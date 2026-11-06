import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Hammer,
  RotateCw,
  FolderGit2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { RoadmapTask, UserProfile } from '../../types';
import { CURATED_PROJECTS } from '../../data/seedData';
import { NavTab } from '../navigation/Sidebar';

interface RoadmapViewProps {
  tasks: RoadmapTask[];
  profile: UserProfile;
  onToggleTask: (taskId: string) => void;
  onRegenerateRoadmap: () => void;
  onUpdateWeeklyBudget: (hours: number) => void;
  onNavigate: (tab: NavTab) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  tasks,
  profile,
  onToggleTask,
  onRegenerateRoadmap,
  onUpdateWeeklyBudget,
  onNavigate,
}) => {
  const [filter, setFilter] = useState<'all' | 'remaining' | 'completed'>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const remainingTasks = tasks.filter(t => t.status !== 'completed');

  const totalEffortHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const remainingHours = remainingTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
  const estimatedWeeksLeft = Math.ceil(remainingHours / (profile.weeklyHoursBudget || 10));

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'remaining') return task.status !== 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Velocity & Timeline Calculation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Milestone Completion Status */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="text-[11px] font-mono uppercase text-[#8E9099] mb-1">
            Milestones Completed
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>{completedTasks.length}</span>
            <span className="text-xs text-[#71717A] font-normal">/ {tasks.length} total tasks</span>
          </div>
          <div className="w-full bg-[#1F2128] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%` }}
            />
          </div>
        </div>

        {/* Remaining Effort */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="text-[11px] font-mono uppercase text-[#8E9099] mb-1">
            Total Remaining Effort
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
            <span>{remainingHours}</span>
            <span className="text-xs text-[#71717A] font-normal">hours remaining</span>
          </div>
          <p className="text-[11px] text-[#71717A] mt-2">
            Out of {totalEffortHours} total estimated roadmap hours
          </p>
        </div>

        {/* Projected Readiness Timeline */}
        <div className="p-4 rounded-xl bg-[#131417] border border-[#212328]">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#8E9099] mb-1">
            <span>Target Timeline</span>
            <span className="text-indigo-400 font-bold">{profile.weeklyHoursBudget}h / wk</span>
          </div>
          <div className="text-2xl font-bold text-indigo-400 flex items-baseline gap-1.5">
            <span>~{estimatedWeeksLeft}</span>
            <span className="text-xs text-[#71717A] font-normal">weeks to readiness</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-[#71717A]">Adjust pace:</span>
            {[8, 12, 20].map(h => (
              <button
                key={h}
                onClick={() => onUpdateWeeklyBudget(h)}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                  profile.weeklyHoursBudget === h
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#1C1E23] text-[#8E9099] hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Control bar: Filters & Regenerate Future Tasks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#131417] border border-[#212328]">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#71717A] mr-1" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filter === 'all' ? 'bg-[#21232A] text-white font-medium' : 'text-[#8E9099] hover:text-white'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('remaining')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filter === 'remaining' ? 'bg-[#21232A] text-white font-medium' : 'text-[#8E9099] hover:text-white'
            }`}
          >
            In Progress & Up Next ({remainingTasks.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
              filter === 'completed' ? 'bg-[#21232A] text-white font-medium' : 'text-[#8E9099] hover:text-white'
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>

        <button
          onClick={onRegenerateRoadmap}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#18191E] border border-[#282B33] text-[#C4C7D0] hover:text-white hover:bg-[#202228] transition-colors self-start sm:self-auto"
          title="Recalculates subsequent roadmap tasks based on current skill assessments while strictly preserving completed milestones"
        >
          <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
          <span>Sync & Adapt Remaining Modules</span>
        </button>
      </div>

      {/* Sequential Task List */}
      <div className="space-y-3.5">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#71717A] bg-[#121316] rounded-xl border border-[#212328]">
            No roadmap tasks matching current filter.
          </div>
        ) : (
          filteredTasks.map((task, index) => {
            const isDone = task.status === 'completed';
            const isExpanded = expandedTaskId === task.id;
            const relatedProject = task.relatedProjectId
              ? CURATED_PROJECTS.find(p => p.id === task.relatedProjectId)
              : null;

            return (
              <div
                key={task.id}
                className={`rounded-xl border transition-all ${
                  isDone
                    ? 'bg-[#101114] border-[#1D1F24] opacity-70'
                    : 'bg-[#131417] border-[#23262E] hover:border-[#353945]'
                }`}
              >
                {/* Main Card Header */}
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-[#52525B] hover:text-emerald-400 transition-colors shrink-0"
                      aria-label={`Toggle completion of ${task.title}`}
                    >
                      <CheckCircle2
                        className={`w-5 h-5 ${isDone ? 'text-emerald-500 fill-emerald-950/40' : 'text-[#3E424D]'}`}
                      />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-[#71717A]">
                          #{task.sequenceOrder || index + 1}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#1B1D23] text-indigo-300 border border-[#262932]">
                          {task.category}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                            Completed
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-[#71717A]' : 'text-white'}`}>
                        {task.title}
                      </h4>

                      <p className="text-xs text-[#8E9099] mt-1 line-clamp-2 leading-relaxed">
                        {task.objective}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-mono text-[#8E9099] bg-[#17191E] px-2.5 py-1 rounded border border-[#252830] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {task.estimatedHours}h
                    </span>
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="p-1 rounded text-[#71717A] hover:text-white"
                      aria-label="Toggle task details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Pane */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#1F2128] space-y-3 text-xs bg-[#111215]/50 rounded-b-xl">
                    {/* Practical Exercise Box */}
                    <div className="p-3 bg-[#16171C] border border-[#252830] rounded-lg">
                      <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-1">
                        <Hammer className="w-3.5 h-3.5" />
                        Practical Hands-On Deliverable
                      </div>
                      <p className="text-[#C4C7D2] leading-relaxed">
                        {task.practicalExercise}
                      </p>
                    </div>

                    {/* Completion Criteria */}
                    <div className="text-[#A1A1AA]">
                      <strong className="text-white">Completion Criteria: </strong>
                      {task.completionCriteria}
                    </div>

                    {/* Related Project Bridge */}
                    {relatedProject && (
                      <div className="flex items-center justify-between p-2.5 rounded bg-[#17181F] border border-indigo-900/30">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-indigo-400" />
                          <span className="text-white font-medium">Applied in Project: {relatedProject.title}</span>
                        </div>
                        <button
                          onClick={() => onNavigate('projects')}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          View Project <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
