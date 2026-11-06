import React, { useState } from 'react';
import {
  FileSearch,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Trash2,
  ArrowRight,
  BookOpen,
  FolderGit2,
  FileText
} from 'lucide-react';
import { ResumeAnalysisResult, UserProfile } from '../../types';
import { AppStorage } from '../../lib/storage';
import { NavTab } from '../navigation/Sidebar';

interface ResumeAnalyzerViewProps {
  profile: UserProfile;
  onNavigate: (tab: NavTab) => void;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  profile,
  onNavigate,
}) => {
  const [resumeText, setResumeText] = useState(
`Alex Chen
Email: alex.chen@university.edu | GitHub: github.com/developer | Portfolio: alexchen.dev

EDUCATION:
B.S. in Computer Science & Software Engineering, Senior
Relevant Coursework: Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript, Python, SQL, C++
Frameworks & Tools: Node.js, Express, React, PostgreSQL, Git, Docker (Basic), Linux

PROJECTS:
- Distributed Token-Bucket Rate Limiter (TypeScript, Redis, Docker)
  Implemented sliding window rate limiting algorithm handling concurrency under load.
  Wrote unit tests and containerized environment using docker-compose.
- Campus Event Booking API (Node.js, PostgreSQL)
  Designed normalized 3NF schema with foreign keys, transactional reservations, and JWT authentication.`
  );

  const [jobDescriptionText, setJobDescriptionText] = useState(
`Junior Backend Systems Engineer - Distributed Platform Team
Responsibilities:
- Build and maintain high-throughput REST APIs and microservices in Node.js/TypeScript or Go.
- Design normalized PostgreSQL schemas, write complex joins, and optimize query latency using B-Tree indexes.
- Maintain automated unit and integration testing pipelines with >80% code coverage.
- Configure containerized microservice deployments with Docker and GitHub Actions CI/CD.
- Experience with Redis caching and asynchronous job queues is a strong plus.`
  );

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Junior Backend Systems Engineer');
  const [isScanning, setIsScanning] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysisResult | null>(() => {
    const cached = AppStorage.getResumeAnalyses();
    return cached.length > 0 ? cached[0] : null;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setResumeText(text);
    };
    reader.readAsText(file);
  };

  const handleRunAnalysis = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) return;

    setIsScanning(true);
    try {
      const response = await fetch('/api/analyze/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescriptionText,
          targetRole,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        AppStorage.saveResumeAnalysis(data);
      }
    } catch (err) {
      console.error('Resume analysis failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClearAnalysis = () => {
    setAnalysisResult(null);
    AppStorage.clearResumeAnalyses();
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-xl bg-[#141519] border border-[#23252E] flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-white">Private In-Memory Analysis:</span>
            <p className="text-[#8E9099] leading-relaxed">
              Uploaded resumes are processed in-memory for semantic skill verification and are never permanently persisted on our servers. You can clear analysis history at any time.
            </p>
          </div>
        </div>
        {analysisResult && (
          <button
            onClick={handleClearAnalysis}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#71717A] hover:text-red-400 bg-[#1A1C22] hover:bg-[#202229] rounded-lg transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Data
          </button>
        )}
      </div>

      {/* Input Form Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Resume Input */}
        <div className="p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Candidate Resume
            </label>
            <label className="cursor-pointer text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              Upload .txt / .md
              <input
                type="file"
                accept=".txt,.md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            rows={12}
            className="w-full bg-[#16171B] border border-[#262830] rounded-lg p-3 text-xs text-[#E4E4E7] font-mono leading-relaxed placeholder-[#52525B] focus:outline-none focus:border-indigo-500"
            placeholder="Paste your plain-text resume here..."
          />
          <div className="text-[11px] text-[#71717A] font-mono">
            {resumeText.trim().split(/\s+/).filter(Boolean).length} words
          </div>
        </div>

        {/* Right: Job Description Input */}
        <div className="p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-white flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-amber-400" />
              Target Job Description
            </label>
            <span className="text-[10px] font-mono text-[#71717A]">
              Paste posting requirements
            </span>
          </div>

          <textarea
            value={jobDescriptionText}
            onChange={e => setJobDescriptionText(e.target.value)}
            rows={12}
            className="w-full bg-[#16171B] border border-[#262830] rounded-lg p-3 text-xs text-[#E4E4E7] font-mono leading-relaxed placeholder-[#52525B] focus:outline-none focus:border-indigo-500"
            placeholder="Paste the target job description or requirements section here..."
          />

          <div className="flex items-center justify-between">
            <div className="text-[11px] text-[#71717A] font-mono">
              {jobDescriptionText.trim().split(/\s+/).filter(Boolean).length} words
            </div>
            <button
              onClick={handleRunAnalysis}
              disabled={isScanning || !resumeText.trim() || !jobDescriptionText.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isScanning ? 'Analyzing Competencies...' : 'Perform Gap Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Pane */}
      {analysisResult && (
        <div className="p-6 rounded-xl bg-[#131417] border border-[#212328] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#212328] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-indigo-400">
                Evidence Evaluation Report
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Target Role: {analysisResult.targetRoleTitle}
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1E23] text-[#8E9099] border border-[#282B33] self-start sm:self-auto">
              {analysisResult.isAiGenerated ? 'Analyzed via Gemini 3.8 Flash' : 'Deterministic Rules Engine'}
            </span>
          </div>

          {/* Matched vs Unmentioned Skills Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Evidenced Skills */}
            <div className="p-4 rounded-lg bg-[#111613] border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Skills Evidenced in Resume ({analysisResult.matchedSkills.length})
                </span>
              </div>

              <div className="space-y-2">
                {analysisResult.matchedSkills.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#161D19] border border-emerald-900/30 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{item.skill}</span>
                      <span className="text-[10px] font-mono text-emerald-400 capitalize">
                        {item.strength} evidence
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] mt-1">
                      {item.evidenceContext}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Unmentioned Job Skills */}
            <div className="p-4 rounded-lg bg-[#181511] border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Unmentioned in Resume ({analysisResult.unmentionedJobSkills.length})
                </span>
              </div>

              <div className="space-y-2">
                {analysisResult.unmentionedJobSkills.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#201B15] border border-amber-900/30 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{item.skill}</span>
                      <span className="text-[10px] font-mono text-amber-400 uppercase">
                        {item.importanceInJob}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#C4C7D2] mt-1">
                      <strong>Recommended Action: </strong>{item.recommendedAction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Presentation & Impact Critiques */}
          <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830] space-y-2">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Presentation & Evidence Enhancement Notes
            </h4>
            <ul className="space-y-1.5 text-xs text-[#C4C7D0]">
              {analysisResult.presentationCritiques.map((critique, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold shrink-0">•</span>
                  <span>{critique}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Bridge Projects */}
          <div className="p-4 rounded-lg bg-[#14151B] border border-indigo-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-indigo-400" />
                Recommended Bridge Projects
              </h4>
              <button
                onClick={() => onNavigate('projects')}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                Explore Project Lab <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <ul className="space-y-1.5 text-xs text-[#C4C7D0]">
              {analysisResult.recommendedBridgeProjects.map((bp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">→</span>
                  <span>{bp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
