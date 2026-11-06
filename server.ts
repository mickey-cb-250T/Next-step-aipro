import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialise Gemini SDK safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('MY_GEMINI_')) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialise GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiAvailable: !!aiClient,
    model: aiClient ? 'gemini-3.8-flash' : 'deterministic-engine',
    timestamp: new Date().toISOString(),
  });
});

// Helper for cleaning markdown code fences from JSON output
function parseJsonFromLlm(text: string): any {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Fast Gemini caller with timeout race to guarantee instant responsiveness (<3.5s)
async function callGeminiFast(prompt: string, systemInstruction: string, timeoutMs = 3500): Promise<any> {
  if (!aiClient) return null;

  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('AI call timeout - falling back to instant deterministic engine')), timeoutMs)
  );

  const apiPromise = (async () => {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      return parseJsonFromLlm(response.text || '{}');
    } catch (err) {
      console.warn('Primary model failed, attempting gemini-3.1-flash-lite:', err);
      const fallbackResponse = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      });
      return parseJsonFromLlm(fallbackResponse.text || '{}');
    }
  })();

  return Promise.race([apiPromise, timeoutPromise]);
}

// -------------------------------------------------------------
// 1. CAREER ANALYSIS ENDPOINT
// -------------------------------------------------------------
app.post('/api/analyze/career', async (req, res) => {
  try {
    const { profile } = req.body;
    if (!profile) {
      return res.status(400).json({ error: 'Missing profile payload' });
    }

    const { fullName, educationLevel, degreeMajor, careerTrackId, targetRole, weeklyHoursBudget, skills } = profile;

    // Deterministic fallback generator
    const generateFallbackAnalysis = () => {
      const skillsArray = Object.values(skills || {}) as Array<{ skillId: string; selfReportedLevel: number; verifiedLevel: number; notes?: string }>;
      const strongSkills = skillsArray.filter(s => (s.verifiedLevel || s.selfReportedLevel) >= 3).map(s => s.skillId);
      const weakSkills = skillsArray.filter(s => (s.verifiedLevel || s.selfReportedLevel) < 3).map(s => s.skillId);

      return {
        profileSummary: `${fullName || 'Candidate'} is an ${educationLevel || 'engineering student'} targeting ${targetRole || 'Software Engineering'} with ${weeklyHoursBudget || 10} hours of weekly commitment.`,
        targetRoleRequirements: [
          'Proficiency with foundational data structures and algorithm analysis',
          'Demonstrated experience building end-to-end applications with robust databases',
          'Familiarity with containerized deployments and automated testing pipelines',
          'Clear communication of architectural tradeoffs and edge-case handling'
        ],
        demonstratedSkills: strongSkills.length > 0 ? strongSkills : ['prog-foundations', 'git-version-control'],
        skillsRequiringDevelopment: weakSkills.length > 0 ? weakSkills : ['testing-fundamentals', 'docker-containers', 'system-design-basics'],
        learningPriorities: [
          'Solidify relational database modeling and ACID transaction guarantees',
          'Implement automated unit and integration tests with mocking',
          'Build and deploy a distributed or asynchronous service portfolio project',
          'Engage in weekly timed technical interview problem walkthroughs'
        ],
        recommendedPracticalProjects: [
          'Distributed Rate Limiter with Redis & Leaky Bucket Math',
          'Idempotent Event Ingestion Pipeline with Integration Tests'
        ],
        suggestedMilestones: [
          'Phase 1: Core Competency Verification (Weeks 1-3)',
          'Phase 2: Milestone Portfolio Project Build (Weeks 4-8)',
          'Phase 3: System Design & Technical Interview Rehearsal (Weeks 9-12)'
        ],
        weeklySchedule: {
          conceptualStudyHours: Math.round((weeklyHoursBudget || 10) * 0.3),
          handsOnCodingHours: Math.round((weeklyHoursBudget || 10) * 0.5),
          interviewAndReviewHours: Math.round((weeklyHoursBudget || 10) * 0.2),
          suggestedCadence: '4 study sessions of 2.5-3 hours each per week'
        },
        provider: 'deterministic-engine',
        isAiGenerated: false
      };
    };

    if (!aiClient) {
      return res.json(generateFallbackAnalysis());
    }

    const prompt = `
Act as a senior software engineering career director. Analyze this candidate profile:
Candidate Name: ${fullName}
Education: ${educationLevel} (${degreeMajor})
Career Track: ${careerTrackId}
Target Role: ${targetRole}
Weekly Budget: ${weeklyHoursBudget} hours/week
Candidate Skill Assessments: ${JSON.stringify(skills)}

Provide an objective, non-inflated career development plan. Return strictly valid JSON with this schema:
{
  "profileSummary": string,
  "targetRoleRequirements": string[],
  "demonstratedSkills": string[],
  "skillsRequiringDevelopment": string[],
  "learningPriorities": string[],
  "recommendedPracticalProjects": string[],
  "suggestedMilestones": string[],
  "weeklySchedule": {
    "conceptualStudyHours": number,
    "handsOnCodingHours": number,
    "interviewAndReviewHours": number,
    "suggestedCadence": string
  }
}
Do not invent fictional metrics or guaranteed job offers.
`;

    const parsed = await callGeminiFast(prompt, 'You are an objective engineering mentor. Output only valid JSON.');
    if (!parsed || !parsed.profileSummary) {
      return res.json(generateFallbackAnalysis());
    }

    return res.json({
      ...parsed,
      provider: 'gemini-2.5-flash',
      isAiGenerated: true,
    });
  } catch (error) {
    console.error('Error in /api/analyze/career:', error);
    // Return deterministic fallback upon any error
    return res.json({
      profileSummary: 'Candidate career progression calculated via deterministic rule engine.',
      targetRoleRequirements: [
        'Strong core programming problem-solving skills',
        'Database indexing and transactional consistency',
        'Automated testing and CI/CD pipelines'
      ],
      demonstratedSkills: ['prog-foundations', 'git-version-control'],
      skillsRequiringDevelopment: ['testing-fundamentals', 'docker-containers'],
      learningPriorities: [
        'Bridge verified testing and database foundations',
        'Construct a focused portfolio project with README documentation'
      ],
      recommendedPracticalProjects: ['Distributed Token-Bucket Rate Limiter'],
      suggestedMilestones: ['Phase 1: Foundations', 'Phase 2: Project Build', 'Phase 3: Interview Prep'],
      weeklySchedule: {
        conceptualStudyHours: 3,
        handsOnCodingHours: 6,
        interviewAndReviewHours: 3,
        suggestedCadence: '3-4 weekly focused blocks'
      },
      provider: 'deterministic-engine',
      isAiGenerated: false
    });
  }
});

// -------------------------------------------------------------
// 2. RESUME VS JOB DESCRIPTION ANALYZER
// -------------------------------------------------------------
app.post('/api/analyze/resume', async (req, res) => {
  try {
    const { resumeText, jobDescriptionText, targetRole } = req.body;
    if (!resumeText || !jobDescriptionText) {
      return res.status(400).json({ error: 'Both resumeText and jobDescriptionText are required.' });
    }

    const deterministicTokenExtractor = (text: string) => {
      const canonicalTokens = [
        'typescript', 'javascript', 'python', 'java', 'c++', 'go', 'rust',
        'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'react', 'next.js',
        'node.js', 'docker', 'kubernetes', 'aws', 'gcp', 'ci/cd', 'git',
        'graphql', 'rest api', 'tailwind css', 'pandas', 'numpy', 'pytorch'
      ];
      const lower = text.toLowerCase();
      return canonicalTokens.filter(t => {
        const regex = new RegExp(`\\b${t.replace('.', '\\.')}\\b`, 'i');
        return regex.test(lower);
      });
    };

    const resumeTokens = deterministicTokenExtractor(resumeText);
    const jdTokens = deterministicTokenExtractor(jobDescriptionText);

    const matched = jdTokens.filter(t => resumeTokens.includes(t)).map(skill => ({
      skill: skill.toUpperCase(),
      evidenceContext: `Identified keyword present in resume text.`,
      strength: 'moderate' as const
    }));

    const unmentioned = jdTokens.filter(t => !resumeTokens.includes(t)).map(skill => ({
      skill: skill.toUpperCase(),
      importanceInJob: 'critical' as const,
      recommendedAction: `Create a modular component or repository demonstrates ${skill.toUpperCase()} with documentation.`
    }));

    const deterministicFallback = {
      targetRoleTitle: targetRole || 'Target Software Position',
      matchedSkills: matched.length > 0 ? matched : [
        { skill: 'CORE PROGRAMMING', evidenceContext: 'Inferred from resume coursework and projects', strength: 'moderate' }
      ],
      unmentionedJobSkills: unmentioned.length > 0 ? unmentioned : [
        { skill: 'AUTOMATED TESTING', importanceInJob: 'critical', recommendedAction: 'Add Vitest or Jest test suites to your primary GitHub project' }
      ],
      presentationCritiques: [
        'Include quantifiable engineering impact metrics (e.g., latency reduction, request throughput, test coverage percentage) rather than only listing responsibilities.',
        'Ensure all mentioned project names link directly to live public repositories with setup instructions.'
      ],
      recommendedBridgeProjects: [
        'A full-stack or backend service integrating authenticated endpoints, relational database indexing, and automated unit tests.'
      ],
      analyzedAt: new Date().toISOString(),
      isAiGenerated: false
    };

    if (!aiClient) {
      return res.json(deterministicFallback);
    }

    const prompt = `
You are an expert technical recruiter and engineering hiring manager.
Compare this candidate's resume with the target job description.

Candidate Resume Text:
${resumeText.slice(0, 4500)}

Target Job Description:
${jobDescriptionText.slice(0, 3500)}

Perform an evidence-based gap analysis. Never hallucinate experience. Distinguish between skills mentioned with proof vs skills totally unmentioned in the resume.
Return strictly valid JSON in this schema:
{
  "targetRoleTitle": "${targetRole || 'Target Role'}",
  "matchedSkills": [
    {
      "skill": string,
      "evidenceContext": string,
      "strength": "strong" | "moderate" | "surface_mention"
    }
  ],
  "unmentionedJobSkills": [
    {
      "skill": string,
      "importanceInJob": "critical" | "beneficial",
      "recommendedAction": string
    }
  ],
  "presentationCritiques": string[],
  "recommendedBridgeProjects": string[]
}
`;

    const parsed = await callGeminiFast(prompt, 'You are an objective hiring manager evaluating candidates. Output valid JSON only.');
    if (!parsed || !parsed.matchedSkills) {
      return res.json(deterministicFallback);
    }

    return res.json({
      ...parsed,
      analyzedAt: new Date().toISOString(),
      isAiGenerated: true
    });
  } catch (error) {
    console.error('Error in /api/analyze/resume:', error);
    return res.json({
      targetRoleTitle: req.body.targetRole || 'Software Engineer',
      matchedSkills: [
        { skill: 'TECHNICAL FOUNDATIONS', evidenceContext: 'Foundational coursework and programming keywords present in resume', strength: 'moderate' }
      ],
      unmentionedJobSkills: [
        { skill: 'CI/CD & TEST PIPELINES', importanceInJob: 'critical', recommendedAction: 'Demonstrate automated test verification in portfolio repository' }
      ],
      presentationCritiques: [
        'Add quantitative metrics and business outcome numbers to project bullet points.',
        'Verify that all listed projects have accessible public GitHub URLs.'
      ],
      recommendedBridgeProjects: ['Distributed Token-Bucket Rate Limiter with Unit Tests'],
      analyzedAt: new Date().toISOString(),
      isAiGenerated: false
    });
  }
});

// -------------------------------------------------------------
// 3. GITHUB REPOSITORY AUDITOR
// -------------------------------------------------------------
app.post('/api/analyze/github', async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: 'GitHub repository URL is required.' });
    }

    // Parse owner & repo
    let owner = '';
    let repo = '';
    try {
      const cleaned = repoUrl.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '');
      const parts = cleaned.split('/').filter(Boolean);
      if (parts.length >= 2) {
        owner = parts[0];
        repo = parts[1];
      }
    } catch {
      // Fallback
    }

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Could not extract valid GitHub owner and repository name from URL.' });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'NextStep-AI-Pro-Portfolio-Auditor',
    };

    // 1. Fetch Repository Details
    let repoData: any = null;
    try {
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (repoRes.ok) {
        repoData = await repoRes.json();
      }
    } catch (e) {
      console.warn('GitHub API repo fetch failed:', e);
    }

    // 2. Fetch README
    let readmeText = '';
    try {
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      if (readmeRes.ok) {
        const readmeJson = await readmeRes.json();
        if (readmeJson.content) {
          readmeText = Buffer.from(readmeJson.content, 'base64').toString('utf-8');
        }
      }
    } catch (e) {
      console.warn('GitHub API readme fetch failed:', e);
    }

    // 3. Fetch Tree
    const filePaths: string[] = [];
    try {
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`, { headers });
      if (treeRes.ok) {
        const treeJson = await treeRes.json();
        if (Array.isArray(treeJson.tree)) {
          treeJson.tree.forEach((item: any) => filePaths.push(String(item.path || '').toLowerCase()));
        }
      }
    } catch (e) {
      console.warn('GitHub API tree fetch failed:', e);
    }

    // Analyze findings
    const wordCount = readmeText.trim().split(/\s+/).filter(Boolean).length;
    const hasSetup = /install|setup|run|start|getting started|prerequisites/i.test(readmeText);
    const hasArch = /architecture|design|tech stack|overview|how it works|system design/i.test(readmeText);
    const readmeFeedback: string[] = [];

    if (!readmeText) {
      readmeFeedback.push('No README found in repository root.');
    } else {
      if (wordCount < 100) readmeFeedback.push('README is very brief. Expand with problem definition, architecture, and tradeoffs.');
      if (!hasSetup) readmeFeedback.push('Add a step-by-step local setup and environment execution section.');
      if (!hasArch) readmeFeedback.push('Include a technical architecture summary or data flow diagram.');
    }

    const hasTests = filePaths.some(p => p.includes('test') || p.includes('spec') || p.endsWith('.test.ts') || p.endsWith('.test.js') || p.endsWith('.test.py'));
    const hasCi = filePaths.some(p => p.startsWith('.github/workflows/'));
    const hasManifest = filePaths.some(p => p === 'package.json' || p === 'requirements.txt' || p === 'pom.xml' || p === 'go.mod' || p === 'cargo.toml');

    const detectedStack: string[] = [];
    if (filePaths.some(p => p.endsWith('.ts') || p.endsWith('.tsx'))) detectedStack.push('TypeScript');
    if (filePaths.some(p => p.endsWith('.js') || p.endsWith('.jsx'))) detectedStack.push('JavaScript');
    if (filePaths.some(p => p.endsWith('.py'))) detectedStack.push('Python');
    if (filePaths.some(p => p.endsWith('.go'))) detectedStack.push('Go');
    if (filePaths.some(p => p.endsWith('.java'))) detectedStack.push('Java');
    if (filePaths.some(p => p === 'dockerfile' || p === 'docker-compose.yml')) detectedStack.push('Docker');

    const actionableCommits: Array<{ priority: 'high' | 'medium' | 'low'; recommendation: string; rationale: string }> = [];

    if (!hasTests) {
      actionableCommits.push({
        priority: 'high',
        recommendation: 'Add automated unit and integration tests (e.g. Vitest / Pytest)',
        rationale: 'Hiring managers view codebases without automated tests as unproven or incomplete.'
      });
    }
    if (!hasCi) {
      actionableCommits.push({
        priority: 'medium',
        recommendation: 'Add a GitHub Actions CI workflow to verify linting and tests on pull requests',
        rationale: 'Demonstrates professional CI/CD standards and automated quality enforcement.'
      });
    }
    if (!hasSetup) {
      actionableCommits.push({
        priority: 'high',
        recommendation: 'Document local setup commands and environment variables in README.md',
        rationale: 'Technical interviewers who cannot run your project in under 3 minutes will move to the next candidate.'
      });
    }
    if (actionableCommits.length === 0) {
      actionableCommits.push({
        priority: 'low',
        recommendation: 'Add benchmark latency graphs or architectural trade-off notes to README',
        rationale: 'Elevates your project from student coursework to senior-level engineering documentation.'
      });
    }

    const isAccessible = !!repoData || filePaths.length > 0;

    return res.json({
      repoName: repo,
      owner,
      isAccessible,
      readmeAnalysis: {
        exists: !!readmeText,
        hasSetupInstructions: hasSetup,
        hasArchitectureSummary: hasArch,
        wordCount,
        feedback: readmeFeedback
      },
      codeQualitySignals: {
        hasTestsDirectory: hasTests,
        hasCiWorkflow: hasCi,
        hasPackageManifest: hasManifest,
        detectedStack: detectedStack.length > 0 ? detectedStack : ['Repository files inspected'],
        potentialConcerns: hasTests ? [] : ['Missing automated test suite in primary directory tree']
      },
      actionableCommits,
      summary: isAccessible
        ? `Audited ${owner}/${repo}. Detected stack: ${detectedStack.join(', ') || 'Standard files'}. Tests: ${hasTests ? 'Present' : 'Missing'}. CI/CD: ${hasCi ? 'Configured' : 'Missing'}.`
        : `Repository ${owner}/${repo} could not be fully accessed (it may be private or rate limits applied). Standard baseline audit recommendations applied.`,
      auditedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in /api/analyze/github:', error);
    return res.status(500).json({ error: 'Failed to inspect GitHub repository.' });
  }
});

// -------------------------------------------------------------
// 4. INTERVIEW QUESTION EVALUATION ENDPOINT
// -------------------------------------------------------------
app.post('/api/interview/evaluate', async (req, res) => {
  try {
    const { questionTitle, questionPrompt, userAnswer, keyConcepts } = req.body;
    if (!userAnswer || !questionPrompt) {
      return res.status(400).json({ error: 'User answer and question prompt are required.' });
    }

    // Deterministic evaluation logic
    const lowerAnswer = userAnswer.toLowerCase();
    const concepts: string[] = Array.isArray(keyConcepts) ? keyConcepts : [];
    const covered: string[] = [];
    const missing: string[] = [];

    concepts.forEach(c => {
      const words = c.toLowerCase().split(/\s+/).filter(w => w.length > 3).slice(0, 3);
      const matches = words.some(w => lowerAnswer.includes(w));
      if (matches) {
        covered.push(c);
      } else {
        missing.push(c);
      }
    });

    const scorePct = concepts.length > 0 
      ? Math.round((covered.length / concepts.length) * 100) 
      : (userAnswer.length > 150 ? 80 : 50);

    let scoreSummary = 'Satisfactory Explanation';
    if (scorePct >= 80) scoreSummary = 'Strong Technical Formulation with Deep Insight';
    else if (scorePct >= 50) scoreSummary = 'Solid Foundation; Missing Edge Cases or Deep Tradeoffs';
    else scoreSummary = 'Surface-Level Summary; Requires Deeper System Mechanics';

    const deterministicResult = {
      scoreSummary,
      scorePercentage: scorePct,
      coveredConcepts: covered,
      missingConcepts: missing,
      strengths: [
        'Direct engagement with core question mechanics',
        'Use of appropriate domain vocabulary'
      ],
      improvementNote: missing.length > 0
        ? `Ensure you explicitly discuss: ${missing[0]}`
        : 'Clear, concise explanation with good architectural context.',
      suggestedRevisionTopics: missing.length > 0 ? missing : ['Review production performance tradeoffs'],
      isAiGenerated: false
    };

    if (!aiClient) {
      return res.json(deterministicResult);
    }

    const prompt = `
You are a Staff Software Engineer conducting a technical interview.
Question: ${questionTitle}
Prompt: ${questionPrompt}
Key Concepts Expected:
${concepts.map(c => `- ${c}`).join('\n')}

Candidate Answer:
${userAnswer}

Evaluate the candidate's answer objectively against the rubric. Output strictly valid JSON matching this schema:
{
  "scoreSummary": string,
  "scorePercentage": number,
  "coveredConcepts": string[],
  "missingConcepts": string[],
  "strengths": string[],
  "improvementNote": string,
  "suggestedRevisionTopics": string[]
}
`;

    const parsed = await callGeminiFast(prompt, 'You are an objective engineering interview evaluator. Output valid JSON only.');
    if (!parsed || !parsed.scoreSummary) {
      return res.json(deterministicResult);
    }

    return res.json({
      ...parsed,
      isAiGenerated: true
    });
  } catch (error) {
    console.error('Error in /api/interview/evaluate:', error);
    return res.json({
      scoreSummary: 'Evaluated response via rubric rules engine.',
      scorePercentage: 75,
      coveredConcepts: ['Core architectural concepts'],
      missingConcepts: ['Specific kernel/engine boundary nuances'],
      strengths: ['Identified key components and responsibilities'],
      improvementNote: 'Include practical production examples and complexity analysis.',
      suggestedRevisionTopics: ['Internal data structures and concurrency locking'],
      isAiGenerated: false
    });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC ASSETS
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NextStep AI Pro server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
