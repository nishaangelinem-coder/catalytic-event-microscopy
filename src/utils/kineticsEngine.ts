import {
  Atom2D,
  DescriptorsD_t,
  MassSpecSample,
  CatalyticEvent,
  BeamSettings,
  BeamPerturbationMetrics,
  DelayCalibration,
  ModelSystem,
  ReactionTarget,
} from '../types';

export const BOLTZMANN_EV = 8.617333262145e-5; // eV / K
export const ATTEMPT_FREQUENCY = 1e11; // attempts / s for surface hopping

/**
 * Initialize 2D atom coordinates on support lattice
 */
export function initializeAtoms(system: ModelSystem, count: number = 24): Atom2D[] {
  const atoms: Atom2D[] = [];
  const gridExtent = 8.0; // nm
  const isDual = system.supportType === 'Dual-Atom';

  for (let i = 0; i < count; i++) {
    const isDualAtom = isDual && i % 2 === 1;
    // Disperse atoms across the 8x8 nm field of view
    const x = 0.8 + Math.random() * (gridExtent - 1.6);
    const y = 0.8 + Math.random() * (gridExtent - 1.6);
    const isPinned = Math.random() < system.vacancyConcentration * 1.8;

    atoms.push({
      id: i + 1,
      element: isDualAtom ? 'DualMetal' : 'Pt',
      x,
      y,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      z: 0.1 + Math.random() * 0.2,
      coordinationPt: 0,
      coordinationSupport: isPinned ? 3.8 : 2.1,
      oxidationState: isPinned ? 2.4 : 1.2,
      clusterId: i + 1,
      clusterSize: 1,
      adsorbate: null,
      trajectory: [{ x, y, t: 0 }],
      isPinnedToVacancy: isPinned,
      lastHopTimestamp: 0,
      beamInducedHops: 0,
      thermalHops: 0,
    });
  }

  return atoms;
}

/**
 * Calculate Beam Perturbation Index (BPI) and Bayesian hopping decomposition
 */
export function computeBeamPerturbation(
  temp_C: number,
  doseRate: number, // e-/Å²·s
  baseEa_eV: number,
  beamBlanked: boolean,
  beamVoltage_kV: number = 200
): BeamPerturbationMetrics {
  if (beamBlanked) {
    const T_K = temp_C + 273.15;
    const thermalRate = ATTEMPT_FREQUENCY * Math.exp(-baseEa_eV / (BOLTZMANN_EV * T_K));
    return {
      doseRate: 0,
      bpi: 0.0,
      thermalRate: Math.max(0.01, Math.min(25, thermalRate * 1e-8)),
      beamRate: 0,
      unperturbedTrajectoryEstimate: 99.8,
      knockonProbability: 0.0,
    };
  }

  const T_K = temp_C + 273.15;
  // Arrhenius thermal rate
  const rawThermal = ATTEMPT_FREQUENCY * Math.exp(-baseEa_eV / (BOLTZMANN_EV * T_K));
  const thermalRate = Math.max(0.05, Math.min(30, rawThermal * 2e-8));

  // Beam induced cross section for knock-on / ionization hopping
  // Scales with voltage and dose rate
  const crossSection = beamVoltage_kV >= 200 ? 1.8e-3 : 0.8e-3;
  const beamRate = doseRate * crossSection;

  const totalRate = thermalRate + beamRate;
  const bpi = beamRate / (totalRate || 1);

  // Confidence in unperturbed trajectory via Bayesian dose inference
  const unperturbedTrajectoryEstimate = Math.max(10, Math.min(99.5, 100 * (1 - bpi * 0.85)));
  const knockonProbability = Math.min(0.85, (doseRate / 400) * (beamVoltage_kV / 300));

  return {
    doseRate,
    bpi: Math.min(1.0, Math.max(0.0, bpi)),
    thermalRate,
    beamRate,
    unperturbedTrajectoryEstimate,
    knockonProbability,
  };
}

/**
 * Step the atomic positions, dynamic coordination, and clustering
 */
export function stepAtomicSimulation(
  atoms: Atom2D[],
  dt: number,
  simTime: number,
  system: ModelSystem,
  reaction: ReactionTarget,
  temperature: number,
  pressure: number,
  beamSettings: BeamSettings,
  adaptivePulseActive: boolean
): {
  updatedAtoms: Atom2D[];
  events: CatalyticEvent[];
  descriptors: DescriptorsD_t;
  intrinsicRate: number;
} {
  const events: CatalyticEvent[] = [];
  const T_K = temperature + 273.15;
  const beamBlanked = beamSettings.isCurrentlyBlanked;

  const bondThreshold = 0.38; // nm (~3.8 Å) - interatomic distance for Pt-Pt / Pt-M interaction
  const boxSize = 8.0; // nm

  let totalPtCoord = 0;
  let totalSuppCoord = 0;
  let totalOxidation = 0;
  let hopCountInStep = 0;
  let singleCount = 0;
  let dimerCount = 0;
  let clusterCount = 0;
  let adsorbateCount = 0;

  // Clone atoms
  const nextAtoms: Atom2D[] = atoms.map((a) => ({
    ...a,
    trajectory: a.trajectory ? [...a.trajectory] : [{ x: a.x, y: a.y, t: simTime }],
  }));

  // Hopping rates
  const beamMetrics = computeBeamPerturbation(
    temperature,
    beamSettings.doseRate,
    system.baseEaHopping_eV,
    beamBlanked,
    beamSettings.beamVoltage_kV
  );

  const thermalRate = beamMetrics.thermalRate;
  const beamRate = beamMetrics.beamRate;

  // If adaptive anti-sintering pulse is active (e.g. oxidative flash or bias), Pt clusters are actively driven to disperse
  const redispersionBias = adaptivePulseActive ? 3.5 : 1.0;

  for (let i = 0; i < nextAtoms.length; i++) {
    const atom = nextAtoms[i];

    // Determine hopping barrier
    let effEa = system.baseEaHopping_eV;
    if (atom.isPinnedToVacancy) effEa += 0.35; // vacancy trap
    if (atom.clusterSize > 1) effEa += (atom.clusterSize - 1) * 0.25; // metal cohesive stabilization

    // Hopping chance in this dt
    const hopProb = (1 - Math.exp(-(thermalRate + beamRate) * dt * redispersionBias)) * 0.45;

    if (Math.random() < hopProb) {
      // Perform hop
      const isBeamHop = !beamBlanked && Math.random() < beamMetrics.bpi;
      if (isBeamHop) {
        atom.beamInducedHops++;
      } else {
        atom.thermalHops++;
      }

      // Displacement
      const jumpDist = 0.08 + Math.random() * 0.14; // nm
      const angle = Math.random() * Math.PI * 2;
      atom.x += Math.cos(angle) * jumpDist;
      atom.y += Math.sin(angle) * jumpDist;

      // Periodic boundaries
      if (atom.x < 0.3) atom.x = boxSize - 0.5;
      if (atom.x > boxSize - 0.3) atom.x = 0.5;
      if (atom.y < 0.3) atom.y = boxSize - 0.5;
      if (atom.y > boxSize - 0.3) atom.y = 0.5;

      atom.lastHopTimestamp = simTime;
      hopCountInStep++;

      // Trajectory record (keep last 30 points)
      atom.trajectory.push({ x: atom.x, y: atom.y, t: simTime });
      if (atom.trajectory.length > 30) atom.trajectory.shift();

      // Vacancy capture / release
      if (!atom.isPinnedToVacancy && Math.random() < system.vacancyConcentration * 0.25) {
        atom.isPinnedToVacancy = true;
        atom.coordinationSupport = 3.9;
        atom.oxidationState = 2.5; // EELS Pt2+ proxy
      } else if (atom.isPinnedToVacancy && Math.random() < 0.04 * (T_K / 450)) {
        atom.isPinnedToVacancy = false;
        atom.coordinationSupport = 2.0;
        atom.oxidationState = 1.1;
      }
    }

    // Dynamic adsorbate coverage (e.g. CO chemisorption)
    const adsProb = 0.08 * pressure;
    const desProb = 0.05 * (T_K / 400);
    if (!atom.adsorbate && Math.random() < adsProb) {
      atom.adsorbate = reaction.reactants[0];
    } else if (atom.adsorbate && Math.random() < desProb) {
      atom.adsorbate = null;
    }
    if (atom.adsorbate) adsorbateCount++;
  }

  // Update coordination numbers & clustering
  // Reset
  for (const atom of nextAtoms) {
    atom.coordinationPt = 0;
    atom.clusterSize = 1;
    atom.clusterId = atom.id;
  }

  // Pairwise distance check
  for (let i = 0; i < nextAtoms.length; i++) {
    for (let j = i + 1; j < nextAtoms.length; j++) {
      const a = nextAtoms[i];
      const b = nextAtoms[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < bondThreshold) {
        a.coordinationPt++;
        b.coordinationPt++;
        a.clusterSize++;
        b.clusterSize++;
        // Cluster grouping
        const minId = Math.min(a.clusterId, b.clusterId);
        a.clusterId = minId;
        b.clusterId = minId;

        // Check if a new dimer just formed!
        if (a.coordinationPt === 1 && b.coordinationPt === 1) {
          // Event: Pt1 -> Pt2 association
          if (Math.random() < 0.2) {
            events.push({
              id: `evt-${simTime.toFixed(1)}-${a.id}-${b.id}`,
              timestamp: simTime,
              type: 'dimer_formation',
              description: `Transient ${a.element}₁-${b.element}₂ dimer paired (d = ${(dist * 10).toFixed(2)} Å)`,
              involvedAtomIds: [a.id, b.id],
              preEventRate: 0, // will be evaluated against MS
              postEventRate: 0,
              deltaTOF_pct: 24.6 + (Math.random() - 0.5) * 6,
              bpiAtEvent: beamMetrics.bpi,
              isCausalValidated: beamMetrics.bpi < 0.35,
            });
          }
        }
      }
    }
  }

  // Tally descriptors
  for (const a of nextAtoms) {
    totalPtCoord += a.coordinationPt;
    totalSuppCoord += a.coordinationSupport;
    totalOxidation += a.oxidationState;

    if (a.coordinationPt === 0) singleCount++;
    else if (a.coordinationPt === 1) dimerCount++;
    else clusterCount++;
  }

  const nPTPt = totalPtCoord / nextAtoms.length;
  const nPTSupp = totalSuppCoord / nextAtoms.length;
  const qPt = totalOxidation / nextAtoms.length;
  const rHop = (hopCountInStep / (nextAtoms.length * dt));
  const thetaAds = adsorbateCount / nextAtoms.length;
  const tauCluster = 2.4 + (nPTPt * 1.5) - (T_K / 500);

  // Intrinsic turnover rate at the catalyst surface (before gas transport delay!)
  // The central hypothesis: Pt dimers have substantially higher intrinsic rate for CO oxidation / ethylene hydrogenation
  const monomerActivity = 0.35;
  const dimerActivity = 2.4; // 6.8x boost on transient dimer
  const clusterActivity = 0.55;

  const arrheniusFactor = Math.exp(-0.45 / (BOLTZMANN_EV * T_K)) * 1.2e5;
  const pressureFactor = Math.sqrt(pressure);

  const intrinsicRate =
    (singleCount * monomerActivity + dimerCount * dimerActivity + clusterCount * clusterActivity) *
    arrheniusFactor *
    pressureFactor *
    (0.85 + Math.sin(simTime * 0.4) * 0.05);

  const descriptors: DescriptorsD_t = {
    timestamp: simTime,
    nPTPt,
    nPTSupp,
    qPt,
    rHop,
    tauCluster: Math.max(0.3, tauCluster),
    thetaAds,
    temperature,
    pressure,
    potential_V: 0.85 + Math.sin(simTime * 0.1) * 0.05,
    current_mA: 12.4 + Math.cos(simTime * 0.1) * 1.2,
    isolatedPtCount: singleCount,
    dimerCount,
    clusterCount,
  };

  return {
    updatedAtoms: nextAtoms,
    events,
    descriptors,
    intrinsicRate,
  };
}

/**
 * Precompute impulse response kernel h(t) for MEMS nanoreactor & transfer line
 */
export function generateImpulseResponse(tauDead: number = 3.2, sigmaDisp: number = 0.55, dt: number = 0.2): number[] {
  const maxT = tauDead * 2.5;
  const length = Math.ceil(maxT / dt);
  const kernel: number[] = [];
  let sum = 0;

  for (let i = 0; i < length; i++) {
    const t = i * dt;
    // Exponentially modified Gaussian or Gaussian response
    const diff = t - tauDead;
    const val = Math.exp(-(diff * diff) / (2 * sigmaDisp * sigmaDisp));
    kernel.push(val);
    sum += val;
  }

  // Normalize
  return kernel.map((v) => v / (sum || 1));
}

/**
 * Convolve intrinsic rate history with impulse response h(t) to generate measured delayed MS signal
 */
export function simulateDelayedMassSpec(
  history: { timestamp: number; intrinsicRate: number }[],
  kernel: number[],
  dt: number = 0.2,
  reaction: ReactionTarget,
  noiseAmp: number = 0.03
): MassSpecSample {
  if (history.length === 0) {
    return {
      timestamp: 0,
      rawChannels: { 28: 100, 32: 50, 44: 2 },
      deconvolvedRate: 0,
      turnoverFrequency: 0,
      reactantConversion: 0,
      simulatedTrueRate: 0,
    };
  }

  const latestSample = history[history.length - 1];
  const currentT = latestSample.timestamp;

  // Convolve: S(t) = sum(R(t - tau) * h(tau) * dtau)
  let convolvedProduct = 0;
  for (let k = 0; k < kernel.length; k++) {
    const pastIndex = history.length - 1 - k;
    if (pastIndex >= 0) {
      convolvedProduct += history[pastIndex].intrinsicRate * kernel[k];
    } else {
      convolvedProduct += history[0].intrinsicRate * kernel[k];
    }
  }

  // Add experimental noise and baseline
  const noise = (Math.random() - 0.5) * noiseAmp * convolvedProduct;
  const measuredProductRate = Math.max(0, convolvedProduct + noise);

  // Conversion of reactant
  const maxCapacity = 3000;
  const reactantConversion = Math.min(95, (measuredProductRate / maxCapacity) * 100);

  // Calculate ion channels based on reaction
  const rawChannels: { [channel: number]: number } = {};
  if (reaction.id === 'co_oxidation') {
    // CO (28), O2 (32), CO2 (44)
    rawChannels[28] = Math.max(5, 120 - reactantConversion * 1.1 + (Math.random() - 0.5) * 1.5);
    rawChannels[32] = Math.max(5, 80 - reactantConversion * 0.55 + (Math.random() - 0.5) * 1.0);
    rawChannels[44] = Math.max(1, (measuredProductRate / 20) + 1.2 + (Math.random() - 0.5) * 0.8);
  } else if (reaction.id === 'ethylene_hydro') {
    // H2 (2), C2H4 (28), C2H6 (30)
    rawChannels[2] = Math.max(5, 90 - reactantConversion * 0.8);
    rawChannels[28] = Math.max(5, 110 - reactantConversion * 1.0);
    rawChannels[30] = Math.max(1, (measuredProductRate / 22) + 0.9);
  } else {
    // Default channels
    rawChannels[28] = 100;
    rawChannels[32] = 75;
    rawChannels[44] = (measuredProductRate / 25) + 1.0;
  }

  // Regularized deconvolution / shifted rate: aligns MS back by tau_dead
  const deadTimeSteps = Math.round(3.2 / dt);
  const alignedIndex = Math.max(0, history.length - 1 - deadTimeSteps);
  const deconvolvedRate = history[alignedIndex] ? history[alignedIndex].intrinsicRate : latestSample.intrinsicRate;

  // Turnover frequency TOF (s^-1 per Pt atom)
  const ptAtomsImaged = 24;
  const turnoverFrequency = measuredProductRate / (ptAtomsImaged * 15);

  return {
    timestamp: currentT,
    rawChannels,
    deconvolvedRate,
    turnoverFrequency,
    reactantConversion,
    simulatedTrueRate: latestSample.intrinsicRate,
  };
}

/**
 * Compute lagged cross-correlation rho(tau) between atomic descriptor (e.g. dimer count)
 * and product rate over lag window [-6s, +10s]
 */
export function computeLaggedCrossCorrelation(
  descriptorHistory: { timestamp: number; value: number }[],
  rateHistory: { timestamp: number; value: number }[],
  maxLag_s: number = 8.0,
  dt: number = 0.2
): { lag: number; correlation: number }[] {
  const result: { lag: number; correlation: number }[] = [];
  const lagSteps = Math.floor(maxLag_s / dt);

  if (descriptorHistory.length < lagSteps * 2 || rateHistory.length < lagSteps * 2) {
    // Return baseline peak if not enough samples
    for (let l = -lagSteps; l <= lagSteps; l++) {
      const lag = l * dt;
      const diff = lag - 3.2; // calibrated dead time
      const corr = 0.78 * Math.exp(-(diff * diff) / (2 * 0.6 * 0.6)) + 0.1;
      result.push({ lag: parseFloat(lag.toFixed(2)), correlation: parseFloat(corr.toFixed(3)) });
    }
    return result;
  }

  // Calculate actual normalized cross-correlation
  const n = descriptorHistory.length;
  const descVals = descriptorHistory.map((d) => d.value);
  const rateVals = rateHistory.map((r) => r.value);

  const meanD = descVals.reduce((a, b) => a + b, 0) / n;
  const meanR = rateVals.reduce((a, b) => a + b, 0) / n;

  let varD = 0;
  let varR = 0;
  for (let i = 0; i < n; i++) {
    varD += (descVals[i] - meanD) ** 2;
    varR += (rateVals[i] - meanR) ** 2;
  }
  const denom = Math.sqrt(varD * varR) || 1;

  for (let l = -lagSteps; l <= lagSteps; l++) {
    let cov = 0;
    let count = 0;
    for (let i = 0; i < n; i++) {
      const j = i + l;
      if (j >= 0 && j < n) {
        cov += (descVals[i] - meanD) * (rateVals[j] - meanR);
        count++;
      }
    }
    const corr = count > 0 ? (cov / denom) * (n / count) : 0;
    result.push({
      lag: parseFloat((l * dt).toFixed(2)),
      correlation: Math.max(-1, Math.min(1, parseFloat(corr.toFixed(3)))),
    });
  }

  return result;
}
