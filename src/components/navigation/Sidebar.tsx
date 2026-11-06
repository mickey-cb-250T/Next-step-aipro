import React from 'react';
import {
  LayoutDashboard,
  GitFork,
  MapPin,
  FolderGit2,
  FileSearch,
  Github,
  Terminal,
  ShieldCheck,
  Sparkles,
  Settings,
  ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../types';
import { CAREER_TRACKS } from '../../data/seedData';

export type NavTab = 
  | 'dashboard' 
  | 'skills' 
  | 'roadmap' 
  | 'projects' 
  | 'resume' 
  | 'github' 
  | 'interview';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: UserProfile;
  onOpenProfile: () => void;
  isAiAvailable: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onOpenProfile,
  isAiAvailable,
}) => {
  const currentTrack = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'skills' as NavTab, label: 'Skill Graph', icon: GitFork, badge: 'DAG' },
    { id: 'roadmap' as NavTab, label: 'Adaptive Roadmap', icon: MapPin },
    { id: 'projects' as NavTab, label: 'Project Lab', icon: FolderGit2 },
    { id: 'resume' as NavTab, label: 'Resume & Job Gap', icon: FileSearch },
    { id: 'github' as NavTab, label: 'GitHub Inspector', icon: Github },
    { id: 'interview' as NavTab, label: 'Interview Studio', icon: Terminal },
  ];

  return (
    <aside className="w-64 border-r border-[#212328] bg-[#101114] flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand identity */}
        <div className="p-4 border-b border-[#212328] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-900/30">
              <span className="font-extrabold text-white text-base tracking-tight">N</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white">NextStep</span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 font-mono text-[10px] font-semibold border border-indigo-500/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] tracking-tight">Career Intelligence</p>
            </div>
          </div>
        </div>

        {/* Current Track Summary Badge */}
        <div className="px-3 py-3 mx-3 mt-3 rounded-lg bg-[#16171B] border border-[#26282E]">
          <div className="flex items-center justify-between text-[11px] text-[#8E9099] mb-1 font-mono uppercase">
            <span>Target Track</span>
            <button 
              onClick={onOpenProfile}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Edit Profile"
            >
              Edit
            </button>
          </div>
          <div className="text-xs font-semibold text-white truncate" title={currentTrack.name}>
            {currentTrack.name}
          </div>
          <div className="text-[11px] text-[#71717A] mt-0.5 truncate" title={profile.targetRole}>
            {profile.targetRole}
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/40 font-semibold'
                    : 'text-[#9A9DA6] hover:text-white hover:bg-[#18191D]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-[#71717A]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-[#202228] text-[#A1A1AA] border border-[#2D3038]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & AI Status Card */}
      <div className="p-3 border-t border-[#212328] space-y-2">
        <div className="p-2.5 rounded-lg bg-[#141518] border border-[#22242A]">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-[#8E9099] flex items-center gap-1.5">
              <Sparkles className={`w-3 h-3 ${isAiAvailable ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>Intelligence Mode</span>
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isAiAvailable 
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' 
                : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
            }`}>
              {isAiAvailable ? 'Gemini 3.8' : 'Rules Engine'}
            </span>
          </div>
          <p className="text-[10px] text-[#71717A] leading-tight">
            {isAiAvailable 
              ? 'Real-time structured reasoning active.' 
              : 'Deterministic algorithms active. No mock hallucinations.'}
          </p>
        </div>

        {/* User Card */}
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#18191D] transition-colors text-left"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#252830] border border-[#31353F] flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{profile.fullName}</div>
              <div className="text-[10px] text-[#71717A] truncate">{profile.educationLevel}</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-[#52525B]" />
        </button>
      </div>
    </aside>
  );
};
