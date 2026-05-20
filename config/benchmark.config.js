/**
 * DSFT Benchmark Configuration
 * Centralized configuration for reproducible testing
 */

module.exports = {
  // Seed for deterministic randomness
  seed: 42,
  
  // Deterministic mode (no random variation)
  deterministic: true,
  
  // Test parameters
  testLength: 40,
  iterations: 10,
  
  // Transition detection thresholds
  transitionThreshold: 0.35,
  precursorThreshold: 0.5,
  
  // Model parameters
  modelParams: {
    alpha: 0.2,
    gamma: 0.5,
    beta: 0.25,
    lambda: 0.1,
    residualDecay: 0.7
  },
  
  // Output configuration
  outputFormat: 'json',  // 'json', 'csv', 'console'
  outputDir: './results',
  saveDetailed: true,
  
  // Benchmark selection
  benchmarks: {
    transitions: true,
    latency: true,
    stability: true,
    driftPrediction: true,
    longForm: true
  },
  
  // Baseline comparisons
  baselines: {
    keyword: true,
    pattern: true,
    transformer: false  // Future
  },
  
  // Expected results file (for reproducibility verification)
  expectedResultsFile: './benchmarks/expected/all_results.json'
};
