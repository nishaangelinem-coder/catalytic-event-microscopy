import React from 'react';
import { BeamSettings, BeamPerturbationMetrics } from '../types';
import {
  Zap,
  ShieldCheck,
  AlertTriangle,
  Radio,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers,
} from 'lucide-react';

interface BeamAwareFrameworkProps {
  beamSettings: BeamSettings;
  onUpdateBeamSettings: (settings: Partial<BeamSettings>) => void;
  metrics: BeamPerturbationMetrics;
  onToggleBeamBlank: () => void;
}

export const BeamAwareFramework: React.FC<BeamAwareFrameworkProps> = ({
  beamSettings,
  onUpdateBeamSettings,
  metrics,
  onToggleBeamBlank,
}) => {
  const bpi = metrics.bpi;
  const isHighBPI = bpi > 0.35;
  const isModerateBPI = bpi >= 0.2 && bpi <= 0.35;

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-bold text-slate-100">
              Beam-Aware & Beam-Minimized Catalytic Atom Tracking
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            Eliminating beam-induced artifacts in single-atom dynamics. High-energy electrons can knock, ionize,
            or thermally agitate isolated Pt atoms. This framework measures dose-rate dependence, executes stroboscopic
            beam blanking, and applies dose-aware Bayesian trajectory reconstruction to recover unperturbed thermal motion.
          </p>
        </div>

        {/* Real-Time BPI Badge */}
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col items-center justify-center shrink-0 font-mono">
          <span className="text-[10px] text-slate-400 uppercase tracking-wide">Beam Perturbation Index</span>
          <span
            className={`text-2xl font-bold ${
              isHighBPI ? 'text-rose-400' : isModerateBPI ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            BPI = {bpi.toFixed(3)}
          </span>
          <span className="text-[10px] text-slate-400">
            {isHighBPI
              ? 'Beam-Dominated'
              : isModerateBPI
              ? 'Moderate Perturbation'
              : 'Thermal Kinetics Safe'}
          </span>
        </div>
      </div>

      {/* Grid: Controls & Dose-Rate Mobility */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Beam Controls & Stroboscopic Imaging Settings */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Electron Beam & Stroboscopic Controls
            </h3>
            <button
              onClick={onToggleBeamBlank}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                beamSettings.isCurrentlyBlanked
                  ? 'bg-rose-500/20 border border-rose-500/50 text-rose-300'
                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {beamSettings.isCurrentlyBlanked ? '● BEAM BLANKED' : '○ BLANK BEAM'}
            </button>
          </div>

          {/* Dose Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Electron Dose Rate (Φ)</span>
              <span className="font-mono text-cyan-400 font-bold">{beamSettings.doseRate} e⁻/Å²·s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="250"
              step="1"
              value={beamSettings.doseRate}
              onChange={(e) => onUpdateBeamSettings({ doseRate: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 e⁻/Å²·s (Ultra-low dose)</span>
              <span>250 e⁻/Å²·s (High radiation)</span>
            </div>
          </div>

          {/* Imaging Mode: Continuous vs Stroboscopic */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Imaging Protocol</span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
                <button
                  onClick={() => onUpdateBeamSettings({ mode: 'continuous' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    beamSettings.mode === 'continuous'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Continuous
                </button>
                <button
                  onClick={() => onUpdateBeamSettings({ mode: 'stroboscopic' })}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    beamSettings.mode === 'stroboscopic'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Stroboscopic
                </button>
              </div>
            </div>

            {beamSettings.mode === 'stroboscopic' && (
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Exposure Window (t_exp):</span>
                  <span className="font-mono text-cyan-400">{beamSettings.exposureDuration_s} s</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Blanking Recovery Window (t_blank):</span>
                  <span className="font-mono text-emerald-400">{beamSettings.blankingDuration_s} s</span>
                </div>
                <div className="text-[10px] text-slate-500 italic">
                  Duty cycle = {((beamSettings.exposureDuration_s / (beamSettings.exposureDuration_s + beamSettings.blankingDuration_s)) * 100).toFixed(0)}%.
                  Suppresses radiolytic heating and accumulates clean thermal reaction progress between frames.
                </div>
              </div>
            )}
          </div>

          {/* Accelerating Voltage */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-300 font-medium">Beam Voltage</span>
              <span className="font-mono text-slate-200">{beamSettings.beamVoltage_kV} kV</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[80, 200, 300].map((kv) => (
                <button
                  key={kv}
                  onClick={() => onUpdateBeamSettings({ beamVoltage_kV: kv })}
                  className={`py-1 rounded border text-xs font-mono transition-colors ${
                    beamSettings.beamVoltage_kV === kv
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {kv} kV {kv === 80 ? '(Knock-on safe)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Dose-Aware Bayesian Trajectory Decomposition */}
        <div className="lg:col-span-6 p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Bayesian Hopping Decomposition (Φ → 0 Limit)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Reconstruction Confidence: {metrics.unperturbedTrajectoryEstimate.toFixed(1)}%
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Decomposes observed atomic mobility into true thermal Arrhenius kinetics vs electron-beam knock-on:
            <br />
            <code className="text-cyan-300 font-mono text-[11px]">
              k_observed(Φ) = k_thermal + σ_beam · Φ
            </code>
          </p>

          {/* Dose vs Hopping Rate Plot */}
          <div className="h-36 w-full bg-slate-950 rounded-lg p-2 relative border border-slate-800/80">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 200 90" preserveAspectRatio="none">
              {/* Grid */}
              <line x1="25" y1="20" x2="195" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
              <line x1="25" y1="50" x2="195" y2="50" stroke="#1e293b" strokeWidth="0.5" />
              <line x1="25" y1="80" x2="195" y2="80" stroke="#334155" />
              <line x1="25" y1="5" x2="25" y2="80" stroke="#334155" />

              {/* Zero-dose extrapolation intercept (k_thermal) */}
              <circle cx="25" cy="65" r="3.5" fill="#10b981" />
              <text x="32" y="67" fill="#10b981" fontSize="7" fontFamily="monospace">
                k_thermal = {metrics.thermalRate.toFixed(2)} hops/s
              </text>

              {/* Linear dose-rate regression line */}
              <line x1="25" y1="65" x2="190" y2="25" stroke="#a855f7" strokeWidth="2.0" />

              {/* Current operating point */}
              {/* map doseRate (0 to 250) to X (25 to 190) */}
              {(() => {
                const currentX = 25 + (beamSettings.doseRate / 250) * 165;
                const currentY = 65 - (beamSettings.doseRate / 250) * 40;
                return (
                  <g>
                    <circle cx={currentX} cy={currentY} r="4.5" fill="#eab308" stroke="#ffffff" strokeWidth="1" />
                    <line x1={currentX} y1={currentY} x2={currentX} y2="80" stroke="#eab308" strokeDasharray="2,2" />
                  </g>
                );
              })()}

              {/* Axes labels */}
              <text x="100" y="88" fill="#64748b" fontSize="6" fontFamily="monospace" textAnchor="middle">
                Dose Rate Φ (e⁻/Å²·s) →
              </text>
              <text x="8" y="45" fill="#64748b" fontSize="6" fontFamily="monospace" transform="rotate(-90 8,45)">
                k_hop (s⁻¹)
              </text>
            </svg>
          </div>

          {/* Metrics breakdown */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Thermal Rate</span>
              <span className="text-emerald-400 font-bold">{metrics.thermalRate.toFixed(2)} hops/s</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Beam Knock-On</span>
              <span className="text-amber-400 font-bold">{metrics.beamRate.toFixed(2)} hops/s</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Knock-On Prob</span>
              <span className="text-slate-300 font-bold">{(metrics.knockonProbability * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spatial Representativeness & Multi-Technique Operando Validation Matrix */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Spatial Representativeness & Multi-Technique Operando Cross-Validation
            </h3>
            <p className="text-xs text-slate-400">
              Corroborating local atomic TEM observations with ensemble operando spectroscopy outside the microscope.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
            Benchmark Aligned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2 px-3">Method / Instrument</th>
                <th className="py-2 px-3">Observable / Signature</th>
                <th className="py-2 px-3">Ensemble Benchmark</th>
                <th className="py-2 px-3">Operando TEM Correlated</th>
                <th className="py-2 px-3">Consistency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Operando EXAFS (Pt L₃ Edge)</td>
                <td className="py-2 px-3 text-slate-400">Pt–Pt Coordination Number (CN)</td>
                <td className="py-2 px-3 text-cyan-300">CN = 0.42 ± 0.08</td>
                <td className="py-2 px-3 text-emerald-400">N_Pt-Pt = 0.45 (10 Hz avg)</td>
                <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Concordant
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Operando DRIFTS (CO Chemisorption)</td>
                <td className="py-2 px-3 text-slate-400">Linear (2085 cm⁻¹) vs Bridge CO (1850 cm⁻¹)</td>
                <td className="py-2 px-3 text-cyan-300">I_bridge / I_linear = 0.28</td>
                <td className="py-2 px-3 text-emerald-400">Dimer fraction = 0.31</td>
                <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Concordant
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Operando Raman (CeO₂ Defect Mode)</td>
                <td className="py-2 px-3 text-slate-400">Oxygen Vacancy Defect Band (595 cm⁻¹)</td>
                <td className="py-2 px-3 text-cyan-300">I_595 / I_465 = 0.16</td>
                <td className="py-2 px-3 text-emerald-400">V_O pinning ratio = 0.18</td>
                <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Concordant
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-200">Fixed-Bed Microreactor Benchmark</td>
                <td className="py-2 px-3 text-slate-400">Intrinsic CO₂ TOF @ 220°C, 1 bar</td>
                <td className="py-2 px-3 text-cyan-300">1.48 s⁻¹ / Pt site</td>
                <td className="py-2 px-3 text-emerald-400">1.54 s⁻¹ (Deconvolved MS)</td>
                <td className="py-2 px-3 text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Concordant
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
