import React, { useState } from 'react';
import { ManuscriptFigureData } from '../data/manuscriptData';
import { ZoomIn, Download, Info, Check, Copy } from 'lucide-react';

interface ManuscriptFigureRendererProps {
  figure: ManuscriptFigureData;
  onOpenZoom?: (fig: ManuscriptFigureData) => void;
}

export const ManuscriptFigureRenderer: React.FC<ManuscriptFigureRendererProps> = ({
  figure,
  onOpenZoom,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(`${figure.label}: ${figure.title}\n\n${figure.extendedCaption}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render unique scientific vector SVG graphics based on figure.id (1 to 20)
  const renderGraphic = (id: number) => {
    switch (id) {
      case 1:
        // Nanoreactor architecture & TTL schematic
        return (
          <svg viewBox="0 0 800 280" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            {/* Background Grid */}
            <defs>
              <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="280" fill="url(#grid1)" rx="8" />

            {/* Panel a: MEMS Nanoreactor Cell */}
            <g transform="translate(30, 20)">
              <rect x="0" y="0" width="220" height="200" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="10" y="20" fill="#38bdf8" fontSize="12" fontWeight="bold">a | MEMS Nanoreactor</text>
              {/* Top and Bottom Si3N4 membranes */}
              <rect x="25" y="40" width="170" height="10" fill="#3b82f6" opacity="0.6" rx="2" />
              <text x="70" y="48" fill="#ffffff" fontSize="9">Top Si₃N₄ (15 nm)</text>
              <rect x="25" y="140" width="170" height="10" fill="#3b82f6" opacity="0.6" rx="2" />
              <text x="65" y="148" fill="#ffffff" fontSize="9">Bottom Si₃N₄ (15 nm)</text>
              {/* Gas Flow Channel */}
              <rect x="25" y="55" width="170" height="80" fill="#0284c7" opacity="0.15" />
              <path d="M 30,95 Q 70,80 110,95 T 190,95" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4,3" />
              <text x="45" y="90" fill="#7dd3fc" fontSize="10">Gas Flow: 5 sccm He/CO/O₂</text>
              {/* Catalyst and heater */}
              <circle cx="110" cy="135" r="5" fill="#f59e0b" />
              <text x="95" y="125" fill="#fcd34d" fontSize="9">Pt₁/CeO₂</text>
              <rect x="35" y="155" width="150" height="8" fill="#ef4444" opacity="0.7" rx="2" />
              <text x="55" y="162" fill="#ffffff" fontSize="8">Pt Microheater (220 °C)</text>
            </g>

            {/* Panel b: 10 Hz Shared TTL Pulse */}
            <g transform="translate(280, 20)">
              <rect x="0" y="0" width="230" height="200" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="10" y="20" fill="#38bdf8" fontSize="12" fontWeight="bold">b | Hardware TTL Pulse (10 Hz)</text>
              <path d="M 20,80 L 50,80 L 50,45 L 80,45 L 80,80 L 120,80 L 120,45 L 150,45 L 150,80 L 190,80 L 190,45 L 220,45" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x="55" y="40" fill="#34d399" fontSize="9">5V TTL (10 ms)</text>
              <text x="80" y="100" fill="#94a3b8" fontSize="10">Shared Master Clock</text>
              {/* Divergence lines */}
              <line x1="80" y1="110" x2="40" y2="150" stroke="#64748b" strokeWidth="1.2" markerEnd="url(#arrow)" />
              <line x1="120" y1="110" x2="120" y2="150" stroke="#64748b" strokeWidth="1.2" />
              <line x1="160" y1="110" x2="200" y2="150" stroke="#64748b" strokeWidth="1.2" />
              <rect x="15" y="150" width="55" height="30" rx="4" fill="#1e293b" stroke="#0ea5e9" />
              <text x="22" y="168" fill="#e2e8f0" fontSize="8">STEM Scan</text>
              <rect x="95" y="150" width="55" height="30" rx="4" fill="#1e293b" stroke="#a855f7" />
              <text x="100" y="168" fill="#e2e8f0" fontSize="8">Beam Blank</text>
              <rect x="175" y="150" width="50" height="30" rx="4" fill="#1e293b" stroke="#10b981" />
              <text x="182" y="168" fill="#e2e8f0" fontSize="8">MS ADC</text>
            </g>

            {/* Panel c & d: Zero-Dead-Volume Fluidics & Pipeline */}
            <g transform="translate(540, 20)">
              <rect x="0" y="0" width="230" height="200" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
              <text x="10" y="20" fill="#38bdf8" fontSize="12" fontWeight="bold">c,d | Fluidics & Inverted Rate</text>
              {/* Transfer line */}
              <path d="M 20,60 C 80,40 100,100 160,80 L 210,80" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <text x="25" y="48" fill="#fbbf24" fontSize="9">Capillary L = 1.2 m</text>
              <circle cx="210" cy="80" r="4" fill="#ef4444" />
              <text x="160" y="100" fill="#94a3b8" fontSize="9">QMS Detector</text>
              {/* Convolution math callout */}
              <rect x="15" y="120" width="200" height="60" rx="4" fill="#1e1e38" stroke="#818cf8" strokeWidth="1" />
              <text x="25" y="140" fill="#a5b4fc" fontSize="10">S(t) = (R * h)(t) + n(t)</text>
              <text x="25" y="160" fill="#34d399" fontSize="10">R(t) = D⁻¹[S(t)] (τ_dead = 3.2s)</text>
            </g>

            <text x="30" y="250" fill="#64748b" fontSize="11">Fig. 1 | Hardware-synchronized operando platform architecture coupling MEMS nanoreactor with QMS.</text>
          </svg>
        );

      case 2:
        // HAADF-STEM atomic trajectory & dynamic coordination
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(30, 20)">
              {/* Simulated HAADF frame */}
              <rect x="0" y="0" width="200" height="190" rx="6" fill="#020617" stroke="#334155" />
              <text x="10" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold">a | HAADF-STEM (t = 0.0s)</text>
              {/* Ceria lattice spots */}
              {[...Array(6)].map((_, r) =>
                [...Array(6)].map((_, c) => (
                  <circle key={`${r}-${c}`} cx={35 + c * 26} cy={45 + r * 24} r="2.5" fill="#334155" opacity="0.6" />
                ))
              )}
              {/* Two isolated Pt atoms */}
              <circle cx="75" cy="95" r="7" fill="#f59e0b" opacity="0.9" />
              <circle cx="145" cy="100" r="7" fill="#f59e0b" opacity="0.9" />
              <text x="60" y="80" fill="#fbbf24" fontSize="9">Pt₁(A)</text>
              <text x="135" y="85" fill="#fbbf24" fontSize="9">Pt₁(B)</text>
              <text x="85" y="115" fill="#64748b" fontSize="9">d &gt; 4.5 Å</text>
            </g>

            <g transform="translate(260, 20)">
              <rect x="0" y="0" width="200" height="190" rx="6" fill="#020617" stroke="#334155" />
              <text x="10" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold">b | Dimer Assembled (t = 1.2s)</text>
              {[...Array(6)].map((_, r) =>
                [...Array(6)].map((_, c) => (
                  <circle key={`${r}-${c}`} cx={35 + c * 26} cy={45 + r * 24} r="2.5" fill="#334155" opacity="0.6" />
                ))
              )}
              {/* Pt2 dimer paired */}
              <line x1="100" y1="95" x2="126" y2="98" stroke="#38bdf8" strokeWidth="2.5" />
              <circle cx="100" cy="95" r="8" fill="#f59e0b" />
              <circle cx="126" cy="98" r="8" fill="#f59e0b" />
              <text x="80" y="80" fill="#38bdf8" fontSize="10" fontWeight="bold">Pt₁–Pt₂ Dimer</text>
              <text x="92" y="125" fill="#34d399" fontSize="10">d = 2.68 Å</text>
            </g>

            {/* Trajectory plot */}
            <g transform="translate(490, 20)">
              <rect x="0" y="0" width="280" height="190" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="10" y="20" fill="#38bdf8" fontSize="11" fontWeight="bold">c,d | Interatomic Trajectory d(t)</text>
              <line x1="30" y1="150" x2="260" y2="150" stroke="#475569" strokeWidth="1" />
              <line x1="30" y1="40" x2="30" y2="150" stroke="#475569" strokeWidth="1" />
              <text x="5" y="45" fill="#94a3b8" fontSize="9">d(Å)</text>
              <text x="15" y="85" fill="#94a3b8" fontSize="8">4.0</text>
              <text x="15" y="125" fill="#94a3b8" fontSize="8">2.7</text>
              {/* Distance trajectory curve */}
              <path d="M 30,80 L 60,85 L 90,82 L 105,125 L 160,126 L 180,85 L 220,83 L 235,124 L 260,125" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <rect x="105" y="115" width="55" height="25" fill="#38bdf8" opacity="0.2" rx="2" />
              <text x="110" y="130" fill="#38bdf8" fontSize="8">Dimer τ=1.8s</text>
              <text x="140" y="170" fill="#64748b" fontSize="9">Time t (s) →</text>
            </g>
          </svg>
        );

      case 3:
        // Impulse response calibration & deconvolution
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(40, 20)">
              <rect x="0" y="0" width="340" height="190" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="15" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold">a | Impulse Response h(t) Calibration</text>
              <line x1="40" y1="150" x2="310" y2="150" stroke="#475569" />
              <line x1="40" y1="40" x2="40" y2="150" stroke="#475569" />
              {/* Impulse peak */}
              <path d="M 40,150 L 100,150 Q 130,150 145,55 Q 155,50 165,85 Q 190,135 250,150 L 310,150" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <line x1="150" y1="35" x2="150" y2="150" stroke="#eab308" strokeDasharray="3,2" />
              <text x="155" y="45" fill="#eab308" fontSize="9">τ_dead = 3.20 s</text>
              <text x="175" y="85" fill="#94a3b8" fontSize="8">σ_disp = 0.55 s</text>
              <text x="150" y="170" fill="#64748b" fontSize="9">Time t (s) →</text>
            </g>

            <g transform="translate(420, 20)">
              <rect x="0" y="0" width="340" height="190" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="15" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold">b | Regularized Deconvolution R(t)</text>
              <line x1="40" y1="150" x2="310" y2="150" stroke="#475569" />
              <line x1="40" y1="40" x2="40" y2="150" stroke="#475569" />
              {/* Raw S(t) delayed */}
              <path d="M 40,140 L 110,140 Q 140,140 160,80 Q 200,80 240,140 L 310,140" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3,2" />
              <text x="175" y="95" fill="#f43f5e" fontSize="9">Raw MS S(t)</text>
              {/* Deconvolved R(t) */}
              <path d="M 40,140 L 70,140 L 80,60 L 130,60 L 140,140 L 310,140" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x="85" y="50" fill="#10b981" fontSize="9" fontWeight="bold">Deconvolved R(t) [TOF]</text>
              <text x="150" y="170" fill="#64748b" fontSize="9">Time t (s) →</text>
            </g>
          </svg>
        );

      case 5:
        // Event-aligned averaging across N = 48 events
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(50, 20)">
              <rect x="0" y="0" width="700" height="200" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="20" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Event-Aligned Averaging of CO₂ Turnover (N = 48 Events, 4 MEMS Chips)
              </text>
              <line x1="60" y1="150" x2="650" y2="150" stroke="#475569" />
              <line x1="60" y1="40" x2="60" y2="150" stroke="#475569" />
              {/* t = 0 event marker */}
              <line x1="280" y1="30" x2="280" y2="170" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3,2" />
              <text x="285" y="45" fill="#eab308" fontSize="10" fontWeight="bold">t = 0 (Pt₁→Pt₂ Dimer Formation)</text>
              {/* 95% Confidence Band */}
              <polygon points="60,150 280,150 320,110 380,85 450,90 520,135 650,148 650,155 520,145 450,110 380,105 320,130 280,155 60,155" fill="#10b981" opacity="0.2" />
              {/* Mean curve */}
              <path d="M 60,152 L 280,151 L 320,120 L 380,95 L 450,100 L 520,140 L 650,150" fill="none" stroke="#10b981" strokeWidth="3" />
              <circle cx="380" cy="95" r="5" fill="#10b981" />
              <text x="390" y="90" fill="#34d399" fontSize="11" fontWeight="bold">Δr_CO₂ = +24.6% ± 4.2%</text>
              <text x="140" y="170" fill="#94a3b8" fontSize="10">Pre-Event Baseline [-6s, 0s]</text>
              <text x="440" y="170" fill="#94a3b8" fontSize="10">Post-Event Transient [+0s, +8s]</text>
            </g>
          </svg>
        );

      case 7:
        // 3D Causal Probability Field
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(50, 20)">
              <rect x="0" y="0" width="700" height="200" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="20" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Causal Activity Map: Conditional Probability Field P(Δr &gt; 0 | D)
              </text>
              {/* Grid matrix */}
              <g transform="translate(100, 50)">
                {[0, 1, 2, 3, 4].map((x) =>
                  [0, 1, 2, 3].map((y) => {
                    const isHotspot = x === 1 && y === 3;
                    const prob = isHotspot ? 0.94 : x === 1 ? 0.72 : x === 0 ? 0.38 : 0.15;
                    const fill = isHotspot ? '#10b981' : prob > 0.6 ? '#06b6d4' : prob > 0.3 ? '#3b82f6' : '#1e293b';
                    return (
                      <g key={`${x}-${y}`} transform={`translate(${x * 90}, ${y * 28})`}>
                        <rect width="80" height="22" rx="4" fill={fill} opacity={isHotspot ? 0.9 : 0.6} stroke={isHotspot ? '#ffffff' : '#334155'} strokeWidth={isHotspot ? 1.5 : 0.8} />
                        <text x="15" y="15" fill="#ffffff" fontSize="9" fontWeight={isHotspot ? 'bold' : 'normal'}>
                          P = {prob.toFixed(2)}
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
              {/* Labels */}
              <text x="20" y="80" fill="#94a3b8" fontSize="9">N_supp = 1</text>
              <text x="20" y="110" fill="#94a3b8" fontSize="9">N_supp = 2</text>
              <text x="20" y="135" fill="#94a3b8" fontSize="9">N_supp = 3</text>
              <text x="20" y="165" fill="#34d399" fontSize="9" fontWeight="bold">Vacancy V_O</text>

              <text x="120" y="190" fill="#94a3b8" fontSize="9">Pt₁ (N=0)</text>
              <text x="205" y="190" fill="#34d399" fontSize="9" fontWeight="bold">Pt₂ Dimer (N=1)</text>
              <text x="300" y="190" fill="#94a3b8" fontSize="9">Pt₃ (N=2)</text>
              <text x="390" y="190" fill="#94a3b8" fontSize="9">Cluster (N=3)</text>
              <text x="480" y="190" fill="#94a3b8" fontSize="9">Sintered (N≥4)</text>

              {/* Callout */}
              <rect x="560" y="60" width="125" height="90" rx="6" fill="#022c22" stroke="#10b981" />
              <text x="570" y="80" fill="#34d399" fontSize="10" fontWeight="bold">Active Hotspot</text>
              <text x="570" y="100" fill="#e2e8f0" fontSize="9">Pt₁–Pt₂ @ V_O</text>
              <text x="570" y="120" fill="#10b981" fontSize="11" fontWeight="bold">P = 0.94</text>
              <text x="570" y="138" fill="#a7f3d0" fontSize="9">+28.4% TOF</text>
            </g>
          </svg>
        );

      case 8:
        // Electron dose-rate dependence & BPI
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(40, 20)">
              <rect x="0" y="0" width="340" height="190" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="15" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold">a | Hopping Rate vs Dose Rate Φ</text>
              <line x1="40" y1="150" x2="310" y2="150" stroke="#475569" />
              <line x1="40" y1="40" x2="40" y2="150" stroke="#475569" />
              {/* Linear trend */}
              <line x1="40" y1="120" x2="300" y2="50" stroke="#a855f7" strokeWidth="2.5" />
              <circle cx="40" cy="120" r="4.5" fill="#10b981" />
              <text x="48" y="118" fill="#10b981" fontSize="9" fontWeight="bold">k_thermal = 0.38 s⁻¹</text>
              <text x="180" y="70" fill="#d8b4fe" fontSize="9">σ_beam = 1.42×10⁻³ Å²/e⁻</text>
              <text x="130" y="170" fill="#64748b" fontSize="9">Dose Rate Φ (e⁻/Å²·s) →</text>
            </g>

            <g transform="translate(420, 20)">
              <rect x="0" y="0" width="340" height="190" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="15" y="22" fill="#38bdf8" fontSize="11" fontWeight="bold">b | Beam Perturbation Index (BPI)</text>
              <line x1="40" y1="150" x2="310" y2="150" stroke="#475569" />
              <line x1="40" y1="40" x2="40" y2="150" stroke="#475569" />
              {/* Safe zone shading */}
              <rect x="40" y="90" width="270" height="60" fill="#10b981" opacity="0.1" />
              <line x1="40" y1="90" x2="310" y2="90" stroke="#10b981" strokeDasharray="3,2" />
              <text x="50" y="105" fill="#34d399" fontSize="9">Safe Thermal Zone (BPI &lt; 0.25)</text>
              {/* Curve */}
              <path d="M 40,145 Q 120,135 180,105 T 300,55" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <circle cx="100" cy="138" r="4.5" fill="#10b981" />
              <text x="110" y="140" fill="#10b981" fontSize="9">Operando Dose: BPI = 0.08</text>
              <text x="130" y="170" fill="#64748b" fontSize="9">Dose Rate Φ →</text>
            </g>
          </svg>
        );

      case 15:
        // Closed-Loop Adaptive Catalyst Feedback
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(50, 20)">
              <rect x="0" y="0" width="700" height="200" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="20" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold">
                Closed-Loop Feedback Controller & Dynamic Redispersion Protocol
              </text>
              {/* Loop diagram */}
              <rect x="40" y="60" width="130" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" />
              <text x="50" y="85" fill="#e2e8f0" fontSize="10" fontWeight="bold">1. Operando STEM</text>
              <text x="50" y="105" fill="#94a3b8" fontSize="8">Coordinate stream</text>

              <line x1="170" y1="90" x2="220" y2="90" stroke="#64748b" strokeWidth="2" />

              <rect x="220" y="60" width="130" height="60" rx="6" fill="#1e293b" stroke="#a855f7" />
              <text x="230" y="85" fill="#e2e8f0" fontSize="10" fontWeight="bold">2. Coarsening Filter</text>
              <text x="230" y="105" fill="#d8b4fe" fontSize="8">NPt–Pt &gt; 1.8 Threshold</text>

              <line x1="350" y1="90" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />

              <rect x="400" y="60" width="130" height="60" rx="6" fill="#1e293b" stroke="#ef4444" />
              <text x="410" y="85" fill="#e2e8f0" fontSize="10" fontWeight="bold">3. Micro-Pulse Trigger</text>
              <text x="410" y="105" fill="#fca5a5" fontSize="8">50 ms 15% O₂ flash</text>

              <line x1="530" y1="90" x2="580" y2="90" stroke="#64748b" strokeWidth="2" />

              <rect x="580" y="60" width="100" height="60" rx="6" fill="#064e3b" stroke="#10b981" />
              <text x="590" y="85" fill="#a7f3d0" fontSize="10" fontWeight="bold">4. Redispersion</text>
              <text x="590" y="105" fill="#34d399" fontSize="8">Pt₁ 96% Restored</text>

              {/* Feedback arrow */}
              <path d="M 630,120 L 630,160 L 105,160 L 105,120" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4,3" />
              <text x="280" y="175" fill="#34d399" fontSize="10">Active closed-loop stabilization cycle (&lt;1.5 s)</text>
            </g>
          </svg>
        );

      case 20:
        // DFT reaction energy profile
        return (
          <svg viewBox="0 0 800 260" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <g transform="translate(50, 20)">
              <rect x="0" y="0" width="700" height="200" rx="6" fill="#0f172a" stroke="#334155" />
              <text x="20" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold">
                DFT+U Reaction Free Energy Coordinates (T = 220 °C, P = 1 bar)
              </text>
              <line x1="50" y1="160" x2="650" y2="160" stroke="#475569" />
              <line x1="50" y1="40" x2="50" y2="160" stroke="#475569" />
              <text x="15" y="45" fill="#94a3b8" fontSize="9">ΔG (eV)</text>

              {/* Isolated Pt1 path (high barrier) */}
              <path d="M 60,140 L 140,70 L 220,70 L 320,30 L 400,100 L 520,110 L 640,160" fill="none" stroke="#ef4444" strokeWidth="2.5" />
              <text x="325" y="25" fill="#f87171" fontSize="9" fontWeight="bold">E_a = 1.42 eV (Pt₁ O–O scission barrier)</text>

              {/* Pt1-Pt2 dimer path (facile barrier) */}
              <path d="M 60,140 L 140,110 L 220,110 L 320,80 L 400,140 L 520,145 L 640,160" fill="none" stroke="#10b981" strokeWidth="2.5" />
              <text x="325" y="75" fill="#34d399" fontSize="9" fontWeight="bold">E_a = 0.38 eV (Pt₁–Pt₂ Dimer facile scission)</text>

              {/* Stage labels */}
              <text x="50" y="180" fill="#94a3b8" fontSize="9">Reactants</text>
              <text x="150" y="180" fill="#94a3b8" fontSize="9">CO* Ads.</text>
              <text x="300" y="180" fill="#94a3b8" fontSize="9">O₂* Dissoc. TS</text>
              <text x="450" y="180" fill="#94a3b8" fontSize="9">CO₂* Coupling</text>
              <text x="600" y="180" fill="#94a3b8" fontSize="9">Products</text>
            </g>
          </svg>
        );

      default:
        // Generic scientific panel representation for remaining figures (4, 6, 9-14, 16-19)
        return (
          <svg viewBox="0 0 800 240" className="w-full h-auto bg-slate-950 rounded-lg p-2 font-mono">
            <rect width="800" height="240" rx="8" fill="#0f172a" stroke="#334155" />
            <text x="25" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">
              {figure.label} | {figure.title}
            </text>

            <g transform="translate(30, 50)">
              {/* 4 Quadrants/panels (a, b, c, d) */}
              {figure.panels.map((p, idx) => {
                const x = (idx % 2) * 370;
                const y = Math.floor(idx / 2) * 80;
                return (
                  <g key={p.label} transform={`translate(${x}, ${y})`}>
                    <rect width="350" height="70" rx="4" fill="#020617" stroke="#1e293b" />
                    <text x="10" y="20" fill="#eab308" fontSize="10" fontWeight="bold">
                      {p.label} | {p.title}
                    </text>
                    <text x="10" y="40" fill="#94a3b8" fontSize="9">
                      {p.description}
                    </text>
                    {/* Small preview decorative wave */}
                    <path
                      d="M 220,50 Q 250,20 280,45 T 340,35"
                      fill="none"
                      stroke={idx % 2 === 0 ? '#10b981' : '#06b6d4'}
                      strokeWidth="1.8"
                    />
                  </g>
                );
              })}
            </g>
          </svg>
        );
    }
  };

  return (
    <figure
      id={`figure-${figure.id}`}
      className="my-8 p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 flex flex-col gap-3 shadow-md scroll-mt-24"
    >
      {/* Top action bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-xs font-mono font-bold text-cyan-400">
          {figure.label.toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCaption}
            className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors"
            title="Copy Figure Caption"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Caption'}</span>
          </button>
          {onOpenZoom && (
            <button
              onClick={() => onOpenZoom(figure)}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-950 border border-slate-800 transition-colors"
            >
              <ZoomIn className="w-3 h-3" />
              <span>Inspect Vector</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Vector Rendering */}
      <div className="w-full overflow-hidden rounded-lg border border-slate-800/80">
        {renderGraphic(figure.id)}
      </div>

      {/* Formal Q1 Scientific Caption */}
      <figcaption className="text-xs text-slate-300 leading-relaxed pt-1 space-y-1 font-serif">
        <p>
          <strong className="font-sans font-bold text-slate-100">
            {figure.label} | {figure.title}.
          </strong>{' '}
          {figure.caption}
        </p>
        <p className="text-[11px] text-slate-400 font-sans leading-normal">
          {figure.extendedCaption}
        </p>
      </figcaption>
    </figure>
  );
};
