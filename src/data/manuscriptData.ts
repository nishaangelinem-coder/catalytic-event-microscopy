export interface ManuscriptMeta {
  title: string;
  shortTitle: string;
  journal: string;
  articleType: string;
  doi: string;
  receivedDate: string;
  acceptedDate: string;
  publishedDate: string;
  authors: {
    name: string;
    affiliations: string[];
    isCorresponding?: boolean;
    email?: string;
  }[];
  affiliations: string[];
  abstract: string;
  keywords: string[];
}

export interface ManuscriptSection {
  id: string;
  number: string;
  title: string;
  content: string[];
}

export interface ManuscriptFigureData {
  id: number;
  label: string;
  title: string;
  caption: string;
  extendedCaption: string;
  panels: {
    label: string;
    title: string;
    description: string;
  }[];
}

export interface ManuscriptTableData {
  id: number;
  label: string;
  title: string;
  headers: string[];
  subHeaders?: string[];
  rows: (string | number)[][];
  footnotes: string[];
}

export const MANUSCRIPT_META: ManuscriptMeta = {
  title: 'Catalytic Event Microscopy Resolves Dynamic Atomic Restructuring and Causal Product Transients in Single-Atom Platinum Catalysis',
  shortTitle: 'Catalytic Event Microscopy of Dynamic Single-Atom Catalysts',
  journal: 'Nature Catalysis',
  articleType: 'Article',
  doi: '10.1038/s41929-026-01842-x',
  receivedDate: '14 November 2025',
  acceptedDate: '18 February 2026',
  publishedDate: '24 March 2026',
  authors: [
    { name: 'Elena V. Rostova', affiliations: ['Department of Chemical & Biomolecular Engineering, Institute for Nano-Materials, Zurich, Switzerland'], isCorresponding: true, email: 'e.rostova@nano-inst.ch' },
    { name: 'Marcus H. Lindqvist', affiliations: ['Center for Electron Nanoscopy, Technical University of Denmark, Lyngby, Denmark'] },
    { name: 'Siddharth R. Patel', affiliations: ['Department of Chemical & Biomolecular Engineering, Institute for Nano-Materials, Zurich, Switzerland'] },
    { name: 'Akira Takahashi', affiliations: ['National Institute for Materials Science, Tsukuba, Ibaraki, Japan'] },
    { name: 'Chao Wang', affiliations: ['Department of Chemical and Biomolecular Engineering, Johns Hopkins University, Baltimore, MD, USA'] },
    { name: 'Klaus K. Hansen', affiliations: ['Center for Electron Nanoscopy, Technical University of Denmark, Lyngby, Denmark'], isCorresponding: true, email: 'klaus.hansen@cen.dtu.dk' },
  ],
  affiliations: [
    '1. Department of Chemical & Biomolecular Engineering, Institute for Nano-Materials, Zurich, Switzerland',
    '2. Center for Electron Nanoscopy, Technical University of Denmark, Lyngby, Denmark',
    '3. National Institute for Materials Science, Tsukuba, Ibaraki, Japan',
    '4. Department of Chemical and Biomolecular Engineering, Johns Hopkins University, Baltimore, MD, USA',
  ],
  abstract:
    'Single-atom catalysts (SACs) are traditionally evaluated under the paradigm of static, isolated coordination environments. However, operando observations increasingly demonstrate that active sites undergo stochastic spatial migration, coordination restructuring, and transient clustering under working conditions. Disentangling true catalytic turnover from electron-beam artifacts and passive coexisting structures has remained an intractable challenge. Here, we report Catalytic Event Microscopy (CEM), an operando transmission electron microscopy platform that hardware-synchronizes 10 Hz high-angle annular dark-field (HAADF) atomic trajectory tracking with online mass spectrometry and electron energy-loss spectroscopy via a shared hardware TTL trigger. By calibrating the MEMS nanoreactor gas transport transfer function and applying regularized Wiener–Tikhonov deconvolution, we achieve sub-second alignment between local atomic coordinate transitions and global reaction-rate transients. In operando CO oxidation over Pt₁/CeO₂, event-aligned averaging across N = 48 restructuring events reveals that transient Pt₁–Pt₂ dimer assembly at ceria oxygen vacancies produces a +24.6% ± 4.2% surge in CO₂ turnover frequency, whereas static isolated Pt₁ monomers exhibit a lower turnover limited by O–O scission. A dose-aware Bayesian trajectory framework decouples thermal kinetics from beam-induced knock-on, establishing a Beam Perturbation Index (BPI < 0.22) that guarantees observation in the unperturbed thermal regime. Furthermore, we translate these insights into a closed-loop adaptive catalyst that deploys automated 50-ms oxidative pulses upon detecting cluster coarsening (NPt–Pt > 1.8), demonstrating 50 consecutive regeneration cycles with 94.2% single-atom dispersion retention. This methodology transforms electron microscopy from passive observational imaging into a quantitative, causal, and closed-loop platform for dynamic catalytic science.',
  keywords: [
    'Single-atom catalysis',
    'Operando TEM',
    'Catalytic event microscopy',
    'Causal activity mapping',
    'Impulse response deconvolution',
    'Platinum dimers',
    'Beam perturbation index',
    'Adaptive catalysts',
  ],
};

export const MANUSCRIPT_SECTIONS: ManuscriptSection[] = [
  {
    id: 'intro',
    number: '1',
    title: 'Introduction',
    content: [
      'Single-atom catalysts (SACs) represent the thermodynamic limit of metal utilization, presenting uniformly dispersed single metal atoms stabilized on functional oxide, carbon, or chalcogenide supports. For over a decade, heterogenous catalysis has interpreted SAC reactivity through static structural models, in which the local coordination polyhedron—inferred from ex situ X-ray absorption fine structure (XAFS) or DFT ground-state calculations—is assumed to govern the entire catalytic turnover cycle.',
      'However, operando spectroscopy and environmental transmission electron microscopy (ETEM) have revealed that heterogeneous catalyst surfaces are fundamentally dynamic under reaction driving forces. Driven by chemical potential gradients of adsorbates and elevated temperatures, isolated single atoms undergo rapid surface hopping, coordination polyhedron distortion, charge fluctuation, and reversible agglomeration into transient dimers or sub-nanometer clusters. This dynamic reality shatters the foundational static assumption: catalyst activity is governed not by a single time-invariant structure, but by the transition frequencies, coordination lifetimes, and thermodynamic stability of a small ensemble of dynamic atomic motifs.',
      'Correlating local single-atom dynamics with macroscopic reaction rate poses severe experimental and methodological barriers. First, gas-phase products formed inside a MEMS nanoreactor cell must traverse micro-channels, transfer lines, and capillary inlets before reaching an online quadrupole mass spectrometer (QMS), introducing an advective-dispersive transport delay (τ_dead ≈ 1–5 s) and peak broadening. Prior studies correlating TEM videos with external mass spectrometry have relied on manual logging or static time-averages, obscuring the temporal link between a 100-ms structural transition and the resulting chemical pulse.',
      'Second, the high-energy electron beam (80–300 keV) transfers momentum and ionization energy to supported metal atoms. Beam-induced knock-on, radiolysis, and electrostatic charging can induce spurious atomic hopping or sintering, generating synthetic dynamics that do not reflect thermal chemical reactivity. Without a quantitative beam perturbation index, the catalytic community has rightfully questioned whether reported dynamic restructuring is an authentic chemical mechanism or an artifact of electron radiation.',
      'Here, we establish Catalytic Event Microscopy (CEM) to overcome these foundational bottlenecks. By integrating hardware TTL pulse synchronization (10 Hz), physical transport transfer line calibration h(t), regularized mathematical deconvolution, and dose-aware Bayesian trajectory decomposition, we demonstrate the direct detection and causal verification of catalytic events in dynamic Pt SACs across four model systems and five key reaction targets.',
    ],
  },
  {
    id: 'results_1',
    number: '2.1',
    title: 'Hardware-Synchronized Operando Nanoreactor & Multimodal TTL Architecture',
    content: [
      'To achieve millisecond synchronization between atomic coordinate time series and macroscopic product generation, we microfabricated a closed-cell MEMS nanoreactor chip with a spiral SiNx microheater and integrated thin Pt four-point resistive thermometers (Fig. 1). The nanoreactor reaction volume is bounded by 15-nm-thick SiNx electron-transparent windows separated by a 4.5-µm spacer, ensuring a total gas path length of <5 µm to minimize electron scattering.',
      'A dedicated master clock controller broadcasts a shared 5-V TTL trigger pulse at 10.00 Hz to the HAADF-STEM acquisition computer, the electron beam electrostatic blanker, and the high-speed quadrupole mass spectrometer ADC converter (Fig. 1b). This eliminates asynchronous software jitter and guarantees sample-by-sample phase coherence across all sensory channels.',
      'The electron optical setup utilizes an aberration-corrected cold-field emission gun operated at 200 kV (with low-knock-on comparison tests at 80 kV). Individual Pt atoms are localized on the support with sub-0.5 Å spatial precision and a temporal resolution of 100 ms per frame (Fig. 2a–d). Coordinate extraction algorithms quantify the dynamic descriptor vector D(t) = [NPt–Pt(t), NPt–supp(t), qPt(t), rhop(t), τcluster(t), θads(t), T, P] simultaneously with EELS core-loss spectra across the Pt M3 and O K edges (Table 1, Table 2).',
    ],
  },
  {
    id: 'results_2',
    number: '2.2',
    title: 'Impulse Response Deconvolution & Delayed Signal Alignment',
    content: [
      'The raw mass spectrometer signal S(t) cannot be correlated directly with raw atomic descriptors because product molecules traverse the MEMS nanoreactor cavity and a 1.2-m silica capillary transfer line. We calibrated this fluidic transport by injecting 20-ms delta pulses of pure CO2 and He carrier gas through a high-speed piezoelectric micro-valve under identical operando temperature (220 °C) and pressure (1.2 bar) conditions.',
      'The measured residence-time distribution yields an asymmetric impulse response function h(t) characterized by an advective transport delay τ_dead = 3.20 ± 0.04 s and a Gaussian-exponential dispersion coefficient σ_disp = 0.55 ± 0.03 s (Fig. 3a, Table 3). The Peclet number Pe = 42 confirms dominant plug-flow advection with minor Taylor dispersion.',
      'We implemented a Tikhonov-Wiener regularized deconvolution operator D^-1 to reconstruct the true instantaneous turnover frequency R(t) from the raw delayed signal S(t) = (R * h)(t) + n(t) (Fig. 3b–d). Deconvolved turnover profiles exhibit sub-second fidelity, aligning product surges directly with the precursor atomic transitions recorded in TEM (Fig. 4).',
    ],
  },
  {
    id: 'results_3',
    number: '2.3',
    title: 'Event-Aligned Averaging & Discovery of Transient Pt1–Pt2 Dimer Activation',
    content: [
      'During operando CO oxidation (CO:O2:He = 1:5:94, 220 °C, 1.2 bar) over Pt1/CeO2, isolated Pt1 atoms continually undergo surface migration. Frequently, two adjacent Pt1 atoms migrate across oxygen vacancy (VO) step edges and associate into a transient Pt1–Pt2 dimer with an interatomic distance of 2.68 ± 0.08 Å, persisting for lifetimes τ_life = 1.2 to 4.8 s before dissociating back into isolated single atoms (Fig. 2e–g).',
      'To test whether this structural association is causally linked to product generation, we extracted the deconvolved reaction rate R(t) aligned to the exact instant of dimer formation (t_event = 0). Event-aligned averaging across N = 48 independent association events observed across four separate chips reveals a sharp, statistically robust surge in CO2 production: Δr_CO2 = +24.6% ± 4.2% (two-tailed t-test p = 4.2 × 10^-6, Fig. 5a).',
      'Bootstrapped 95% confidence intervals confirm that the reaction rate remains flat in the pre-event window [-6 s, 0 s], rises sharply following the structural transition, and peaks at t = +0.8 s before relaxing as dimers dissociate (Fig. 5b). In contrast, control events aligning to random atomic hopping events on flat (111) terraces produce no statistically significant rate change (Δr = +1.1% ± 2.8%, p = 0.68), ruling out observational bias.',
      'Time-lagged cross-correlation analysis ρ_{X,r}(τ) = Corr[NPt–Pt(t), S(t+τ)] yields an asymmetric cross-correlation peak of ρ_max = 0.84 located at τ_peak = +3.20 s (Fig. 6a, Table 5). The positive lag τ_peak precisely matches the independent physical gas transit delay τ_dead, proving mathematically that the structural coordination transition precedes the product signal arrival at the mass spectrometer.',
    ],
  },
  {
    id: 'results_4',
    number: '2.4',
    title: 'Construction of the 3D Causal Structure–Activity Probability Field',
    content: [
      'To systematically map the functional landscape, we constructed a 3D causal probability field P(Δr > 0 | D) across three orthogonal descriptors: metallic coordination number NPt–Pt (0 to 4), support coordination NPt–supp (1 to 4), and oxidation state proxy qPt (+0 to +4) derived from Pt M3 EELS white-line integrals (Fig. 7).',
      'The causal probability field reveals a distinct catalytic "golden hotspot" centered at (NPt–Pt = 1.0, NPt–supp = 3.6–4.0, qPt = +2.2 ± 0.3), corresponding to a Pt1–Pt2 dimer anchored at a ceria oxygen vacancy perimeter. Within this hotspot, the conditional probability of inducing a positive turnover transient is P = 0.94 ± 0.03, with an average instantaneous TOF enhancement of +28.4% (Fig. 7b).',
      'Conversely, static isolated single atoms (NPt–Pt = 0, NPt–supp = 4) exhibit a moderate, baseline causal probability of P = 0.42, limited by the high activation barrier for O2 dissociative chemisorption on a single metal center. Coarse sintered Pt clusters (NPt–Pt ≥ 3) yield negative causal shifts (Δr = -8.5%, P = 0.08) due to severe CO poisoning and loss of the reactive metal-support interfacial boundary (Table 6).',
    ],
  },
  {
    id: 'results_5',
    number: '2.5',
    title: 'Beam-Aware Measurement & Bayesian Trajectory Reconstruction',
    content: [
      'A fundamental critique of in situ electron microscopy is that high-energy electron irradiation drives artificial atomic motion. To address this, we systematically measured the Pt hopping frequency rhop across five orders of electron dose rate, from Φ = 0.5 e^-/Å²·s to Φ = 500 e^-/Å²·s (Fig. 8, Table 7).',
      'The observed hopping rate exhibits a classic linear dose dependence: k_obs(Φ) = k_thermal + σ_beam · Φ, where k_thermal is the true thermal hopping frequency and σ_beam is the effective electron-impact displacement cross section. At 220 °C, the fitted thermal intercept is k_thermal = 0.38 ± 0.04 s^-1, with σ_beam = (1.42 ± 0.11) × 10^-3 Å²/e^- at 200 kV (Fig. 8b). At 80 kV, σ_beam drops to (2.1 ± 0.3) × 10^-4 Å²/e^-, demonstrating that direct knock-on displacement is strongly suppressed below the ballistic displacement threshold of Pt on CeO2 (112 keV).',
      'We formulated the Beam Perturbation Index BPI = k_beam / (k_thermal + k_beam). When imaging at low dose rate (Φ ≤ 25 e^-/Å²·s), BPI remains below 0.22, confirming that >78% of all observed hops are purely thermally activated (Fig. 8c).',
      'To further decouple electron radiation from catalytic dynamics, we implemented stroboscopic beam blanking (Fig. 9). The electron beam was unblanked for t_exp = 1.0 s to record atomic coordinates, then deflected away for t_blank = 5.0 s (duty cycle 16.7%). A dose-aware Bayesian filter integrates the intermittent frame coordinates with the known thermal Arrhenius prior, reconstructing unperturbed trajectories with >95% confidence (Fig. 10, Table 8). Dimer association events and their correlated MS transients persisted identically under stroboscopic blanking, providing definitive proof that transient dimerization is an authentic thermal chemical phenomenon.',
    ],
  },
  {
    id: 'results_6',
    number: '2.6',
    title: 'Spatial Representativeness & Multi-Technique Operando Spectroscopy Cross-Validation',
    content: [
      'Because TEM inspects nanometer-scale specimen regions, we established spatial representativeness by benchmarking CEM against macroscopic, ensemble operando techniques performed under identical reactant partial pressures and temperatures (Fig. 11–14, Table 9).',
      'Operando EXAFS at the Pt L3-edge (220 °C, 1 bar CO/O2) yields a mean Pt–Pt first-shell coordination number of CN = 0.42 ± 0.08 and Pt–O coordination of CN = 3.6 ± 0.3, in exceptional agreement with our TEM time-ensemble average (NPt–Pt = 0.45 ± 0.05, NPt–supp = 3.4 ± 0.2; Fig. 11).',
      'Operando diffuse reflectance infrared Fourier transform spectroscopy (DRIFTS) exhibits a dominant linear CO chemisorption band at 2085 cm^-1 (characteristic of isolated Pt1) along with an active bridging CO band at 1850 cm^-1 (characteristic of Pt–Pt ensembles) with an integrated intensity ratio I_bridge / I_linear = 0.28, matching the 29.2% dimer time-fraction observed in TEM (Fig. 12).',
      'Operando Raman spectroscopy captures the CeO2 defect band at 595 cm^-1, demonstrating dynamic oxygen vacancy generation in sync with reactant feed cycles (Fig. 13). Finally, absolute reaction turnover frequencies measured in a standard plug-flow microreactor (1.48 ± 0.09 s^-1 site^-1) matched the deconvolved CEM nanoreactor rate (1.54 ± 0.12 s^-1 site^-1) within experimental uncertainty (Fig. 14), validating the macroscopic relevance of our nanoreactor findings.',
    ],
  },
  {
    id: 'results_7',
    number: '2.7',
    title: 'Closed-Loop Adaptive Catalyst Stabilization & Anti-Sintering Feedback',
    content: [
      'Recognizing that catalyst activity is governed by dynamic motif frequencies, we developed an active closed-loop feedback controller that modulates the catalyst state in operando (Fig. 15). Automated image processing tracks the mean Pt–Pt coordination NPt–Pt in real time.',
      'Under continuous reducing or high-CO loading, single atoms gradually coarsen into inactive trimers and nanoparticles (NPt–Pt > 1.8). Upon crossing this threshold, the closed-loop controller triggers a high-speed 50-ms micro-pulse of 15% O2 (or an electrochemical anodic pulse to 1.1 V vs RHE in liquid environments). The oxidative pulse oxidizes metallic Pt–Pt bonds to Pt–O–Ce linkages, driving rapid Coulombic and thermodynamic redispersion back into isolated single atoms within 1.5 s (Fig. 15b–d).',
      'We subjected the catalyst to 50 continuous start-stop and thermal stress cycles over 72 hours. While an uncontrolled conventional Pt/CeO2 catalyst suffered severe sintering with dispersion dropping from 96% to 28% and TOF declining by 74%, the closed-loop adaptive catalyst maintained 94.2% single-atom dispersion and 96.8% of its initial TOF across all 50 regeneration cycles (Fig. 16, Table 10).',
    ],
  },
  {
    id: 'results_8',
    number: '2.8',
    title: 'Generality Across Model Catalyst Systems: Pt1/TiO2, Pt1/N-C, and Dual-Atom Sites',
    content: [
      'To demonstrate that dynamic motif causation is a universal principle of single-atom catalysis, we extended CEM to three additional model systems (Fig. 17–19, Table 1, Table 5).',
      'On Pt1/TiO2(110) during ethylene hydrogenation (C2H4 + H2 → C2H6, 80 °C), Pt single atoms hop between bridging oxygen rows with an activation energy of Ea = 0.62 eV (Fig. 17). Causal mapping reveals that isolated Pt1 atoms coordinated to sub-surface Ti3+ polarons promote facile H2 heterolytic cleavage, driving C2H6 formation without requiring dimer formation, highlighting the distinct mechanism dictated by reducible titania.',
      'For the oxygen reduction reaction (ORR) over Pt1/N-doped carbon in an operando liquid cell (0.1 M HClO4, 0.90 V vs RHE), Pt single atoms coordinated in Pt–N4 configurations remain robustly isolated under cathodic potentials (Fig. 18). However, during potential steps to 1.05 V, transient Pt–O coordination restructuring occurs, directly correlating with an increase in 4-electron selectivity (H2O vs H2O2).',
      'In Pt–Sn dual-atom catalysts on carbon nanotubes for CO2 electroreduction, Pt–Sn pairs exhibit ensemble-controlled selectivity (Fig. 19). The presence of the adjacent Sn atom modulates the *CO binding energy, switching the primary product from CO (isolated Pt1) to formate (HCOOH, Faradaic efficiency 88.4%), verified by synchronous downstream online electrochemical mass spectrometry (OLEMS).',
    ],
  },
  {
    id: 'results_9',
    number: '2.9',
    title: 'Microkinetic Mechanism and Density Functional Theory Free Energy Profiles',
    content: [
      'Spin-polarized density functional theory (DFT+U) calculations provide a rigorous microkinetic foundation for our experimental observations (Fig. 20, Table 11). On pristine CeO2(111), CO adsorption on isolated Pt1 is strong (E_ads = -2.48 eV), causing CO poisoning at low temperatures. Furthermore, the activation barrier for O2 dissociation on a single Pt atom is high (E_a = 1.42 eV), forming the rate-limiting bottleneck.',
      'At an oxygen vacancy perimeter, the formation of a Pt1–Pt2 dimer significantly moderates CO chemisorption (E_ads = -1.65 eV) while dramatically lowering the O–O bond scission barrier to E_a = 0.38 eV via a cooperative dual-site transition state where one oxygen atom bridges to an adjacent Ce3+ cation (Fig. 20b).',
      'The microkinetic turnover frequency calculated from the DFT energy landscape matches the experimental deconvolved TOF within 15%, fully corroborating the causal activity map: the transient Pt1–Pt2 dimer is the catalytic engine that drives bond activation, while the dynamic CeO2 support provides the thermodynamic matrix for reversible motif assembly.',
    ],
  },
  {
    id: 'discussion',
    number: '3',
    title: 'Discussion',
    content: [
      'The direct observation and causal verification of catalytic events presented here fundamentally alter our conceptual framework for single-atom catalysis. Rather than viewing SACs as rigid, static monuments to spatial isolation, these findings demonstrate that high-performance catalytic systems function as dynamic atomic ensembles.',
      'This resolves a decade-old controversy in heterogeneous catalysis: the long-standing debate over whether "single atoms" or "sub-nanometer clusters" are the true active sites in low-temperature oxidation reactions. Our results prove that both perspectives capture partial truths of a single time-dependent cycle. The catalyst exists predominantly as isolated single atoms during resting states, but catalytic turnover occurs predominantly during transient, sub-second dimer or trimer associations. Attempting to characterize the catalyst by its time-averaged ground state inevitably misses the active catalytic motifs.',
      'Furthermore, the beam-aware framework established herein provides a reproducible blueprint for future operando electron microscopy. By measuring dose-rate dependencies, enforcing BPI thresholds (<0.25), and corroborating observations with ensemble synchrotron XAFS and vibrational spectroscopies, researchers can definitively discriminate between physical chemical kinetics and electron beam damage.',
      'Finally, the demonstration of closed-loop adaptive catalyst control opens an unprecedented avenue for materials design. Rather than designing materials that are passively resistant to sintering—which often requires sacrificing surface energy and reactivity—we can now create intelligent, self-regenerating catalytic systems that actively exploit dynamic restructuring while preventing irreversible degradation.',
    ],
  },
  {
    id: 'methods',
    number: '4',
    title: 'Methods',
    content: [
      'MEMS Nanoreactor Microfabrication: Closed-cell nanoreactor chips were fabricated using double-side polished silicon wafers (300 µm thickness) with 15-nm low-stress Si3N4 membranes. Microheaters were patterned with electron-beam evaporated Pt (50 nm) with a Ti adhesion layer (5 nm) in a four-point geometry calibrated between 20 °C and 600 °C using Raman thermometry.',
      'Operando HAADF-STEM and EELS: Experiments were performed on an FEI Titan Themis 60–300 microscope equipped with a monochromated high-brightness field emission gun (X-FEG), a CEOS DCOR spherical aberration corrector, and a Gatan Enfinium ER EELS spectrometer. Acquisitions operated at 200 kV and 80 kV with a beam convergence semi-angle of 21.4 mrad and collection inner semi-angle of 55 mrad. The beam current was calibrated between 5 pA and 50 pA.',
      'Hardware TTL Synchronization: A National Instruments PCIe-6363 DAQ card running on a dedicated real-time Linux kernel generated 10.00 Hz square TTL pulses (5 V, 10 ms pulse width). TTL signals triggered the STEM scan generator, the electrostatic beam blanking deflector plates, and the Pfeiffer Vacuum PrismaPro QMS ion source.',
      'Gas Transport Impulse Response Calibration and Deconvolution: The physical impulse response h(t) was calibrated by pulsing 20 ms gas packets into the carrier stream using a Parker Hannifin Series 9 high-speed valve. Mathematical deconvolution was computed using Wiener-Tikhonov regularization: R(ω) = [H*(ω) / (|H(ω)|² + λ²)] · S(ω), where λ is the noise regularizer determined by the L-curve criterion.',
      'Bayesian Trajectory Decomposition: Atomic coordinate time series were processed using a Kalman-Bayesian particle filter with a continuous-time Markov jump model incorporating Arrhenius thermal transition rates and electron knock-on cross sections.',
      'Density Functional Theory (DFT): Spin-polarized calculations were performed using VASP with the projector augmented wave (PAW) method and PBE+U exchange-correlation functional (U_eff = 4.5 eV for Ce 4f). Kinetic barriers were located using the climbing-image nudged elastic band (CI-NEB) method with forces converged to <0.02 eV/Å.',
    ],
  },
  {
    id: 'references',
    number: '5',
    title: 'References',
    content: [
      '1. Qiao, B. et al. Single-atom catalysis of CO oxidation using Pt1/FeOx. Nat. Chem. 3, 634–641 (2011).',
      '2. Flytzani-Stephanopoulos, M. & Gates, B. C. Atomically dispersed supported metal catalysts. Annu. Rev. Chem. Biomol. Eng. 3, 545–574 (2012).',
      '3. Liu, L. & Corma, A. Metal catalysts for heterogeneous catalysis: From single atoms to nanoclusters and nanoparticles. Chem. Rev. 118, 4981–5079 (2018).',
      '4. Wang, A., Li, J. & Zhang, T. Heterogeneous single-atom catalysis. Nat. Rev. Chem. 2, 65–81 (2018).',
      '5. DeRita, L. et al. Structural evolution of atomically dispersed Pt catalysts dictated by the support. Nat. Commun. 10, 1785 (2019).',
      '6. Jones, J. et al. Thermally stable single-atom platinum-on-ceria catalysts via atom trapping. Science 353, 150–154 (2016).',
      '7. Maurer, F. et al. Tracking the dynamic restructuring of single-atom catalysts under operando conditions. Nat. Catal. 3, 824–833 (2020).',
      '8. Yoshida, K. et al. Direct visualization of dynamic atomic restructuring in single-atom catalysts. Science 367, 428–431 (2020).',
      '9. Tauster, S. J., Fung, S. C. & Garten, R. L. Strong metal-support interactions: Group 8 noble metals on TiO2. J. Am. Chem. Soc. 100, 170–175 (1978).',
      '10. Datye, A. K. & Wang, H. Atom trapping: A novel approach to generate thermally stable single-atom catalysts. Acc. Chem. Res. 54, 385–394 (2021).',
      '11. Cargnello, M. et al. Particle size effects in ceria-supported platinum catalysts. Science 341, 771–773 (2013).',
      '12. Egerton, R. F., Li, P. & Malac, M. Radiation damage in the TEM and STEM. Micron 35, 399–409 (2004).',
      '13. Susi, T., Meyer, J. C. & Kotakoski, J. Quantifying electron beam damage in low-dimensional materials. Nat. Rev. Phys. 1, 397–405 (2019).',
      '14. Vendelbo, S. B. et al. Visualization of oscillatory behavior in single-nanoparticle oxidation catalysis. Nat. Mater. 13, 884–890 (2014).',
      '15. Simonsen, S. B. et al. Direct observations of Pt nanoparticle sintering on TiO2. Phys. Rev. Lett. 104, 245501 (2010).',
      '16. Hansen, T. W. & Wagner, J. B. Environmental Transmission Electron Microscopy: Concepts and Applications. Springer (2016).',
      '17. Goodman, D. W. Catalysis: From surfaces to nanoparticles. Science 299, 1697–1698 (2003).',
      '18. Nørskov, J. K. et al. The nature of the active site in heterogeneous metal catalysis. Chem. Soc. Rev. 37, 2163–2171 (2008).',
      '19. Chen, Z. et al. Pt–Fe dual-atom sites for high-performance electrocatalytic oxygen reduction. Nat. Energy 6, 614–623 (2021).',
      '20. Zhang, L. et al. Single-atom catalysts: Emerging materials for energy conversion. Adv. Mater. 30, 1800069 (2018).',
    ],
  },
];

export const MANUSCRIPT_FIGURES: ManuscriptFigureData[] = [
  {
    id: 1,
    label: 'Figure 1',
    title: 'Operando Catalytic Event Microscopy (CEM) Platform and Hardware Synchronization Architecture',
    caption: 'Schematic of the closed-cell MEMS nanoreactor, fluidic transfer line, and master TTL trigger network linking HAADF-STEM, online mass spectrometry, and electron energy-loss spectroscopy.',
    extendedCaption: 'a, Cross-sectional architecture of the Si3N4 MEMS nanoreactor cell showing the 4.5-µm microfluidic channel, Pt resistive heater spiral, and gas delivery ports. b, Master hardware timing diagram showing the shared 10.00 Hz TTL pulse coordinating frame scan acquisition, electrostatic beam blanking, and QMS data collection. c, Overview photograph and 3D rendering of the environmental TEM holder with integrated gas capillaries and four-point electrical feedthroughs. d, Overall experimental data acquisition pipeline converting raw image streams into physical descriptor vectors D(t).',
    panels: [
      { label: 'a', title: 'Nanoreactor Cross-Section', description: 'MEMS Si3N4 membrane (15 nm) with integrated Pt heater spiral and 4.5 µm gas flow cavity.' },
      { label: 'b', title: 'TTL Hardware Synchronization', description: '10 Hz shared clock eliminating asynchronous timing jitter between TEM and online MS.' },
      { label: 'c', title: 'Operando Holder & Transfer Line', description: 'Zero-dead-volume MEMS packaging with 1.2 m fused-silica transfer capillary.' },
      { label: 'd', title: 'Data Acquisition Pipeline', description: 'Real-time extraction of atomic coordinates, coordination numbers, and oxidation state.' },
    ],
  },
  {
    id: 2,
    label: 'Figure 2',
    title: 'Operando Atomic Trajectory Tracking and Dynamic Restructuring in Pt₁/CeO₂',
    caption: 'Time-resolved HAADF-STEM atomic coordinate sequences capturing isolated Pt₁ migration and reversible Pt₁–Pt₂ dimer assembly at oxygen vacancy step edges.',
    extendedCaption: 'a–d, Consecutive HAADF-STEM frames (t = 0.0 s to 1.8 s) showing two isolated Pt single atoms (green circles) migrating along a CeO2(111) step edge and forming a dynamic Pt1–Pt2 dimer (yellow ellipse) with an interatomic distance d_Pt-Pt = 2.68 Å. Scale bar: 1.0 nm. e, Interatomic distance d(t) trajectory over 15 s showing repeated association and dissociation transitions. f, Pt–Pt metallic coordination number NPt–Pt(t) trajectory sampled at 10 Hz. g, Support coordination number NPt–supp(t) demonstrating oxygen vacancy pinning.',
    panels: [
      { label: 'a–d', title: 'HAADF-STEM Coordinate Series', description: 'Sub-angstrom localization of Pt single atoms forming a transient dimer on CeO2.' },
      { label: 'e', title: 'Pt–Pt Interatomic Distance', description: 'Reversible transitions between isolated state (>4 Å) and bonded dimer (2.68 Å).' },
      { label: 'f', title: 'Metallic Coordination Number', description: 'Discrete step jumps between NPt–Pt = 0 (monomer) and NPt–Pt = 1 (dimer).' },
      { label: 'g', title: 'Support Pinning Dynamics', description: 'Fluctuations in CeO2 oxygen vacancy coordination during migration.' },
    ],
  },
  {
    id: 3,
    label: 'Figure 3',
    title: 'Gas Transport Impulse Response Calibration h(t) and Regularized Deconvolution',
    caption: 'Experimental calibration of the MEMS nanoreactor residence-time distribution and restoration of the true instantaneous catalytic rate R(t).',
    extendedCaption: 'a, Measured concentration response to a 20-ms delta pulse of CO2 injected into 5.0 sccm He carrier at 220 °C and 1.2 bar. Red curve: experimental QMS trace; black dashed line: fitted impulse response h(t) with τ_dead = 3.20 s and σ_disp = 0.55 s (Peclet number Pe = 42). b, Synthetic test case showing a sharp rate step convolved by h(t) and restored by Wiener-Tikhonov deconvolution. c, L-curve optimization plot showing determination of the optimal regularization parameter λ = 0.018. d, Deconvolution fidelity error as a function of signal-to-noise ratio.',
    panels: [
      { label: 'a', title: 'Impulse Response Calibration', description: 'Measured residence-time distribution yielding transport delay τ_dead = 3.20 ± 0.04 s.' },
      { label: 'b', title: 'Wiener–Tikhonov Deconvolution', description: 'Restoration of step rate transients from dispersed mass spectrometer signals.' },
      { label: 'c', title: 'L-Curve Regularization', description: 'Mathematical selection of regularization parameter balancing noise and resolution.' },
      { label: 'd', title: 'Error Analysis vs SNR', description: 'Sub-second temporal reconstruction fidelity across operational signal levels.' },
    ],
  },
  {
    id: 4,
    label: 'Figure 4',
    title: 'Synchronized Multimodal Time Series: TEM Atomic Descriptors vs Delayed Online MS',
    caption: 'Continuous 30-second synchronized records comparing local TEM descriptors (coordination, hopping rate) with raw and delay-corrected product rates.',
    extendedCaption: 'a, Pt–Pt metallic coordination number NPt–Pt(t) and dimer population fraction over 30 s of operando CO oxidation. b, Pt hopping frequency rhop(t) displaying bursts of atomic mobility. c, Raw delayed mass spectrometer ion current S(t) at m/z 44 (CO2) shifted by +3.2 s due to fluidic transport. d, Deconvolved instantaneous turnover frequency R(t) aligned with the exact occurrence of atomic coordination transitions.',
    panels: [
      { label: 'a', title: 'Coordination Descriptors', description: 'Local TEM structural time series showing discrete dimer formation events.' },
      { label: 'b', title: 'Atomic Hopping Rate', description: 'Transient bursts of surface migration preceding structural rearrangements.' },
      { label: 'c', title: 'Raw Delayed MS Trace', description: 'Global product signal m/z 44 arriving 3.2 s after local atomic events.' },
      { label: 'd', title: 'Deconvolved Instantaneous TOF', description: 'Gas-transport corrected rate exhibiting direct temporal alignment with TEM motifs.' },
    ],
  },
  {
    id: 5,
    label: 'Figure 5',
    title: 'Event-Aligned Averaging and Statistical Confirmation of Dimer Catalytic Activation',
    caption: 'Ensemble event-aligned averaging of reaction rate transients synchronized to the instant of Pt₁–Pt₂ dimer formation (t = 0).',
    extendedCaption: 'a, Mean product rate response Δr(t) averaged across N = 48 independent dimer association events recorded across 4 distinct MEMS chips. Shaded green band indicates the 95% bootstrap confidence interval, showing a +24.6% ± 4.2% rate surge peaking at t = +0.8 s. b, Comparison with control events (N = 50 random single-atom hops on flat terraces) exhibiting no statistically significant rate alteration (Δr = +1.1% ± 2.8%). c, Event-aligned rate surge amplitude as a function of dimer lifetime τ_life. d, Probability density distribution of pre-event vs post-event turnover frequency.',
    panels: [
      { label: 'a', title: 'Event-Aligned Dimer Response', description: 'Statistically significant +24.6% rate surge aligned to t = 0 (N = 48 events).' },
      { label: 'b', title: 'Control Terrace Hop Analysis', description: 'Flat response for isolated hops confirming absence of observational bias.' },
      { label: 'c', title: 'Rate Surge vs Dimer Lifetime', description: 'Positive correlation between transient ensemble duration and product yield.' },
      { label: 'd', title: 'TOF Probability Distributions', description: 'Unimodal shift from 1.24 s^-1 (monomer baseline) to 1.55 s^-1 (dimer active).' },
    ],
  },
  {
    id: 6,
    label: 'Figure 6',
    title: 'Time-Lagged Cross-Correlation ρ(τ) and Granger Causality Verification',
    caption: 'Mathematical proof of causality: lagged cross-correlation peak at positive lag matching transport delay and Granger F-test validation.',
    extendedCaption: 'a, Lagged cross-correlation coefficient ρ_{X,r}(τ) between the dimer population NPt2(t) and raw mass spectrometer signal S(t+τ). The peak ρ_max = 0.84 appears precisely at τ = +3.20 s, matching the independent transport delay τ_dead. b, Cross-correlation computed with deconvolved rate R(t), peaking symmetrically at τ = 0.0 ± 0.1 s. c, Granger causality F-statistic as a function of model lag order p, rejecting the null hypothesis (F = 18.4, p < 0.001) and confirming that structural transitions drive rate changes. d, Multivariable LASSO regression coefficient path.',
    panels: [
      { label: 'a', title: 'Raw Lagged Cross-Correlation', description: 'Peak at τ = +3.2 s confirms structural transition precedes product arrival.' },
      { label: 'b', title: 'Deconvolved Cross-Correlation', description: 'Symmetric peak at zero lag verifying precise temporal synchronization.' },
      { label: 'c', title: 'Granger Causality F-Test', description: 'Statistical proof that atomic descriptors Granger-cause product formation.' },
      { label: 'd', title: 'LASSO Feature Selection', description: 'Identification of NPt–Pt and VO coordination as dominant rate predictors.' },
    ],
  },
  {
    id: 7,
    label: 'Figure 7',
    title: '3D Causal Structure–Activity Probability Field P(Δr > 0 | D)',
    caption: 'Topological mapping of catalytic activity in multi-dimensional descriptor space distinguishing causal motifs from passive spectators.',
    extendedCaption: 'a, 3D volumetric rendering of causal probability P(Δr > 0) in (NPt–Pt, NPt–supp, qPt) space. b, 2D cross-sectional slice at qPt = +2.2 (Pt²⁺ SMSI state) highlighting the golden active hotspot at NPt–Pt = 1.0 and NPt–supp = 3.8 with P = 0.94. c, Catalytic turnover frequency contour map showing lower activity for isolated monomers (NPt–Pt = 0) and deactivation for sintered clusters (NPt–Pt ≥ 3). d, Probability density of atomic motifs under steady-state reaction conditions.',
    panels: [
      { label: 'a', title: '3D Probability Field', description: 'Volumetric causal probability identifying active catalytic configurations.' },
      { label: 'b', title: '2D Descriptor Slice (q = +2)', description: 'Peak causal probability P = 0.94 centered on transient Pt1–Pt2 dimers.' },
      { label: 'c', title: 'TOF Rate Contours', description: 'Quantitative rate enhancement across coordination configurations.' },
      { label: 'd', title: 'Steady-State Motif Populations', description: 'Population distribution showing dynamic equilibrium under reaction gas.' },
    ],
  },
  {
    id: 8,
    label: 'Figure 8',
    title: 'Electron Dose-Rate Dependence of Pt Hopping and Knock-On Cross Sections',
    caption: 'Systematic variation of electron flux from 0.5 to 500 e⁻/Å²·s isolating thermal Arrhenius migration from electron beam knock-on.',
    extendedCaption: 'a, Measured Pt hopping frequency rhop as a function of electron dose rate Φ at 200 kV (purple) and 80 kV (green). Linear extrapolation to Φ → 0 yields the true thermal rate k_thermal = 0.38 ± 0.04 s⁻¹. b, Knock-on displacement cross section σ_beam as a function of accelerating voltage, showing sharp threshold drop below 112 keV. c, Beam Perturbation Index (BPI) as a function of dose rate; the green safe region (BPI < 0.25) guarantees observation in the thermally dominated regime. d, Arrhenius plots of thermal hopping rates at varied temperatures under low-dose conditions.',
    panels: [
      { label: 'a', title: 'Dose-Rate Mobility Scaling', description: 'Linear scaling k_obs = k_thermal + σ_beam · Φ identifying zero-dose intercept.' },
      { label: 'b', title: 'Voltage Displacement Threshold', description: 'Suppression of ballistic knock-on at 80 kV below the displacement threshold.' },
      { label: 'c', title: 'Beam Perturbation Index (BPI)', description: 'Quantitative metric defining the thermal kinetics regime (BPI < 0.22).' },
      { label: 'd', title: 'Unperturbed Arrhenius Kinetics', description: 'Thermal migration barrier Ea = 0.74 ± 0.05 eV on CeO2(111).' },
    ],
  },
  {
    id: 9,
    label: 'Figure 9',
    title: 'Stroboscopic Beam Blanking Protocols and Thermal vs Radiolytic Kinetic Separation',
    caption: 'Intermittent electron exposure schedules suppressing radiolytic accumulation and preserving unperturbed thermal catalytic cycles.',
    extendedCaption: 'a, Stroboscopic beam blanking timing diagram: exposure window t_exp = 1.0 s followed by blanking recovery window t_blank = 5.0 s (16.7% duty cycle). b, Finite-element simulation of local nanoreactor temperature rise ΔT_beam under continuous exposure (ΔT = +4.2 K) vs stroboscopic blanking (ΔT < +0.4 K). c, Cumulative electron dose comparison over 30 minutes of operando acquisition. d, Invariance of the event-aligned CO2 product surge under stroboscopic vs continuous imaging.',
    panels: [
      { label: 'a', title: 'Stroboscopic Timing Protocol', description: 'Pulsed electrostatic beam blanking with 16.7% imaging duty cycle.' },
      { label: 'b', title: 'Nanoscale Beam Heating Profile', description: 'Suppression of beam-induced thermal rise to <0.4 K in stroboscopic mode.' },
      { label: 'c', title: 'Cumulative Dose Reduction', description: '6-fold lower electron burden preventing specimen carbonization and damage.' },
      { label: 'd', title: 'Reaction Invariance Test', description: 'Identical catalytic rate transients confirming thermal mechanism integrity.' },
    ],
  },
  {
    id: 10,
    label: 'Figure 10',
    title: 'Dose-Aware Bayesian Trajectory Reconstruction in the Zero-Dose Limit',
    caption: 'Probabilistic particle filtering restoring continuous unperturbed atomic trajectories from intermittent low-dose observations.',
    extendedCaption: 'a, Discrete, noisy atom coordinates recorded during stroboscopic exposure frames. b, Bayesian prior distribution incorporating thermal Arrhenius hopping rates and support diffusion barriers. c, Reconstructed posterior trajectory (cyan curve) with 95% credible intervals (shaded blue band). d, Autocorrelation function of reconstructed trajectories matching theoretical Markovian random walk kinetics.',
    panels: [
      { label: 'a', title: 'Intermittent Frame Data', description: 'Low-dose coordinate observations recorded at sparse temporal intervals.' },
      { label: 'b', title: 'Arrhenius Bayesian Prior', description: 'Microkinetic prior constraining physically plausible atomic displacement paths.' },
      { label: 'c', title: 'Posterior Continuous Trajectory', description: 'Probabilistic reconstruction of the unperturbed atomic coordinate history.' },
      { label: 'd', title: 'Trajectory Autocorrelation', description: 'Validation against theoretical 2D Brownian surface diffusion models.' },
    ],
  },
  {
    id: 11,
    label: 'Figure 11',
    title: 'Operando EXAFS Cross-Validation of Pt Coordination Numbers',
    caption: 'Synchrotron X-ray absorption fine structure spectroscopy corroborating TEM-derived Pt–Pt and Pt–O coordination numbers in ensemble.',
    extendedCaption: 'a, Operando Pt L3-edge EXAFS Fourier transform magnitude |χ(R)| measured during steady-state CO oxidation at 220 °C (blue circles) and best fit (red line). b, First-shell Pt–Pt coordination number CN = 0.42 ± 0.08 from EXAFS compared to the TEM time-averaged coordination NPt–Pt = 0.45 ± 0.05. c, In situ reduction series demonstrating the emergence of the dynamic dimer peak at R = 2.7 Å. d, Wavelet transform EXAFS confirming absence of high-coordination metallic nanoparticles.',
    panels: [
      { label: 'a', title: 'Fourier Transform EXAFS', description: 'First-shell Pt–O (1.6 Å) and Pt–Pt (2.7 Å) scattering paths under reaction gas.' },
      { label: 'b', title: 'Coordination Comparison', description: 'Quantitative concordance between ensemble synchrotron XAS and local TEM.' },
      { label: 'c', title: 'Dynamic Reduction Series', description: 'Evolution of dynamic dimer peak under varying CO/O2 chemical potentials.' },
      { label: 'd', title: 'Wavelet Transform Analysis', description: 'Definitive discrimination between sub-nanometer dimers and bulk Pt foils.' },
    ],
  },
  {
    id: 12,
    label: 'Figure 12',
    title: 'Operando DRIFTS Spectroscopy of Linear vs Bridging CO Chemisorption Motifs',
    caption: 'Diffuse reflectance infrared spectroscopy tracking the vibrational signatures of isolated single atoms and transient dimer pairs.',
    extendedCaption: 'a, Operando DRIFTS spectra in the CO stretching region (1700–2200 cm⁻¹) during CO oxidation over Pt1/CeO2 at 220 °C. The dominant peak at 2085 cm⁻¹ corresponds to linear CO atop isolated Pt1; the peak at 1850 cm⁻¹ corresponds to bridge-bonded CO on Pt–Pt pairs. b, Deconvolution of infrared absorbance bands over time. c, Ratio of bridge-to-linear CO integrated absorbance I_bridge / I_linear = 0.28 matching the TEM dimer population fraction (29.2%). d, Temperature-programmed desorption verifying weaker CO binding on dimer motifs.',
    panels: [
      { label: 'a', title: 'Operando DRIFTS Spectra', description: 'Vibrational bands of linear (2085 cm⁻¹) and bridging (1850 cm⁻¹) CO species.' },
      { label: 'b', title: 'Band Area Deconvolution', description: 'Tracking the dynamic population fraction of isolated vs paired Pt sites.' },
      { label: 'c', title: 'Ensemble Ratio Concordance', description: 'Agreement between spectroscopic bridge fraction and TEM dimer count.' },
      { label: 'd', title: 'CO Desorption Energetics', description: 'Facile CO desorption from dimers relieving self-poisoning at 220 °C.' },
    ],
  },
  {
    id: 13,
    label: 'Figure 13',
    title: 'Operando Raman Spectroscopy of Support Oxygen Vacancy Defect Dynamics',
    caption: 'Vibrational probing of the CeO₂ support demonstrating dynamic generation of oxygen vacancies (595 cm⁻¹) in sync with Pt restructuring.',
    extendedCaption: 'a, Operando Raman spectra of Pt1/CeO2 showing the symmetric Ce–O F2g phonon mode at 465 cm⁻¹ and the oxygen-vacancy defect mode (D-band) at 595 cm⁻¹. b, Evolution of the I_595 / I_465 intensity ratio during cyclic switching of CO and O2 feed streams. c, Spatial Raman mapping across the catalyst wafer confirming uniform defect density. d, Correlation between Raman vacancy intensity and the TEM-observed Pt pinning frequency at VO sites.',
    panels: [
      { label: 'a', title: 'Operando Raman Spectra', description: 'F2g fundamental (465 cm⁻¹) and oxygen-vacancy defect mode (595 cm⁻¹).' },
      { label: 'b', title: 'Dynamic Gas-Switch Response', description: 'Reversible vacancy generation under CO reduction and healing under O2.' },
      { label: 'c', title: 'Spatial Defect Mapping', description: 'Uniform support oxygen mobility across the catalytic nanoreactor bed.' },
      { label: 'd', title: 'Correlation with TEM Pinning', description: 'Direct proportionality between Raman VO band and atomic pinning lifetimes.' },
    ],
  },
  {
    id: 14,
    label: 'Figure 14',
    title: 'Plug-Flow Microreactor Benchmark vs MEMS Nanoreactor Turnover Frequencies',
    caption: 'Rigorous kinetic validation demonstrating that the microfluidic nanoreactor reproduces macroscopic catalytic rates without mass-transfer limitations.',
    extendedCaption: 'a, Steady-state CO conversion X_CO as a function of temperature (120–300 °C) in an ex situ plug-flow fixed-bed reactor (black circles) compared to the MEMS nanoreactor (red diamonds). b, Arrhenius plots yielding identical apparent activation energies: E_app = 68.4 ± 3.2 kJ/mol (fixed-bed) vs 69.1 ± 3.5 kJ/mol (nanoreactor). c, Reaction order measurements with respect to P_CO (-0.22) and P_O2 (+0.84). d, Weisz-Prater criterion calculation (C_WP < 0.05) ruling out intra-bed diffusion limitations.',
    panels: [
      { label: 'a', title: 'CO Light-Off Comparison', description: 'Superimposable conversion curves confirming identical kinetic behavior.' },
      { label: 'b', title: 'Apparent Activation Energy', description: 'Matching Arrhenius barriers verifying absent thermal gradients.' },
      { label: 'c', title: 'Kinetic Reaction Orders', description: 'Identical partial pressure dependencies in both reactor geometries.' },
      { label: 'd', title: 'Weisz–Prater Criterion', description: 'Rigorous proof of operation in the true chemical kinetic regime.' },
    ],
  },
  {
    id: 15,
    label: 'Figure 15',
    title: 'Closed-Loop Adaptive Catalyst Feedback Circuit and Dynamic Anti-Sintering Control',
    caption: 'Real-time computer vision detection of cluster coarsening triggering automated 50-ms oxidative pulses that redisperse Pt single atoms.',
    extendedCaption: 'a, Block diagram of the closed-loop feedback system: TEM stream → real-time descriptor filter → threshold comparator (NPt–Pt > 1.8) → high-speed piezo valve driver. b, Sequence of HAADF-STEM frames capturing the rapid redispersion of a 4-atom Pt cluster into isolated single atoms within 1.5 s following a 50-ms 15% O2 pulse. c, Transient potential and chemical flux response during pulse execution. d, Single-atom dispersion score recovery from 42% back to 96%.',
    panels: [
      { label: 'a', title: 'Feedback Loop Architecture', description: 'Automated closed-loop control maintaining optimal dynamic motif distributions.' },
      { label: 'b', title: 'Cluster Redispersion Sequence', description: 'Oxidative cleavage of metallic Pt–Pt bonds into anchored single atoms in 1.5 s.' },
      { label: 'c', title: 'Pulse Actuation Dynamics', description: '50-ms high-speed piezo gas delivery without disturbing pressure regulation.' },
      { label: 'd', title: 'Dispersion Recovery Metric', description: 'Instantaneous restoration of single-atom dispersion score above 95%.' },
    ],
  },
  {
    id: 16,
    label: 'Figure 16',
    title: '50-Cycle Reversibility and Anti-Sintering Durability Benchmark',
    caption: 'Extended 72-hour catalytic durability comparison between closed-loop adaptive self-regeneration and uncontrolled static catalyst deactivation.',
    extendedCaption: 'a, Single-atom dispersion percentage over 50 consecutive thermal stress and start-stop cycles. Adaptive catalyst (emerald curve) maintains 94.2% dispersion; uncontrolled catalyst (rose curve) severely sinters to 28.4%. b, Catalytic CO2 turnover frequency retention over 72 hours (96.8% vs 25.6%). c, HAADF-STEM overview micrographs after 50 cycles showing persistent isolated atoms in the adaptive system vs large 3-nm nanoparticles in the uncontrolled system. d, Cumulative Pt loss profile measured by ICP-MS confirming zero volatile leaching.',
    panels: [
      { label: 'a', title: 'Dispersion Retention vs Cycles', description: 'Stable 94.2% dispersion over 50 cycles under closed-loop stabilization.' },
      { label: 'b', title: 'Turnover Rate Durability', description: 'Persistent 96.8% activity retention avoiding conventional catalyst decay.' },
      { label: 'c', title: 'Post-Mortem STEM Micrographs', description: 'Absence of sintered nanoparticles following 72 hours of cyclic stress.' },
      { label: 'd', title: 'ICP-MS Metal Leaching Assay', description: 'Negligible metal loss during gas-pulsed redispersion protocols.' },
    ],
  },
  {
    id: 17,
    label: 'Figure 17',
    title: 'Model System 2: Pt₁/TiO₂(110) Polaron-Mediated Hopping and Ethylene Hydrogenation',
    caption: 'Causal activity mapping on reducible titania demonstrating polaron-coupled H₂ heterolytic activation without dimer formation.',
    extendedCaption: 'a, Atomic resolution HAADF-STEM of Pt1 on TiO2(110) aligned along [001] oxygen bridging rows. b, Pt hopping trajectories showing anisotropic 1D diffusion along bridging rows with Ea = 0.62 eV. c, Operando EELS Ti L2,3 edge showing localized Ti3+ polaron states pinned beneath Pt atoms. d, Event-aligned ethane product rate Δr_C2H6 during ethylene hydrogenation; isolated Pt1 sites coupled to polarons drive turnover without requiring metallic dimer formation.',
    panels: [
      { label: 'a', title: 'Pt₁/TiO₂ Atomic Structure', description: 'Single Pt atoms anchored on bridging oxygen rows of rutile TiO2(110).' },
      { label: 'b', title: '1D Directional Hopping', description: 'Anisotropic migration with lower barrier along [001] channels.' },
      { label: 'c', title: 'Ti³⁺ Polaron EELS Signature', description: 'Localized sub-surface charge transfer stabilizing the Pt1 active center.' },
      { label: 'd', title: 'Ethane Product Correlation', description: 'Facile H2 activation on isolated polaronic Pt1 without dimer formation.' },
    ],
  },
  {
    id: 18,
    label: 'Figure 18',
    title: 'Model System 3: Pt₁/N-Doped Carbon Electrocatalyst for Oxygen Reduction (ORR)',
    caption: 'Liquid-cell operando TEM tracking of Pt–N₄ coordination stability and 4-electron ORR selectivity under electrochemical potential control.',
    extendedCaption: 'a, Liquid-cell electrochemical TEM holder geometry in 0.1 M HClO4 electrolyte. b, High-resolution HAADF-STEM image of isolated Pt atoms coordinated into N-doped graphene matrices. c, Cyclic voltammogram and online electrochemical mass spectrometry (OLEMS) tracking O2 consumption and H2O2 byproduct formation. d, Potential-step transients from 0.6 V to 1.05 V vs RHE showing reversible Pt–O coordination restructuring and preservation of the Pt–N4 anchoring framework.',
    panels: [
      { label: 'a', title: 'Liquid-Cell Operando Setup', description: 'Electrochemical micro-cell integrating glassy carbon working electrode.' },
      { label: 'b', title: 'Pt–N₄ Site Visualization', description: 'Robust atomic dispersion on nitrogen-doped carbon nanosheets.' },
      { label: 'c', title: 'ORR Hydrodynamic Voltammetry', description: 'High kinetic current density (3.8 mA/cm² @ 0.90 V) with 98.6% H2O selectivity.' },
      { label: 'd', title: 'Potential-Step Restructuring', description: 'Dynamic Pt–O axial bond formation without electro-dissolution.' },
    ],
  },
  {
    id: 19,
    label: 'Figure 19',
    title: 'Model System 4: Pt–Sn Dual-Atom Sites for Selective CO₂ Reduction to Formate',
    caption: 'Ensemble-controlled selectivity mapping demonstrating switching from CO (isolated Pt₁) to HCOOH (Pt–Sn pairs) via adjacent heteroatom tuning.',
    extendedCaption: 'a, Atomic resolution HAADF-STEM imaging of paired Pt–Sn dual-atom sites on carbon nanotubes (interatomic distance d_Pt-Sn = 2.45 Å). b, Faradaic efficiency of CO2 electroreduction products: isolated Pt1 produces CO (82% FE), whereas Pt–Sn dual sites switch selectivity to formate (88.4% FE). c, Operando Sn K-edge and Pt L3-edge XAS proving persistent heterodimeric coordination under -0.8 V vs RHE. d, DFT calculated *OCHO vs *COOH free energy pathways.',
    panels: [
      { label: 'a', title: 'Pt–Sn Dual-Atom HAADF-STEM', description: 'Heteronuclear Pt–Sn pairs identified by distinct Z-contrast intensities.' },
      { label: 'b', title: 'Selectivity Switching Map', description: 'Dramatic shift from CO to formate mediated by adjacent Sn promoter atom.' },
      { label: 'c', title: 'In Situ Heterodimer XAS', description: 'Preservation of the direct Pt–Sn bonding under intense cathodic bias.' },
      { label: 'd', title: 'Reaction Pathway Free Energies', description: 'Oxophilic Sn stabilizing *OCHO intermediate to steer formate pathway.' },
    ],
  },
  {
    id: 20,
    label: 'Figure 20',
    title: 'Density Functional Theory Microkinetic Free Energy Landscape of Pt₁ vs Pt₁–Pt₂ Motifs',
    caption: 'Spin-polarized DFT+U reaction coordinates comparing Langmuir–Hinshelwood and Mars–van Krevelen pathways for CO oxidation on CeO₂.',
    extendedCaption: 'a, Relaxed atomic structures of reaction intermediates along the CO oxidation pathway: CO adsorption, O2 co-adsorption, peroxo transition state, and CO2 desorption on isolated Pt1 (top row) vs Pt1–Pt2 dimer (bottom row). b, Free energy diagram at 220 °C showing that the dimer relieves severe CO self-poisoning (ΔG_ads = -1.65 eV vs -2.48 eV) and dramatically lowers the rate-limiting O–O scission barrier from 1.42 eV to 0.38 eV. c, Microkinetic turnover rate comparison matching experimental CEM values within 15%. d, Charge density difference maps showing electron transfer to the CeO2 support.',
    panels: [
      { label: 'a', title: 'DFT Optimized Intermediates', description: 'Geometric structures of stationary and transition states on CeO2(111).' },
      { label: 'b', title: 'Reaction Free Energy Profile', description: 'Significant reduction in O–O dissociation barrier on the transient dimer.' },
      { label: 'c', title: 'Microkinetic TOF Simulation', description: 'Theoretical rate predictions quantitatively matching operando deconvolution.' },
      { label: 'd', title: 'Differential Charge Density', description: 'Interfacial charge redistribution facilitating facile O2 activation.' },
    ],
  },
];

export const MANUSCRIPT_TABLES: ManuscriptTableData[] = [
  {
    id: 1,
    label: 'Table 1',
    title: 'Physicochemical Properties and Initial Dispersion of Model Catalyst Systems',
    headers: ['Catalyst System', 'Support Matrix', 'Pt Loading (wt%)', 'BET Area (m²/g)', 'Defect Density (nm⁻²)', 'Initial Dispersion (%)', 'Synthesis Method'],
    rows: [
      ['Pt₁/CeO₂', 'CeO₂ Nanorods (111)', '0.45 ± 0.03', '84.2 ± 3.1', '0.48 ± 0.05 (V_O)', '96.4 ± 1.2', 'Atom Trapping (800 °C)'],
      ['Pt₁/TiO₂', 'Rutile TiO₂ (110)', '0.38 ± 0.02', '52.6 ± 2.4', '0.34 ± 0.04 (Ti³⁺)', '95.1 ± 1.5', 'Wet Impregnation + Photodep.'],
      ['Pt₁/N-C', 'N-Doped Graphene', '0.92 ± 0.05', '480 ± 15', '1.24 ± 0.08 (N-pyrrolic)', '98.2 ± 0.8', 'Pyrolysis of ZIF-8 Precursor'],
      ['Pt–Sn/CNT', 'Multi-Walled CNTs', '0.65 (Pt), 0.38 (Sn)', '210 ± 8', '0.85 ± 0.06 (Defect C)', '94.8 ± 1.4', 'Co-Coordination Impregnation'],
      ['Pt–Fe/N-C', 'N-Doped Carbon', '0.74 (Pt), 0.22 (Fe)', '510 ± 20', '1.38 ± 0.09 (N-pyridinic)', '96.0 ± 1.1', 'Dual-Metal Complex Chelation'],
    ],
    footnotes: [
      'Metal loadings quantified via inductively coupled plasma optical emission spectroscopy (ICP-OES).',
      'Defect densities measured via operando Raman (CeO₂), EPR (TiO₂), and high-resolution XPS N 1s deconvolution (N-C).',
      'Initial dispersion determined by statistic counting of >1,500 individual metal centers across 50 HAADF-STEM images.',
    ],
  },
  {
    id: 2,
    label: 'Table 2',
    title: 'Operando Reaction Targets and Experimental Operating Conditions',
    headers: ['Reaction Target', 'Phase', 'Feed Composition', 'T (°C)', 'P (bar)', 'Flow (sccm)', 'Primary Product', 'Intrinsic TOF (s⁻¹)'],
    rows: [
      ['CO Oxidation', 'Gas', '1% CO, 5% O₂, 94% He', '220', '1.2', '5.0', 'CO₂ (m/z 44)', '1.54 ± 0.12'],
      ['Ethylene Hydrogenation', 'Gas', '2% C₂H₄, 10% H₂, 88% He', '80', '1.1', '5.0', 'C₂H₆ (m/z 30)', '4.82 ± 0.35'],
      ['Oxygen Reduction (ORR)', 'Liquid', 'O₂-Sat. 0.1 M HClO₄', '25', '1.0', '10.0 µL/min', 'H₂O (4e⁻ pathway)', '3.85 mA/cm² @ 0.9V'],
      ['CO₂ Reduction (CO₂RR)', 'Liquid', 'CO₂-Sat. 0.1 M KHCO₃', '25', '1.0', '15.0 µL/min', 'HCOOH / CO', '24.2 mA/cm² @ -0.8V'],
      ['Hydrogen Evolution (HER)', 'Liquid', 'Ar-Sat. 0.5 M H₂SO₄', '25', '1.0', '10.0 µL/min', 'H₂ (m/z 2)', '18.4 s⁻¹ @ -50 mV'],
    ],
    footnotes: [
      'Reaction rates measured in the microfluidic MEMS nanoreactor cell with online QMS and OLEMS detection.',
      'Turnover frequency normalized per total supported Pt atom site quantified by ICP-OES.',
    ],
  },
  {
    id: 3,
    label: 'Table 3',
    title: 'MEMS Nanoreactor Fluidic Transport Parameters and Transfer Line Calibration',
    headers: ['Parameter', 'Symbol', 'Unit', 'Measured Value', 'Uncertainty', 'Method / Origin'],
    rows: [
      ['Reaction Chamber Volume', 'V_cell', 'nL', '42.5', '± 1.2', 'Profilometry & CAD Microfabrication'],
      ['Capillary Transfer Line Length', 'L_cap', 'm', '1.20', '± 0.01', 'Fused-silica capillary (i.d. 100 µm)'],
      ['Transfer Line Temperature', 'T_cap', '°C', '180', '± 2', 'Resistive heating jacket'],
      ['Volumetric Flow Rate', 'Q_gas', 'sccm', '5.0', '± 0.1', 'Calibrated thermal mass-flow controller'],
      ['Peclet Number', 'Pe', 'dimensionless', '42.4', '± 1.8', 'Pe = u · L / D_ax (Advection-dominated)'],
      ['Gas Transport Dead Time', 'τ_dead', 's', '3.20', '± 0.04', '20-ms delta-pulse QMS arrival'],
      ['Dispersion Broadening Coefficient', 'σ_disp', 's', '0.55', '± 0.03', 'Gaussian-exponential tail fitting'],
      ['Wiener-Tikhonov Regularizer', 'λ_opt', 'dimensionless', '0.018', '± 0.002', 'L-curve curvature maximum'],
    ],
    footnotes: [
      'Calibration performed with pure He carrier gas and CO₂ tracer pulses at operational temperature and pressure.',
      'Reynolds number Re < 0.8 confirms strictly laminar flow through the entire microfluidic circuit.',
    ],
  },
  {
    id: 4,
    label: 'Table 4',
    title: 'Atomic Structural Descriptor Extraction Metrics and Resolution Bounds',
    headers: ['Descriptor Variable', 'Symbol', 'Extracted Meaning', 'Sampling Rate', 'Measurement Precision', 'Analytical Method'],
    rows: [
      ['Pt–Pt Coordination Number', 'N_Pt-Pt', 'Metallic bond aggregation', '10 Hz', '± 0.05', 'HAADF-STEM Voronoi / Pair Dist.'],
      ['Pt–Support Coordination', 'N_Pt-supp', 'Anchoring & defect pinning', '10 Hz', '± 0.12', 'Sub-angstrom lattice registration'],
      ['Pt Oxidation State Proxy', 'q_Pt', 'Local electronic valence', '2 Hz', '± 0.15 e⁻', 'Pt M₃-edge EELS white-line ratio'],
      ['Atomic Hopping Rate', 'r_hop', 'Surface migration mobility', '10 Hz', '± 0.02 hops/s', 'Sub-pixel centroid displacement >1.2 Å'],
      ['Cluster Mean Lifetime', 'τ_cluster', 'Transient motif persistence', 'Event-based', '± 0.10 s', 'Continuity tracking across frames'],
      ['Adsorbate Coverage Proxy', 'θ_ads', 'Local chemical loading', '2 Hz', '± 0.08 ML', 'O K-edge and C K-edge core-loss EELS'],
    ],
    footnotes: [
      'Centroid localization achieved using 2D Gaussian fitting on Wiener-filtered HAADF-STEM frame arrays.',
      'Minimum hopping displacement threshold set at 1.2 Å (half the CeO₂–CeO₂ surface lattice spacing) to reject vibration noise.',
    ],
  },
  {
    id: 5,
    label: 'Table 5',
    title: 'Cross-Correlation Coefficients and Time Lags across Catalyst Models and Reactions',
    headers: ['Catalyst System', 'Reaction Target', 'Active Motif Transition', 'Peak Lag τ_peak (s)', 'Transport Delay τ_dead (s)', 'Max Correlation ρ_max', 'Granger F-Stat (p-val)'],
    rows: [
      ['Pt₁/CeO₂', 'CO Oxidation', 'Pt₁ → Pt₁–Pt₂ Dimer', '+3.20 ± 0.04', '3.20 ± 0.04', '0.84 ± 0.03', '18.4 (p < 0.0001)'],
      ['Pt₁/TiO₂', 'Ethylene Hydrogenation', 'Pt₁–Terrace → Pt₁–Polaron', '+3.18 ± 0.05', '3.20 ± 0.04', '0.79 ± 0.04', '14.2 (p = 0.0002)'],
      ['Pt₁/N-C', 'Oxygen Reduction (ORR)', 'Pt–N₄ → Pt–N₄(OH)_ax', '+1.45 ± 0.02', '1.44 ± 0.02', '0.88 ± 0.02', '22.1 (p < 0.0001)'],
      ['Pt–Sn/CNT', 'CO₂ Reduction (CO₂RR)', 'Pt–Sn Heterodimer Restruct.', '+1.48 ± 0.03', '1.44 ± 0.02', '0.81 ± 0.03', '16.8 (p < 0.0001)'],
      ['Pt–Fe/N-C', 'Oxygen Reduction (ORR)', 'Pt–Fe Dual-Site Oxygen Bridging', '+1.46 ± 0.02', '1.44 ± 0.02', '0.86 ± 0.03', '20.5 (p < 0.0001)'],
    ],
    footnotes: [
      'Gas-phase reactions evaluated at 5.0 sccm (τ_dead = 3.20 s); liquid-phase reactions evaluated with OLEMS (τ_dead = 1.44 s).',
      'Granger causality tests performed at lag order p = 4; all p-values reject the null hypothesis at >99.9% confidence.',
    ],
  },
  {
    id: 6,
    label: 'Table 6',
    title: 'Multivariable LASSO Kinetic State-Space Regression Coefficients',
    headers: ['Predictor Term', 'Physical Meaning', 'Standardized Coeff β', 'Standard Error', 't-Statistic', 'p-Value', 'Variance Inflation Factor'],
    rows: [
      ['Intercept (β₀)', 'Baseline unperturbed rate', '1.242', '0.045', '27.6', '< 0.0001', '—'],
      ['N_Pt-Pt (β₁)', 'Metallic Pt–Pt coordination', '+0.684', '0.052', '13.1', '< 0.0001', '1.42'],
      ['N_Pt-supp (β₂)', 'Support vacancy coordination', '+0.412', '0.048', '8.58', '< 0.0001', '1.38'],
      ['r_hop (β₃)', 'Surface migration frequency', '+0.218', '0.039', '5.59', '< 0.0001', '1.25'],
      ['q_Pt (β₄)', 'Pt oxidation state (EELS)', '-0.145', '0.041', '-3.54', '0.0004', '1.51'],
      ['T_cell (β₅)', 'Nanoreactor temperature', '+0.324', '0.036', '9.00', '< 0.0001', '1.18'],
      ['P_CO (β₆)', 'CO reactant partial pressure', '-0.112', '0.034', '-3.29', '0.0011', '1.32'],
      ['P_O2 (β₇)', 'O₂ reactant partial pressure', '+0.285', '0.038', '7.50', '< 0.0001', '1.29'],
    ],
    footnotes: [
      'Model: r(t) = β₀ + ∑ β_i · X_i(t) + ε(t). Total R² = 0.912, adjusted R² = 0.906, F(7, 142) = 210.4 (p < 0.0001).',
      'VIF < 2.0 confirms absence of severe multicollinearity among atomic descriptors and macroscopic variables.',
    ],
  },
  {
    id: 7,
    label: 'Table 7',
    title: 'Electron Beam Interaction Parameters, Knock-On Cross Sections, and Damage Thresholds',
    headers: ['Accelerating Voltage (kV)', 'Electron Wavelength (pm)', 'Max Energy Transfer T_max (eV)', 'Knock-On Cross Section σ (Å²)', 'Threshold Dose Φ_crit (e⁻/Å²·s)', 'Measured BPI (at 25 e⁻/Å²·s)'],
    rows: [
      ['80 kV', '4.18', '0.98 eV', '(2.1 ± 0.3) × 10⁻⁴', '480', '0.042 ± 0.005'],
      ['120 kV', '3.35', '1.52 eV', '(5.8 ± 0.6) × 10⁻⁴', '220', '0.098 ± 0.008'],
      ['200 kV', '2.51', '2.68 eV', '(1.42 ± 0.11) × 10⁻³', '85', '0.218 ± 0.015'],
      ['300 kV', '1.97', '4.24 eV', '(3.85 ± 0.28) × 10⁻³', '32', '0.485 ± 0.028'],
    ],
    footnotes: [
      'Maximum kinetic energy transfer T_max calculated for relativistic head-on elastic collision with a ¹⁹⁵Pt nucleus.',
      'Bulk displacement threshold for Pt on CeO₂(111) is E_d = 1.45 eV (corresponding to 112 keV incident electrons).',
      'BPI > 0.35 denotes beam-dominated mobility where electron radiation displaces atoms faster than thermal Arrhenius hopping.',
    ],
  },
  {
    id: 8,
    label: 'Table 8',
    title: 'Dose-Dependent Hopping Frequencies and Bayesian Extrapolated Zero-Dose Limits',
    headers: ['Dose Rate Φ (e⁻/Å²·s)', 'Imaging Mode', 'Duty Cycle (%)', 'Measured r_hop (s⁻¹)', 'Beam Knock-On Rate (s⁻¹)', 'Inferred k_thermal (s⁻¹)', 'Bayesian Confidence (%)'],
    rows: [
      ['0.5', 'Continuous', '100', '0.38 ± 0.03', '0.001', '0.38 ± 0.03', '98.5'],
      ['5.0', 'Continuous', '100', '0.39 ± 0.03', '0.007', '0.38 ± 0.03', '97.8'],
      ['25.0', 'Continuous', '100', '0.42 ± 0.04', '0.036', '0.38 ± 0.03', '96.2'],
      ['100.0', 'Continuous', '100', '0.52 ± 0.05', '0.142', '0.38 ± 0.04', '92.4'],
      ['250.0', 'Continuous', '100', '0.74 ± 0.07', '0.355', '0.38 ± 0.05', '84.0'],
      ['25.0', 'Stroboscopic (1s on / 5s off)', '16.7', '0.39 ± 0.03', '0.006', '0.38 ± 0.03', '98.1'],
      ['100.0', 'Stroboscopic (1s on / 5s off)', '16.7', '0.41 ± 0.04', '0.024', '0.38 ± 0.03', '97.2'],
    ],
    footnotes: [
      'Measurements conducted on Pt₁/CeO₂ at 220 °C in 1.2 bar CO/O₂/He.',
      'Extrapolated zero-dose thermal hopping frequency k_thermal = 0.38 ± 0.03 s⁻¹ matches theoretical Arrhenius prediction (0.36 s⁻¹).',
    ],
  },
  {
    id: 9,
    label: 'Table 9',
    title: 'Multi-Technique Operando Cross-Validation: Local TEM vs Macroscopic Ensemble Observables',
    headers: ['Analytical Technique', 'Investigated Observable', 'Physical Scale', 'Ensemble Benchmark Value', 'Operando CEM Correlated Value', 'Concordance Assessment'],
    rows: [
      ['Operando EXAFS (Pt L₃ Edge)', 'Pt–Pt Coordination Number (CN)', 'Ensemble (~10¹⁶ atoms)', 'CN = 0.42 ± 0.08', 'N_Pt-Pt = 0.45 ± 0.05', 'Concordant within 1σ'],
      ['Operando EXAFS (Pt L₃ Edge)', 'Pt–O Coordination Number (CN)', 'Ensemble (~10¹⁶ atoms)', 'CN = 3.60 ± 0.30', 'N_Pt-supp = 3.40 ± 0.20', 'Concordant within 1σ'],
      ['Operando DRIFTS', 'Bridge / Linear CO Area Ratio', 'Wafer (~10¹⁴ sites)', 'I_bridge / I_linear = 0.28', 'Dimer Fraction = 0.292', 'Concordant (<4% delta)'],
      ['Operando Raman Spectroscopy', 'Oxygen Vacancy Ratio (I_595 / I_465)', 'Spot (~10¹² sites)', 'I_ratio = 0.16 ± 0.02', 'V_O Pinning Ratio = 0.18', 'Concordant within 1σ'],
      ['Plug-Flow Microreactor', 'Intrinsic TOF at 220 °C (s⁻¹ site⁻¹)', 'Pellet Bed (~10¹⁷ sites)', '1.48 ± 0.09', '1.54 ± 0.12 (Deconvolved)', 'Concordant (<4% delta)'],
      ['Plug-Flow Microreactor', 'Apparent Activation Energy E_app', 'Pellet Bed (~10¹⁷ sites)', '68.4 ± 3.2 kJ/mol', '69.1 ± 3.5 kJ/mol', 'Identical within error'],
    ],
    footnotes: [
      'All cross-validation experiments performed on identical catalyst synthesis batches under matched gas feeds and temperatures.',
      'Confirms spatial representativeness of local 8.0 × 8.0 nm TEM observations relative to macroscopic reactor kinetics.',
    ],
  },
  {
    id: 10,
    label: 'Table 10',
    title: 'Closed-Loop Adaptive Catalyst Durability and Dispersion Retention across 50 Cycles',
    headers: ['Cycle Number', 'Single-Atom Dispersion (%)', 'Active Dimer Fraction (%)', 'Sintered Clusters (N ≥ 3)', 'CO₂ TOF (s⁻¹ site⁻¹)', 'Regeneration Pulses Executed', 'Health Status'],
    rows: [
      ['Cycle 1 (Fresh)', '96.4 ± 1.2', '29.4 ± 1.5', '0', '1.54 ± 0.12', '0', 'Optimal Active State'],
      ['Cycle 10', '95.8 ± 1.4', '28.8 ± 1.6', '1', '1.52 ± 0.11', '2 (Auto-triggered)', 'Self-Regenerated'],
      ['Cycle 20', '95.1 ± 1.5', '28.2 ± 1.4', '1', '1.50 ± 0.12', '5 (Auto-triggered)', 'Self-Regenerated'],
      ['Cycle 30', '94.8 ± 1.6', '27.9 ± 1.5', '2', '1.49 ± 0.10', '8 (Auto-triggered)', 'Self-Regenerated'],
      ['Cycle 40', '94.5 ± 1.8', '27.5 ± 1.4', '2', '1.48 ± 0.11', '11 (Auto-triggered)', 'Self-Regenerated'],
      ['Cycle 50 (Final)', '94.2 ± 1.8', '27.2 ± 1.5', '2', '1.47 ± 0.11', '14 (Auto-triggered)', 'Optimal Active State'],
      ['Cycle 50 (Uncontrolled Control)', '28.4 ± 3.5', '6.2 ± 1.2', '48 (Sintered NPs)', '0.39 ± 0.08', '0 (Uncontrolled)', 'Severe Deactivation'],
    ],
    footnotes: [
      'Each cycle consists of 1 h steady-state CO oxidation (220 °C, 1.2 bar), 10 min reduction under 5% CO/He, and thermal ramp.',
      'The uncontrolled catalyst underwent irreversible sintering into 2.8 ± 0.6 nm nanoparticles with a 74.7% loss in turnover rate.',
    ],
  },
  {
    id: 11,
    label: 'Table 11',
    title: 'DFT+U Calculated Reaction Enthalpies, Activation Free Energies, and Transition State Barriers',
    headers: ['Elementary Reaction Step', 'Catalytic Motif / Site', 'ΔE_DFT (eV)', 'ΔG_220°C (eV)', 'Forward Barrier E_a (eV)', 'Rate-Determining Character'],
    rows: [
      ['CO(g) + * → CO*', 'Isolated Pt₁ on CeO₂(111)', '-2.48', '-1.62', '0.00 (Barrierless)', 'Severe CO self-poisoning'],
      ['CO(g) + * → CO*', 'Pt₁–Pt₂ Dimer at V_O', '-1.65', '-0.88', '0.00 (Barrierless)', 'Reversible, facile turnover'],
      ['O₂(g) + 2* → 2O*', 'Isolated Pt₁ on CeO₂(111)', '-0.84', '-0.12', '1.42 ± 0.04', 'Rate-limiting bottleneck on Pt₁'],
      ['O₂(g) + 2* → 2O*', 'Pt₁–Pt₂ Dimer at V_O', '-1.92', '-1.18', '0.38 ± 0.03', 'Facile dual-site scission'],
      ['CO* + O* → CO₂* (TS₁)', 'Isolated Pt₁ on CeO₂(111)', '-1.12', '-1.05', '0.78 ± 0.04', 'Langmuir–Hinshelwood intermediate'],
      ['CO* + O* → CO₂* (TS₁)', 'Pt₁–Pt₂ Dimer at V_O', '-1.84', '-1.76', '0.45 ± 0.03', 'Facile coupling at dimer perimeter'],
      ['CO₂* → CO₂(g) + *', 'Both Pt Sites', '+0.22', '-0.42', '0.22 (Desorption)', 'Spontaneous product release'],
      ['CO* + O_lat → CO₂ + V_O', 'Mars–van Krevelen at Ceria Boundary', '-1.45', '-1.38', '0.62 ± 0.04', 'Regenerates support vacancy'],
    ],
    footnotes: [
      'Calculations performed with VASP (PBE+U, U_eff = 4.5 eV on Ce 4f, 400 eV plane-wave cutoff).',
      'Free energies ΔG computed at T = 493.15 K (220 °C) and P = 1.0 bar including zero-point energy and vibrational entropy.',
    ],
  },
];
