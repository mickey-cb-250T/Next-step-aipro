import React, { useState } from 'react';
import {
  Github,
  Search,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  FileCode,
  ShieldCheck,
  GitCommit,
  ExternalLink,
  Info,
  Clock
} from 'lucide-react';
import { GitHubAuditResult, UserProfile } from '../../types';

interface GitHubAnalyzerViewProps {
  initialRepoUrl?: string;
  profile: UserProfile;
}

export const GitHubAnalyzerView: React.FC<GitHubAnalyzerViewProps> = ({
  initialRepoUrl = 'https://github.com/developer/distributed-rate-limiter',
  profile,
}) => {
  const [repoUrl, setRepoUrl] = useState(initialRepoUrl);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<GitHubAuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsAuditing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setAuditResult(data);
      } else {
        const err = await response.json();
        setErrorMessage(err.error || 'Failed to inspect GitHub repository.');
      }
    } catch (err) {
      console.error('GitHub audit failed:', err);
      setErrorMessage('Network or server error while querying GitHub.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Audit Bar */}
      <div className="p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Github className="w-4 h-4 text-white" />
            Public GitHub Repository Inspector
          </h3>
          <p className="text-xs text-[#8E9099] mt-1">
            Audits directory layout, automated testing presence, README setup clarity, CI workflows, and maintainability standards without executing untrusted code.
          </p>
        </div>

        <form onSubmit={handleRunAudit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Github className="w-4 h-4 text-[#71717A] absolute left-3 top-3" />
            <input
              type="text"
              value={repoUrl}
              onChange={e => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-[#17181D] border border-[#282B33] rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#52525B] focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing || !repoUrl.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            {isAuditing ? 'Auditing Repository...' : 'Audit Repository'}
          </button>
        </form>

        {errorMessage && (
          <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-300">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Audit Report */}
      {auditResult && (
        <div className="p-6 rounded-xl bg-[#131417] border border-[#212328] space-y-6">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#212328] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-indigo-400">
                  {auditResult.owner} / {auditResult.repoName}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  auditResult.isAccessible
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                }`}>
                  {auditResult.isAccessible ? 'Inspected via GitHub API' : 'Limited Access / Local Analysis'}
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA] mt-1.5">{auditResult.summary}</p>
            </div>
            <a
              href={`https://github.com/${auditResult.owner}/${auditResult.repoName}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
            >
              Open on GitHub <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Core Quality Signal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* README Quality */}
            <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830]">
              <div className="text-[11px] font-mono uppercase text-[#8E9099] mb-2 flex items-center justify-between">
                <span>README Clarity</span>
                {auditResult.readmeAnalysis.exists ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="text-lg font-bold text-white">
                {auditResult.readmeAnalysis.wordCount} words
              </div>
              <div className="mt-2 space-y-1 text-xs text-[#A1A1AA]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${auditResult.readmeAnalysis.hasSetupInstructions ? 'bg-emerald-400' : 'bg-[#52525B]'}`} />
                  <span>Setup Guide: {auditResult.readmeAnalysis.hasSetupInstructions ? 'Detected' : 'Missing'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${auditResult.readmeAnalysis.hasArchitectureSummary ? 'bg-emerald-400' : 'bg-[#52525B]'}`} />
                  <span>Architecture Docs: {auditResult.readmeAnalysis.hasArchitectureSummary ? 'Detected' : 'Missing'}</span>
                </div>
              </div>
            </div>

            {/* Test Coverage Signal */}
            <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830]">
              <div className="text-[11px] font-mono uppercase text-[#8E9099] mb-2 flex items-center justify-between">
                <span>Automated Tests</span>
                {auditResult.codeQualitySignals.hasTestsDirectory ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="text-lg font-bold text-white">
                {auditResult.codeQualitySignals.hasTestsDirectory ? 'Tests Detected' : 'No Test Suite'}
              </div>
              <p className="text-xs text-[#8E9099] mt-2">
                {auditResult.codeQualitySignals.hasTestsDirectory 
                  ? 'Unit/integration test directories or test files found in tree.'
                  : 'Automated test suite not found in primary directory tree.'}
              </p>
            </div>

            {/* CI/CD & Tooling */}
            <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830]">
              <div className="text-[11px] font-mono uppercase text-[#8E9099] mb-2 flex items-center justify-between">
                <span>CI/CD Automation</span>
                {auditResult.codeQualitySignals.hasCiWorkflow ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#71717A]" />
                )}
              </div>
              <div className="text-lg font-bold text-white">
                {auditResult.codeQualitySignals.hasCiWorkflow ? 'CI Configured' : 'No CI Pipeline'}
              </div>
              <p className="text-xs text-[#8E9099] mt-2">
                {auditResult.codeQualitySignals.hasCiWorkflow
                  ? 'GitHub Actions workflows detected (.github/workflows).'
                  : 'Consider adding a test & lint validation workflow on pull request.'}
              </p>
            </div>
          </div>

          {/* Detected Tech Stack */}
          <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830] space-y-2">
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Detected Technology Stack
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {auditResult.codeQualitySignals.detectedStack.map((tech, idx) => (
                <span key={idx} className="text-xs font-mono px-2.5 py-1 rounded bg-[#202229] text-indigo-300 border border-[#2A2D37]">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Actionable Commit Recommendations */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-indigo-400" />
              Prioritized Actionable Commits to Elevate This Portfolio Repo
            </h4>

            <div className="space-y-2.5">
              {auditResult.actionableCommits.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#16171B] border border-[#252830] flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold uppercase ${
                        item.priority === 'high' ? 'bg-red-950/60 text-red-300 border border-red-800/40' :
                        item.priority === 'medium' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' :
                        'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                      }`}>
                        {item.priority} Priority
                      </span>
                      <span className="font-semibold text-white">{item.recommendation}</span>
                    </div>
                    <p className="text-[#8E9099] leading-relaxed">
                      <strong>Rationale: </strong>{item.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
