/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { SkillGraphView } from './components/skills/SkillGraphView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ProjectsView } from './components/projects/ProjectsView';
import { ResumeAnalyzerView } from './components/resume/ResumeAnalyzerView';
import { GitHubAnalyzerView } from './components/portfolio/GitHubAnalyzerView';
import { InterviewStudioView } from './components/interview/InterviewStudioView';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { UserProfile, RoadmapTask, ProjectRecommendation } from './types';
import { AppStorage } from './lib/storage';
import { RoadmapEngine } from './lib/roadmapEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [profile, setProfile] = useState<UserProfile>(() => AppStorage.getProfile());
  const [tasks, setTasks] = useState<RoadmapTask[]>(() => AppStorage.getRoadmapTasks());
  const [projects, setProjects] = useState<ProjectRecommendation[]>(() => AppStorage.getProjects());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAiAvailable, setIsAiAvailable] = useState(false);
  const [repoForAudit, setRepoForAudit] = useState<string>('https://github.com/developer/distributed-rate-limiter');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check backend AI availability on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setIsAiAvailable(Boolean(data.aiAvailable));
      })
      .catch(() => {
        setIsAiAvailable(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Task toggle handler
  const handleToggleTask = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? ('not_started' as const) : ('completed' as const);
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      AppStorage.saveRoadmapTasks(updated);
      return updated;
    });
  };

  // 2. Skill level change
  const handleUpdateSkillLevel = (skillId: string, level: number) => {
    const updatedProfile: UserProfile = {
      ...profile,
      skills: {
        ...profile.skills,
        [skillId]: {
          skillId,
          selfReportedLevel: level,
          verifiedLevel: profile.skills[skillId]?.verifiedLevel || 0,
          evidenceType: profile.skills[skillId]?.evidenceType || 'none',
          notes: profile.skills[skillId]?.notes || '',
          updatedAt: new Date().toISOString(),
        },
      },
    };
    setProfile(updatedProfile);
    AppStorage.saveProfile(updatedProfile);
    showToast(`Updated skill level to ${level}/5`);
  };

  // 3. Regenerate / adapt remaining roadmap
  const handleRegenerateRoadmap = () => {
    const updatedTasks = RoadmapEngine.generateOrAdaptRoadmap(profile, tasks);
    setTasks(updatedTasks);
    AppStorage.saveRoadmapTasks(updatedTasks);
    showToast('Roadmap adapted to latest competencies (completed tasks preserved).');
  };

  // 4. Update weekly budget
  const handleUpdateWeeklyBudget = (hours: number) => {
    const updatedProfile: UserProfile = {
      ...profile,
      weeklyHoursBudget: hours,
    };
    setProfile(updatedProfile);
    AppStorage.saveProfile(updatedProfile);
    showToast(`Updated weekly study commitment to ${hours} hrs/week.`);
  };

  // 5. Update projects list
  const handleUpdateProjects = (newProjects: ProjectRecommendation[]) => {
    setProjects(newProjects);
    AppStorage.saveProjects(newProjects);
  };

  // 6. Save from Onboarding Modal
  const handleSaveProfileFromModal = (newProfile: UserProfile) => {
    setProfile(newProfile);
    AppStorage.saveProfile(newProfile);
    // Adapt roadmap
    const newTasks = RoadmapEngine.generateOrAdaptRoadmap(newProfile, tasks);
    setTasks(newTasks);
    AppStorage.saveRoadmapTasks(newTasks);
    showToast('Career profile and roadmap updated successfully!');
  };

  // 7. Export backup JSON
  const handleExportData = () => {
    const jsonStr = AppStorage.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NextStep-AI-Pro-Portfolio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Portfolio and progress data exported.');
  };

  // 8. Reset data
  const handleResetData = () => {
    if (window.confirm('Reset all progress, tasks, and profile back to the pristine default state?')) {
      AppStorage.resetAllData();
      const freshProfile = AppStorage.getProfile();
      const freshTasks = AppStorage.getRoadmapTasks();
      const freshProjects = AppStorage.getProjects();
      setProfile(freshProfile);
      setTasks(freshTasks);
      setProjects(freshProjects);
      showToast('Reset to default seed state.');
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="flex h-screen bg-[#0C0D0E] text-[#E4E4E7] overflow-hidden selection:bg-indigo-500/30">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#16181F] text-white border border-indigo-500/50 px-4 py-2.5 rounded-lg text-xs font-medium shadow-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          profile={profile}
          onOpenProfile={() => setIsOnboardingOpen(true)}
          isAiAvailable={isAiAvailable}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Mobile Drawer */}
      {isMobileNavOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-72 md:hidden">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={(tab) => {
              setCurrentTab(tab);
              setIsMobileNavOpen(false);
            }}
            profile={profile}
            onOpenProfile={() => {
              setIsOnboardingOpen(true);
              setIsMobileNavOpen(false);
            }}
            isAiAvailable={isAiAvailable}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          currentTab={currentTab}
          profile={profile}
          onOpenProfile={() => setIsOnboardingOpen(true)}
          onExportData={handleExportData}
          onResetData={handleResetData}
          onToggleMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
          completedTasksCount={completedCount}
          totalTasksCount={tasks.length}
        />

        <main className="flex-1 p-5 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              tasks={tasks}
              projects={projects}
              onNavigate={setCurrentTab}
              onOpenProfile={() => setIsOnboardingOpen(true)}
              onToggleTask={handleToggleTask}
            />
          )}

          {currentTab === 'skills' && (
            <SkillGraphView
              profile={profile}
              onUpdateSkillLevel={handleUpdateSkillLevel}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'roadmap' && (
            <RoadmapView
              tasks={tasks}
              profile={profile}
              onToggleTask={handleToggleTask}
              onRegenerateRoadmap={handleRegenerateRoadmap}
              onUpdateWeeklyBudget={handleUpdateWeeklyBudget}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              profile={profile}
              onUpdateProjects={handleUpdateProjects}
              onNavigate={setCurrentTab}
              onSelectRepoForAudit={(url) => setRepoForAudit(url)}
            />
          )}

          {currentTab === 'resume' && (
            <ResumeAnalyzerView
              profile={profile}
              onNavigate={setCurrentTab}
            />
          )}

          {currentTab === 'github' && (
            <GitHubAnalyzerView
              initialRepoUrl={repoForAudit}
              profile={profile}
            />
          )}

          {currentTab === 'interview' && (
            <InterviewStudioView
              profile={profile}
              onNavigate={setCurrentTab}
            />
          )}
        </main>
      </div>

      {/* Onboarding & Career Diagnostic Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onSaveProfile={handleSaveProfileFromModal}
      />
    </div>
  );
}
