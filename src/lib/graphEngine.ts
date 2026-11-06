import { Skill, SkillPrerequisite, UserProfile, ComputedSkillNode, SkillNodeStatus } from '../types';
import { SKILLS_CATALOG, SKILL_PREREQUISITES, CAREER_TRACKS } from '../data/seedData';

export interface GraphEdge {
  from: string;
  to: string;
  isSatisfied: boolean;
}

export interface GraphComputationResult {
  nodes: ComputedSkillNode[];
  edges: GraphEdge[];
  maxDepth: number;
  readinessPercentage: number;
  evidencedSkillsCount: number;
  totalTrackSkillsCount: number;
}

export class SkillGraphEngine {
  /**
   * Computes topologically-layered skill nodes with accurate status (locked, ready, in_progress, mastered)
   */
  static computeGraph(profile: UserProfile): GraphComputationResult {
    const track = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];
    const trackCoreSkills = new Set(track.coreSkills);

    // Build map of prerequisites per skill
    const prereqMap = new Map<string, string[]>();
    SKILLS_CATALOG.forEach(s => prereqMap.set(s.id, []));
    SKILL_PREREQUISITES.forEach(p => {
      const list = prereqMap.get(p.skillId) || [];
      list.push(p.prerequisiteId);
      prereqMap.set(p.skillId, list);
    });

    // Memoize depth calculations to avoid cyclic overflow
    const memoDepth = new Map<string, number>();
    const computeDepth = (skillId: string, visited: Set<string>): number => {
      if (memoDepth.has(skillId)) return memoDepth.get(skillId)!;
      if (visited.has(skillId)) return 0;
      visited.add(skillId);

      const parents = prereqMap.get(skillId) || [];
      if (parents.length === 0) {
        memoDepth.set(skillId, 0);
        return 0;
      }

      let maxP = 0;
      for (const p of parents) {
        maxP = Math.max(maxP, computeDepth(p, new Set(visited)) + 1);
      }
      memoDepth.set(skillId, maxP);
      return maxP;
    };

    let maxDepth = 0;
    SKILLS_CATALOG.forEach(s => {
      const d = computeDepth(s.id, new Set());
      if (d > maxDepth) maxDepth = d;
    });

    let totalTargetSum = 0;
    let userAchievedSum = 0;
    let evidencedCount = 0;

    const nodes: ComputedSkillNode[] = SKILLS_CATALOG.map(skill => {
      const parents = prereqMap.get(skill.id) || [];
      const userAssessment = profile.skills[skill.id];
      const selfLevel = userAssessment?.selfReportedLevel || 0;
      const verifiedLevel = userAssessment?.verifiedLevel || 0;
      const effectiveLevel = Math.max(selfLevel, verifiedLevel);

      const isCore = trackCoreSkills.has(skill.id);
      const targetLevel = isCore ? 4 : 3;

      if (isCore) {
        totalTargetSum += targetLevel;
        userAchievedSum += Math.min(effectiveLevel, targetLevel);
        if (verifiedLevel >= 2) evidencedCount++;
      }

      // Status determination
      let status: SkillNodeStatus = 'locked';
      if (effectiveLevel >= targetLevel) {
        status = 'mastered';
      } else if (effectiveLevel > 0) {
        status = 'in_progress';
      } else {
        // Ready if all required parents have effectiveLevel >= 3
        const parentsSatisfied = parents.every(pId => {
          const pAssessment = profile.skills[pId];
          const pLevel = Math.max(pAssessment?.selfReportedLevel || 0, pAssessment?.verifiedLevel || 0);
          return pLevel >= 3;
        });
        status = parentsSatisfied ? 'ready' : 'locked';
      }

      return {
        ...skill,
        prerequisites: parents,
        status,
        userLevel: effectiveLevel,
        targetLevel,
        depth: memoDepth.get(skill.id) || 0,
        verifiedEvidence: userAssessment?.notes
      };
    });

    const edges: GraphEdge[] = SKILL_PREREQUISITES.map(p => {
      const parentAssessment = profile.skills[p.prerequisiteId];
      const parentLevel = Math.max(parentAssessment?.selfReportedLevel || 0, parentAssessment?.verifiedLevel || 0);
      return {
        from: p.prerequisiteId,
        to: p.skillId,
        isSatisfied: parentLevel >= 3
      };
    });

    const readinessPercentage = totalTargetSum > 0 
      ? Math.round((userAchievedSum / totalTargetSum) * 100) 
      : 0;

    return {
      nodes,
      edges,
      maxDepth,
      readinessPercentage,
      evidencedSkillsCount: evidencedCount,
      totalTrackSkillsCount: track.coreSkills.length
    };
  }
}
