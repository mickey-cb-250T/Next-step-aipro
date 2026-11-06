import React from 'react';
import { Download, RotateCcw, UserCheck, Menu, Clock, Target } from 'lucide-react';
import { UserProfile } from '../../types';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  profile: UserProfile;
  onOpenProfile: () => void;
  onExportData: () => void;
  onResetData: () => void;
  onToggleMobileNav: () => void;
  completedTasksCount: number;
  totalTasksCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  profile,
  onOpenProfile,
  onExportData,
  onResetData,
  onToggleMobileNav,
  completedTasksCount,
  totalTasksCount
}) => {
  const getTabTitle = (tab: NavTab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Career Intelligence Command Center', desc: 'Real-time readiness metrics, next milestone, and verified competency.' };
      case 'skills':
        return { title: 'Topological Skill Graph (DAG)', desc: 'Interactive dependency tree mapping prerequisite progressions to target roles.' };
      case 'roadmap':
        return { title: 'Adaptive Learning Roadmap', desc: 'Personalized engineering curriculum with practical exercises and effort tracking.' };
      case 'projects':
        return { title: 'Portfolio Project Laboratory', desc: 'Curated and custom production-grade projects demonstrating real architectural depth.' };
      case 'resume':
        return { title: 'Resume & Job-Description Gap Analyzer', desc: 'Objective evidence matching vs target job specs with zero permanent retention.' };
      case 'github':
        return { title: 'Public GitHub Portfolio Inspector', desc: 'Audits README quality, test coverage, CI workflows, and code organization.' };
      case 'interview':
        return { title: 'Technical Interview Practice Studio', desc: 'Interactive rubric evaluation with expected concepts and revision guidance.' };
    }
  };

  const { title, desc } = getTabTitle(currentTab);

  return (
    <header className="border-b border-[#212328] bg-[#0E0F12]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-lg bg-[#18191D] text-[#A1A1AA] hover:text-white"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-[#7E828D] hidden sm:block">{desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick status pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#141518] border border-[#22242A] text-xs font-mono text-[#8E9099]">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Target className="w-3.5 h-3.5" />
            <span>{completedTasksCount}/{totalTasksCount} tasks</span>
          </span>
          <span className="text-[#3F424E]">|</span>
          <span className="flex items-center gap-1.5 text-[#A1A1AA]">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{profile.weeklyHoursBudget}h/wk</span>
          </span>
        </div>

        {/* Profile / Onboarding trigger */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-sm"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Profile & Assessment</span>
          <span className="sm:hidden">Profile</span>
        </button>

        {/* Export JSON */}
        <button
          onClick={onExportData}
          title="Export complete portfolio & progress data as JSON"
          className="p-2 text-xs font-medium rounded-lg bg-[#18191D] border border-[#26282E] text-[#A1A1AA] hover:text-white hover:bg-[#202227] transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Reset */}
        <button
          onClick={onResetData}
          title="Reset to fresh default baseline"
          className="p-2 text-xs font-medium rounded-lg bg-[#18191D] border border-[#26282E] text-[#71717A] hover:text-amber-400 hover:bg-[#202227] transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
