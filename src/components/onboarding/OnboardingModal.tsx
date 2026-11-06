import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, Clock, Target, Shield, HelpCircle } from 'lucide-react';
import { UserProfile, CareerTrackId } from '../../types';
import { CAREER_TRACKS, SKILLS_CATALOG } from '../../data/seedData';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile, analysisResult?: any) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [profile, setProfile] = useState<UserProfile>({ ...currentProfile });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [careerAnalysis, setCareerAnalysis] = useState<any>(null);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrackChange = (trackId: CareerTrackId) => {
    const track = CAREER_TRACKS.find(t => t.id === trackId);
    setProfile(prev => ({
      ...prev,
      careerTrackId: trackId,
      targetRole: track ? `Junior ${track.name.replace('Engineering', 'Engineer').replace('Development', 'Developer')}` : prev.targetRole,
      weeklyHoursBudget: track?.recommendedWeeklyHours || prev.weeklyHoursBudget,
      preparationTimelineWeeks: track?.averageWeeksToReadiness || prev.preparationTimelineWeeks,
    }));
  };

  const handleSkillLevelChange = (skillId: string, level: number) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [skillId]: {
          skillId,
          selfReportedLevel: level,
          verifiedLevel: prev.skills[skillId]?.verifiedLevel || 0,
          evidenceType: prev.skills[skillId]?.evidenceType || 'none',
          notes: prev.skills[skillId]?.notes || '',
          updatedAt: new Date().toISOString()
        }
      }
    }));
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setStep(4);
    try {
      const response = await fetch('/api/analyze/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });
      if (response.ok) {
        const data = await response.json();
        setCareerAnalysis(data);
      }
    } catch (err) {
      console.error('Failed to run career analysis:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinish = () => {
    onSaveProfile(profile, careerAnalysis);
    onClose();
  };

  const selectedTrack = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121316] border border-[#25282F] rounded-xl max-w-3xl w-full my-8 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#212328] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Step {step} of 4
              </span>
              <h2 className="text-base font-bold text-white">Career Intelligence Profile & Assessment</h2>
            </div>
            <p className="text-xs text-[#8E9099] mt-0.5">
              Personalize your target career, self-assess current competencies, and generate your development plan.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#71717A] hover:text-white hover:bg-[#1C1E23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: TARGET CAREER & ACADEMICS */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#C4C7D0] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full bg-[#18191E] border border-[#282B33] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#C4C7D0] mb-1.5">
                    Education Level
                  </label>
                  <select
                    value={profile.educationLevel}
                    onChange={e => setProfile({ ...profile, educationLevel: e.target.value })}
                    className="w-full bg-[#18191E] border border-[#282B33] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Undergraduate Sophomore/Junior">Undergraduate Sophomore/Junior</option>
                    <option value="Undergraduate Senior">Undergraduate Senior</option>
                    <option value="Master's / Graduate Student">Master's / Graduate Student</option>
                    <option value="Recent Graduate (< 1 year)">Recent Graduate (&lt; 1 year)</option>
                    <option value="Self-Taught / Career Transitioner">Self-Taught / Career Transitioner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C4C7D0] mb-1.5">
                  Major / Field of Study
                </label>
                <input
                  type="text"
                  value={profile.degreeMajor}
                  onChange={e => setProfile({ ...profile, degreeMajor: e.target.value })}
                  className="w-full bg-[#18191E] border border-[#282B33] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Computer Science, Electrical Engineering, Data Science"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C4C7D0] mb-2 flex items-center justify-between">
                  <span>Target Career Track</span>
                  <span className="text-[11px] text-[#71717A] font-normal">Select the domain you want to specialize in</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAREER_TRACKS.map(track => {
                    const isSelected = profile.careerTrackId === track.id;
                    return (
                      <div
                        key={track.id}
                        onClick={() => handleTrackChange(track.id)}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/30 border-indigo-500 text-white shadow-sm'
                            : 'bg-[#16171B] border-[#25282F] text-[#A1A1AA] hover:border-[#353942] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-white">{track.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <p className="text-xs text-[#8E9099] line-clamp-2 leading-relaxed mb-2">
                          {track.description}
                        </p>
                        <div className="text-[10px] font-mono text-indigo-400">
                          Focus: {track.marketFocus}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#C4C7D0] mb-1.5">
                  Specific Target Job Title
                </label>
                <input
                  type="text"
                  value={profile.targetRole}
                  onChange={e => setProfile({ ...profile, targetRole: e.target.value })}
                  className="w-full bg-[#18191E] border border-[#282B33] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Junior Backend Systems Engineer, Cloud Infrastructure Intern"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TECHNICAL SKILL SELF-ASSESSMENT */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-[#18191D] border border-[#26282F] rounded-lg flex items-start gap-2.5 text-xs text-[#A1A1AA]">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Assessment Rubric:</strong> Rate your honest ability from 0 (Unfamiliar) to 5 (Production Expert).
                  Our system verifies skills with project evidence to avoid false confidence.
                </span>
              </div>

              <div className="space-y-3">
                {SKILLS_CATALOG.filter(s => selectedTrack.coreSkills.includes(s.id) || ['prog-foundations', 'git-version-control', 'data-structures'].includes(s.id)).map(skill => {
                  const currentLevel = profile.skills[skill.id]?.selfReportedLevel || 0;
                  const verifiedLevel = profile.skills[skill.id]?.verifiedLevel || 0;

                  return (
                    <div key={skill.id} className="p-3.5 bg-[#16171B] border border-[#25282F] rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">{skill.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#21232A] text-[#A1A1AA]">
                              {skill.category}
                            </span>
                            {verifiedLevel > 0 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40">
                                Verified Level {verifiedLevel}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7E828D] mt-0.5">{skill.description}</p>
                        </div>
                        <div className="text-xs font-mono text-indigo-400 font-semibold shrink-0">
                          Level {currentLevel} / 5
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        {[0, 1, 2, 3, 4, 5].map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleSkillLevelChange(skill.id, lvl)}
                            className={`flex-1 py-1.5 text-xs font-mono rounded transition-all ${
                              currentLevel === lvl
                                ? 'bg-indigo-600 text-white font-bold ring-1 ring-indigo-400'
                                : currentLevel > lvl
                                ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 hover:bg-indigo-900/50'
                                : 'bg-[#202227] text-[#71717A] hover:bg-[#282B32] hover:text-white'
                            }`}
                          >
                            {lvl === 0 ? 'None' : lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: TIME BUDGET & LEARNING PREFERENCES */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-4 bg-[#16171B] border border-[#25282F] rounded-lg space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Weekly Available Study Budget</span>
                    </label>
                    <span className="text-sm font-mono text-amber-400 font-bold">
                      {profile.weeklyHoursBudget} hours / week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="40"
                    step="2"
                    value={profile.weeklyHoursBudget}
                    onChange={e => setProfile({ ...profile, weeklyHoursBudget: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#71717A] font-mono mt-1">
                    <span>4h (Light / Busy Schedule)</span>
                    <span>14h (Consistent Momentum)</span>
                    <span>40h (Full-Time Sprint)</span>
                  </div>
                </div>

                <div className="border-t border-[#23252B] pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <span>Target Preparation Timeline</span>
                    </label>
                    <span className="text-sm font-mono text-indigo-400 font-bold">
                      {profile.preparationTimelineWeeks} weeks
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="52"
                    step="2"
                    value={profile.preparationTimelineWeeks}
                    onChange={e => setProfile({ ...profile, preparationTimelineWeeks: Number(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#71717A] font-mono mt-1">
                    <span>4 weeks (Rapid Interview Prep)</span>
                    <span>16 weeks (Semester Cadence)</span>
                    <span>52 weeks (1 Year Foundation)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-2">
                  Preferred Learning Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'hands-on-projects', title: 'Hands-On Projects', desc: 'Prioritize building runnable systems and code repositories.' },
                    { id: 'systematic-depth', title: 'Systematic Depth', desc: 'Focus on computer science theory, internals, and architectural tradeoffs.' },
                    { id: 'interview-sprint', title: 'Interview Focus', desc: 'Prioritize algorithmic problem solving and technical interview rubrics.' }
                  ].map(style => {
                    const isSelected = profile.learningStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setProfile({ ...profile, learningStyle: style.id as any })}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500 text-white'
                            : 'bg-[#16171B] border-[#25282F] text-[#A1A1AA] hover:text-white'
                        }`}
                      >
                        <div className="font-semibold text-xs text-white mb-1">{style.title}</div>
                        <p className="text-[11px] text-[#7E828D] leading-relaxed">{style.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REAL-TIME CAREER ANALYSIS RESULT */}
          {step === 4 && (
            <div className="space-y-5">
              {isAnalyzing ? (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-medium text-white">Synthesizing personalized career analysis...</p>
                  <p className="text-xs text-[#71717A] max-w-sm">
                    Evaluating prerequisite dependencies, project alignment, and weekly study cadence.
                  </p>
                </div>
              ) : careerAnalysis ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#16171B] border border-[#25282F]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-xs font-mono uppercase text-indigo-400">Profile Summary</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#202228] text-[#8E9099]">
                        {careerAnalysis.provider === 'gemini-3.8-flash' ? 'AI Augmented (Gemini 3.8)' : 'Deterministic Rules Engine'}
                      </span>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{careerAnalysis.profileSummary}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#141518] border border-[#25282F] rounded-lg">
                      <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-2">
                        Demonstrated Skills
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#C4C7D0]">
                        {careerAnalysis.demonstratedSkills?.map((s: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-[#141518] border border-[#25282F] rounded-lg">
                      <div className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">
                        Skills Requiring Development
                      </div>
                      <ul className="space-y-1.5 text-xs text-[#C4C7D0]">
                        {careerAnalysis.skillsRequiringDevelopment?.map((s: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-[#141518] border border-[#25282F] rounded-lg">
                    <div className="text-xs font-semibold text-white uppercase tracking-wide mb-2">
                      Weekly Study Schedule Allocation
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded bg-[#1B1D22]">
                        <div className="text-lg font-bold text-indigo-400">
                          {careerAnalysis.weeklySchedule?.conceptualStudyHours || 3}h
                        </div>
                        <div className="text-[11px] text-[#8E9099]">Architecture & Concepts</div>
                      </div>
                      <div className="p-2 rounded bg-[#1B1D22]">
                        <div className="text-lg font-bold text-emerald-400">
                          {careerAnalysis.weeklySchedule?.handsOnCodingHours || 6}h
                        </div>
                        <div className="text-[11px] text-[#8E9099]">Hands-On Projects</div>
                      </div>
                      <div className="p-2 rounded bg-[#1B1D22]">
                        <div className="text-lg font-bold text-amber-400">
                          {careerAnalysis.weeklySchedule?.interviewAndReviewHours || 3}h
                        </div>
                        <div className="text-[11px] text-[#8E9099]">Interviews & Tests</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-[#212328] flex items-center justify-between bg-[#101114] shrink-0">
          <div>
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 3 && (
              <button
                onClick={() => setStep((step + 1) as any)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleRunAnalysis}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate Career Analysis
              </button>
            )}

            {step === 4 && (
              <button
                onClick={handleFinish}
                disabled={isAnalyzing}
                className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
              >
                Apply & Update My Roadmap
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
