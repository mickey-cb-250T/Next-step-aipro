import { RoadmapTask, UserProfile } from '../types';
import { SKILLS_CATALOG, CAREER_TRACKS, CURATED_PROJECTS } from '../data/seedData';
import { SkillGraphEngine } from './graphEngine';

export class RoadmapEngine {
  /**
   * Generates a structured sequence of actionable tasks based on user skill gaps and target track.
   * If existing tasks exist, it preserves their completion status.
   */
  static generateOrAdaptRoadmap(profile: UserProfile, existingTasks: RoadmapTask[] = []): RoadmapTask[] {
    const track = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];
    const graphResult = SkillGraphEngine.computeGraph(profile);
    const existingMap = new Map(existingTasks.map(t => [t.skillId || t.title, t]));

    // Find skills in track that are not yet mastered, ordered by DAG depth then importance
    const unmasteredSkills = graphResult.nodes
      .filter(n => track.coreSkills.includes(n.id))
      .sort((a, b) => {
        if (a.depth !== b.depth) return a.depth - b.depth;
        return b.importance - a.importance;
      });

    const newTasks: RoadmapTask[] = [];
    let sequence = 1;

    unmasteredSkills.forEach(node => {
      const existing = existingMap.get(node.id);
      if (existing) {
        newTasks.push({
          ...existing,
          sequenceOrder: sequence++
        });
        return;
      }

      // Generate task based on skill
      const relatedProject = CURATED_PROJECTS.find(p => p.developedSkills.includes(node.id));

      let practicalExercise = `Implement a focused mini-module applying ${node.name} concepts and write automated unit tests.`;
      let objective = `Master fundamental principles of ${node.name} and apply them to production architectures.`;

      if (node.id === 'sql-relational-db') {
        objective = 'Design normalized 3NF schemas, foreign key constraints, and multi-table analytical joins.';
        practicalExercise = 'Write PostgreSQL migration scripts for an e-commerce order system with indexes and transaction rollbacks.';
      } else if (node.id === 'rest-api-design') {
        objective = 'Engineer scalable REST endpoints with idempotency, input validation, and HTTP 429 rate limit contracts.';
        practicalExercise = 'Build an Express/Fastify service with token-bucket rate limiting and structured error responses.';
      } else if (node.id === 'docker-containers') {
        objective = 'Craft multi-stage Docker builds to reduce image attack surfaces and standardize development runtime.';
        practicalExercise = 'Write a multi-stage Dockerfile for a Node.js/TypeScript service and orchestrate it with Redis via docker-compose.';
      } else if (node.id === 'testing-fundamentals') {
        objective = 'Establish automated unit, integration, and mock testing pipelines.';
        practicalExercise = 'Configure Vitest test suites testing service domain logic and error edge cases with >85% branch coverage.';
      } else if (node.id === 'system-design-basics') {
        objective = 'Evaluate latency budgets, database replication tradeoffs, and caching invalidation strategies.';
        practicalExercise = 'Draft an architectural technical spec document for a distributed notification service with horizontal scaling.';
      }

      newTasks.push({
        id: `task_${node.id}_${Date.now()}_${sequence}`,
        skillId: node.id,
        title: `Master ${node.name} in Real Applications`,
        category: node.category,
        objective,
        practicalExercise,
        estimatedHours: Math.max(4, Math.round(node.estimatedHours * 0.4)),
        sequenceOrder: sequence++,
        status: node.userLevel >= 3 ? 'completed' : node.userLevel > 0 ? 'in_progress' : 'not_started',
        completionCriteria: `Verified by creating working code repository or passing interview rubric check on ${node.name}.`,
        resourceUrls: [
          { label: 'Official Documentation', url: 'https://developer.mozilla.org' },
          { label: 'Architecture Guide', url: 'https://github.com' }
        ],
        relatedProjectId: relatedProject?.id
      });
    });

    // Also preserve any custom tasks the user completed that are not in core skills
    existingTasks.forEach(et => {
      if (!newTasks.some(nt => nt.id === et.id || nt.skillId === et.skillId)) {
        newTasks.push({
          ...et,
          sequenceOrder: sequence++
        });
      }
    });

    return newTasks;
  }
}
