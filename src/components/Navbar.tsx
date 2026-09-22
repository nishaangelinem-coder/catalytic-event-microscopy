import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  FlaskConical,
  Radio,
  Clock,
  Zap,
  BookOpen,
} from 'lucide-react';
import { ModelSystem, ReactionTarget } from '../types';
import { MODEL_SYSTEMS, REACTION_TARGETS } from '../data/modelsAndReactions';

interface NavbarProps {
  currentSystem: ModelSystem;
  onSelectSystem: (sys: ModelSystem) => void;
  currentReaction: ReactionTarget;
  onSelectReaction: (rxn: ReactionTarget) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  simTime: number;
  bpi: number;
  isBeamBlanked: boolean;
  onOpenAiAnalyst: () => void;
  activeTab: 'nanoreactor' | 'causal_map' | 'beam_aware' | 'adaptive_catalyst' | 'manuscript';
  onChangeTab: (tab: 'nanoreactor' | 'causal_map' | 'beam_aware' | 'adaptive_catalyst' | 'manuscript') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSystem,
  onSelectSystem,
  currentReaction,
  onSelectReaction,
  isRunning,
  onToggleRun,
  onReset,
  simTime,
  bpi,
  isBeamBlanked,
  onOpenAiAnalyst,
  activeTab,
  onChangeTab,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand & Master Clock */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-mono font-bold text-base">
              Pt₁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight leading-tight">
                  Catalytic Event Microscopy
                </h1>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-300">
                  Operando 4D-TEM
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Correlated Atomic Trajectories • Spectroscopy • Mass Spectrometry
              </p>
            </div>
          </div>

          {/* Master Synchronized TTL Clock readout */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">TTL Sync:</span>
            <span className="font-semibold text-emerald-400">{simTime.toFixed(1)} s</span>
            <span className="text-[10px] text-slate-500">10 Hz</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center p-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs font-medium">
          <button
            id="tab-nanoreactor"
            onClick={() => onChangeTab('nanoreactor')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'nanoreactor'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Operando Nanoreactor</span>
          </button>
          <button
            id="tab-causal-map"
            onClick={() => onChangeTab('causal_map')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'causal_map'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Causal Activity Map</span>
          </button>
          <button
            id="tab-beam-aware"
            onClick={() => onChangeTab('beam_aware')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'beam_aware'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Beam-Aware Tracking</span>
            {bpi > 0.35 && !isBeamBlanked && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
          <button
            id="tab-adaptive"
            onClick={() => onChangeTab('adaptive_catalyst')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'adaptive_catalyst'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Adaptive Pt Catalysts</span>
          </button>
          <button
            id="tab-manuscript"
            onClick={() => onChangeTab('manuscript')}
            className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'manuscript'
                ? 'bg-gradient-to-r from-emerald-500/25 to-cyan-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manuscript (Q1 Journal)</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
              20F·11T
            </span>
          </button>
        </div>

        {/* Global Controls & System Selectors */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          {/* Catalyst Selector */}
          <select
            id="select-model-system"
            aria-label="Select Model Catalyst System"
            value={currentSystem.id}
            onChange={(e) => {
              const found = MODEL_SYSTEMS.find((m) => m.id === e.target.value);
              if (found) onSelectSystem(found);
            }}
            className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {MODEL_SYSTEMS.map((sys) => (
              <option key={sys.id} value={sys.id}>
                {sys.name}
              </option>
            ))}
          </select>

          {/* Reaction Selector */}
          <select
            id="select-reaction-target"
            aria-label="Select Reaction Target"
            value={currentReaction.id}
            onChange={(e) => {
              const found = REACTION_TARGETS.find((r) => r.id === e.target.value);
              if (found) onSelectReaction(found);
            }}
            className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {REACTION_TARGETS.map((rxn) => (
              <option key={rxn.id} value={rxn.id}>
                {rxn.name}
              </option>
            ))}
          </select>

          {/* Run/Pause Button */}
          <button
            id="btn-toggle-run"
            onClick={onToggleRun}
            className={`p-1.5 rounded-md border transition-colors ${
              isRunning
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
            }`}
            title={isRunning ? 'Pause Operando Acquisition' : 'Start Live Acquisition'}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* Reset Button */}
          <button
            id="btn-reset-sim"
            onClick={onReset}
            className="p-1.5 rounded-md border border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            title="Reset Experiment & Trajectories"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* AI Causal Analyst Trigger */}
          <button
            id="btn-open-ai-analyst"
            onClick={onOpenAiAnalyst}
            className="px-2.5 py-1.5 rounded-md bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/40 text-purple-200 hover:text-purple-100 hover:border-purple-400 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">AI Causal Analyst</span>
          </button>
        </div>
      </div>
    </header>
  );
};
