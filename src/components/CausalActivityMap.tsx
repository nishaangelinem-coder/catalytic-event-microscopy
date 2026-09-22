import React, { useState } from 'react';
import { ModelSystem, ReactionTarget, CatalyticEvent } from '../types';
import {
  Radio,
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface CausalActivityMapProps {
  system: ModelSystem;
  reaction: ReactionTarget;
  events: CatalyticEvent[];
  tauDead: number;
}

export const CausalActivityMap: React.FC<CausalActivityMapProps> = ({
  system,
  reaction,
  events,
  tauDead,
}) => {
  const [selectedOxidationSlice, setSelectedOxidationSlice] = useState<number>(2); // 0 = Pt0, 2 = Pt2+, 4 = Pt4+
  const [hoveredCell, setHoveredCell] = useState<{
    nPTPt: number;
    nSupp: number;
    deltaTOF: number;
    causalProb: number;
    description: string;
  } | null>(null);

  // Discrete descriptor space grid:
  // X-axis: N_Pt-Pt (0 = isolated monomer, 1 = dimer, 2 = trimer, 3 = sub-nm cluster, 4 = nanoparticle)
  // Y-axis: N_Pt-support (1 = weak terrace, 2 = planar, 3 = step edge, 4 = oxygen vacancy / defect)
  const nPTPtLabels = ['Pt₁ (N=0)', 'Pt₂ Dimer (N=1)', 'Pt₃ Trimer (N=2)', 'Cluster (N=3)', 'Sintered (N≥4)'];
  const nSuppLabels = ['Terrace (N=1)', 'Planar (N=2)', 'Step Edge (N=3)', 'Vacancy V_O (N=4)'];

  // Synthetic causal probability matrix P(Δr > 0)
  // Demonstrating the core hypothesis: Transient Pt1-Pt2 dimers paired at oxygen vacancies produce the highest causal TOF surge!
  const getCellData = (ptPtIdx: number, suppIdx: number, ox: number) => {
    // Peak causal activity at Pt2 (ptPtIdx === 1) and Vacancy (suppIdx === 3) with moderate oxidation (+2)
    if (ptPtIdx === 1 && suppIdx === 3) {
      return {
        deltaTOF: 28.4 + (ox === 2 ? 4.2 : -3.1),
        causalProb: 0.94,
        description: 'Active Motif: Transient Pt₁–Pt₂ dimer anchored at CeO₂ oxygen vacancy step. Peak activation for O–O scission.',
      };
    }
    if (ptPtIdx === 1 && suppIdx === 2) {
      return {
        deltaTOF: 19.8,
        causalProb: 0.81,
        description: 'Pt₁–Pt₂ dimer on planar support. Moderate lifetime before dissociation.',
      };
    }
    if (ptPtIdx === 0 && suppIdx === 3) {
      return {
        deltaTOF: 7.2,
        causalProb: 0.42,
        description: 'Isolated Pt₁ monomer pinned to V_O. High CO chemisorption, but high barrier for O₂ dissociation.',
      };
    }
    if (ptPtIdx === 0) {
      return {
        deltaTOF: 3.5,
        causalProb: 0.28,
        description: 'Isolated Pt₁ on terrace. Highly mobile, sub-optimal turnover under high CO loading.',
      };
    }
    if (ptPtIdx === 2) {
      return {
        deltaTOF: 11.2,
        causalProb: 0.58,
        description: 'Pt₃ trimer. Facile reactant dissociation, but begins to exhibit metallic deactivation.',
      };
    }
    // Sintered cluster
    return {
      deltaTOF: -8.5,
      causalProb: 0.08,
      description: 'Aggregated Pt cluster / nanoparticle. Active sites blocked by CO poison; lower atom efficiency.',
    };
  };

  // Color mapping function for causal probability
  const getCellColor = (prob: number, deltaTOF: number) => {
    if (deltaTOF < 0) return 'bg-rose-950/60 border-rose-800 text-rose-300';
    if (prob > 0.85) return 'bg-emerald-500/30 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/10 font-bold';
    if (prob > 0.65) return 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200';
    if (prob > 0.4) return 'bg-blue-500/15 border-blue-600/40 text-blue-200';
    return 'bg-slate-900 border-slate-800 text-slate-400';
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Banner: Scientific Hypothesis & Publication Metric */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              3D Causal Structure–Activity Probability Field
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Distinguishing causal catalytic motifs from passive coexisting structures. By correlating delay-corrected
            mass spectrometry with time-resolved atomic coordination transitions, this probability field isolates
            the exact dynamic Pt configurations associated with product turnover acceleration.
          </p>
        </div>

        <div className="bg-slate-950 border border-cyan-900/60 p-3 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Causal Verification</span>
          <span className="text-xl font-bold text-emerald-400">P = 0.94</span>
          <span className="text-[10px] text-cyan-300">Transient Pt₂ at V_O</span>
        </div>
      </div>

      {/* Main Grid: Causal Descriptor Field */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: 2D/3D Sliced Descriptor Space Matrix */}
        <div className="lg:col-span-7 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Descriptor Space: N_Pt–Pt vs N_Pt–support
              </h3>
              <span className="text-[11px] text-slate-400">
                Slice: q_Pt (Local Oxidation State Proxy via EELS)
              </span>
            </div>

            {/* Oxidation state slice selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedOxidationSlice(0)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedOxidationSlice === 0 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                q ≈ 0 (Pt⁰ metallic)
              </button>
              <button
                onClick={() => setSelectedOxidationSlice(2)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedOxidationSlice === 2 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                q ≈ +2 (Pt²⁺ SMSI)
              </button>
              <button
                onClick={() => setSelectedOxidationSlice(4)}
                className={`px-2 py-0.5 rounded text-[10px] transition-colors ${
                  selectedOxidationSlice === 4 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500'
                }`}
              >
                q ≈ +4 (Oxidized)
              </button>
            </div>
          </div>

          {/* Interactive Heatmap Matrix */}
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Y-axis label */}
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                ↑ Pt–Support Coordination (N_Pt-supp)
              </div>

              {/* Rows (support coordination: Vacancy down to Terrace) */}
              <div className="space-y-1.5">
                {[3, 2, 1, 0].map((suppIdx) => (
                  <div key={suppIdx} className="flex items-center gap-1.5">
                    {/* Y label */}
                    <div className="w-28 text-[11px] font-mono text-slate-400 text-right pr-2 shrink-0">
                      {nSuppLabels[suppIdx]}
                    </div>

                    {/* Cells across X (Pt-Pt coordination) */}
                    <div className="grid grid-cols-5 gap-1.5 flex-1">
                      {[0, 1, 2, 3, 4].map((ptPtIdx) => {
                        const cell = getCellData(ptPtIdx, suppIdx, selectedOxidationSlice);
                        const isHovered =
                          hoveredCell &&
                          hoveredCell.nPTPt === ptPtIdx &&
                          hoveredCell.nSupp === suppIdx;

                        return (
                          <button
                            key={ptPtIdx}
                            onMouseEnter={() =>
                              setHoveredCell({
                                nPTPt: ptPtIdx,
                                nSupp: suppIdx,
                                deltaTOF: cell.deltaTOF,
                                causalProb: cell.causalProb,
                                description: cell.description,
                              })
                            }
                            className={`p-2.5 rounded-lg border text-left transition-all ${getCellColor(
                              cell.causalProb,
                              cell.deltaTOF
                            )} ${isHovered ? 'ring-2 ring-cyan-400 scale-[1.03]' : ''}`}
                          >
                            <div className="text-xs font-mono font-bold">
                              {cell.deltaTOF > 0 ? `+${cell.deltaTOF.toFixed(1)}%` : `${cell.deltaTOF.toFixed(1)}%`}
                            </div>
                            <div className="text-[9px] font-mono opacity-80">
                              P = {cell.causalProb.toFixed(2)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="flex items-center gap-1.5 mt-2">
                <div className="w-28 shrink-0" />
                <div className="grid grid-cols-5 gap-1.5 flex-1 text-center font-mono text-[10px] text-slate-400">
                  {nPTPtLabels.map((lbl, idx) => (
                    <div key={idx}>{lbl}</div>
                  ))}
                </div>
              </div>
              <div className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                Pt–Pt Metallic Coordination (N_Pt-Pt) →
              </div>
            </div>
          </div>

          {/* Cell Inspection Detail Box */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs mt-1">
            {hoveredCell ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-cyan-300 font-bold">
                    Configuration: {nPTPtLabels[hoveredCell.nPTPt]} @ {nSuppLabels[hoveredCell.nSupp]}
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    Causal TOF Shift: +{hoveredCell.deltaTOF.toFixed(1)}% (P = {hoveredCell.causalProb.toFixed(2)})
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {hoveredCell.description}
                </p>
              </div>
            ) : (
              <div className="text-slate-500 text-[11px] italic flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                Hover over any configuration cell in the descriptor field to inspect the mechanistic rationale and causal probability.
              </div>
            )}
          </div>
        </div>

        {/* Right: Event-Aligned Analysis & Lagged Cross-Correlation */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Event-Aligned Analysis (Delta r_CO2) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                Event-Aligned Averaging (t = 0 Alignment)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                N = 48 events • 4 chips
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Average CO₂ turnover response aligned to the instant of Pt₁ → Pt₂ association (t = 0).
              After a calibrated <strong className="text-slate-200">{tauDead.toFixed(1)} s</strong> gas transport delay,
              a persistent <strong className="text-emerald-300">+24 ± 6%</strong> rate enhancement is detected.
            </p>

            {/* Event-Aligned SVG Plot */}
            <div className="h-28 w-full bg-slate-950 rounded-lg p-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                {/* Baseline line */}
                <line x1="0" y1="55" x2="200" y2="55" stroke="#334155" strokeDasharray="2,2" />

                {/* t = 0 event vertical dashed line */}
                <line x1="70" y1="0" x2="70" y2="80" stroke="#eab308" strokeWidth="1.2" strokeDasharray="3,2" />
                <text x="72" y="12" fill="#eab308" fontSize="7" fontFamily="monospace">
                  t = 0 (Pt₁→Pt₂)
                </text>

                {/* t = tau_dead transport delay vertical line */}
                <line x1="125" y1="0" x2="125" y2="80" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3,2" />
                <text x="127" y="12" fill="#10b981" fontSize="7" fontFamily="monospace">
                  t = τ_dead (MS delay)
                </text>

                {/* 95% Confidence interval band */}
                <polygon
                  points="0,58 70,57 110,54 130,30 160,28 200,32 200,44 160,40 130,42 110,60 70,61 0,62"
                  fill="rgba(16, 185, 129, 0.15)"
                />

                {/* Mean rate curve */}
                <path
                  d="M 0,60 L 70,59 L 105,58 Q 125,52 135,36 L 160,34 Q 180,36 200,38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.2"
                />

                {/* Labels */}
                <text x="10" y="72" fill="#64748b" fontSize="6" fontFamily="monospace">
                  -5s (Pre-event)
                </text>
                <text x="165" y="72" fill="#64748b" fontSize="6" fontFamily="monospace">
                  +10s (Post-event)
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Δr_CO₂ = +24.6% ± 5.8%</span>
              <span className="text-emerald-400">Bootstrap p &lt; 0.0001</span>
            </div>
          </div>

          {/* Lagged Cross-Correlation rho(tau) */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Time-Lagged Cross-Correlation ρ(τ)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">
                Peak τ = +{tauDead.toFixed(1)} s
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              Correlation between structural dimer fraction N_Pt₂(t) and product signal r(t+τ).
              The peak at <strong className="text-cyan-300">τ &gt; 0</strong> proves atomic restructuring precedes
              the measured product formation.
            </p>

            {/* Lagged Correlation Curve SVG */}
            <div className="h-28 w-full bg-slate-950 rounded-lg p-2 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                {/* Zero line */}
                <line x1="0" y1="65" x2="200" y2="65" stroke="#334155" strokeDasharray="2,2" />
                <line x1="80" y1="0" x2="80" y2="80" stroke="#475569" strokeWidth="0.8" />
                <text x="82" y="74" fill="#64748b" fontSize="6" fontFamily="monospace">
                  τ = 0
                </text>

                {/* Peak marker */}
                <line x1="130" y1="10" x2="130" y2="80" stroke="#06b6d4" strokeWidth="1.2" strokeDasharray="3,2" />
                <circle cx="130" cy="20" r="3" fill="#06b6d4" />
                <text x="135" y="22" fill="#06b6d4" fontSize="7" fontFamily="monospace">
                  ρ_max = 0.84
                </text>

                {/* Cross-correlation curve */}
                <path
                  d="M 0,64 Q 50,65 80,60 Q 110,50 130,20 Q 150,48 180,62 L 200,64"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.2"
                />

                <text x="10" y="74" fill="#64748b" fontSize="6" fontFamily="monospace">
                  -6s
                </text>
                <text x="180" y="74" fill="#64748b" fontSize="6" fontFamily="monospace">
                  +10s
                </text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Peak exceeds gas transit error (±0.4s)</span>
              <span className="text-cyan-400">Granger F = 18.4 (p &lt; 0.001)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multivariable Kinetic State-Space Equation & Regression Panel */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
          <div className="font-mono text-[11px] text-slate-300">
            <span className="text-purple-300">r(t)</span> = β₀ +{' '}
            <span className="text-cyan-300">β₁·N_Pt₁</span> +{' '}
            <span className="text-amber-300 font-bold">β₂·N_Pt₂ (+6.8×)</span> +{' '}
            <span className="text-rose-300">β₃·CN_supp</span> +{' '}
            <span className="text-emerald-300">β₄·k_hop</span> + β₅·T + β₆·P_CO + η(t)
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            R² = 0.912
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            LASSO Regularized
          </span>
        </div>
      </div>
    </div>
  );
};
