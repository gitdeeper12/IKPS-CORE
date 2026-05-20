// IKPS-CORE Main Entry Point
// Pure Epistemic Projection System

export { 
  projectDialogue, 
  exportToJSON,
  type EPS, 
  type DialogueTurn 
} from './core/projectionOperator';

export {
  computeSemanticDrift,
  detectInflectionPoints,
  cumulativeDrift
} from './core/semanticDrift';

export {
  computeEpistemicEntropy,
  classifyConvergence,
  entropyDrop
} from './core/epistemicEntropy';

export {
  computeAssumptionField,
  detectAssumptionInjection,
  PRESUPPOSITION_MARKERS
} from './core/assumptionField';

export {
  computeAffectiveCurve,
  classifyAffectiveRegime,
  detectIntensity
} from './core/affectiveDimension';

export {
  runSimulation,
  runAllSimulations,
  verifySimulation,
  SCENARIOS
} from './simulation/environment';

export {
  formatEntropyLabJSON,
  downloadJSON
} from './export/entropylab';

// Stability Testing
export {
  runStabilityTestSuite,
  summarizeStabilityResults,
  classifyStability,
  BASELINE_DIALOGUE,
  synonymNoiseTest,
  structuralPermutationTest,
  redundancyShockTest,
  wordDeletionTest,
  paraphraseTest,
  minimalNoiseTest,
  type StabilityMetrics,
  type PerturbationTest
} from './simulation/stabilitySuite';
