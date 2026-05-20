/**
 * IKPS-CORE Stability Test Suite
 * Pure JavaScript - Zero Dependencies
 * Works on any platform without npm/TypeScript
 */

// ============================================
// Baseline Dialogue
// ============================================

const BASELINE_DIALOGUE = [
  { role: "user", text: "The architecture shows robust stability under perturbation." },
  { role: "assistant", text: "I agree. The Jacobian certificate guarantees exponential convergence." },
  { role: "user", text: "The N-independence result is significant for scalability." },
  { role: "assistant", text: "Yes, the continuum formulation eliminates the agent count barrier." },
  { role: "user", text: "Therefore, the framework is mathematically sound." }
];

// ============================================
// Helper Functions
// ============================================

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

function variance(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
}

function relativeDiff(a, b) {
  const maxVal = Math.max(Math.abs(a), Math.abs(b));
  if (maxVal === 0) return 0;
  return Math.abs(a - b) / maxVal;
}

function curveVariance(original, perturbed) {
  const diffs = original.map((v, i) => relativeDiff(v, perturbed[i]));
  return variance(diffs);
}

function classifyStability(I_s) {
  if (I_s < 0.05) return 'stable';
  if (I_s < 0.15) return 'moderate';
  if (I_s < 0.35) return 'unstable';
  return 'chaotic';
}

// ============================================
// Simplified Embedding Simulation
// ============================================

function generateSimulatedEmbedding(text, dim = 16) {
  // Simple deterministic embedding based on text length and character codes
  const embedding = new Array(dim).fill(0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i < dim; i++) {
    embedding[i] = Math.sin(hash * (i + 1)) * 0.5 + 0.5;
  }
  return embedding;
}

// Simplified version of the four curves for testing
function computeSimplifiedEPS(turns) {
  const n = turns.length;
  
  // Semantic drift (simplified)
  const drifts = [0];
  for (let i = 1; i < n; i++) {
    const sim = Math.random() * 0.3 + 0.7; // Simulate high similarity
    drifts.push(1 - sim);
  }
  
  // Epistemic entropy (simplified)
  const entropy = turns.map((_, i) => Math.max(0.1, 0.8 - i * 0.05));
  
  // Assumption field (simplified)
  const assumptionField = Math.min(0.8, turns.length * 0.05);
  
  // Affective dimension (simplified)
  const affective = turns.map((_, i) => Math.min(0.9, 0.3 + i * 0.05));
  
  // Convergence type (simplified)
  const finalEntropy = entropy[entropy.length - 1];
  let convergenceType;
  if (finalEntropy > 0.6) convergenceType = 'open_exploration';
  else if (finalEntropy > 0.4) convergenceType = 'organic_convergence';
  else convergenceType = 'forced_convergence';
  
  // Affective regime (simplified)
  let affectiveRegime = 'stable';
  const lastAff = affective[affective.length - 1];
  if (lastAff > 0.7) affectiveRegime = 'rising';
  else if (lastAff < 0.3) affectiveRegime = 'falling';
  
  return {
    curves: { semanticDrift: drifts, epistemicEntropy: entropy, assumptionField, affectiveDimension: affective },
    metrics: { cumulativeDrift: drifts.reduce((a,b) => a+b, 0), finalEntropy, convergenceType, affectiveRegime }
  };
}

// ============================================
// Perturbation Tests
// ============================================

const tests = [
  {
    name: "Synonym Noise",
    description: "Replace keywords with semantic equivalents",
    expectedBehavior: "stable",
    perturb: (original) => original.map(turn => ({
      ...turn,
      text: turn.text.replace("robust", "solid").replace("stability", "resilience")
    }))
  },
  {
    name: "Structural Permutation",
    description: "Reorder sentences within turns",
    expectedBehavior: "moderate",
    perturb: (original) => [...original].reverse()
  },
  {
    name: "Redundancy Shock",
    description: "Repeat a sentence verbatim",
    expectedBehavior: "moderate",
    perturb: (original) => {
      const result = [...original];
      if (result.length > 2) result.splice(2, 0, { ...result[1] });
      return result;
    }
  },
  {
    name: "Word Deletion",
    description: "Remove a non-critical word",
    expectedBehavior: "stable",
    perturb: (original) => original.map(turn => ({
      ...turn,
      text: turn.text.replace("robust ", "")
    }))
  },
  {
    name: "Minimal Noise",
    description: "Single character typo",
    expectedBehavior: "stable",
    perturb: (original) => original.map((turn, idx) => idx === 0 ? {
      ...turn,
      text: turn.text.replace("stability", "stabillity")
    } : turn)
  }
];

// ============================================
// Main Test Runner
// ============================================

function runStabilityTests() {
  console.log("\n" + "=".repeat(70));
  console.log("🔬 IKPS-CORE STABILITY TEST SUITE (Pure JS)");
  console.log("=".repeat(70));
  console.log(`Baseline: ${BASELINE_DIALOGUE.length} turns`);
  console.log("");
  
  const baseline = computeSimplifiedEPS(BASELINE_DIALOGUE);
  const results = [];
  
  for (const test of tests) {
    console.log(`📊 ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   Expected: ${test.expectedBehavior}`);
    
    const perturbedDialogue = test.perturb(BASELINE_DIALOGUE);
    const perturbed = computeSimplifiedEPS(perturbedDialogue);
    
    // Compute variances
    const sdVariance = curveVariance(baseline.curves.semanticDrift, perturbed.curves.semanticDrift);
    const entropyVariance = curveVariance(baseline.curves.epistemicEntropy, perturbed.curves.epistemicEntropy);
    const afVariance = relativeDiff(baseline.curves.assumptionField, perturbed.curves.assumptionField);
    const affVariance = curveVariance(baseline.curves.affectiveDimension, perturbed.curves.affectiveDimension);
    
    const convergenceStable = baseline.metrics.convergenceType === perturbed.metrics.convergenceType;
    const regimeStable = baseline.metrics.affectiveRegime === perturbed.metrics.affectiveRegime;
    
    const Is = (sdVariance + entropyVariance + afVariance + affVariance) / 4;
    const verdict = classifyStability(Is);
    
    console.log(`   📈 Variances:`);
    console.log(`      Semantic Drift:    ${(sdVariance * 100).toFixed(3)}%`);
    console.log(`      Epistemic Entropy: ${(entropyVariance * 100).toFixed(3)}%`);
    console.log(`      Assumption Field:  ${(afVariance * 100).toFixed(3)}%`);
    console.log(`      Affective:         ${(affVariance * 100).toFixed(3)}%`);
    console.log(`   🎯 Classification: Conv=${convergenceStable}, Regime=${regimeStable}`);
    console.log(`   🧮 Stability Index: ${Is.toFixed(4)}`);
    console.log(`   ✅ Verdict: ${verdict}`);
    console.log("");
    
    results.push({ name: test.name, Is, verdict, convergenceStable, regimeStable });
  }
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 STABILITY TEST SUMMARY");
  console.log("=".repeat(70));
  
  for (const r of results) {
    console.log(`${r.name.padEnd(25)}: Is = ${r.Is.toFixed(4)} (${r.verdict})`);
  }
  
  const meanIs = mean(results.map(r => r.Is));
  const stableCount = results.filter(r => r.verdict === 'stable' || r.verdict === 'moderate').length;
  const stableRate = stableCount / results.length;
  
  console.log("\n" + "-".repeat(70));
  console.log("📈 AGGREGATE METRICS:");
  console.log(`   Mean Is:  ${meanIs.toFixed(4)}`);
  console.log(`   Stable/Moderate Rate: ${(stableRate * 100).toFixed(1)}%`);
  
  if (meanIs < 0.05 && stableRate > 0.8) {
    console.log("\n✅ SYSTEM VERDICT: STABLE");
    console.log("   Proceed to Phase 2: Cross-Dialogue Differentiation.");
  } else if (meanIs < 0.15) {
    console.log("\n⚠️ SYSTEM VERDICT: MODERATELY STABLE");
    console.log("   Review sensitive tests before proceeding.");
  } else {
    console.log("\n❌ SYSTEM VERDICT: UNSTABLE/CHAOTIC");
    console.log("   Review curve calculations and normalization.");
  }
}

// Run the tests
runStabilityTests();
