/**
 * Core type definitions for Catalytic Event Microscopy platform
 */

export interface ModelSystem {
  id: string;
  name: string;
  chemicalFormula: string;
  supportType: 'CeO2' | 'TiO2' | 'N-C' | 'Dual-Atom';
  description: string;
  smsiActive: boolean;
  vacancyConcentration: number; // 0 to 1
  baseEaHopping_eV: number;
  ptLoading_wtPct: number;
  dualMetal?: string; // 'Fe' | 'Co' | 'Sn'
  preferredMotif: string;
}

export interface ReactionTarget {
  id: string;
  name: string;
  reactants: string[];
  products: string[];
  stoichiometry: string;
  massChannels: { [label: string]: number }; // e.g. { 'CO': 28, 'O2': 32, 'CO2': 44 }
  typicalTempRange_C: [number, number];
  typicalPressure_bar: [number, number];
  primaryProductLabel: string;
  turnoverKey: string;
}

export interface Atom2D {
  id: number;
  element: 'Pt' | 'Support' | 'DualMetal' | 'Adsorbate';
  x: number; // nm
  y: number; // nm
  vx: number;
  vy: number;
  z: number; // relative depth proxy (0 to 1)
  coordinationPt: number; // Pt-Pt bonds
  coordinationSupport: number; // Pt-support bonds
  oxidationState: number; // +0.0 to +4.0 proxy
  clusterId: number; // grouping index
  clusterSize: number; // 1 = single atom, 2 = dimer, etc.
  adsorbate: string | null; // 'CO' | 'O' | 'H' | 'C2H4' | null
  trajectory: { x: number; y: number; t: number }[];
  isPinnedToVacancy: boolean;
  lastHopTimestamp: number;
  beamInducedHops: number;
  thermalHops: number;
}

export interface DescriptorsD_t {
  timestamp: number; // seconds
  nPTPt: number; // Pt-Pt coordination average
  nPTSupp: number; // Pt-support coordination average
  qPt: number; // oxidation state proxy from EELS
  rHop: number; // hopping rate (hops / atom / s)
  tauCluster: number; // mean active cluster lifetime (s)
  thetaAds: number; // fractional adsorbate coverage (0 to 1)
  temperature: number; // °C
  pressure: number; // bar
  potential_V: number; // V vs RHE
  current_mA: number; // mA
  isolatedPtCount: number;
  dimerCount: number;
  clusterCount: number;
}

export interface MassSpecSample {
  timestamp: number;
  rawChannels: { [channel: number]: number }; // ion current (pA or a.u.)
  deconvolvedRate: number; // product rate r(t)
  turnoverFrequency: number; // TOF in s^-1
  reactantConversion: number; // % (e.g. X_CO)
  simulatedTrueRate: number; // true instantaneous rate at catalyst
}

export interface CatalyticEvent {
  id: string;
  timestamp: number; // when structural event occurred in TEM
  type: 'dimer_formation' | 'cluster_dissociation' | 'vacancy_capture' | 'sintering' | 'redispersion';
  description: string;
  involvedAtomIds: number[];
  preEventRate: number;
  postEventRate: number;
  deltaTOF_pct: number;
  bpiAtEvent: number;
  isCausalValidated: boolean;
}

export interface BeamSettings {
  doseRate: number; // e-/Å²·s (0.1 to 500)
  mode: 'continuous' | 'stroboscopic';
  exposureDuration_s: number; // e.g. 1.0 s
  blankingDuration_s: number; // e.g. 5.0 s
  isCurrentlyBlanked: boolean;
  beamVoltage_kV: number; // e.g. 80, 200, 300
}

export interface BeamPerturbationMetrics {
  doseRate: number;
  bpi: number; // Beam Perturbation Index (0 to 1)
  thermalRate: number; // hops/s
  beamRate: number; // hops/s
  unperturbedTrajectoryEstimate: number; // confidence %
  knockonProbability: number;
}

export interface DelayCalibration {
  flowRate_sccm: number;
  transferLineLength_m: number;
  transferLineTemp_C: number;
  carrierGas: 'He' | 'Ar' | 'N2';
  tauDead: number; // seconds
  sigmaDisp: number; // dispersion broadening (s)
  impulseResponse_h: number[]; // kernel
  useDeconvolution: boolean;
}

export interface CausalMapCell {
  nPTPt_bin: number; // 0, 1, 2, 3+
  nPTSupp_bin: number; // 1, 2, 3, 4
  qPt_bin: number; // 0 (metallic), +1, +2, +4
  sampleCount: number;
  meanDeltaTOF: number;
  causalProbability: number; // 0 to 1
  isSignificant: boolean;
}

export interface AdaptiveControlState {
  enabled: boolean;
  targetRegime: 'high_turnover' | 'anti_sintering' | 'selectivity_lock';
  sinteringThreshold: number; // mean cluster size trigger
  pulseType: 'oxidative_flash' | 'electrochemical_bias' | 'temperature_quench';
  pulseActive: boolean;
  totalRegenerations: number;
  stabilityScore: number;
}

export interface AICausalReport {
  causalVerification: 'Confirmed' | 'Probable' | 'Inconclusive' | 'Beam-Dominated';
  causalConfidencePercent: number;
  activeMotif: string;
  mechanisticRoute: string;
  beamArtifactAssessment: string;
  transportDelayValidation: string;
  recommendedClosedLoopPulse: string;
  suggestedNextOperandoExperiment: string;
}
