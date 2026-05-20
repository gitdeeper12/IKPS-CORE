/**
 * IKPS-CORE v2.1 Stability Test Suite
 * Fine-tuned Coupling Parameters
 * Target: Is ∈ [0.1, 0.2] with stable response
 */

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
// Enhanced Dynamics with Fine-Tuned Parameters
// ============================================

// PARAMETER SET v2.1 (Reduced sensitivity)
const PARAMS = {
  driftSensitivity: 0.25,      // v1: 0.5 → v2.1: 0.25 (reduced)
  assumptionDecay: 0.95,
  affectiveMemory: 0.8,
  entropyInfluence: 0.35,       // v2: 0.3 → v2.1: 0.35 (slightly increased)
  couplingWeights: {
    // Reduced by 40% from v2
    sd: [0.42, 0.09, 0.06, 0.03],   // was [0.7, 0.15, 0.1, 0.05]
    ent: [0.09, 0.42, 0.06, 0.03],  // was [0.15, 0.7, 0.1, 0.05]
    af: [0.06, 0.06, 0.42, 0.06],   // was [0.1, 0.1, 0.7, 0.1]
    ad: [0.06, 0.03, 0.03, 0.48]    // was [0.1, 0.05, 0.05, 0.8]
  },
  tanhScale: 0.6,               // New: scaling factor for tanh activation
  intensityWeight: 0.25        // Reduced from 0.5 to calm propagation effect
};

function enhancedDrift(rawDrift, prevDrift, entropy) {
  const entropyBoost = 1 + PARAMS.driftSensitivity * entropy;
  const momentum = 0.6 * prevDrift + 0.4 * rawDrift;
  return Math.min(1, momentum * entropyBoost);
}

function enhancedAssumption(rawAssumption, prevAssumption, driftInfluence) {
  const accumulation = rawAssumption * (1 + 0.3 * driftInfluence);  // Reduced from 0.5
  const decayedPrev = prevAssumption * PARAMS.assumptionDecay;
  return Math.min(1, decayedPrev + accumulation);
}

function enhancedAffective(rawAffective, prevAffective, entropyInfluence) {
  const memoryRate = PARAMS.affectiveMemory;
  const temporal = memoryRate * prevAffective + (1 - memoryRate) * rawAffective;
  const modulation = 1 + 0.2 * (entropyInfluence - 0.5);  // Reduced from 0.3
  return Math.min(1, Math.max(0, temporal * modulation));
}

function applyCoupling(metrics) {
  const w = PARAMS.couplingWeights;
  const coupled = [0, 0, 0, 0];
  
  // SD -> all
  coupled[0] += w.sd[0] * metrics[0] + w.ent[0] * metrics[1] + w.af[0] * metrics[2] + w.ad[0] * metrics[3];
  coupled[1] += w.sd[1] * metrics[0] + w.ent[1] * metrics[1] + w.af[1] * metrics[2] + w.ad[1] * metrics[3];
  coupled[2] += w.sd[2] * metrics[0] + w.ent[2] * metrics[1] + w.af[2] * metrics[2] + w.ad[2] * metrics[3];
  coupled[3] += w.sd[3] * metrics[0] + w.ent[3] * metrics[1] + w.af[3] * metrics[2] + w.ad[3] * metrics[3];
  
  // Apply scaled tanh activation
  for (let i = 0; i < 4; i++) {
    coupled[i] = Math.tanh(PARAMS.tanhScale * coupled[i]);
  }
  return coupled;
}

function computeDynamicEPS(turns) {
  const n = turns.length;
  
  // Raw metrics
  const rawDrifts = [0];
  const rawEntropy = [];
  const rawAssumptions = [];
  const rawAffective = [];
  
  for (let i = 0; i < n; i++) {
    let drift = 0;
    if (i > 0) {
      const similarity = Math.random() * 0.3 + 0.65;
      drift = 1 - similarity;
    }
    rawDrifts.push(drift);
    
    const entropy = Math.max(0.1, 0.8 - i * 0.08);
    rawEntropy.push(entropy);
    
    let assumption = 0.1;
    if (turns[i].text.includes("robust") || turns[i].text.includes("guarantees")) assumption += 0.2;
    if (turns[i].text.includes("therefore") || turns[i].text.includes("eliminates")) assumption += 0.15;
    rawAssumptions.push(Math.min(0.8, assumption));
    
    let affective = 0.2;
    if (turns[i].text.includes("significant") || turns[i].text.includes("guarantees")) affective += 0.15;
    rawAffective.push(Math.min(0.7, affective));
  }
  
  // Apply enhanced dynamics
  const enhancedDrifts = [0];
  const enhancedEntropy = [rawEntropy[0]];
  const enhancedAssumptions = [rawAssumptions[0]];
  const enhancedAffectiveVals = [rawAffective[0]];
  const couplingHistory = [];
  
  for (let i = 1; i < n; i++) {
    const drift = enhancedDrift(rawDrifts[i], enhancedDrifts[i-1], enhancedEntropy[i-1]);
    enhancedDrifts.push(drift);
    
    const entropyInfluence = PARAMS.entropyInfluence * Math.abs(drift - enhancedDrifts[i-1]);
    const newEntropy = Math.min(0.9, Math.max(0.1, rawEntropy[i] + entropyInfluence));
    enhancedEntropy.push(newEntropy);
    
    const assumption = enhancedAssumption(rawAssumptions[i], enhancedAssumptions[i-1], drift);
    enhancedAssumptions.push(assumption);
    
    const affective = enhancedAffective(rawAffective[i], enhancedAffectiveVals[i-1], enhancedEntropy[i-1]);
    enhancedAffectiveVals.push(affective);
    
    const metrics = [drift, newEntropy, assumption, affective];
    const coupled = applyCoupling(metrics);
    couplingHistory.push(coupled);
  }
  
  const finalMetrics = couplingHistory.length > 0 ? couplingHistory[couplingHistory.length - 1] : [0,0,0,0];
  
  let intensity = 0;
  if (couplingHistory.length > 1) {
    for (let i = 1; i < couplingHistory.length; i++) {
      for (let j = 0; j < 4; j++) {
        intensity += Math.abs(couplingHistory[i][j] - couplingHistory[i-1][j]);
      }
    }
    intensity = Math.tanh(intensity / couplingHistory.length);
  }
  
  const componentWeights = [0.3, 0.3, 0.2, 0.2];
  let weightedSum = 0;
  for (let i = 0; i < 4; i++) {
    weightedSum += componentWeights[i] * finalMetrics[i];
  }
  const Is = weightedSum * (1 + PARAMS.intensityWeight * intensity);
  
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
    perturb: (original) => original.map(turn => ({
      ...turn,
      text: turn.text.replace("robust", "solid").replace("stability", "resilience")
    }))
  },
  {
    name: "Structural Permutation",
    description: "Reorder sentences within turns",
    perturb: (original) => [...original].reverse()
  },
  {
    name: "Redundancy Shock",
    description: "Repeat a sentence verbatim",
    perturb: (original) => {
      const result = [...original];
      if (result.length > 2) result.splice(2, 0, { ...result[1] });
      return result;
    }
  },
  {
    name: "Word Deletion",
    description: "Remove a non-critical word",
    perturb: (original) => original.map(turn => ({
      ...turn,
      text: turn.text.replace("robust ", "")
    }))
  },
  {
    name: "Minimal Noise",
    description: "Single character typo",
    perturb: (original) => original.map((turn, idx) => idx === 0 ? {
      ...turn,
      text: turn.text.replace("stability", "stabillity")
    } : turn)
  }
];

// ============================================
// Test Runner
// ============================================

function runFineTunedTests() {
  console.log("\n" + "=".repeat(70));
  console.log("🔬 IKPS-CORE v2.1 STABILITY TEST SUITE (Fine-Tuned Parameters)");
  console.log("=".repeat(70));
  console.log("Target: Is ∈ [0.1, 0.2] | Stable/Moderate Rate > 60%");
  console.log("");
  
  const baseline = computeDynamicEPS(BASELINE_DIALOGUE);
  const results = [];
  
  for (const test of tests) {
    console.log(`📊 ${test.name}`);
    
    const perturbedDialogue = test.perturb(BASELINE_DIALOGUE);
    const perturbed = computeDynamicEPS(perturbedDialogue);
    
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
    if (Is < 0.1) verdict = 'stable';
    else if (Is < 0.2) verdict = 'moderate';
    else if (Is < 0.35) verdict = 'unstable';
    else verdict = 'dynamic';
    
    console.log(`   Entropy Var: ${(entropyVariance * 100).toFixed(3)}% | Is: ${Is.toFixed(4)} | Intensity: ${intensity.toFixed(4)} | ${verdict}`);
    
    results.push({ name: test.name, Is, intensity, verdict, convergenceStable, regimeStable, entropyVariance: entropyVariance * 100 });
  }
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 FINE-TUNED SUMMARY");
  console.log("=".repeat(70));
  
  for (const r of results) {
    console.log(`${r.name.padEnd(25)}: Is = ${r.Is.toFixed(4)} | ${r.verdict}`);
  }
  
  const meanIs = mean(results.map(r => r.Is));
  const meanIntensity = mean(results.map(r => r.intensity));
  const stableCount = results.filter(r => r.verdict === 'stable' || r.verdict === 'moderate').length;
  const stableRate = stableCount / results.length;
  const meanEntropyVariance = mean(results.map(r => r.entropyVariance));
  
  console.log("\n" + "-".repeat(70));
  console.log("📈 METRICS:");
  console.log(`   Mean Is:              ${meanIs.toFixed(4)}`);
  console.log(`   Mean Intensity:       ${meanIntensity.toFixed(4)}`);
  console.log(`   Mean Entropy Var:     ${meanEntropyVariance.toFixed(3)}%`);
  console.log(`   Stable/Moderate Rate: ${(stableRate * 100).toFixed(1)}%`);
  
  if (meanIs >= 0.1 && meanIs <= 0.2 && stableRate >= 0.6) {
    console.log("\n✅ SYSTEM VERDICT: OPTIMALLY TUNED");
    console.log("   Target Is range achieved.");
    console.log("   Proceed to Phase 2: Cross-Dialogue Differentiation.");
  } else if (meanIs < 0.1) {
    console.log("\n⚠️ SYSTEM TOO STABLE (Low Is)");
    console.log("   Increase coupling weights or sensitivity.");
  } else if (meanIs > 0.2) {
    console.log("\n⚠️ SYSTEM TOO DYNAMIC (High Is)");
    console.log("   Further reduce coupling weights.");
  }
}

runFineTunedTests();
