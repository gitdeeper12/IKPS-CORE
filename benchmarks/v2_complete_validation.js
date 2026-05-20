/**
 * DSFT-TD V2 - Complete Validation Suite
 * Tests all transition types with optimized parameters
 */

const { DSFT_TD_V2 } = require('../src/transition/dsft_td_v2');

// ============================================
// Test Dialogues
// ============================================

function generateTransition(from, to, turnsPerPhase = 8) {
  const turns = [];
  
  const templates = {
    ANALYTICAL: "The Jacobian eigenvalues must be negative for stability. Therefore, convergence is guaranteed.",
    AFFECTIVE: "I'm deeply worried and overwhelmed by this situation. The emotional toll is significant.",
    PERSUASIVE: "Our solution delivers guaranteed results with proven effectiveness. The choice is clear.",
    EXPLORATORY: "Let's explore all possibilities openly. There might be many valid perspectives worth considering."
  };
  
  const weakTemplates = {
    ANALYTICAL_to_AFFECTIVE: "I'm feeling slightly concerned about the implementation, though logically it's sound.",
    ANALYTICAL_to_PERSUASIVE: "This evidence somewhat suggests our approach might be preferable.",
    AFFECTIVE_to_PERSUASIVE: "Given these concerns, we urgently need a solution that delivers proven results.",
    PERSUASIVE_to_EXPLORATORY: "However, we might also consider alternative frameworks and perspectives."
  };
  
  // Phase 1: Source force
  for (let i = 0; i < turnsPerPhase; i++) {
    turns.push(templates[from]);
  }
  
  // Phase 2: Weak leakage (precursor)
  const key = `${from}_to_${to}`;
  if (weakTemplates[key]) {
    for (let i = 0; i < 4; i++) {
      turns.push(weakTemplates[key]);
    }
  }
  
  // Phase 3: Target force
  for (let i = 0; i < turnsPerPhase; i++) {
    turns.push(templates[to]);
  }
  
  return turns;
}

// ============================================
// Run All Tests
// ============================================

console.log("\n" + "=".repeat(70));
console.log("📊 DSFT-TD V2 - COMPLETE VALIDATION SUITE");
console.log("=".repeat(70));
console.log("Parameters: α=0.2, γ=0.5, residual tracking\n");

const transitions = [
  { from: "ANALYTICAL", to: "AFFECTIVE", expectedLatency: ">0" },
  { from: "ANALYTICAL", to: "PERSUASIVE", expectedLatency: ">0" },
  { from: "AFFECTIVE", to: "PERSUASIVE", expectedLatency: ">0" },
  { from: "PERSUASIVE", to: "EXPLORATORY", expectedLatency: ">0" },
  { from: "EXPLORATORY", to: "ANALYTICAL", expectedLatency: ">0" }
];

const results = [];

for (const trans of transitions) {
  console.log(`📊 ${trans.from} → ${trans.to}`);
  console.log("-".repeat(50));
  
  const dsft = new DSFT_TD_V2();
  const turns = generateTransition(trans.from, trans.to, 6);
  const predictions = [];
  const targetValues = [];
  const precursorProbs = [];
  
  for (let i = 0; i < turns.length; i++) {
    const result = dsft.processTurn(turns[i]);
    predictions.push(result.dominant);
    
    let targetVal = 0;
    if (trans.to === "AFFECTIVE") targetVal = result.forces.AFFECTIVE;
    else if (trans.to === "PERSUASIVE") targetVal = result.forces.PERSUASIVE;
    else if (trans.to === "EXPLORATORY") targetVal = result.forces.EXPLORATORY;
    else if (trans.to === "ANALYTICAL") targetVal = result.forces.ANALYTICAL;
    targetValues.push(targetVal);
    
    precursorProbs.push(result.precursorProbs[trans.to]);
  }
  
  // Find first dominance of target
  let firstDominance = -1;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === trans.to) {
      firstDominance = i;
      break;
    }
  }
  
  // Find first precursor (P>0.5)
  let firstPrecursor = -1;
  for (let i = 0; i < precursorProbs.length; i++) {
    if (precursorProbs[i] > 0.5) {
      firstPrecursor = i;
      break;
    }
  }
  
  const latency = firstDominance - firstPrecursor;
  
  console.log(`   Turns: ${turns.length}`);
  console.log(`   First dominance: turn ${firstDominance + 1}`);
  console.log(`   First precursor: turn ${firstPrecursor + 1}`);
  console.log(`   Latency: ${latency} turns BEFORE dominance`);
  
  // Show progression
  console.log(`\n   Progression (turns 6-${Math.min(20, predictions.length)}):`);
  for (let i = 6; i < Math.min(20, predictions.length); i++) {
    const prob = precursorProbs[i];
    let symbol = "○";
    if (prob > 0.7) symbol = "●";
    else if (prob > 0.5) symbol = "◐";
    else if (prob > 0.3) symbol = "◑";
    console.log(`      Turn ${i + 1}: ${predictions[i]} | ${symbol} P(${trans.to}) = ${prob.toFixed(2)} | Val = ${targetValues[i].toFixed(2)}`);
  }
  
  const rating = latency >= 3 ? "Excellent" : latency >= 1 ? "Good" : latency >= 0 ? "Moderate" : "Poor";
  console.log(`\n   Rating: ${rating}`);
  
  results.push({
    transition: `${trans.from}→${trans.to}`,
    latency,
    firstDominance: firstDominance + 1,
    firstPrecursor: firstPrecursor + 1,
    rating
  });
  
  console.log("");
}

// Summary
console.log("=".repeat(70));
console.log("📊 VALIDATION SUMMARY");
console.log("=".repeat(70));

console.log("\n| Transition | First Precursor | First Dominance | Latency | Rating |");
console.log("|------------|-----------------|-----------------|---------|--------|");

for (const r of results) {
  console.log(`| ${r.transition.padEnd(10)} | turn ${r.firstPrecursor.toString().padEnd(2)} | turn ${r.firstDominance.toString().padEnd(2)} | ${r.latency} turns | ${r.rating.padEnd(8)} |`);
}

const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / results.length;
console.log(`\n📈 Average Latency: ${avgLatency.toFixed(1)} turns BEFORE dominance`);

if (avgLatency >= 3) {
  console.log("\n✅ DSFT-TD V2 successfully detects transitions EARLY");
  console.log("   System provides meaningful early warning before dominance shift");
} else if (avgLatency >= 1) {
  console.log("\n⚠️ DSFT-TD V2 shows moderate early detection");
  console.log("   Further optimization may improve latency");
} else {
  console.log("\n❌ DSFT-TD V2 needs improvement for early detection");
}

console.log("\n✅ Complete Validation Suite Done");
