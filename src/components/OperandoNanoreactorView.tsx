import React, { useRef, useEffect, useState } from 'react';
import {
  Atom2D,
  DescriptorsD_t,
  ModelSystem,
  ReactionTarget,
  BeamSettings,
} from '../types';
import {
  Eye,
  Crosshair,
  Thermometer,
  Gauge,
  Wind,
  Layers,
  Activity,
  Maximize2,
} from 'lucide-react';

interface OperandoNanoreactorViewProps {
  atoms: Atom2D[];
  descriptors: DescriptorsD_t;
  system: ModelSystem;
  reaction: ReactionTarget;
  beamSettings: BeamSettings;
  temperature: number;
  onTemperatureChange: (val: number) => void;
  pressure: number;
  onPressureChange: (val: number) => void;
  flowRate: number;
  onFlowRateChange: (val: number) => void;
  isAdaptivePulseActive: boolean;
}

export const OperandoNanoreactorView: React.FC<OperandoNanoreactorViewProps> = ({
  atoms,
  descriptors,
  system,
  reaction,
  beamSettings,
  temperature,
  onTemperatureChange,
  pressure,
  onPressureChange,
  flowRate,
  onFlowRateChange,
  isAdaptivePulseActive,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedAtom, setSelectedAtom] = useState<Atom2D | null>(null);
  const [showTrails, setShowTrails] = useState(true);
  const [showCoordBonds, setShowCoordBonds] = useState(true);
  const [showVacancies, setShowVacancies] = useState(true);
  const [showAdsorbates, setShowAdsorbates] = useState(true);
  const [scanlineY, setScanlineY] = useState(0);

  // Scanline animation loop
  useEffect(() => {
    let frameId: number;
    const animate = () => {
      setScanlineY((prev) => (prev > 500 ? 0 : prev + 2.5));
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Render Canvas (HAADF-STEM atomic view)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = width / 8.0; // 8.0 nm box

    // Clear with dark substrate background (simulating carbon or oxide film in ADF)
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, 0, width, height);

    // Substrate atomic lattice texture (CeO2 fluorite or TiO2 rutile rows)
    ctx.fillStyle = '#0c1524';
    const latticeStep = 0.38 * scale; // ~0.38 nm lattice spacing
    for (let x = 0; x < width; x += latticeStep) {
      for (let y = 0; y < height; y += latticeStep) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Oxygen vacancies (V_O) if CeO2 or TiO2
    if (showVacancies && (system.supportType === 'CeO2' || system.supportType === 'TiO2')) {
      const vSpacing = 1.4 * scale;
      for (let vx = 0.7 * scale; vx < width; vx += vSpacing) {
        for (let vy = 0.7 * scale; vy < height; vy += vSpacing) {
          // Vacancy defect glow
          const grad = ctx.createRadialGradient(vx, vy, 1, vx, vy, 14);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
          grad.addColorStop(0.5, 'rgba(239, 68, 68, 0.15)');
          grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(vx, vy, 14, 0, Math.PI * 2);
          ctx.fill();

          // Defect box outline
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(vx - 4, vy - 4, 8, 8);
        }
      }
    }

    // Trajectory trails
    if (showTrails) {
      for (const atom of atoms) {
        if (!atom.trajectory || atom.trajectory.length < 2) continue;
        ctx.beginPath();
        ctx.moveTo(atom.trajectory[0].x * scale, atom.trajectory[0].y * scale);
        for (let t = 1; t < atom.trajectory.length; t++) {
          ctx.lineTo(atom.trajectory[t].x * scale, atom.trajectory[t].y * scale);
        }
        ctx.strokeStyle =
          atom.clusterSize === 2
            ? 'rgba(234, 179, 8, 0.35)' // gold for active dimer
            : atom.clusterSize > 2
            ? 'rgba(244, 63, 94, 0.35)' // red for cluster
            : 'rgba(6, 182, 212, 0.25)'; // cyan for single atom
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }

    // Coordination bonds (Pt-Pt / Pt-M)
    if (showCoordBonds) {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a = atoms[i];
          const b = atoms[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 0.38) {
            // Draw bond line
            ctx.beginPath();
            ctx.moveTo(a.x * scale, a.y * scale);
            ctx.lineTo(b.x * scale, b.y * scale);

            // Glowing bond
            ctx.strokeStyle = a.clusterSize === 2 && b.clusterSize === 2
              ? 'rgba(250, 204, 21, 0.9)'
              : 'rgba(244, 63, 94, 0.7)';
            ctx.lineWidth = 2.4;
            ctx.stroke();

            // Interatomic distance label (in Angstroms)
            const midX = ((a.x + b.x) / 2) * scale;
            const midY = ((a.y + b.y) / 2) * scale;
            ctx.fillStyle = '#fef08a';
            ctx.font = '9px JetBrains Mono, monospace';
            ctx.fillText(`${(dist * 10).toFixed(2)} Å`, midX + 4, midY - 4);
          }
        }
      }
    }

    // Render individual atoms with HAADF-STEM Z-contrast
    for (const atom of atoms) {
      const px = atom.x * scale;
      const py = atom.y * scale;

      const isDimer = atom.clusterSize === 2;
      const isCluster = atom.clusterSize > 2;
      const isDual = atom.element === 'DualMetal';

      // Atomic intensity glow (HAADF Z^1.7 contrast)
      const grad = ctx.createRadialGradient(px, py, 1, px, py, isDimer ? 22 : 16);
      if (isDimer) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(250, 204, 21, 0.85)');
        grad.addColorStop(0.7, 'rgba(234, 179, 8, 0.35)');
        grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      } else if (isCluster) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(244, 63, 94, 0.8)');
        grad.addColorStop(0.7, 'rgba(225, 29, 72, 0.3)');
        grad.addColorStop(1, 'rgba(225, 29, 72, 0)');
      } else if (isDual) {
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(168, 85, 247, 0.85)');
        grad.addColorStop(0.7, 'rgba(147, 51, 234, 0.3)');
        grad.addColorStop(1, 'rgba(147, 51, 234, 0)');
      } else {
        // Isolated Pt1
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(34, 211, 238, 0.85)');
        grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.25)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, isDimer ? 22 : 16, 0, Math.PI * 2);
      ctx.fill();

      // Core nucleus
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();

      // Selected ring
      if (selectedAtom && selectedAtom.id === atom.id) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Adsorbate tag (e.g. CO or O)
      if (showAdsorbates && atom.adsorbate) {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(px + 9, py - 9, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px sans-serif';
        ctx.fillText(atom.adsorbate, px + 14, py - 8);
      }
    }

    // Stroboscopic Beam-Blanking Overlay if currently blanked
    if (beamSettings.isCurrentlyBlanked) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '13px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('BEAM BLANKED (STROBOSCOPIC INTERVAL)', width / 2, height / 2 - 10);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText('Thermal relaxation window • Zero knock-on irradiation', width / 2, height / 2 + 12);
      ctx.textAlign = 'start';
    } else {
      // STEM Raster Scan line
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(0, scanlineY, width, 2);
    }

    // Adaptive pulse indicator
    if (isAdaptivePulseActive) {
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, width, height);
    }
  }, [
    atoms,
    selectedAtom,
    showTrails,
    showCoordBonds,
    showVacancies,
    showAdsorbates,
    beamSettings.isCurrentlyBlanked,
    scanlineY,
    system.supportType,
    isAdaptivePulseActive,
  ]);

  // Handle canvas click to select atom
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 8.0;
    const y = ((e.clientY - rect.top) / rect.height) * 8.0;

    // Find closest atom
    let closest: Atom2D | null = null;
    let minDist = 0.5; // nm
    for (const a of atoms) {
      const dist = Math.sqrt((a.x - x) ** 2 + (a.y - y) ** 2);
      if (dist < minDist) {
        minDist = dist;
        closest = a;
      }
    }
    setSelectedAtom(closest);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top status & nanoreactor environment header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Pt–Pt Coordination</span>
          </div>
          <div className="text-lg font-mono font-bold text-cyan-300">
            N = {descriptors.nPTPt.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">
            {descriptors.isolatedPtCount} Pt₁ | {descriptors.dimerCount} Pt₂ | {descriptors.clusterCount} Ptₙ
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Pt–Support Coordination</span>
          </div>
          <div className="text-lg font-mono font-bold text-emerald-300">
            N = {descriptors.nPTSupp.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">
            {system.smsiActive ? 'SMSI Vacancy-anchored' : 'Perimeter bound'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3 h-3 text-amber-400" />
            <span>Pt Oxidation Proxy (EELS)</span>
          </div>
          <div className="text-lg font-mono font-bold text-amber-300">
            q = +{descriptors.qPt.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-500">
            {descriptors.qPt > 2.0 ? 'Pt²⁺/Pt⁴⁺ oxide state' : 'Pt⁰ metallic state'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Wind className="w-3 h-3 text-purple-400" />
            <span>Hopping Rate (r_hop)</span>
          </div>
          <div className="text-lg font-mono font-bold text-purple-300">
            {descriptors.rHop.toFixed(2)} <span className="text-xs font-normal text-slate-400">s⁻¹</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Thermal + Beam mobility
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3 h-3 text-rose-400" />
            <span>Active Cluster Lifetime</span>
          </div>
          <div className="text-lg font-mono font-bold text-rose-300">
            τ = {descriptors.tauCluster.toFixed(2)} <span className="text-xs font-normal text-slate-400">s</span>
          </div>
          <div className="text-[10px] text-slate-500">Dynamic ensemble lifetime</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
            <Crosshair className="w-3 h-3 text-blue-400" />
            <span>Adsorbate Coverage</span>
          </div>
          <div className="text-lg font-mono font-bold text-blue-300">
            θ = {(descriptors.thetaAds * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-500">{reaction.reactants[0]} chemisorption</div>
        </div>
      </div>

      {/* Main HAADF-STEM Canvas & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive HAADF-STEM Display */}
        <div className="lg:col-span-8 flex flex-col gap-2 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 relative overflow-hidden shadow-lg">
          {/* Header Bar inside View */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">HAADF-STEM Dynamic Tracking</span>
              <span className="text-[10px] font-mono text-slate-500">8.0 × 8.0 nm Field of View</span>
            </div>

            {/* View toggles */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
              <button
                onClick={() => setShowTrails(!showTrails)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  showTrails ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500'
                }`}
                title="Toggle Atomic Trajectory Trails"
              >
                Trails
              </button>
              <button
                onClick={() => setShowCoordBonds(!showCoordBonds)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  showCoordBonds ? 'bg-amber-500/20 text-amber-300' : 'text-slate-500'
                }`}
                title="Toggle Coordination Bonds (< 3.8 Å)"
              >
                Bonds
              </button>
              <button
                onClick={() => setShowVacancies(!showVacancies)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  showVacancies ? 'bg-rose-500/20 text-rose-300' : 'text-slate-500'
                }`}
                title="Toggle Support Oxygen Vacancies"
              >
                Vacancies
              </button>
              <button
                onClick={() => setShowAdsorbates(!showAdsorbates)}
                className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                  showAdsorbates ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'
                }`}
                title="Toggle Adsorbates"
              >
                Adsorbates
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative aspect-square w-full max-w-[560px] mx-auto rounded-lg overflow-hidden border border-slate-800/80 bg-black cursor-crosshair">
            <canvas
              ref={canvasRef}
              width={560}
              height={560}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain"
            />

            {/* Overlay Scale Bar */}
            <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-300 flex items-center gap-2">
              <div className="w-14 h-1 bg-white rounded-full" />
              <span>1.0 nm</span>
            </div>

            {/* Dose Rate Badge */}
            <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-sm border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{beamSettings.doseRate} e⁻/Å²·s</span>
            </div>

            {/* Adaptive Regeneration Flash Banner */}
            {isAdaptivePulseActive && (
              <div className="absolute top-3 left-3 bg-rose-950/90 border border-rose-600 text-rose-200 px-2.5 py-1 rounded text-xs font-mono font-bold animate-pulse">
                ⚡ ACTIVE STABILIZATION PULSE (REDISPERSING PT CLUSTERS)
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Pt₁ Monomer
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Pt₁–Pt₂ Dimer
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Ptₙ Cluster
              </span>
              {system.supportType === 'Dual-Atom' && (
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> {system.dualMetal} Hetero-atom
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[10px]">
              Click any atom to inspect sub-angstrom coords & local EELS proxy
            </div>
          </div>
        </div>

        {/* Right Sidebar: Atom Inspector, EELS Spectrum, & In-Situ Controls */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {/* Selected Atom Inspector */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                Atomic Coordinate Inspector
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {selectedAtom ? `Atom #${selectedAtom.id}` : 'Select an atom'}
              </span>
            </div>

            {selectedAtom ? (
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Element:</span>
                  <span className="text-slate-200">{selectedAtom.element}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Position (x, y, z):</span>
                  <span className="text-cyan-300">
                    [{selectedAtom.x.toFixed(3)}, {selectedAtom.y.toFixed(3)}, {selectedAtom.z.toFixed(2)}] nm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coordination State:</span>
                  <span className={selectedAtom.coordinationPt === 1 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                    Pt–Pt: {selectedAtom.coordinationPt} | Supp: {selectedAtom.coordinationSupport.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ensemble Group:</span>
                  <span className="text-slate-200">
                    {selectedAtom.clusterSize === 1
                      ? 'Isolated Monomer (Pt₁)'
                      : selectedAtom.clusterSize === 2
                      ? 'Active Dimer (Pt₂)'
                      : `Cluster (Pt_${selectedAtom.clusterSize})`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Oxidation Proxy:</span>
                  <span className="text-amber-300">+{selectedAtom.oxidationState.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hop Breakdown:</span>
                  <span className="text-slate-300">
                    {selectedAtom.thermalHops} Thermal / {selectedAtom.beamInducedHops} Beam
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vacancy Pinning:</span>
                  <span className={selectedAtom.isPinnedToVacancy ? 'text-emerald-400' : 'text-slate-500'}>
                    {selectedAtom.isPinnedToVacancy ? 'Anchored to V_O' : 'Mobile on Terrace'}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic py-4 text-center">
                Click any atomic dot in the HAADF-STEM field to view trajectory logs, local oxidation state, and bond distances.
              </p>
            )}
          </div>

          {/* Operando EELS Spectrum Inset */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-purple-400" />
                Operando EELS Spectrum (Pt M₃ Edge)
              </span>
              <span className="text-[10px] font-mono text-purple-300">
                White-line Ratio: {descriptors.qPt.toFixed(2)}
              </span>
            </div>

            {/* Synthetic EELS curve SVG */}
            <div className="h-28 w-full bg-slate-950 rounded-lg p-2 relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                {/* Background Grid */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#1e293b" strokeDasharray="2,2" />

                {/* EELS baseline + Pt M3 edge white line peak */}
                {/* Dynamic peak height driven by qPt oxidation state */}
                <path
                  d={`M 0,70 Q 50,68 80,65 Q 105,${Math.max(10, 65 - descriptors.qPt * 18)} 120,40 Q 140,55 200,60`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.2"
                />

                {/* Shaded area under peak */}
                <path
                  d={`M 80,65 Q 105,${Math.max(10, 65 - descriptors.qPt * 18)} 120,40 L 120,75 L 80,75 Z`}
                  fill="rgba(168, 85, 247, 0.2)"
                />

                {/* Label */}
                <text x="105" y="16" fill="#c084fc" fontSize="7" textAnchor="middle" fontFamily="monospace">
                  Pt M₃ White-line
                </text>
                <text x="10" y="75" fill="#64748b" fontSize="6" fontFamily="monospace">
                  2120 eV
                </text>
                <text x="180" y="75" fill="#64748b" fontSize="6" fontFamily="monospace">
                  2180 eV
                </text>
              </svg>
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
              <span>Pt⁰ (metallic 5d state)</span>
              <span className="text-purple-400 font-mono">
                {descriptors.qPt > 1.8 ? 'Strong d-band oxidation' : 'Reduced metallic'}
              </span>
              <span>Pt²⁺ / Pt⁴⁺</span>
            </div>
          </div>

          {/* In-Situ Nanoreactor Controls */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-3">
            <span className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5">
              MEMS Nanoreactor Operating Parameters
            </span>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  Microheater Temp (T)
                </span>
                <span className="font-mono text-amber-400 font-bold">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="25"
                max="450"
                step="5"
                value={temperature}
                onChange={(e) => onTemperatureChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Pressure Slider */}
            <div>
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  Nanoreactor Pressure (P)
                </span>
                <span className="font-mono text-blue-400 font-bold">{pressure.toFixed(2)} bar</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.05"
                value={pressure}
                onChange={(e) => onPressureChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Flow Rate */}
            <div>
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-emerald-400" />
                  Gas Flow Rate (F)
                </span>
                <span className="font-mono text-emerald-400 font-bold">{flowRate.toFixed(1)} sccm</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={flowRate}
                onChange={(e) => onFlowRateChange(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                <span>Calculated Dead Time:</span>
                <span className="font-mono text-slate-300">{(3.2 * (5.0 / (flowRate || 1))).toFixed(2)} s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
