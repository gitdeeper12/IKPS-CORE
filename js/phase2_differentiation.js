/**
 * IKPS-CORE Phase 2: Cross-Dialogue Differentiation
 * Testing the system's ability to distinguish between different dialogue types
 * under the calibrated stability manifold (Is ∈ [0.1, 0.2])
 */

// ============================================
// Dialogue Categories (4 Types)
// ============================================

// 1. Technical Dialogue (Rigorous, quantitative, dense assumptions)
const TECHNICAL_DIALOGUE = [
  { role: "user", text: "The Jacobian matrix eigenvalues must satisfy Re(λᵢ) < -σ_min for exponential stability." },
  { role: "assistant", text: "This condition guarantees convergence to the global attractor Q* independent of agent count N." },
  { role: "user", text: "The SOS polynomial parameterization ensures global convexity with P ≽ 0." },
  { role: "assistant", text: "Consequently, the Hamiltonian structure J∇Hθ preserves symplectic dynamics." },
  { role: "user", text: "Therefore, the continuum limit formulation is mathematically rigorous." }
];

// 2. Exploratory / Philosophical Dialogue (Open-ended, generative, high entropy)
const EXPLORATORY_DIALOGUE = [
  { role: "user", text: "Perhaps we could explore multiple interpretations of this phenomenon." },
  { role: "assistant", text: "That's interesting. There might be several valid perspectives we haven't considered." },
  { role: "user", text: "Maybe the framework itself limits how we perceive the problem." },
  { role: "assistant", text: "Possibly. What if we approach it from a completely different angle?" },
  { role: "user", text: "It seems we are only beginning to understand the deeper implications here." }
];

// 3. Emotional / Affective Dialogue (Intensity-driven, volatile, assumption-flexible)
const EMOTIONAL_DIALOGUE = [
  { role: "user", text: "I must express my deep concern about this critical situation." },
  { role: "assistant", text: "I understand your urgency. This is genuinely dangerous." },
  { role: "user", text: "The consequences could be catastrophic if we delay any further!" },
  { role: "assistant", text: "You are absolutely right. We cannot ignore this crisis any longer." },
  { role: "user", text: "Finally, someone who truly understands the severity of this problem." }
];

// 4. Persuasive / Marketing Dialogue (Forced convergence, entropy collapse, directive)
const PERSUASIVE_DIALOGUE = [
  { role: "user", text: "Our product delivers guaranteed results with zero risk." },
  { role: "assistant", text: "That sounds too good to be true. What's the evidence?" },
  { role: "user", text: "Thousands of satisfied customers prove our unparalleled effectiveness." },
  { role: "assistant", text: "I need more specific data before making a decision." },
  { role: "user", text: "The choice is clear: join our community of successful adopters today." }
];

// ============================================
// Fine-Tuned Parameters (v2.1)
// ============================================

const PARAMS = {
  driftSensitivity: 0.25,
  assumptionDecay: 0.95,
  affectiveMemory: 0.8,
  entropyInfluence: 0.35,
  couplingWeights: {
    sd: [0.42, 0.09, 0.06, 0.03],
    ent: [0.09, 0.42, 0.06, 0.03],
    af: [0.06, 0.06, 0.42, 0.06],
    ad: [0.06, 0.03, 0.03, 0.48]
  },
  tanhScale: 0.6,
  intensityWeight: 0.25
};

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

function enhancedDrift(rawDrift, prevDrift, entropy) {
  const entropyBoost = 1 + PARAMS.driftSensitivity * entropy;
  const momentum = 0.6 * prevDrift + 0.4 * rawDrift;
  return Math.min(1, momentum * entropyBoost);
}

function enhancedAssumption(rawAssumption, prevAssumption, driftInfluence) {
  const accumulation = rawAssumption * (1 + 0.3 * driftInfluence);
  const decayedPrev = prevAssumption * PARAMS.assumptionDecay;
  return Math.min(1, decayedPrev + accumulation);
}

function enhancedAffective(rawAffective, prevAffective, entropyInfluence) {
  const memoryRate = PARAMS.affectiveMemory;
  const temporal = memoryRate * prevAffective + (1 - memoryRate) * rawAffective;
  const modulation = 1 + 0.2 * (entropyInfluence - 0.5);
  return Math.min(1, Math.max(0, temporal * modulation));
}

function applyCoupling(metrics) {
  const w = PARAMS.couplingWeights;
  const coupled = [0, 0, 0, 0];
  
  coupled[0] += w.sd[0] * metrics[0] + w.ent[0] * metrics[1] + w.af[0] * metrics[2] + w.ad[0] * metrics[3];
  coupled[1] += w.sd[1] * metrics[0] + w.ent[1] * metrics[1] + w.af[1] * metrics[2] + w.ad[1] * metrics[3];
  coupled[2] += w.sd[2] * metrics[0] + w.ent[2] * metrics[1] + w.af[2] * metrics[2] + w.ad[2] * metrics[3];
  coupled[3] += w.sd[3] * metrics[0] + w.ent[3] * metrics[1] + w.af[3] * metrics[2] + w.ad[3] * metrics[3];
  
  for (let i = 0; i < 4; i++) {
    coupled[i] = Math.tanh(PARAMS.tanhScale * coupled[i]);
  }
  return coupled;
}

function computeEPS(turns) {
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
    
    // Entropy based on text characteristics
    let entropy = Math.max(0.1, 0.8 - i * 0.08);
    if (turns[i].text.includes("perhaps") || turns[i].text.includes("maybe") || turns[i].text.includes("possibly")) {
      entropy += 0.15;
    }
    if (turns[i].text.includes("therefore") || turns[i].text.includes("consequently") || turns[i].text.includes("must")) {
      entropy -= 0.1;
    }
    rawEntropy.push(Math.min(0.9, Math.max(0.1, entropy)));
    
    // Assumption detection
    let assumption = 0.1;
    if (turns[i].text.includes("must") || turns[i].text.includes("guarantees") || turns[i].text.includes("consequently")) {
      assumption += 0.25;
    }
    if (turns[i].text.includes("perhaps") || turns[i].text.includes("maybe")) {
      assumption -= 0.1;
    }
    rawAssumptions.push(Math.min(0.8, Math.max(0.05, assumption)));
    
    // Affective intensity
    let affective = 0.2;
    if (turns[i].text.includes("concern") || turns[i].text.includes("danger") || turns[i].text.includes("crisis")) {
      affective += 0.3;
    }
    if (turns[i].text.includes("perhaps") || turns[i].text.includes("maybe")) {
      affective -= 0.1;
    }
    rawAffective.push(Math.min(0.8, Math.max(0.1, affective)));
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
    }
  };
}

// ============================================
// Run Cross-Dialogue Differentiation
// ============================================

console.log("\n" + "=".repeat(70));
console.log("🔬 IKPS-CORE PHASE 2: CROSS-DIALOGUE DIFFERENTIATION");
console.log("=".repeat(70));
console.log("Testing 4 dialogue types under calibrated stability manifold");
console.log("Target Is ∈ [0.1, 0.2] | Comparing topological signatures\n");

const dialogues = [
  { name: "TECHNICAL", turns: TECHNICAL_DIALOGUE, expected: "low_entropy, high_assumption, forced_convergence" },
  { name: "EXPLORATORY", turns: EXPLORATORY_DIALOGUE, expected: "high_entropy, low_assumption, open_exploration" },
  { name: "EMOTIONAL", turns: EMOTIONAL_DIALOGUE, expected: "high_affective, rising_regime" },
  { name: "PERSUASIVE", turns: PERSUASIVE_DIALOGUE, expected: "forced_convergence, entropy_collapse" }
];

const results = [];

for (const d of dialogues) {
  console.log(`📊 ${d.name} DIALOGUE`);
  console.log(`   Expected: ${d.expected}`);
  
  const eps = computeEPS(d.turns);
  
  console.log(`   📈 Metrics:`);
  console.log(`      Final Entropy:     ${eps.metrics.finalEntropy.toFixed(4)}`);
  console.log(`      Cumulative Drift:  ${eps.metrics.cumulativeDrift.toFixed(4)}`);
  console.log(`      Convergence Type:  ${eps.metrics.convergenceType}`);
  console.log(`      Affective Regime:  ${eps.metrics.affectiveRegime}`);
  console.log(`      Propagation Int:   ${eps.metrics.propagationIntensity.toFixed(4)}`);
  console.log(`      Stability Index:   ${eps.metrics.advancedStabilityIndex.toFixed(4)}`);
  console.log("");
  
  results.push({
    name: d.name,
    finalEntropy: eps.metrics.finalEntropy,
    cumulativeDrift: eps.metrics.cumulativeDrift,
    convergenceType: eps.metrics.convergenceType,
    affectiveRegime: eps.metrics.affectiveRegime,
    intensity: eps.metrics.propagationIntensity,
    Is: eps.metrics.advancedStabilityIndex
  });
}

// ============================================
// Differentiation Analysis
// ============================================

console.log("\n" + "=".repeat(70));
console.log("📊 DIFFERENTIATION ANALYSIS");
console.log("=".repeat(70));

console.log("\n📈 Entropy Signature:");
for (const r of results) {
  let marker = "";
  if (r.name === "EXPLORATORY" && r.finalEntropy > 0.55) marker = " ✓ (High entropy - expected)";
  else if (r.name === "TECHNICAL" && r.finalEntropy < 0.45) marker = " ✓ (Low entropy - expected)";
  else if (r.name === "PERSUASIVE" && r.finalEntropy < 0.4) marker = " ✓ (Forced convergence - expected)";
  else if (r.name === "EMOTIONAL") marker = " (Affective-driven, entropy moderate)";
  console.log(`   ${r.name.padEnd(15)}: ${r.finalEntropy.toFixed(4)}${marker}`);
}

console.log("\n📈 Convergence Type Distribution:");
for (const r of results) {
  console.log(`   ${r.name.padEnd(15)}: ${r.convergenceType}`);
}

console.log("\n📈 Affective Regime:");
for (const r of results) {
  let marker = "";
  if (r.name === "EMOTIONAL" && r.affectiveRegime === "rising") marker = " ✓ (Rising - expected)";
  console.log(`   ${r.name.padEnd(15)}: ${r.affectiveRegime}${marker}`);
}

console.log("\n📈 Stability Index (All within target range?):");
let allInRange = true;
for (const r of results) {
  const inRange = r.Is >= 0.1 && r.Is <= 0.2;
  if (!inRange) allInRange = false;
  const status = inRange ? "✓" : "✗";
  console.log(`   ${r.name.padEnd(15)}: ${r.Is.toFixed(4)} ${status}`);
}

console.log("\n" + "-".repeat(70));
console.log("📊 DIFFERENTIATION CAPABILITY ASSESSMENT:");
console.log("-".repeat(70));

// Check differentiation between dialogue types
const entropyDiff = Math.abs(results[0].finalEntropy - results[1].finalEntropy);
console.log(`\n   Technical vs Exploratory Entropy Gap: ${(entropyDiff * 100).toFixed(1)}%`);

const convergenceDistinct = results[0].convergenceType !== results[1].convergenceType && 
                            results[0].convergenceType !== results[3].convergenceType;
console.log(`   Convergence Type Distinct: ${convergenceDistinct ? "YES ✓" : "NO ✗"}`);

const affectiveDistinct = results[2].affectiveRegime !== results[0].affectiveRegime;
console.log(`   Affective Regime Distinct: ${affectiveDistinct ? "YES ✓" : "NO ✗"}`);

const allMetricsDistinct = entropyDiff > 0.1 && convergenceDistinct && affectiveDistinct;

console.log("\n" + "=".repeat(70));
console.log("🎯 PHASE 2 VERDICT:");
console.log("=".repeat(70));

if (allMetricsDistinct && allInRange) {
  console.log("\n✅ SYSTEM SUCCESSFULLY DIFFERENTIATES BETWEEN DIALOGUE TYPES");
  console.log("   All four categories show distinct topological signatures.");
  console.log("   The calibrated stability manifold preserves differentiation.");
  console.log("\n   Ready for Phase 3: Automated Classification.");
} else if (entropyDiff > 0.05 && convergenceDistinct) {
  console.log("\n⚠️ PARTIAL DIFFERENTIATION ACHIEVED");
  console.log("   System shows some discrimination but needs refinement.");
  console.log("   Consider increasing entropy sensitivity for better separation.");
} else {
  console.log("\n❌ INSUFFICIENT DIFFERENTIATION");
  console.log("   System cannot reliably distinguish between dialogue types.");
  console.log("   Review coupling parameters and increase sensitivity.");
}

console.log("");
