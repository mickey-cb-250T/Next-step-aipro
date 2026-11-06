import React, { useState } from 'react';
import {
  FolderGit2,
  GitBranch,
  CheckCircle2,
  ExternalLink,
  Plus,
  PlayCircle,
  Bookmark,
  Github,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Hammer,
  Search,
  Check
} from 'lucide-react';
import { ProjectRecommendation, UserProfile } from '../../types';
import { NavTab } from '../navigation/Sidebar';

interface ProjectsViewProps {
  projects: ProjectRecommendation[];
  profile: UserProfile;
  onUpdateProjects: (projects: ProjectRecommendation[]) => void;
  onNavigate: (tab: NavTab) => void;
  onSelectRepoForAudit: (repoUrl: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  profile,
  onUpdateProjects,
  onNavigate,
  onSelectRepoForAudit,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectRecommendation | null>(null);
  const [editingRepoId, setEditingRepoId] = useState<string | null>(null);
  const [repoInput, setRepoInput] = useState('');

  const filteredProjects = projects.filter(p => {
    const matchesDiff = selectedDifficulty === 'all' || p.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.problemStatement.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDiff && matchesSearch;
  });

  const handleSetActive = (projectId: string) => {
    const updated = projects.map(p => ({
      ...p,
      status: p.id === projectId ? ('in_progress' as const) : (p.status === 'in_progress' ? 'saved' as const : p.status)
    }));
    onUpdateProjects(updated);
  };

  const handleToggleSave = (projectId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          status: p.status === 'saved' ? undefined : ('saved' as const)
        };
      }
      return p;
    });
    onUpdateProjects(updated);
  };

  const handleSaveRepoUrl = (projectId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, githubUrl: repoInput.trim() };
      }
      return p;
    });
    onUpdateProjects(updated);
    setEditingRepoId(null);
    setRepoInput('');
  };

  const handleInspectRepo = (url: string) => {
    onSelectRepoForAudit(url);
    onNavigate('github');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#131417] border border-[#212328]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search projects & stacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191E] border border-[#282B33] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {['all', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-[#18191E] text-[#8E9099] hover:text-white'
                }`}
              >
                {diff === 'all' ? 'All Difficulties' : diff}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[#71717A]">
          Showing {filteredProjects.length} production portfolio architectures
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map(proj => {
          const isActive = proj.status === 'in_progress';
          const isSaved = proj.status === 'saved';

          return (
            <div
              key={proj.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-[#14161E] border-indigo-500/50 shadow-md shadow-indigo-950/20'
                  : 'bg-[#131417] border-[#22242B] hover:border-[#353945]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B1D23] text-indigo-400 font-semibold border border-[#272A34]">
                      {proj.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      proj.difficulty === 'Advanced' ? 'bg-purple-950/40 text-purple-300 border border-purple-800/40' :
                      proj.difficulty === 'Intermediate' ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40' :
                      'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                    }`}>
                      {proj.difficulty}
                    </span>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 font-semibold">
                      Active Target
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {proj.title}
                </h3>

                <p className="text-xs text-[#8E9099] leading-relaxed mb-3">
                  {proj.problemStatement}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {proj.techStack.map((t, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1C22] text-[#A1A1AA]">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Why It Matters */}
                <div className="p-3 rounded-lg bg-[#111215] border border-[#212328] text-xs text-[#C4C7D0] mb-4">
                  <strong className="text-white">Why Hiring Managers Care: </strong>
                  {proj.whyItMatters}
                </div>

                {/* GitHub Repo Attachment */}
                <div className="pt-2 border-t border-[#1F2128]">
                  {editingRepoId === proj.id ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={repoInput}
                        onChange={e => setRepoInput(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="flex-1 bg-[#18191E] border border-[#282B33] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <button
                        onClick={() => handleSaveRepoUrl(proj.id)}
                        className="px-2.5 py-1 bg-indigo-600 text-white rounded text-xs font-medium hover:bg-indigo-500"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRepoId(null)}
                        className="px-2 py-1 text-xs text-[#71717A] hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : proj.githubUrl ? (
                    <div className="flex items-center justify-between text-xs font-mono text-[#8E9099] mt-2">
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 truncate max-w-[240px]"
                      >
                        <Github className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{proj.githubUrl.replace('https://github.com/', '')}</span>
                      </a>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInspectRepo(proj.githubUrl!)}
                          className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 font-sans"
                        >
                          Run Audit →
                        </button>
                        <button
                          onClick={() => {
                            setEditingRepoId(proj.id);
                            setRepoInput(proj.githubUrl || '');
                          }}
                          className="text-[10px] text-[#71717A] hover:text-white"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingRepoId(proj.id);
                        setRepoInput('');
                      }}
                      className="text-xs text-[#71717A] hover:text-indigo-400 flex items-center gap-1.5 transition-colors mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Attach GitHub Repository Link
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1F2128]">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View Architecture Spec <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleSave(proj.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300' : 'bg-[#18191E] border-[#252830] text-[#71717A] hover:text-white'
                    }`}
                    title={isSaved ? 'Saved in portfolio' : 'Save project'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleSetActive(proj.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isActive ? 'Current Target' : 'Set as Active'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Architectural Specification Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121316] border border-[#25282F] rounded-xl max-w-2xl w-full my-8 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#212328] pb-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase">
                  {selectedProject.difficulty} • {selectedProject.category}
                </span>
                <h2 className="text-lg font-bold text-white mt-1">
                  {selectedProject.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-[#71717A] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="font-semibold text-white uppercase text-[11px] mb-1">
                  Problem Statement & System Purpose
                </div>
                <p className="text-[#A1A1AA] leading-relaxed">
                  {selectedProject.problemStatement}
                </p>
              </div>

              <div>
                <div className="font-semibold text-white uppercase text-[11px] mb-1">
                  Implementation Milestones
                </div>
                <div className="space-y-2">
                  {selectedProject.milestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-[#16171B] border border-[#24262E] flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-white">{m.title}</div>
                        <div className="text-[11px] text-[#8E9099] mt-0.5">{m.target}</div>
                      </div>
                      <span className="text-amber-400 font-mono shrink-0 ml-2">{m.hours}h</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#16171B] border border-[#24262E] rounded-lg">
                <div className="font-semibold text-white uppercase text-[11px] mb-1">
                  Automated Testing Requirements
                </div>
                <p className="text-[#C4C7D0] leading-relaxed">
                  {selectedProject.testingRequirements}
                </p>
              </div>

              <div>
                <div className="font-semibold text-white uppercase text-[11px] mb-1">
                  Expected Portfolio Deliverables
                </div>
                <ul className="space-y-1.5 text-[#A1A1AA]">
                  {selectedProject.deliverables.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#212328] pt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-[#A1A1AA] hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSetActive(selectedProject.id);
                  setSelectedProject(null);
                }}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                Set as Active Portfolio Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
