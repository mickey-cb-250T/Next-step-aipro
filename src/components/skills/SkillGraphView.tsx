import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  CircleAlert,
  X,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  FolderGit2,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserProfile, ComputedSkillNode, SkillNodeStatus } from '../../types';
import { SkillGraphEngine } from '../../lib/graphEngine';
import { CURATED_PROJECTS, CAREER_TRACKS } from '../../data/seedData';
import { NavTab } from '../navigation/Sidebar';

interface SkillGraphViewProps {
  profile: UserProfile;
  onUpdateSkillLevel: (skillId: string, level: number) => void;
  onNavigate: (tab: NavTab) => void;
}

export const SkillGraphView: React.FC<SkillGraphViewProps> = ({
  profile,
  onUpdateSkillLevel,
  onNavigate,
}) => {
  const [selectedNode, setSelectedNode] = useState<ComputedSkillNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'dag' | 'list'>('dag');

  const graphResult = SkillGraphEngine.computeGraph(profile);
  const currentTrack = CAREER_TRACKS.find(t => t.id === profile.careerTrackId) || CAREER_TRACKS[0];

  const filteredNodes = graphResult.nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || node.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Group nodes by DAG depth layers
  const layers: ComputedSkillNode[][] = Array.from({ length: graphResult.maxDepth + 1 }, () => []);
  filteredNodes.forEach(node => {
    if (layers[node.depth]) {
      layers[node.depth].push(node);
    }
  });

  const getStatusBadge = (status: SkillNodeStatus) => {
    switch (status) {
      case 'mastered':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mastered
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
            <PlayCircle className="w-3 h-3 text-amber-400" /> In Progress
          </span>
        );
      case 'ready':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
            <CircleAlert className="w-3 h-3 text-indigo-400" /> Ready to Learn
          </span>
        );
      case 'locked':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1E23] text-[#71717A] border border-[#2B2E36]">
            <Lock className="w-3 h-3" /> Locked (Prereqs)
          </span>
        );
    }
  };

  const getCardBorder = (status: SkillNodeStatus, isSelected: boolean) => {
    if (isSelected) return 'ring-2 ring-indigo-500 border-transparent';
    switch (status) {
      case 'mastered':
        return 'border-emerald-900/60 bg-[#121815] hover:border-emerald-600/80';
      case 'in_progress':
        return 'border-amber-900/60 bg-[#181612] hover:border-amber-600/80';
      case 'ready':
        return 'border-indigo-900/60 bg-[#14151E] hover:border-indigo-600/80';
      case 'locked':
        return 'border-[#22242A] bg-[#121316] opacity-75 hover:opacity-100 hover:border-[#353842]';
    }
  };

  // Find projects that develop the selected node
  const relatedProjects = selectedNode
    ? CURATED_PROJECTS.filter(p => p.developedSkills.includes(selectedNode.id))
    : [];

  const categories = ['all', 'Core', 'Backend', 'Frontend', 'Databases', 'DevOps', 'Quality', 'Architecture', 'AI/Data'];

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#131417] border border-[#212328]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#18191E] border border-[#282B33] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {categories.slice(0, 6).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors shrink-0 ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-[#18191E] text-[#8E9099] hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Skills' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setViewMode('dag')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'dag' ? 'bg-[#202228] text-white border border-[#2E313A]' : 'text-[#71717A] hover:text-white'
            }`}
          >
            Phased DAG View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-[#202228] text-white border border-[#2E313A]' : 'text-[#71717A] hover:text-white'
            }`}
          >
            Categorized Tree
          </button>
        </div>
      </div>

      {/* Main Graph Canvas Area */}
      <div className="relative border border-[#212328] rounded-xl bg-[#0F1013] p-6 min-h-[550px] overflow-x-auto">
        {/* Phase Timeline Header */}
        {viewMode === 'dag' && (
          <div className="flex gap-6 min-w-[900px] mb-4 pb-2 border-b border-[#1E2026]">
            {layers.map((_, idx) => (
              <div key={idx} className="flex-1 text-xs font-mono uppercase text-[#71717A] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>
                  {idx === 0 ? 'Phase 1: Foundations' :
                   idx === 1 ? 'Phase 2: Core Engineering' :
                   idx === 2 ? 'Phase 3: Advanced Architecture' :
                   'Phase 4: Scale & Production'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Columns of Nodes */}
        {viewMode === 'dag' ? (
          <div className="flex gap-6 min-w-[900px]">
            {layers.map((layerNodes, depthIdx) => (
              <div key={depthIdx} className="flex-1 flex flex-col gap-3.5">
                {layerNodes.map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  const isCore = currentTrack.coreSkills.includes(node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3.5 rounded-lg border transition-all cursor-pointer ${getCardBorder(
                        node.status,
                        isSelected
                      )}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#8E9099]">
                          {node.category}
                        </span>
                        {isCore && (
                          <span className="text-[9px] font-mono text-indigo-400 font-semibold uppercase">
                            Target Core
                          </span>
                        )}
                      </div>

                      <div className="font-semibold text-xs text-white mb-1">
                        {node.name}
                      </div>

                      <p className="text-[11px] text-[#8E9099] line-clamp-2 leading-relaxed mb-3">
                        {node.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="text-[11px] font-mono text-[#71717A]">
                          Lvl: <strong className="text-white">{node.userLevel}</strong>/{node.targetLevel}
                        </div>
                        {getStatusBadge(node.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ) : (
          /* Tree / Categorized List Alternative */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNodes.map(node => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${getCardBorder(
                  node.status,
                  selectedNode?.id === node.id
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-indigo-400">{node.category}</span>
                  {getStatusBadge(node.status)}
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{node.name}</h4>
                <p className="text-xs text-[#8E9099] line-clamp-2 mb-3">{node.description}</p>
                <div className="text-xs font-mono text-[#71717A] flex justify-between">
                  <span>Current: Level {node.userLevel}</span>
                  <span>Target: Level {node.targetLevel}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Node Drill-Down Drawer */}
        {selectedNode && (
          <div className="fixed sm:absolute top-0 right-0 w-full sm:w-96 h-full bg-[#141519] border-l border-[#262830] p-6 shadow-2xl flex flex-col justify-between z-30 overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {selectedNode.category}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">
                    {selectedNode.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="p-1 rounded text-[#71717A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {selectedNode.description}
              </p>

              {/* Status and Assessment Control */}
              <div className="p-3.5 rounded-lg bg-[#18191E] border border-[#252830] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8E9099]">Current Status:</span>
                  <div>{getStatusBadge(selectedNode.status)}</div>
                </div>

                <div className="text-xs text-[#8E9099] flex items-center justify-between pt-1">
                  <span>Adjust Self-Assessed Level:</span>
                  <span className="font-mono text-white font-bold">{selectedNode.userLevel} / 5</span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[0, 1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => onUpdateSkillLevel(selectedNode.id, lvl)}
                      className={`flex-1 py-1 text-xs font-mono rounded transition-colors ${
                        selectedNode.userLevel === lvl
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-[#21232A] text-[#8E9099] hover:bg-[#2A2D36] hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prerequisites Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-white uppercase tracking-wider">
                  Prerequisites Required
                </div>
                {selectedNode.prerequisites.length === 0 ? (
                  <div className="text-xs text-[#71717A] italic">
                    Foundational skill. No prior prerequisites required.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedNode.prerequisites.map(pId => {
                      const pNode = graphResult.nodes.find(n => n.id === pId);
                      const isSatisfied = (pNode?.userLevel || 0) >= 3;
                      return (
                        <div
                          key={pId}
                          className="flex items-center justify-between p-2 rounded bg-[#18191E] border border-[#252830] text-xs"
                        >
                          <span className="text-white font-medium">{pNode?.name || pId}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                            isSatisfied ? 'bg-emerald-950/60 text-emerald-300' : 'bg-[#22242B] text-[#71717A]'
                          }`}>
                            {isSatisfied ? 'Satisfied (Lvl >= 3)' : 'Pending Mastery'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Connected Curated Projects */}
              {relatedProjects.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Projects Developing This Skill</span>
                  </div>
                  {relatedProjects.map(proj => (
                    <div
                      key={proj.id}
                      onClick={() => onNavigate('projects')}
                      className="p-2.5 rounded bg-[#18191E] border border-[#252830] hover:border-indigo-500/40 cursor-pointer text-xs transition-colors"
                    >
                      <div className="font-semibold text-white">{proj.title}</div>
                      <div className="text-[10px] text-amber-400 mt-0.5">{proj.difficulty} • {proj.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="border-t border-[#262830] pt-4 mt-6 space-y-2">
              <button
                onClick={() => onNavigate('interview')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                Practice Topic in Interview Studio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
