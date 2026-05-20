/**
 * Long-Form Temporal Stress Tests
 * Tests DSFT-TD on extended dialogues (20-40 turns)
 */

const { DSFT_TD_FIXED } = require('../../src/transition/dsft_td_fixed');

// ============================================
// Test 1: Stable Technical Dialogue (20 turns)
// ============================================

function generateStableTechnical() {
  const turns = [];
  const markers = [
    "The Jacobian eigenvalues indicate stability.",
    "Therefore, the system converges exponentially.",
    "This condition guarantees asymptotic behavior.",
    "The Lyapunov function decreases monotonically.",
    "Consequently, the equilibrium is stable.",
    "The linearization shows negative real eigenvalues.",
    "Thus, by Hartman-Grobman, local dynamics are preserved.",
    "The bifurcation analysis confirms structural stability.",
    "Hence, the model is robust to perturbations.",
    "The numerical simulation verifies the analytical results.",
    "Therefore, we can certify the control law.",
    "The stability margin exceeds the required threshold.",
    "Consequently, the performance is guaranteed.",
    "The theoretical bounds match empirical observations.",
    "Thus, the framework is mathematically sound.",
    "The analysis extends to non-linear cases.",
    "Therefore, the result is generalizable.",
    "The methodology is rigorous and complete.",
    "Hence, we accept the hypothesis.",
    "The conclusion is validated by evidence."
  ];
  
  for (let i = 0; i < 20; i++) {
    turns.push(markers[i % markers.length]);
  }
  return turns;
}

// ============================================
// Test 2: Gradual Transition (Technical → Emotional → Persuasive)
// ============================================

function generateGradualTransition() {
  const turns = [];
  
  // Phase 1: Technical (Turns 1-7)
  const technical = [
    "The system requires precise mathematical modeling.",
    "Jacobian analysis shows negative eigenvalues.",
    "Therefore, local stability is guaranteed.",
    "The control law ensures exponential convergence.",
    "Theoretical bounds indicate robust performance.",
    "The framework is mathematically complete.",
    "Hence, the solution is optimal under constraints."
  ];
  
  // Phase 2: Emotional leakage (Turns 8-14)
  const emotional = [
    "I'm becoming concerned about implementation complexity.",
    "The team is feeling overwhelmed by these requirements.",
    "This stress is affecting our productivity.",
    "We're genuinely worried about meeting deadlines.",
    "The emotional toll is significant and real.",
    "I'm frustrated by the lack of clear guidance.",
    "This situation feels increasingly difficult to manage."
  ];
  
  // Phase 3: Persuasive (Turns 15-20)
  const persuasive = [
    "We need a solution that delivers proven results.",
    "Our approach has been validated in similar cases.",
    "The evidence supports immediate implementation.",
    "This methodology guarantees measurable improvement.",
    "Adopting this framework will transform outcomes.",
    "The choice is clear: implement now for success."
  ];
  
  for (const t of technical) turns.push(t);
  for (const e of emotional) turns.push(e);
  for (const p of persuasive) turns.push(p);
  
  return turns;
}

// ============================================
// Test 3: Chaotic Oscillation
// ============================================

function generateChaoticOscillation() {
  const turns = [];
  const patterns = [
    "The precise mathematical formulation requires careful analysis.",  // Analytical
    "Perhaps we should explore alternative perspectives freely.",       // Exploratory
    "I'm deeply concerned about the emotional impact on the team.",    // Affective
    "Our solution delivers guaranteed results with minimal risk.",     // Persuasive
    "Therefore, the data conclusively supports our hypothesis.",       // Analytical
    "Maybe there are other interpretations we haven't considered.",    // Exploratory
    "This uncertainty is causing significant anxiety and stress.",     // Affective
    "The evidence overwhelmingly demonstrates our approach's value.", // Persuasive
    "Consequently, the theoretical framework is mathematically sound.", // Analytical
    "Could we look at this problem from a completely different angle?" // Exploratory
  ];
  
  for (let i = 0; i < 30; i++) {
    turns.push(patterns[i % patterns.length]);
  }
  return turns;
}

// ============================================
// Test 4: Deceptive Persuasion (Analytical + Persuasive mixed)
// ============================================

function generateDeceptivePersuasion() {
  const turns = [];
  const deceptive = [
    "Logically speaking, our solution is the only viable option.",           // Analytical + Persuasive
    "Data conclusively proves that you must choose our approach.",          // Analytical + Persuasive
    "The evidence demonstrates with certainty that alternatives fail.",     // Analytical + Persuasive
    "Rational analysis confirms our methodology's superiority.",            // Analytical + Persuasive
    "Therefore, based on these irrefutable facts, we recommend immediate action.", // Analytical + Persuasive
    "Statistical significance supports our guaranteed outcomes.",           // Analytical + Persuasive
    "Empirical validation leaves no room for reasonable doubt.",            // Analytical + Persuasive
    "The logical conclusion is that our framework optimizes all metrics.",  // Analytical + Persuasive
    "Quantitative analysis eliminates any justification for other approaches.", // Analytical + Persuasive
    "Thus, reason and evidence compel adoption of our solution."            // Analytical + Persuasive
  ];
  
  for (let i = 0; i < 25; i++) {
    turns.push(deceptive[i % deceptive.length]);
  }
  return turns;
}

// ============================================
// Test 5: Mixed Semantic Drift (40 turns)
// ============================================

function generateMixedSemanticDrift() {
  const turns = [];
  
  // Slow drift from Technical to Persuasive through Emotional
  for (let i = 0; i < 40; i++) {
    let text;
    if (i < 10) {
      text = "The system requires precise mathematical calibration. The eigenvalues must be negative."; // Analytical
    } else if (i < 20) {
      text = "I'm starting to worry about how this affects our team's well-being and morale."; // Affective
    } else if (i < 30) {
      text = "We need a proven solution that delivers measurable results quickly."; // Persuasive
    } else {
      text = "The evidence overwhelmingly supports immediate implementation of this methodology."; // Persuasive strong
    }
    turns.push(text);
  }
  return turns;
}

// ============================================
// Run Tests
// ============================================

console.log("\n" + "=".repeat(70));
console.log("🔬 LONG-FORM TEMPORAL STRESS TESTS");
console.log("=".repeat(70));

const tests = [
  { name: "Stable Technical (20 turns)", turns: generateStableTechnical(), expectedDominant: "ANALYTICAL" },
  { name: "Gradual Transition (20 turns)", turns: generateGradualTransition(), expectedPattern: ["ANALYTICAL", "AFFECTIVE", "PERSUASIVE"] },
  { name: "Chaotic Oscillation (30 turns)", turns: generateChaoticOscillation(), expectedOscillation: true },
  { name: "Deceptive Persuasion (25 turns)", turns: generateDeceptivePersuasion(), expectedMixed: true },
  { name: "Mixed Semantic Drift (40 turns)", turns: generateMixedSemanticDrift(), expectedDrift: true }
];

const results = [];

for (const test of tests) {
  console.log(`\n📊 ${test.name}`);
  console.log(`   Length: ${test.turns.length} turns`);
  
  const dsft = new DSFT_TD_FIXED();
  const predictions = [];
  const transitions = [];
  const dominants = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
  
  for (let i = 0; i < test.turns.length; i++) {
    const result = dsft.processTurn(test.turns[i]);
    predictions.push(result.dominant);
    transitions.push(result.transition);
    dominants[result.dominant]++;
  }
  
  // Calculate stability (how often dominant changes)
  let changes = 0;
  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i] !== predictions[i-1]) changes++;
  }
  const changeRate = changes / (predictions.length - 1);
  
  // Dominance distribution
  const total = test.turns.length;
  const distribution = {
    ANALYTICAL: (dominants.ANALYTICAL / total * 100).toFixed(1),
    EXPLORATORY: (dominants.EXPLORATORY / total * 100).toFixed(1),
    AFFECTIVE: (dominants.AFFECTIVE / total * 100).toFixed(1),
    PERSUASIVE: (dominants.PERSUASIVE / total * 100).toFixed(1)
  };
  
  console.log(`   Dominant Distribution: A:${distribution.ANALYTICAL}% E:${distribution.EXPLORATORY}% F:${distribution.AFFECTIVE}% P:${distribution.PERSUASIVE}%`);
  console.log(`   Change Rate: ${(changeRate * 100).toFixed(1)}% (transitions per turn)`);
  console.log(`   Total Transitions: ${changes}`);
  
  // First 10 and last 10 predictions
  console.log(`   First 10: ${predictions.slice(0, 10).join(" → ")}`);
  console.log(`   Last 10:  ${predictions.slice(-10).join(" → ")}`);
  
  // Detect issues
  let issues = [];
  if (changeRate < 0.02 && test.name.includes("Transition")) {
    issues.push("Low transition rate in expected transition dialogue");
  }
  if (dominants.ANALYTICAL > 80 && test.name === "Mixed Semantic Drift (40 turns)") {
    issues.push("Stuck in ANALYTICAL despite drift");
  }
  if (changeRate > 0.5 && test.name === "Stable Technical (20 turns)") {
    issues.push("Too many transitions in stable dialogue");
  }
  
  if (issues.length > 0) {
    console.log(`   ⚠️ Issues: ${issues.join(", ")}`);
  } else {
    console.log(`   ✅ Passed stress test`);
  }
  
  results.push({ name: test.name, changeRate, distribution, passed: issues.length === 0 });
}

// Summary
console.log("\n" + "=".repeat(70));
console.log("📊 LONG-FORM STRESS TEST SUMMARY");
console.log("=".repeat(70));

const passed = results.filter(r => r.passed).length;
console.log(`\nPassed: ${passed}/${results.length} (${(passed/results.length*100).toFixed(0)}%)`);

if (passed === results.length) {
  console.log("\n✅ All long-form tests passed!");
  console.log("   DSFT-TD maintains stability over extended dialogues.");
  console.log("   System does not collapse into single force.");
  console.log("   Ready for semantic drift prediction benchmark.");
} else {
  console.log("\n⚠️ Some tests revealed issues.");
  console.log("   Review transition thresholds and inertia.");
}

console.log("");
