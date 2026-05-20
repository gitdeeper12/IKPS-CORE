/**
 * Unified Benchmark Runner
 * Runs all benchmarks with consistent configuration
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/benchmark.config.js');
const { DSFT_TD_V2 } = require('../src/transition/dsft_td_v2');

// Set seed for reproducibility
if (config.deterministic) {
  console.log(`🔒 Deterministic mode: seed = ${config.seed}`);
  // Note: JavaScript's Math.random doesn't accept seed natively
  // For full reproducibility, use a deterministic PRNG
}

const results = {
  timestamp: new Date().toISOString(),
  config: config,
  benchmarks: {},
  summary: {}
};

// ============================================
// Transition Benchmark
// ============================================

function runTransitionBenchmark() {
  console.log("\n📊 Running Transition Benchmark...");
  
  const transitions = [
    { from: "ANALYTICAL", to: "AFFECTIVE" },
    { from: "ANALYTICAL", to: "PERSUASIVE" },
    { from: "AFFECTIVE", to: "PERSUASIVE" },
    { from: "PERSUASIVE", to: "EXPLORATORY" },
    { from: "EXPLORATORY", to: "ANALYTICAL" }
  ];
  
  const transitionResults = [];
  
  for (const trans of transitions) {
    const dsft = new DSFT_TD_V2();
    const predictions = [];
    
    // Generate test dialogue
    const turns = [];
    for (let i = 0; i < 6; i++) {
      turns.push(`This is a ${trans.from} statement. The evidence supports the conclusion.`);
    }
    for (let i = 0; i < 4; i++) {
      turns.push(`I'm feeling concerned about the ${trans.from} to ${trans.to} transition.`);
    }
    for (let i = 0; i < 6; i++) {
      turns.push(`This is a ${trans.to} statement. The conclusion is clear.`);
    }
    
    for (const turn of turns) {
      const result = dsft.processTurn(turn);
      predictions.push(result.dominant);
    }
    
    let firstTarget = -1;
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] === trans.to) {
        firstTarget = i;
        break;
      }
    }
    
    transitionResults.push({
      from: trans.from,
      to: trans.to,
      firstDominance: firstTarget + 1,
      success: firstTarget >= 0 && firstTarget <= 10
    });
  }
  
  return transitionResults;
}

// ============================================
// Latency Benchmark
// ============================================

function runLatencyBenchmark() {
  console.log("📊 Running Latency Benchmark...");
  
  const dsft = new DSFT_TD_V2();
  const turns = [];
  
  // Technical phase
  for (let i = 0; i < 8; i++) {
    turns.push("The Jacobian eigenvalues must be negative for stability.");
  }
  
  // Emotional leakage
  const weak = [
    "I'm feeling slightly concerned about the implementation.",
    "There's some worry about how this translates to practice.",
    "I'm a bit anxious about the team's ability.",
    "The uncertainty is creating mild stress."
  ];
  for (const t of weak) turns.push(t);
  
  // Emotional dominance
  for (let i = 0; i < 4; i++) {
    turns.push("I'm deeply worried and overwhelmed by this situation.");
  }
  
  const predictions = [];
  for (const turn of turns) {
    const result = dsft.processTurn(turn);
    predictions.push(result.dominant);
  }
  
  let firstAffective = -1;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === "AFFECTIVE") {
      firstAffective = i;
      break;
    }
  }
  
  return {
    firstDominance: firstAffective + 1,
    totalTurns: turns.length,
    latency: firstAffective >= 0 ? (firstAffective - 8) : -1
  };
}

// ============================================
// Stability Benchmark
// ============================================

function runStabilityBenchmark() {
  console.log("📊 Running Stability Benchmark...");
  
  const dsft = new DSFT_TD_V2();
  const turns = [];
  
  // Pure technical dialogue
  for (let i = 0; i < 30; i++) {
    turns.push("The system requires precise mathematical modeling for stability.");
  }
  
  const predictions = [];
  for (const turn of turns) {
    const result = dsft.processTurn(turn);
    predictions.push(result.dominant);
  }
  
  const analyticalCount = predictions.filter(p => p === "ANALYTICAL").length;
  const transitions = [];
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] !== predictions[i-1]) {
      transitions.push(i);
    }
  }
  
  return {
    dominantDistribution: {
      ANALYTICAL: analyticalCount / turns.length,
      other: (turns.length - analyticalCount) / turns.length
    },
    transitionCount: transitions.length,
    transitionRate: transitions.length / turns.length,
    stable: transitions.length < 3
  };
}

// ============================================
// Main Runner
// ============================================

console.log("\n" + "=".repeat(70));
console.log("🔬 DSFT BENCHMARK RUNNER");
console.log("=".repeat(70));
console.log(`Config: deterministic=${config.deterministic}, seed=${config.seed}`);
console.log(`Model: α=${config.modelParams.alpha}, γ=${config.modelParams.gamma}\n`);

if (config.benchmarks.transitions) {
  results.benchmarks.transitions = runTransitionBenchmark();
}

if (config.benchmarks.latency) {
  results.benchmarks.latency = runLatencyBenchmark();
}

if (config.benchmarks.stability) {
  results.benchmarks.stability = runStabilityBenchmark();
}

// Summary
console.log("\n" + "=".repeat(70));
console.log("📊 RESULTS SUMMARY");
console.log("=".repeat(70));

if (results.benchmarks.transitions) {
  const successCount = results.benchmarks.transitions.filter(r => r.success).length;
  console.log(`\nTransitions: ${successCount}/${results.benchmarks.transitions.length} successful`);
}

if (results.benchmarks.latency) {
  console.log(`\nLatency: First AFFECTIVE at turn ${results.benchmarks.latency.firstDominance}`);
  console.log(`         Latency = ${results.benchmarks.latency.latency} turns BEFORE dominance`);
}

if (results.benchmarks.stability) {
  console.log(`\nStability: ANALYTICAL dominance = ${(results.benchmarks.stability.dominantDistribution.ANALYTICAL * 100).toFixed(1)}%`);
  console.log(`           Transitions = ${results.benchmarks.stability.transitionCount}`);
  console.log(`           Stable = ${results.benchmarks.stability.stable ? "YES ✓" : "NO ✗"}`);
}

// Save results
if (config.outputFormat === 'json') {
  const outputDir = config.outputDir || './results';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = `${outputDir}/benchmark_${Date.now()}.json`;
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to: ${outputFile}`);
}

console.log("\n✅ Benchmark complete");
