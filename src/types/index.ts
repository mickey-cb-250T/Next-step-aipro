/**
 * NextStep AI Pro - Domain Types
 */

export type CareerTrackId = 
  | 'fullstack-dev'
  | 'backend-dev'
  | 'frontend-dev'
  | 'data-analytics'
  | 'ml-ai-engineering';

export interface CareerTrack {
  id: CareerTrackId;
  name: string;
  description: string;
  marketFocus: string;
  recommendedWeeklyHours: number;
  averageWeeksToReadiness: number;
  coreSkills: string[];
}

export type SkillCategory = 'Core' | 'Backend' | 'Frontend' | 'Databases' | 'DevOps' | 'AI/Data' | 'Architecture' | 'Quality';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  importance: 1 | 2 | 3 | 4 | 5; // 1 to 5
  estimatedHours: number;
}

export interface SkillPrerequisite {
  skillId: string;
  prerequisiteId: string;
  strength: 'required' | 'recommended';
}

export type SkillNodeStatus = 'mastered' | 'in_progress' | 'ready' | 'locked';

export interface ComputedSkillNode extends Skill {
  prerequisites: string[];
  status: SkillNodeStatus;
  userLevel: number; // 0 to 5
  targetLevel: number;
  depth: number;
  verifiedEvidence?: string;
}

export interface UserSkillAssessment {
  skillId: string;
  selfReportedLevel: number; // 0 (None) to 5 (Expert)
  verifiedLevel: number;
  evidenceType?: 'project_repo' | 'interview_quiz' | 'resume_scan' | 'none';
  notes?: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  educationLevel: string;
  degreeMajor: string;
  careerTrackId: CareerTrackId;
  targetRole: string;
  weeklyHoursBudget: number;
  preparationTimelineWeeks: number;
  learningStyle: 'hands-on-projects' | 'systematic-depth' | 'interview-sprint';
  skills: Record<string, UserSkillAssessment>;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapTask {
  id: string;
  skillId?: string;
  title: string;
  category: string;
  objective: string;
  practicalExercise: string;
  estimatedHours: number;
  sequenceOrder: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  completionCriteria: string;
  resourceUrls: { label: string; url: string }[];
  relatedProjectId?: string;
  completedAt?: string;
}

export interface ProjectMilestone {
  title: string;
  target: string;
  hours: number;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  careerTrackId: CareerTrackId;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  problemStatement: string;
  whyItMatters: string;
  techStack: string[];
  milestones: ProjectMilestone[];
  testingRequirements: string;
  deliverables: string[];
  developedSkills: string[];
  githubUrl?: string;
  status?: 'saved' | 'in_progress' | 'completed';
}

export interface ResumeAnalysisResult {
  targetRoleTitle: string;
  matchedSkills: Array<{
    skill: string;
    evidenceContext: string;
    strength: 'strong' | 'moderate' | 'surface_mention';
  }>;
  unmentionedJobSkills: Array<{
    skill: string;
    importanceInJob: 'critical' | 'beneficial';
    recommendedAction: string;
  }>;
  presentationCritiques: string[];
  recommendedBridgeProjects: string[];
  analyzedAt: string;
  isAiGenerated: boolean;
}

export interface GitHubAuditResult {
  repoName: string;
  owner: string;
  isAccessible: boolean;
  readmeAnalysis: {
    exists: boolean;
    hasSetupInstructions: boolean;
    hasArchitectureSummary: boolean;
    wordCount: number;
    feedback: string[];
  };
  codeQualitySignals: {
    hasTestsDirectory: boolean;
    hasCiWorkflow: boolean;
    hasPackageManifest: boolean;
    detectedStack: string[];
    potentialConcerns: string[];
  };
  actionableCommits: Array<{
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    rationale: string;
  }>;
  summary: string;
  auditedAt: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  question: string;
  keyConcepts: string[];
  sampleModelAnswer: string;
  relatedSkillId: string;
}

export interface InterviewEvaluationResult {
  scoreSummary: string;
  scorePercentage: number;
  coveredConcepts: string[];
  missingConcepts: string[];
  strengths: string[];
  improvementNote: string;
  suggestedRevisionTopics: string[];
  isAiGenerated: boolean;
}
