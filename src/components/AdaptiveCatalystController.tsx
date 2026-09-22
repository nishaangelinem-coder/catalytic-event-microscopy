import React from 'react';
import { AdaptiveControlState, DescriptorsD_t, ModelSystem } from '../types';
import {
  FlaskConical,
  RefreshCw,
  Zap,
  ShieldCheck,
  TrendingDown,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AdaptiveCatalystControllerProps {
  controlState: AdaptiveControlState;
  onUpdateControlState: (state: Partial<AdaptiveControlState>) => void;
  descriptors: DescriptorsD_t;
  system: ModelSystem;
  onTriggerManualPulse: () => void;
  isPulseActive: boolean;
}

export const AdaptiveCatalystController: React.FC<AdaptiveCatalystControllerProps> = ({
  controlState,
  onUpdateControlState,
  descriptors,
  system,
  onTriggerManualPulse,
  isPulseActive,
}) => {
  const dispersionScore = Math.max(
    10,
    Math.min(100, Math.round((descriptors.isolatedPtCount / (descriptors.isolatedPtCount + descriptors.clusterCount * 2 || 1)) * 100))
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">
              Closed-Loop Adaptive Pt Catalysts (Self-Regenerating Catalyst)
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Transitioning from static catalysts to self-regenerating dynamic materials. Under high reactant loading,
            Pt single atoms reversibly assemble into transient dimers for bond activation. When coarsening or sintering begins,
            the closed-loop controller pulses the support or electrochemical potential to actively redisperse Pt back into isolated single atoms.
          </p>
        </div>

        {/* Closed Loop Master Switch */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800 shrink-0">
          <div>
            <div className="text-xs font-semibold text-slate-200">Active Stabilization</div>
            <div className="text-[10px] text-slate-400">Feedback closed loop</div>
          </div>
          <button
            onClick={() => onUpdateControlState({ enabled: !controlState.enabled })}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              controlState.enabled ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                controlState.enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Grid: Health Metrics & Control Logic */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Health, Dispersion & Reversibility */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Dynamic Catalyst State & Reversibility
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              {controlState.totalRegenerations} Regeneration Cycles Completed
            </span>
          </div>

          {/* Dispersion Gauge */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Single-Atom Dispersion Score</span>
              <span className="font-mono text-emerald-400 font-bold">{dispersionScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  dispersionScore > 75
                    ? 'bg-emerald-400'
                    : dispersionScore > 45
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${dispersionScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>Severe Sintering (&lt; 40%)</span>
              <span>Optimal Dynamic Dispersion (&gt; 75%)</span>
            </div>
          </div>

          {/* Cluster Status Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Isolated Pt₁</span>
              <span className="text-cyan-300 font-bold text-base">{descriptors.isolatedPtCount}</span>
              <span className="text-[9px] text-slate-500 block">Single-atom sites</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Active Pt₂ Dimers</span>
              <span className="text-amber-300 font-bold text-base">{descriptors.dimerCount}</span>
              <span className="text-[9px] text-slate-500 block">Bond-activation pairs</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Aggregated Ptₙ</span>
              <span className="text-rose-400 font-bold text-base">{descriptors.clusterCount}</span>
              <span className="text-[9px] text-slate-500 block">Sintering precursors</span>
            </div>
          </div>

          {/* Manual Regeneration Pulse Button */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-200">Force Anti-Sintering Pulse</div>
              <div className="text-[10px] text-slate-400">Trigger immediate oxidative/bias flash</div>
            </div>
            <button
              onClick={onTriggerManualPulse}
              disabled={isPulseActive}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                isPulseActive
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-md'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              {isPulseActive ? 'PULSE ACTIVE...' : 'EXECUTE PULSE'}
            </button>
          </div>
        </div>

        {/* Right: Controller Strategy & Pulse Configuration */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Adaptive Control Strategies
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">
              Support: {system.chemicalFormula}
            </span>
          </div>

          {/* Target Regime Options */}
          <div className="space-y-2 text-xs">
            <span className="text-slate-300 font-medium block">Active Operating Strategy</span>

            <button
              onClick={() => onUpdateControlState({ targetRegime: 'anti_sintering' })}
              className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                controlState.targetRegime === 'anti_sintering'
                  ? 'bg-emerald-500/20 border-emerald-500/60 text-slate-100 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center font-semibold text-xs mb-0.5">
                <span className="text-emerald-300">Anti-Sintering Self-Regeneration (Recommended)</span>
                {controlState.targetRegime === 'anti_sintering' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Detects early cluster aggregation (N_Pt–Pt &gt; 1.8) and automatically fires an anti-sintering re-oxidation pulse,
                redistributing Pt clusters back to anchored single atoms.
              </p>
            </button>

            <button
              onClick={() => onUpdateControlState({ targetRegime: 'high_turnover' })}
              className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                controlState.targetRegime === 'high_turnover'
                  ? 'bg-cyan-500/20 border-cyan-500/60 text-slate-100 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center font-semibold text-xs mb-0.5">
                <span className="text-cyan-300">Dynamic Reactant-Triggered Assembly</span>
                {controlState.targetRegime === 'high_turnover' && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Permits brief dynamic Pt₁ → Pt₂ pairing during high reactant concentration steps to maximize bond scission rate,
                followed by controlled dispersion.
              </p>
            </button>

            <button
              onClick={() => onUpdateControlState({ targetRegime: 'selectivity_lock' })}
              className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                controlState.targetRegime === 'selectivity_lock'
                  ? 'bg-purple-500/20 border-purple-500/60 text-slate-100 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center font-semibold text-xs mb-0.5">
                <span className="text-purple-300">Selectivity Switching (Dual Pathway)</span>
                {controlState.targetRegime === 'selectivity_lock' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Modulates local atomic coordination to switch between partial oxidation (favored by isolated Pt₁)
                and complete activation pathways without changing the bulk catalyst.
              </p>
            </button>
          </div>

          {/* Pulse Mechanism Type */}
          <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
            <span className="text-slate-300 font-medium">Pulse Physical Mechanism</span>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <button
                onClick={() => onUpdateControlState({ pulseType: 'oxidative_flash' })}
                className={`p-2 rounded border transition-colors text-left ${
                  controlState.pulseType === 'oxidative_flash'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>Oxidative Gas Pulse</div>
                <div className="text-[9px] text-slate-500 font-normal">50ms 15% O₂ flash</div>
              </button>
              <button
                onClick={() => onUpdateControlState({ pulseType: 'electrochemical_bias' })}
                className={`p-2 rounded border transition-colors text-left ${
                  controlState.pulseType === 'electrochemical_bias'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <div>Electrochemical Bias Dip</div>
                <div className="text-[9px] text-slate-500 font-normal">0.1s anodic step to 1.1V</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
