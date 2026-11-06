import { UserProfile, RoadmapTask, ProjectRecommendation, ResumeAnalysisResult, InterviewEvaluationResult } from '../types';
import { DEFAULT_USER_PROFILE, CURATED_PROJECTS } from '../data/seedData';
import { RoadmapEngine } from './roadmapEngine';

const STORAGE_KEYS = {
  PROFILE: 'nextstep_user_profile_v1',
  ROADMAP: 'nextstep_roadmap_tasks_v1',
  PROJECTS: 'nextstep_user_projects_v1',
  RESUME_ANALYSES: 'nextstep_resume_analyses_v1',
  INTERVIEW_SESSIONS: 'nextstep_interview_sessions_v1',
  DEMO_MODE: 'nextstep_demo_mode_v1'
};

export class AppStorage {
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    // Initialise with default profile
    this.saveProfile(DEFAULT_USER_PROFILE);
    return DEFAULT_USER_PROFILE;
  }

  static saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  static getRoadmapTasks(): RoadmapTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ROADMAP);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    const profile = this.getProfile();
    const initialTasks = RoadmapEngine.generateOrAdaptRoadmap(profile);
    this.saveRoadmapTasks(initialTasks);
    return initialTasks;
  }

  static saveRoadmapTasks(tasks: RoadmapTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROADMAP, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  static getProjects(): ProjectRecommendation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    this.saveProjects(CURATED_PROJECTS);
    return CURATED_PROJECTS;
  }

  static saveProjects(projects: ProjectRecommendation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  static getResumeAnalyses(): ResumeAnalysisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUME_ANALYSES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    return [];
  }

  static saveResumeAnalysis(analysis: ResumeAnalysisResult): void {
    try {
      const existing = this.getResumeAnalyses();
      const updated = [analysis, ...existing.slice(0, 9)];
      localStorage.setItem(STORAGE_KEYS.RESUME_ANALYSES, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  static clearResumeAnalyses(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.RESUME_ANALYSES);
    } catch (e) {
      console.warn('Storage clear failed:', e);
    }
  }

  static getInterviewHistory(): Array<{
    questionId: string;
    questionTitle: string;
    category: string;
    userAnswer: string;
    result: InterviewEvaluationResult;
    timestamp: string;
  }> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.INTERVIEW_SESSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed:', e);
    }
    return [];
  }

  static recordInterviewSession(session: {
    questionId: string;
    questionTitle: string;
    category: string;
    userAnswer: string;
    result: InterviewEvaluationResult;
    timestamp: string;
  }): void {
    try {
      const history = this.getInterviewHistory();
      localStorage.setItem(STORAGE_KEYS.INTERVIEW_SESSIONS, JSON.stringify([session, ...history.slice(0, 19)]));
    } catch (e) {
      console.warn('Storage write failed:', e);
    }
  }

  static resetAllData(): void {
    try {
      localStorage.clear();
      this.saveProfile(DEFAULT_USER_PROFILE);
      const initialTasks = RoadmapEngine.generateOrAdaptRoadmap(DEFAULT_USER_PROFILE);
      this.saveRoadmapTasks(initialTasks);
      this.saveProjects(CURATED_PROJECTS);
    } catch (e) {
      console.warn('Storage reset failed:', e);
    }
  }

  static exportFullBackup(): string {
    const backup = {
      profile: this.getProfile(),
      roadmap: this.getRoadmapTasks(),
      projects: this.getProjects(),
      interviewHistory: this.getInterviewHistory(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(backup, null, 2);
  }

  static importBackup(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (parsed.roadmap) this.saveRoadmapTasks(parsed.roadmap);
      if (parsed.projects) this.saveProjects(parsed.projects);
      return true;
    } catch (e) {
      console.error('Failed to import backup:', e);
      return false;
    }
  }
}
