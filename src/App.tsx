import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { OperandoNanoreactorView } from './components/OperandoNanoreactorView';
import { SynchronizedStreamChart } from './components/SynchronizedStreamChart';
import { CausalActivityMap } from './components/CausalActivityMap';
import { BeamAwareFramework } from './components/BeamAwareFramework';
import { AdaptiveCatalystController } from './components/AdaptiveCatalystController';
import { AICausalAnalystModal } from './components/AICausalAnalystModal';
import { ManuscriptView } from './components/ManuscriptView';
import {
  ModelSystem,
  ReactionTarget,
  Atom2D,
  DescriptorsD_t,
  MassSpecSample,
  CatalyticEvent,
  BeamSettings,
  BeamPerturbationMetrics,
  DelayCalibration,
  AdaptiveControlState,
} from './types';
import { MODEL_SYSTEMS, REACTION_TARGETS } from './data/modelsAndReactions';
import {
  initializeAtoms,
  stepAtomicSimulation,
  generateImpulseResponse,
  simulateDelayedMassSpec,
  computeBeamPerturbation,
} from './utils/kineticsEngine';

export default function App() {
  // Model and Reaction Targets
  const [currentSystem, setCurrentSystem] = useState<ModelSystem>(MODEL_SYSTEMS[0]);
  const [currentReaction, setCurrentReaction] = useState<ReactionTarget>(REACTION_TARGETS[0]);

  // Master Synchronized Clock & Run state
  const [simTime, setSimTime] = useState<number>(14.2);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<
    'nanoreactor' | 'causal_map' | 'beam_aware' | 'adaptive_catalyst' | 'manuscript'
  >('nanoreactor');

  // Reactor physical parameters
  const [temperature, setTemperature] = useState<number>(220); // °C
  const [pressure, setPressure] = useState<number>(1.2); // bar
  const [flowRate, setFlowRate] = useState<number>(5.0); // sccm

  // Electron Beam Settings
  const [beamSettings, setBeamSettings] = useState<BeamSettings>({
    doseRate: 25, // e-/Å²·s
    mode: 'continuous',
    exposureDuration_s: 1.5,
    blankingDuration_s: 6.0,
    isCurrentlyBlanked: false,
    beamVoltage_kV: 200,
  });

  // Delay Calibration & Transfer line
  const [calibration, setCalibration] = useState<DelayCalibration>(() => {
    const tau = 3.2;
    const sigma = 0.55;
    return {
      flowRate_sccm: 5.0,
      transferLineLength_m: 1.2,
      transferLineTemp_C: 180,
      carrierGas: 'He',
      tauDead: tau,
      sigmaDisp: sigma,
      impulseResponse_h: generateImpulseResponse(tau, sigma, 0.2),
      useDeconvolution: true,
    };
  });

  // Closed Loop Adaptive Catalyst State
  const [adaptiveControl, setAdaptiveControl] = useState<AdaptiveControlState>({
    enabled: true,
    targetRegime: 'anti_sintering',
    sinteringThreshold: 1.8,
    pulseType: 'oxidative_flash',
    pulseActive: false,
    totalRegenerations: 12,
    stabilityScore: 94,
  });

  // Atomic state
  const [atoms, setAtoms] = useState<Atom2D[]>(() => initializeAtoms(MODEL_SYSTEMS[0], 24));
  const [descriptors, setDescriptors] = useState<DescriptorsD_t>({
    timestamp: 14.2,
    nPTPt: 0.45,
    nPTSupp: 3.4,
    qPt: 2.1,
    rHop: 0.48,
    tauCluster: 1.8,
    thetaAds: 0.65,
    temperature: 220,
    pressure: 1.2,
    potential_V: 0.85,
    current_mA: 12.4,
    isolatedPtCount: 16,
    dimerCount: 3,
    clusterCount: 1,
  });

  // Multi-modal data histories
  const [descriptorsHistory, setDescriptorsHistory] = useState<DescriptorsD_t[]>([]);
  const [msHistory, setMsHistory] = useState<MassSpecSample[]>([]);
  const [events, setEvents] = useState<CatalyticEvent[]>([]);

  // AI Modal
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Rate history ref for convolution
  const intrinsicRateHistoryRef = useRef<{ timestamp: number; intrinsicRate: number }[]>([]);

  // Calculate current beam perturbation metrics
  const beamMetrics: BeamPerturbationMetrics = computeBeamPerturbation(
    temperature,
    beamSettings.doseRate,
    currentSystem.baseEaHopping_eV,
    beamSettings.isCurrentlyBlanked,
    beamSettings.beamVoltage_kV
  );

  // Reset experiment
  const handleReset = useCallback(() => {
    setSimTime(0);
    const initialAtoms = initializeAtoms(currentSystem, 24);
    setAtoms(initialAtoms);
    setDescriptorsHistory([]);
    setMsHistory([]);
    setEvents([]);
    intrinsicRateHistoryRef.current = [];
  }, [currentSystem]);

  // When Model System changes, reinitialize atoms
  const handleSelectSystem = (sys: ModelSystem) => {
    setCurrentSystem(sys);
    setAtoms(initializeAtoms(sys, 24));
  };

  // Trigger manual anti-sintering pulse
  const triggerManualPulse = useCallback(() => {
    setAdaptiveControl((prev) => ({
      ...prev,
      pulseActive: true,
      totalRegenerations: prev.totalRegenerations + 1,
    }));

    setTimeout(() => {
      setAdaptiveControl((prev) => ({ ...prev, pulseActive: false }));
    }, 1500);
  }, []);

  // Update calibration if flow rate changes
  useEffect(() => {
    const newTau = 3.2 * (5.0 / (flowRate || 1));
    const newSigma = 0.55 * Math.sqrt(5.0 / (flowRate || 1));
    setCalibration((prev) => ({
      ...prev,
      flowRate_sccm: flowRate,
      tauDead: newTau,
      sigmaDisp: newSigma,
      impulseResponse_h: generateImpulseResponse(newTau, newSigma, 0.2),
    }));
  }, [flowRate]);

  // Main simulation tick (runs at 10 Hz / every 100ms when isRunning)
  useEffect(() => {
    if (!isRunning) return;

    const dt = 0.2; // 200 ms simulated time per step
    const interval = setInterval(() => {
      setSimTime((prevTime) => {
        const nextTime = prevTime + dt;

        // Check stroboscopic beam blanking schedule
        if (beamSettings.mode === 'stroboscopic') {
          const cycleLength = beamSettings.exposureDuration_s + beamSettings.blankingDuration_s;
          const cyclePos = nextTime % cycleLength;
          const shouldBlank = cyclePos >= beamSettings.exposureDuration_s;
          if (shouldBlank !== beamSettings.isCurrentlyBlanked) {
            setBeamSettings((bs) => ({ ...bs, isCurrentlyBlanked: shouldBlank }));
          }
        }

        // Advance atomic coordinates and descriptors
        setAtoms((currentAtoms) => {
          const result = stepAtomicSimulation(
            currentAtoms,
            dt,
            nextTime,
            currentSystem,
            currentReaction,
            temperature,
            pressure,
            beamSettings,
            adaptiveControl.pulseActive
          );

          setDescriptors(result.descriptors);

          // Append to history
          setDescriptorsHistory((prev) => {
            const next = [...prev, result.descriptors];
            if (next.length > 180) next.shift();
            return next;
          });

          // Check if new events occurred
          if (result.events.length > 0) {
            setEvents((prev) => [...prev, ...result.events].slice(-50));
          }

          // Maintain intrinsic rate history for MEMS transfer line convolution
          intrinsicRateHistoryRef.current.push({
            timestamp: nextTime,
            intrinsicRate: result.intrinsicRate,
          });
          if (intrinsicRateHistoryRef.current.length > 180) {
            intrinsicRateHistoryRef.current.shift();
          }

          // Simulate Mass Spectrometry with transport delay & dispersion
          const msSample = simulateDelayedMassSpec(
            intrinsicRateHistoryRef.current,
            calibration.impulseResponse_h,
            dt,
            currentReaction
          );

          setMsHistory((prev) => {
            const next = [...prev, msSample];
            if (next.length > 180) next.shift();
            return next;
          });

          // Automated Closed-Loop Anti-Sintering trigger check
          if (
            adaptiveControl.enabled &&
            !adaptiveControl.pulseActive &&
            adaptiveControl.targetRegime === 'anti_sintering'
          ) {
            if (result.descriptors.nPTPt > adaptiveControl.sinteringThreshold) {
              // Trigger automated anti-sintering pulse
              triggerManualPulse();
            }
          }

          return result.updatedAtoms;
        });

        return nextTime;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [
    isRunning,
    currentSystem,
    currentReaction,
    temperature,
    pressure,
    beamSettings,
    adaptiveControl,
    calibration.impulseResponse_h,
    triggerManualPulse,
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        currentSystem={currentSystem}
        onSelectSystem={handleSelectSystem}
        currentReaction={currentReaction}
        onSelectReaction={setCurrentReaction}
        isRunning={isRunning}
        onToggleRun={() => setIsRunning(!isRunning)}
        onReset={handleReset}
        simTime={simTime}
        bpi={beamMetrics.bpi}
        isBeamBlanked={beamSettings.isCurrentlyBlanked}
        onOpenAiAnalyst={() => setIsAiModalOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Dynamic Tab Views */}
        {activeTab === 'nanoreactor' && (
          <div className="space-y-6 animate-fade-in">
            {/* Live HAADF-STEM Nanoreactor & EELS Inset */}
            <OperandoNanoreactorView
              atoms={atoms}
              descriptors={descriptors}
              system={currentSystem}
              reaction={currentReaction}
              beamSettings={beamSettings}
              temperature={temperature}
              onTemperatureChange={setTemperature}
              pressure={pressure}
              onPressureChange={setPressure}
              flowRate={flowRate}
              onFlowRateChange={setFlowRate}
              isAdaptivePulseActive={adaptiveControl.pulseActive}
            />

            {/* Synchronized Multi-Modal Stream Chart */}
            <SynchronizedStreamChart
              descriptorsHistory={descriptorsHistory}
              msHistory={msHistory}
              events={events}
              reaction={currentReaction}
              calibration={calibration}
              simTime={simTime}
            />
          </div>
        )}

        {activeTab === 'causal_map' && (
          <div className="animate-fade-in">
            <CausalActivityMap
              system={currentSystem}
              reaction={currentReaction}
              events={events}
              tauDead={calibration.tauDead}
            />
          </div>
        )}

        {activeTab === 'beam_aware' && (
          <div className="animate-fade-in">
            <BeamAwareFramework
              beamSettings={beamSettings}
              onUpdateBeamSettings={(newSettings) =>
                setBeamSettings((prev) => ({ ...prev, ...newSettings }))
              }
              metrics={beamMetrics}
              onToggleBeamBlank={() =>
                setBeamSettings((prev) => ({
                  ...prev,
                  isCurrentlyBlanked: !prev.isCurrentlyBlanked,
                }))
              }
            />
          </div>
        )}

        {activeTab === 'adaptive_catalyst' && (
          <div className="animate-fade-in">
            <AdaptiveCatalystController
              controlState={adaptiveControl}
              onUpdateControlState={(newState) =>
                setAdaptiveControl((prev) => ({ ...prev, ...newState }))
              }
              descriptors={descriptors}
              system={currentSystem}
              onTriggerManualPulse={triggerManualPulse}
              isPulseActive={adaptiveControl.pulseActive}
            />
          </div>
        )}

        {activeTab === 'manuscript' && (
          <div className="animate-fade-in">
            <ManuscriptView />
          </div>
        )}
      </main>

      {/* AI Causal Analyst Modal */}
      <AICausalAnalystModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        system={currentSystem}
        reaction={currentReaction}
        descriptors={descriptors}
        events={events}
        beamMetrics={beamMetrics}
        tauDead={calibration.tauDead}
      />
    </div>
  );
}
