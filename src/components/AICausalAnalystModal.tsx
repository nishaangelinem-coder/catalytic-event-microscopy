import React, { useState } from 'react';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  Atom,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ModelSystem,
  ReactionTarget,
  DescriptorsD_t,
  CatalyticEvent,
  BeamPerturbationMetrics,
  AICausalReport,
} from '../types';

interface AICausalAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  system: ModelSystem;
  reaction: ReactionTarget;
  descriptors: DescriptorsD_t;
  events: CatalyticEvent[];
  beamMetrics: BeamPerturbationMetrics;
  tauDead: number;
}

export const AICausalAnalystModal: React.FC<AICausalAnalystModalProps> = ({
  isOpen,
  onClose,
  system,
  reaction,
  descriptors,
  events,
  beamMetrics,
  tauDead,
}) => {
  const [userHypothesis, setUserHypothesis] = useState(
    'Does transient Pt1-Pt2 dimer restructuring causally accelerate CO2 turnover frequency, or is it a beam-induced artifact?'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AICausalReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-causal-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelSystem: system,
          reactionTarget: reaction,
          descriptors,
          eventsDetected: events.slice(-15),
          crossCorrelation: {
            tauDead,
            deltaR: 24.6,
            tauPeak: 3.4,
          },
          beamPerturbationIndex: beamMetrics,
          userHypothesis,
        }),
      });

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
      } else if (data.analyticalInsight) {
        setReport(data.analyticalInsight);
      } else {
        throw new Error(data.error || 'Failed to receive analysis report.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with AI Causal Reasoner.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                AI Causal Event & Mechanistic Reasoner
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating {system.name} • {reaction.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* User Hypothesis Input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium block">
              Mechanistic Query or Hypothesis to Test
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={userHypothesis}
                onChange={(e) => setUserHypothesis(e.target.value)}
                placeholder="Ask about active motif, kinetic bottlenecks, or beam-knock-on validity..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium flex items-center gap-1.5 transition-all shrink-0 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Run Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error notice if any */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Results Display */}
          {report ? (
            <div className="space-y-4 animate-fade-in">
              {/* Verdict Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">
                    Causal Hypothesis Verification
                  </span>
                  <div className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{report.causalVerification}</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    Active Motif:{' '}
                    <strong className="text-amber-300">{report.activeMotif}</strong>
                  </div>
                </div>

                <div className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-right font-mono shrink-0">
                  <div className="text-[10px] text-slate-500 uppercase">Causal Confidence</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {report.causalConfidencePercent}%
                  </div>
                </div>
              </div>

              {/* Elementary Reaction Mechanism */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs border-b border-slate-800 pb-1.5">
                  <Atom className="w-3.5 h-3.5 text-cyan-400" />
                  Elementary Reaction Mechanism & Microkinetics
                </div>
                <p className="text-slate-300 leading-relaxed text-xs font-sans">
                  {report.mechanisticRoute}
                </p>
              </div>

              {/* Two Column Grid: Beam Artifacts & Transport Delay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    Beam Perturbation Assessment
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {report.beamArtifactAssessment}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-xs">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    MEMS Transport Delay & h(t) Validity
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {report.transportDelayValidation}
                  </p>
                </div>
              </div>

              {/* Closed Loop Recommendation */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  Recommended Closed-Loop Stabilization Protocol
                </div>
                <p className="text-slate-300 text-[11px] font-mono leading-relaxed">
                  {report.recommendedClosedLoopPulse}
                </p>
              </div>

              {/* Suggested Next Experiment */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/60 space-y-1 text-slate-300 text-xs">
                <span className="font-semibold text-purple-200">
                  Recommended Next Operando Experiment:
                </span>
                <p className="text-slate-400 text-[11px]">
                  {report.suggestedNextOperandoExperiment}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200">
                  Ready to Evaluate Operando Descriptors
                </h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Click "Run Evaluation" above to trigger AI-guided causal structure-activity verification on the current
                  synchronized TEM atomic trajectories, EELS white-line ratios, and online mass spectrometry traces.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>Server-Side @google/genai Reasoning Engine</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
