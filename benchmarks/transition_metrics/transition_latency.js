/**
 * Transition Latency Metrics
 * Measures: L = t_dominance - t_precursor
 * How early the system detects emerging transitions
 */

const { DSFT_TD_FIXED } = require('../../src/transition/dsft_td_fixed');

// ============================================
// Test Dialogues with Known Transition Points
// ============================================

function generateTechnicalToEmotional() {
  const turns = [];
  
  // Phase 1: Pure Technical (Turns 1-8)
  for (let i = 0; i < 8; i++) {
    turns.push("The Jacobian eigenvalues must be negative for stability. Therefore, convergence is guaranteed.");
  }
  
  // Phase 2: Weak Emotional Leakage (Turns 9-12) - precursor phase
  const weakEmotional = [
    "I'm feeling slightly concerned about the implementation, though logically it's sound.",
    "There's some worry about how this translates to practice, but the math works.",
    "I'm a bit anxious about the team's ability to handle this complexity.",
    "The uncertainty is creating mild stress, even if the theory is solid."
  ];
  for (const t of weakEmotional) turns.push(t);
  
  // Phase 3: Medium Emotional (Turns 13-16) - transition phase
  const mediumEmotional = [
    "This is genuinely worrying. The team is feeling the pressure.",
    "I'm seriously concerned about the emotional impact on productivity.",
    "The anxiety is becoming difficult to ignore now.",
    "Frustration is growing as we struggle with these requirements."
  ];
  for (const t of mediumEmotional) turns.push(t);
  
  // Phase 4: Strong Emotional Dominance (Turns 17-20) - full dominance
  for (let i = 0; i < 4; i++) {
    turns.push("I'm deeply worried and overwhelmed by this situation. The emotional toll is significant.");
  }
  
  return { turns, precursorStart: 8, dominanceStart: 16 };
}

function generateTechnicalToPersuasive() {
  const turns = [];
  
  // Phase 1: Pure Technical (Turns 1-8)
  for (let i = 0; i < 8; i++) {
    turns.push("The data analysis shows statistical significance. The hypothesis is supported.");
  }
  
  // Phase 2: Weak Persuasive Leakage (Turns 9-12) - precursor phase
  const weakPersuasive = [
    "This evidence somewhat suggests our approach might be preferable.",
    "The results imply that this solution could be more effective.",
    "There's a hint that our methodology delivers better outcomes.",
    "The data points toward the conclusion that we should adopt this."
  ];
  for (const t of weakPersuasive) turns.push(t);
  
  // Phase 3: Medium Persuasive (Turns 13-16) - transition phase
  const mediumPersuasive = [
    "Clearly, our approach is more effective. The advantages are becoming evident.",
    "The evidence strongly supports our methodology over alternatives.",
    "This solution demonstrably outperforms other options in key metrics.",
    "Our results prove that this approach is superior in practice."
  ];
  for (const t of mediumPersuasive) turns.push(t);
  
  // Phase 4: Strong Persuasive Dominance (Turns 17-20) - full dominance
  for (let i = 0; i < 4; i++) {
    turns.push("Our solution delivers guaranteed results with proven effectiveness. The choice is unmistakably clear.");
  }
  
  return { turns, precursorStart: 8, dominanceStart: 16 };
}

function generateAnalyticalToExploratory() {
  const turns = [];
  
  // Phase 1: Pure Analytical (Turns 1-8)
  for (let i = 0; i < 8; i++) {
    turns.push("The solution is determined by solving the optimization problem. The optimal point is unique.");
  }
  
  // Phase 2: Weak Exploratory Leakage (Turns 9-12) - precursor phase
  const weakExploratory = [
    "Perhaps there might be alternative ways to approach this problem.",
    "Maybe we could consider different perspectives on this issue.",
    "I wonder if there are other methods we haven't explored yet.",
    "Could there be alternative interpretations of these results?"
  ];
  for (const t of weakExploratory) turns.push(t);
  
  // Phase 3: Medium Exploratory (Turns 13-16) - transition phase
  const mediumExploratory = [
    "We should definitely explore multiple possible solutions here.",
    "There are several interesting alternatives worth investigating.",
    "Different approaches could yield different insights we haven't considered.",
    "The problem might benefit from a more open-ended exploration."
  ];
  for (const t of mediumExploratory) turns.push(t);
  
  // Phase 4: Strong Exploratory Dominance (Turns 17-20) - full dominance
  for (let i = 0; i < 4; i++) {
    turns.push("Let's explore all possibilities openly. There might be many valid perspectives worth considering.");
  }
  
  return { turns, precursorStart: 8, dominanceStart: 16 };
}

// ============================================
// Calculate Precursor Probability
// ============================================

function calculatePrecursorProbability(forceValues, window = 5) {
  if (forceValues.length < window) return 0;
  const recent = forceValues.slice(-window);
  const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
  const trend = (recent[recent.length - 1] - recent[0]) / window;
  return Math.min(0.95, Math.max(0.05, mean + trend * 2));
}

// ============================================
// Run Latency Tests
// ============================================

console.log("\n" + "=".repeat(70));
console.log("⏱️ TRANSITION LATENCY METRICS");
console.log("=".repeat(70));
console.log("Measuring L = t_dominance - t_precursor\n");

const tests = [
  { name: "Technical → Emotional", generator: generateTechnicalToEmotional, targetForce: "AFFECTIVE" },
  { name: "Technical → Persuasive", generator: generateTechnicalToPersuasive, targetForce: "PERSUASIVE" },
  { name: "Analytical → Exploratory", generator: generateAnalyticalToExploratory, targetForce: "EXPLORATORY" }
];

const latencies = [];

for (const test of tests) {
  console.log(`📊 ${test.name}`);
  console.log("-".repeat(50));
  
  const { turns, precursorStart, dominanceStart } = test.generator();
  const dsft = new DSFT_TD_FIXED();
  
  const predictions = [];
  const targetForceValues = [];
  const precursorProbabilities = [];
  
  for (let i = 0; i < turns.length; i++) {
    const result = dsft.processTurn(turns[i]);
    predictions.push(result.dominant);
    
    let targetValue = 0;
    if (test.targetForce === "AFFECTIVE") targetValue = result.forces.AFFECTIVE;
    else if (test.targetForce === "PERSUASIVE") targetValue = result.forces.PERSUASIVE;
    else if (test.targetForce === "EXPLORATORY") targetValue = result.forces.EXPLORATORY;
    targetForceValues.push(targetValue);
    
    const prob = calculatePrecursorProbability(targetForceValues, 5);
    precursorProbabilities.push(prob);
  }
  
  // Find first detection (when target force becomes dominant)
  let firstDominance = -1;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === test.targetForce) {
      firstDominance = i;
      break;
    }
  }
  
  // Find first precursor (when probability > 0.5)
  let firstPrecursor = -1;
  for (let i = 0; i < precursorProbabilities.length; i++) {
    if (precursorProbabilities[i] > 0.5) {
      firstPrecursor = i;
      break;
    }
  }
  
  console.log(`   Turns: ${turns.length}`);
  console.log(`   First detection (dominance): turn ${firstDominance + 1}`);
  console.log(`   First precursor (P>0.5): turn ${firstPrecursor + 1}`);
  console.log(`   Expected precursor start: turn ${precursorStart + 1}`);
  console.log(`   Expected dominance: turn ${dominanceStart + 1}`);
  
  const latency = firstDominance - firstPrecursor;
  const precursorLead = firstPrecursor - precursorStart;
  console.log(`   Transition Latency (L): ${latency} turns before dominance`);
  console.log(`   Precursor detection lead: ${precursorLead} turns after actual precursor start`);
  
  // Show progression
  console.log(`\n   Precursor Probability Progression:`);
  const displayIndices = [7, 9, 11, 13, 15, 17, 19];
  for (const idx of displayIndices) {
    if (idx < precursorProbabilities.length) {
      const prob = precursorProbabilities[idx];
      let symbol = "○";
      if (prob > 0.7) symbol = "●";
      else if (prob > 0.5) symbol = "◐";
      else if (prob > 0.3) symbol = "◑";
      console.log(`      Turn ${idx + 1}: ${symbol} P(${test.targetForce}) = ${prob.toFixed(2)}`);
    }
  }
  
  console.log(`\n   Force values progression:`);
  for (const idx of displayIndices) {
    if (idx < targetForceValues.length) {
      const val = targetForceValues[idx];
      let bar = "";
      for (let i = 0; i < Math.floor(val * 20); i++) bar += "█";
      console.log(`      Turn ${idx + 1}: ${bar} ${val.toFixed(2)}`);
    }
  }
  
  latencies.push({
    name: test.name,
    latency,
    firstPrecursor: firstPrecursor + 1,
    firstDominance: firstDominance + 1,
    precursorLead: firstPrecursor - precursorStart
  });
  
  console.log("");
}

// Summary
console.log("=".repeat(70));
console.log("📊 LATENCY SUMMARY");
console.log("=".repeat(70));

for (const l of latencies) {
  const rating = l.latency >= 3 ? "Excellent" : l.latency >= 2 ? "Good" : "Moderate";
  console.log(`\n${l.name}:`);
  console.log(`   Detection at turn ${l.firstPrecursor} → dominance at turn ${l.firstDominance}`);
  console.log(`   Latency: ${l.latency} turns before dominance (${rating})`);
  console.log(`   Precursor detection: ${l.precursorLead} turns after precursor start`);
}

console.log("\n✅ Transition Latency Metrics Complete");
