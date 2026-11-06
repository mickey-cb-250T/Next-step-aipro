import React, { useState } from 'react';
import {
  Terminal,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  Eye,
  EyeOff,
  History,
  Award
} from 'lucide-react';
import { InterviewQuestion, InterviewEvaluationResult, UserProfile } from '../../types';
import { INTERVIEW_QUESTIONS } from '../../data/seedData';
import { AppStorage } from '../../lib/storage';
import { NavTab } from '../navigation/Sidebar';

interface InterviewStudioViewProps {
  profile: UserProfile;
  onNavigate: (tab: NavTab) => void;
}

export const InterviewStudioView: React.FC<InterviewStudioViewProps> = ({
  profile,
  onNavigate,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion>(INTERVIEW_QUESTIONS[0]);
  const [userAnswer, setUserAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<InterviewEvaluationResult | null>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [history, setHistory] = useState(() => AppStorage.getInterviewHistory());

  const handleSelectQuestion = (q: InterviewQuestion) => {
    setSelectedQuestion(q);
    setUserAnswer('');
    setEvaluationResult(null);
    setShowModelAnswer(false);
  };

  const handleEvaluateAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsEvaluating(true);
    try {
      const response = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionTitle: selectedQuestion.title,
          questionPrompt: selectedQuestion.question,
          userAnswer,
          keyConcepts: selectedQuestion.keyConcepts,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);

        // Record in history
        AppStorage.recordInterviewSession({
          questionId: selectedQuestion.id,
          questionTitle: selectedQuestion.title,
          category: selectedQuestion.category,
          userAnswer,
          result: data,
          timestamp: new Date().toISOString()
        });
        setHistory(AppStorage.getInterviewHistory());
      }
    } catch (err) {
      console.error('Interview evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Selector Carousel */}
      <div className="p-4 rounded-xl bg-[#131417] border border-[#212328] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Interview Question Bank
          </span>
          <span className="text-xs font-mono text-[#71717A]">
            {INTERVIEW_QUESTIONS.length} Architectural & Core Questions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {INTERVIEW_QUESTIONS.map(q => {
            const isSelected = selectedQuestion.id === q.id;
            return (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/80 text-white ring-1 ring-indigo-500'
                    : 'bg-[#17181D] border-[#252830] text-[#A1A1AA] hover:text-white hover:border-[#333742]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-indigo-400">{q.category}</span>
                  <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#8E9099]">{q.difficulty}</span>
                </div>
                <div className="text-xs font-semibold text-white truncate">{q.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Practice Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Question Prompt and Answer Input */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B1D23] text-indigo-400 font-semibold border border-[#272A34]">
                {selectedQuestion.category} • {selectedQuestion.difficulty}
              </span>
              <button
                onClick={() => onNavigate('roadmap')}
                className="text-[11px] font-mono text-[#71717A] hover:text-indigo-400 transition-colors"
              >
                Related Skill: {selectedQuestion.relatedSkillId}
              </button>
            </div>

            <h3 className="text-base font-bold text-white">
              {selectedQuestion.title}
            </h3>

            <p className="text-xs text-[#C4C7D0] leading-relaxed">
              {selectedQuestion.question}
            </p>

            {/* Expected Key Concepts (Accordion) */}
            <div className="p-3 bg-[#17181D] border border-[#252830] rounded-lg">
              <div className="text-[11px] font-semibold text-[#8E9099] uppercase mb-1.5">
                Evaluator Core Expectations
              </div>
              <ul className="space-y-1 text-xs text-[#A1A1AA]">
                {selectedQuestion.keyConcepts.slice(0, 3).map((concept, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Answer Submission Form */}
          <form onSubmit={handleEvaluateAnswer} className="p-5 rounded-xl bg-[#131417] border border-[#212328] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white">
                Your Technical Response
              </label>
              <span className="text-[11px] font-mono text-[#71717A]">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              rows={9}
              className="w-full bg-[#16171B] border border-[#262830] rounded-lg p-3 text-xs text-white font-mono leading-relaxed placeholder-[#52525B] focus:outline-none focus:border-indigo-500"
              placeholder="Explain the internal mechanics, algorithmic tradeoffs, and edge cases..."
            />

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="text-xs font-mono text-[#8E9099] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {showModelAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showModelAnswer ? 'Hide Sample Explanation' : 'View Sample Model Answer'}
              </button>

              <button
                type="submit"
                disabled={isEvaluating || !userAnswer.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isEvaluating ? 'Evaluating Rubric...' : 'Submit for Rubric Evaluation'}
              </button>
            </div>
          </form>

          {/* Model Answer Drawer */}
          {showModelAnswer && (
            <div className="p-4 rounded-xl bg-[#14171E] border border-indigo-900/40 space-y-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Staff Engineer Model Explanation
              </span>
              <p className="text-xs text-[#C4C7D2] leading-relaxed">
                {selectedQuestion.sampleModelAnswer}
              </p>
            </div>
          )}
        </div>

        {/* Right: Rubric Evaluation Results */}
        <div className="p-6 rounded-xl bg-[#131417] border border-[#212328] flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#212328] pb-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Technical Rubric Assessment
              </h4>
              {evaluationResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1B1D23] text-[#8E9099]">
                  {evaluationResult.isAiGenerated ? 'Evaluated via Gemini 3.8' : 'Rules Engine'}
                </span>
              )}
            </div>

            {!evaluationResult ? (
              <div className="py-20 flex flex-col items-center justify-center text-center text-[#71717A] space-y-2">
                <Terminal className="w-8 h-8 opacity-40" />
                <p className="text-xs">
                  Type your explanation and submit to receive concept verification and revision notes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score & Summary */}
                <div className="p-4 rounded-lg bg-[#16171B] border border-[#252830] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#8E9099] uppercase">
                      Evaluation Result
                    </span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {evaluationResult.scoreSummary}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-400">
                      {evaluationResult.scorePercentage}%
                    </span>
                    <div className="text-[10px] font-mono text-[#71717A]">Rubric Match</div>
                  </div>
                </div>

                {/* Covered vs Missing Concepts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[#111613] border border-emerald-900/40 rounded-lg space-y-1.5">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Concepts Covered ({evaluationResult.coveredConcepts?.length || 0})
                    </div>
                    <ul className="space-y-1 text-[#A1A1AA]">
                      {evaluationResult.coveredConcepts?.map((c, i) => (
                        <li key={i} className="text-[11px] leading-tight">• {c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-[#181511] border border-amber-900/40 rounded-lg space-y-1.5">
                    <div className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Missing Concepts ({evaluationResult.missingConcepts?.length || 0})
                    </div>
                    <ul className="space-y-1 text-[#A1A1AA]">
                      {evaluationResult.missingConcepts?.map((m, i) => (
                        <li key={i} className="text-[11px] leading-tight">• {m}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Mentor Improvement Note */}
                <div className="p-3.5 bg-[#17181F] border border-[#252832] rounded-lg text-xs leading-relaxed">
                  <strong className="text-white">Mentor Guidance: </strong>
                  <span className="text-[#C4C7D0]">{evaluationResult.improvementNote}</span>
                </div>

                {/* Revision Topics */}
                {evaluationResult.suggestedRevisionTopics?.length > 0 && (
                  <div className="p-3 bg-[#141519] border border-[#23252E] rounded-lg">
                    <div className="text-[11px] font-semibold text-white uppercase mb-1">
                      Recommended Revision Focus
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {evaluationResult.suggestedRevisionTopics.map((topic, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1E23] text-indigo-300">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Interview History Drawer */}
          {history.length > 0 && (
            <div className="border-t border-[#212328] pt-4 mt-6">
              <div className="flex items-center justify-between text-xs text-[#8E9099] mb-2 font-mono uppercase">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Recent Practice Sessions ({history.length})
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {history.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-2 rounded bg-[#16171B] border border-[#23252E] flex justify-between items-center text-xs">
                    <div className="truncate mr-2">
                      <div className="font-medium text-white truncate">{item.questionTitle}</div>
                      <div className="text-[10px] text-[#71717A]">{item.category}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-400 shrink-0">
                      {item.result.scorePercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
