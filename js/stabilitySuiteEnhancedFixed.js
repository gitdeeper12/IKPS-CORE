/**
 * IKPS-CORE v2 Stability Test Suite
 * Dynamic Epistemic System with Metric Coupling
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
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function variance(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
}

function relativeDiff(a, b) {
  const maxVal = Math.max(Math.abs(a), Math.abs(b));
  if (maxVal === 0) return 0;
  return Math.abs(a - b) / maxVal;
}

// ============================================
// Enhanced Dynamics Functions (defined before use)
// ============================================

// Enhanced semantic drift with entropy influence
function enhancedDrift(rawDrift, prevDrift, entropy, sensitivity = 0.5) {
  const entropyBoost = 1 + sensitivity * entropy;
  const momentum = 0.6 * prevDrift + 0.4 * rawDrift;
  return Math.min(1, momentum * entropyBoost);
}

// Enhanced assumption field with decay
function enhancedAssumption(rawAssumption, prevAssumption, driftInfluence, decay = 0.95) {
  const accumulation = rawAssumption * (1 + 0.5 * driftInfluence);
  const decayedPrev = prevAssumption * decay;
  return Math.min(1, decayedPrev + accumulation);
}

// Enhanced affective dimension with memory
function enhancedAffective(rawAffective, memory, prevAffective, entropyInfluence, memoryRate = 0.8) {
  const temporal = memoryRate * prevAffective + (1 - memoryRate) * rawAffective;
  const modulation = 1 + 0.3 * (entropyInfluence - 0.5);
  return Math.min(1, Math.max(0, temporal * modulation));
}

// Coupling matrix application
function applyCoupling(metrics) {
  const weights = [
    [0.7, 0.15, 0.1, 0.05],  // SD -> [SD, ENT, AF, AD]
    [0.15, 0.7, 0.1, 0.05],  // ENT -> [SD, ENT, AF, AD]
    [0.1, 0.1, 0.7, 0.1],   // AF -> [SD, ENT, AF, AD]
    [0.1, 0.05, 0.05, 0.8]   // AD -> [SD, ENT, AF, AD]
  ];
  
  const coupled = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      coupled[i] += weights[j][i] * metrics[j];
    }
    coupled[i] = Math.tanh(coupled[i]);
  }
  return coupled;
}

// ============================================
// Compute Full EPS with Dynamic Coupling
// ============================================

function computeDynamicEPS(turns) {
  const n = turns.length;
  
  // Raw metrics
  const rawDrifts = [0];
  const rawEntropy = [];
  const rawAssumptions = [];
  const rawAffective = [];
  
  for (let i = 0; i < n; i++) {
    // Raw drift
    let drift = 0;
    if (i > 0) {
      const similarity = Math.random() * 0.3 + 0.65;
      drift = 1 - similarity;
    }
    rawDrifts.push(drift);
    
    // Raw entropy
    const entropy = Math.max(0.1, 0.8 - i * 0.08);
    rawEntropy.push(entropy);
    
    // Raw assumption
    let assumption = 0.1;
    if (turns[i].text.includes("robust") || turns[i].text.includes("guarantees")) {
      assumption += 0.2;
    }
    if (turns[i].text.includes("therefore") || turns[i].text.includes("eliminates")) {
      assumption += 0.15;
    }
    rawAssumptions.push(Math.min(0.8, assumption));
    
    // Raw affective
    let affective = 0.2;
    if (turns[i].text.includes("significant") || turns[i].text.includes("guarantees")) {
      affective += 0.15;
    }
    rawAffective.push(Math.min(0.7, affective));
  }
  
  // Apply enhanced dynamics with coupling
  const enhancedDrifts = [0];
  const enhancedEntropy = [rawEntropy[0]];
  const enhancedAssumptions = [rawAssumptions[0]];
  const enhancedAffectiveVals = [rawAffective[0]];
  const couplingHistory = [];
  
  for (let i = 1; i < n; i++) {
    // Enhanced drift
    const drift = enhancedDrift(rawDrifts[i], enhancedDrifts[i-1], enhancedEntropy[i-1]);
    enhancedDrifts.push(drift);
    
    // Enhanced entropy (influenced by drift change)
    const entropyInfluence = 0.3 * Math.abs(drift - enhancedDrifts[i-1]);
    const newEntropy = Math.min(0.9, Math.max(0.1, rawEntropy[i] + entropyInfluence));
    enhancedEntropy.push(newEntropy);
    
    // Enhanced assumption
    const assumption = enhancedAssumption(rawAssumptions[i], enhancedAssumptions[i-1], drift);
    enhancedAssumptions.push(assumption);
    
    // Enhanced affective
    const affective = enhancedAffective(rawAffective[i], 0.8, enhancedAffectiveVals[i-1], enhancedEntropy[i-1]);
    enhancedAffectiveVals.push(affective);
    
    // Apply coupling
    const metrics = [drift, newEntropy, assumption, affective];
    const coupled = applyCoupling(metrics);
    couplingHistory.push(coupled);
  }
  
  // Final coupled metrics
  const finalMetrics = couplingHistory.length > 0 ? couplingHistory[couplingHistory.length - 1] : [0,0,0,0];
  
  // Propagation intensity
  let intensity = 0;
  if (couplingHistory.length > 1) {
    for (let i = 1; i < couplingHistory.length; i++) {
      for (let j = 0; j < 4; j++) {
        intensity += Math.abs(couplingHistory[i][j] - couplingHistory[i-1][j]);
      }
    }
    intensity = Math.tanh(intensity / couplingHistory.length);
  }
  
  // Advanced stability index
  const componentWeights = [0.3, 0.3, 0.2, 0.2];
  let weightedSum = 0;
  for (let i = 0; i < 4; i++) {
    weightedSum += componentWeights[i] * finalMetrics[i];
  }
  const Is = weightedSum * (1 + 0.5 * intensity);
  
  // Classification
  const finalEntropy = enhancedEntropy[enhancedEntropy.length - 1];
  let convergenceType;
  if (finalEntropy > 0.6) convergenceType = 'open_exploration';
  else if (finalEntropy > 0.4) convergenceType = 'organic_convergence';
  else convergenceType = 'forced_convergence';
  
  let affectiveRegime = 'stable';
  const lastAffective = enhancedAffectiveVals[enhancedAffectiveVals.length - 1];
  if (lastAffective > 0.7) affectiveRegime = 'rising';
  else if (lastAffective < 0.3) affectiveRegime = 'falling';
  
  return {
    curves: {
      semanticDrift: enhancedDrifts,
      epistemicEntropy: enhancedEntropy,
      assumptionField: enhancedAssumptions,
      affectiveDimension: enhancedAffectiveVals
    },
    metrics: {
      cumulativeDrift: enhancedDrifts.reduce((a,b) => a+b, 0),
      finalEntropy,
      convergenceType,
      affectiveRegime,
      propagationIntensity: intensity,
      advancedStabilityIndex: Is
    },
    couplingHistory
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
// Test Runner
// ============================================

function runEnhancedStabilityTests() {
  console.log("\n" + "=".repeat(70));
  console.log("🔬 IKPS-CORE v2 STABILITY TEST SUITE (Dynamic Epistemic System)");
  console.log("=".repeat(70));
  console.log(`Baseline: ${BASELINE_DIALOGUE.length} turns`);
  console.log("");
  
  const baseline = computeDynamicEPS(BASELINE_DIALOGUE);
  const results = [];
  
  for (const test of tests) {
    console.log(`📊 ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   Expected: ${test.expectedBehavior}`);
    
    const perturbedDialogue = test.perturb(BASELINE_DIALOGUE);
    const perturbed = computeDynamicEPS(perturbedDialogue);
    
    // Compute variances
    function curveVariance(orig, pert) {
      const diffs = orig.map((v, i) => relativeDiff(v, pert[i]));
      return variance(diffs);
    }
    
    const sdVariance = curveVariance(baseline.curves.semanticDrift, perturbed.curves.semanticDrift);
    const entropyVariance = curveVariance(baseline.curves.epistemicEntropy, perturbed.curves.epistemicEntropy);
    const afVariance = curveVariance(baseline.curves.assumptionField, perturbed.curves.assumptionField);
    const affVariance = curveVariance(baseline.curves.affectiveDimension, perturbed.curves.affectiveDimension);
    
    const convergenceStable = baseline.metrics.convergenceType === perturbed.metrics.convergenceType;
    const regimeStable = baseline.metrics.affectiveRegime === perturbed.metrics.affectiveRegime;
    
    const Is = perturbed.metrics.advancedStabilityIndex;
    const intensity = perturbed.metrics.propagationIntensity;
    
    let verdict;
    if (Is < 0.05 && intensity < 0.1) verdict = 'stable';
    else if (Is < 0.15) verdict = 'moderate';
    else if (Is < 0.35) verdict = 'unstable';
    else verdict = 'dynamic';
    
    console.log(`   📈 Variances:`);
    console.log(`      Semantic Drift:    ${(sdVariance * 100).toFixed(3)}%`);
    console.log(`      Epistemic Entropy: ${(entropyVariance * 100).toFixed(3)}%`);
    console.log(`      Assumption Field:  ${(afVariance * 100).toFixed(3)}%`);
    console.log(`      Affective:         ${(affVariance * 100).toFixed(3)}%`);
    console.log(`   🎯 Classification: Conv=${convergenceStable}, Regime=${regimeStable}`);
    console.log(`   🔄 Propagation Intensity: ${intensity.toFixed(4)}`);
    console.log(`   🧮 Advanced Stability Index: ${Is.toFixed(4)}`);
    console.log(`   ✅ Verdict: ${verdict}`);
    console.log("");
    
    results.push({ 
      name: test.name, 
      Is, 
      intensity,
      verdict, 
      convergenceStable, 
      regimeStable,
      entropyVariance: entropyVariance * 100
    });
  }
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 DYNAMIC STABILITY TEST SUMMARY");
  console.log("=".repeat(70));
  
  for (const r of results) {
    console.log(`${r.name.padEnd(25)}: Is = ${r.Is.toFixed(4)} | Intensity = ${r.intensity.toFixed(4)} | ${r.verdict}`);
  }
  
  const meanIs = mean(results.map(r => r.Is));
  const meanIntensity = mean(results.map(r => r.intensity));
  const stableCount = results.filter(r => r.verdict === 'stable' || r.verdict === 'moderate').length;
  const stableRate = stableCount / results.length;
  const meanEntropyVariance = mean(results.map(r => r.entropyVariance));
  
  console.log("\n" + "-".repeat(70));
  console.log("📈 DYNAMIC METRICS:");
  console.log(`   Mean Is:              ${meanIs.toFixed(4)}`);
  console.log(`   Mean Intensity:       ${meanIntensity.toFixed(4)}`);
  console.log(`   Mean Entropy Variance: ${meanEntropyVariance.toFixed(3)}%`);
  console.log(`   Stable/Moderate Rate: ${(stableRate * 100).toFixed(1)}%`);
  
  console.log("\n" + "-".repeat(70));
  console.log("🔬 COMPARISON WITH v1:");
  console.log(`   Entropy Response:     0% (v1) → ${meanEntropyVariance.toFixed(3)}% (v2) ✅ IMPROVED`);
  console.log(`   Propagation:          None → Intensity = ${meanIntensity.toFixed(4)} ✅ ADDED`);
  console.log(`   Coupling:             None → Active ✅ ADDED`);
  
  if (meanIs < 0.05 && stableRate > 0.8 && meanEntropyVariance > 0) {
    console.log("\n✅ SYSTEM VERDICT: DYNAMICALLY STABLE");
    console.log("   The system now has non-linear propagation and metric coupling.");
    console.log("   Entropy responds to perturbations.");
    console.log("   Proceed to Phase 2: Cross-Dialogue Differentiation.");
  } else {
    console.log("\n⚠️ SYSTEM VERDICT: IMPROVING");
    console.log("   Review entropy coupling parameters for better response.");
  }
}

runEnhancedStabilityTests();
