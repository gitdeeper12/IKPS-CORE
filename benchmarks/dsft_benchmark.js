/**
 * DSFT Benchmark Suite
 * Real dialogue validation + Baseline comparison
 */

const fs = require('fs');
const path = require('path');

// ============================================
// Real Dialogue Samples
// ============================================

const REAL_DIALOGUES = {
  // Technical debate (Reddit-style)
  TECH_DEBATE: [
    { text: "The fundamental issue is that your model doesn't account for entropy constraints." },
    { text: "Actually, the Lagrangian formulation inherently preserves entropy bounds through the variational principle." },
    { text: "But the discrete approximation breaks symplectic structure after 1000 steps." },
    { text: "We can use adaptive integration with error control; the literature shows 10^-6 energy drift." },
    { text: "That still doesn't guarantee exponential stability for chaotic systems." }
  ],
  
  // Emotional conversation (support group style)
  EMOTIONAL_SUPPORT: [
    { text: "I've been feeling really overwhelmed lately with everything going on." },
    { text: "That sounds incredibly difficult. Do you want to talk about what's been weighing on you?" },
    { text: "It's just... I feel like I'm failing at everything I try to do." },
    { text: "I hear you. That feeling of inadequacy is very real and very painful." },
    { text: "Thank you for listening. It helps just to say it out loud." }
  ],
  
  // Persuasive conversation (sales/marketing)
  PERSUASIVE_SALES: [
    { text: "Our platform reduces operational costs by 40% within the first quarter." },
    { text: "Those numbers sound impressive. What's the implementation timeline?" },
    { text: "We can deploy within two weeks with minimal disruption to your existing workflow." },
    { text: "What about team training? My staff isn't technical." },
    { text: "We provide comprehensive training and 24/7 support - all included in the package." }
  ],
  
  // Exploratory conversation (philosophical)
  EXPLORATORY_PHIL: [
    { text: "Perhaps consciousness is not a binary property but exists on a spectrum." },
    { text: "That's an interesting perspective. How would we measure different degrees?" },
    { text: "Maybe through information integration and causal influence metrics." },
    { text: "Could biological and artificial systems exist on the same continuum?" },
    { text: "Possibly, though the embodiment question remains unresolved." }
  ],
  
  // Mixed (technical + emotional)
  MIXED_TECH_EMO: [
    { text: "The system keeps crashing during peak load. I'm really frustrated." },
    { text: "I understand your frustration. Let's look at the memory allocation logs." },
    { text: "We've tried increasing heap size; it didn't help." },
    { text: "This is affecting my team's morale. We need a real solution." },
    { text: "I agree completely. Let's implement the distributed caching layer as a fix." }
  ],
  
  // Long dialogue (10 turns)
  LONG_TECHNICAL: [
    { text: "The Jacobian analysis shows eigenvalues crossing the imaginary axis." },
    { text: "That suggests a Hopf bifurcation. Did you check the critical parameter value?" },
    { text: "Yes, we computed it. The system becomes unstable at λ = 2.3." },
    { text: "So the stability certificate only holds below that threshold." },
    { text: "Exactly. For λ > 2.3, we need active control to maintain stability." },
    { text: "Have you tried the feedback linearization approach from Smith et al. 2024?" },
    { text: "We implemented it; it works but adds significant computational overhead." },
    { text: "What about the model predictive control variant? It might be more efficient." },
    { text: "We haven't tested that yet. It's worth exploring." },
    { text: "I'll prepare a comparison of both methods for next week's review." }
  ]
};

// ============================================
// Baseline Classifiers (Simulated)
// ============================================

class BaselineClassifier {
  constructor(name) {
    this.name = name;
  }
  
  // Simple keyword-based classification for baseline comparison
  classify(text) {
    const lower = text.toLowerCase();
    let scores = { TECHNICAL: 0, EXPLORATORY: 0, EMOTIONAL: 0, PERSUASIVE: 0 };
    
    const techWords = ["jacobian", "system", "model", "data", "analysis", "compute", "algorithm"];
    const expWords = ["perhaps", "maybe", "could", "might", "possibly", "explore"];
    const emoWords = ["frustrated", "concern", "worry", "feel", "overwhelmed", "difficult"];
    const perWords = ["solution", "implement", "result", "improve", "reduce", "increase"];
    
    for (const w of techWords) if (lower.includes(w)) scores.TECHNICAL += 0.2;
    for (const w of expWords) if (lower.includes(w)) scores.EXPLORATORY += 0.2;
    for (const w of emoWords) if (lower.includes(w)) scores.EMOTIONAL += 0.2;
    for (const w of perWords) if (lower.includes(w)) scores.PERSUASIVE += 0.2;
    
    let max = "TECHNICAL";
    let maxScore = -1;
    for (const [k, v] of Object.entries(scores)) {
      if (v > maxScore) { maxScore = v; max = k; }
    }
    return max;
  }
  
  classifyDialogue(turns) {
    const classifications = turns.map(t => this.classify(t.text));
    const dominant = classifications.reduce((a, b) => {
      let count = {};
      for (const c of classifications) count[c] = (count[c] || 0) + 1;
      return Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b);
    });
    return { dominant, classifications };
  }
}

// ============================================
// DSFT Force Calculator (Simplified)
// ============================================

class DSFTForceCalculator {
  constructor() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.inertia = 0.85;
    this.coupling = {
      ANALYTICAL: { EXPLORATORY: -0.15, AFFECTIVE: -0.10, PERSUASIVE: 0.12 },
      EXPLORATORY: { ANALYTICAL: -0.12, AFFECTIVE: 0.18, PERSUASIVE: -0.08 },
      AFFECTIVE: { ANALYTICAL: -0.08, EXPLORATORY: 0.15, PERSUASIVE: 0.10 },
      PERSUASIVE: { ANALYTICAL: 0.10, EXPLORATORY: -0.05, AFFECTIVE: 0.08 }
    };
  }
  
  detectMarkers(text) {
    const lower = text.toLowerCase();
    let analytical = 0, exploratory = 0, affective = 0, persuasive = 0;
    
    if (lower.includes("jacobian") || lower.includes("system") || lower.includes("model")) analytical += 0.15;
    if (lower.includes("perhaps") || lower.includes("maybe") || lower.includes("could")) exploratory += 0.15;
    if (lower.includes("frustrated") || lower.includes("concern") || lower.includes("feel")) affective += 0.15;
    if (lower.includes("solution") || lower.includes("implement") || lower.includes("result")) persuasive += 0.15;
    if (lower.includes("therefore") || lower.includes("must") || lower.includes("guarantee")) analytical += 0.2;
    if (lower.includes("danger") || lower.includes("crisis") || lower.includes("urgent")) affective += 0.2;
    if (lower.includes("prove") || lower.includes("guaranteed") || lower.includes("customers")) persuasive += 0.2;
    if (lower.includes("explore") || lower.includes("interesting") || lower.includes("perspective")) exploratory += 0.2;
    
    return { analytical, exploratory, affective, persuasive };
  }
  
  updateForce(text) {
    const markers = this.detectMarkers(text);
    
    // Calculate coupling influence
    let coupled = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    for (const [force, value] of Object.entries(this.forces)) {
      for (const [other, weight] of Object.entries(this.coupling[force] || {})) {
        coupled[other] += value * weight;
      }
    }
    
    // Update with inertia and coupling
    this.forces.ANALYTICAL = this.inertia * this.forces.ANALYTICAL + 0.15 * markers.analytical + 0.05 * coupled.ANALYTICAL;
    this.forces.EXPLORATORY = this.inertia * this.forces.EXPLORATORY + 0.15 * markers.exploratory + 0.05 * coupled.EXPLORATORY;
    this.forces.AFFECTIVE = this.inertia * this.forces.AFFECTIVE + 0.15 * markers.affective + 0.05 * coupled.AFFECTIVE;
    this.forces.PERSUASIVE = this.inertia * this.forces.PERSUASIVE + 0.15 * markers.persuasive + 0.05 * coupled.PERSUASIVE;
    
    // Clamp
    for (const f of Object.keys(this.forces)) {
      this.forces[f] = Math.min(0.9, Math.max(0.1, this.forces[f]));
    }
    
    return this.getDominant();
  }
  
  getDominant() {
    let max = "ANALYTICAL";
    let maxVal = this.forces.ANALYTICAL;
    if (this.forces.EXPLORATORY > maxVal) { maxVal = this.forces.EXPLORATORY; max = "EXPLORATORY"; }
    if (this.forces.AFFECTIVE > maxVal) { maxVal = this.forces.AFFECTIVE; max = "AFFECTIVE"; }
    if (this.forces.PERSUASIVE > maxVal) { maxVal = this.forces.PERSUASIVE; max = "PERSUASIVE"; }
    return max;
  }
  
  getStability() {
    const values = Object.values(this.forces);
    const mean = values.reduce((a, b) => a + b, 0) / 4;
    const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / 4;
    return Math.min(0.5, variance * 2);
  }
  
  processDialogue(turns) {
    const history = [];
    for (const turn of turns) {
      const dominant = this.updateForce(turn.text);
      history.push({ dominant, forces: { ...this.forces }, stability: this.getStability() });
    }
    return history;
  }
}

// ============================================
// Benchmark Runner
// ============================================

function runBenchmark() {
  console.log("\n" + "=".repeat(70));
  console.log("🔬 DSFT BENCHMARK SUITE");
  console.log("=".repeat(70));
  
  const baselines = [
    new BaselineClassifier("Keyword-Based"),
    new BaselineClassifier("Simple Pattern")
  ];
  const dsft = new DSFTForceCalculator();
  
  const results = {
    dsft: {},
    baselines: { "Keyword-Based": {}, "Simple Pattern": {} }
  };
  
  for (const [name, dialogue] of Object.entries(REAL_DIALOGUES)) {
    console.log(`\n📊 ${name}`);
    console.log("-".repeat(40));
    
    // DSFT classification
    const dsftHistory = dsft.processDialogue(dialogue);
    const dsftDominant = dsftHistory[dsftHistory.length - 1].dominant;
    const dsftStability = dsftHistory[dsftHistory.length - 1].stability;
    results.dsft[name] = { dominant: dsftDominant, stability: dsftStability, turns: dialogue.length };
    
    console.log(`   DSFT:         ${dsftDominant} (stability: ${dsftStability.toFixed(4)})`);
    
    // Baseline classifications
    for (const baseline of baselines) {
      const result = baseline.classifyDialogue(dialogue);
      results.baselines[baseline.name][name] = result.dominant;
      console.log(`   ${baseline.name.padEnd(14)}: ${result.dominant}`);
    }
    
    // Expected classification (based on dialogue type)
    let expected = "";
    if (name.includes("TECH") || name.includes("LONG")) expected = "TECHNICAL";
    else if (name.includes("EMOTIONAL")) expected = "EMOTIONAL";
    else if (name.includes("PERSUASIVE")) expected = "PERSUASIVE";
    else if (name.includes("EXPLORATORY")) expected = "EXPLORATORY";
    else if (name.includes("MIXED")) expected = "MIXED (ambiguous)";
    
    console.log(`   Expected:     ${expected}`);
    
    // DSFT correct?
    const dsftCorrect = (dsftDominant === "ANALYTICAL" && name.includes("TECH")) ||
                        (dsftDominant === "EXPLORATORY" && name.includes("EXPLORATORY")) ||
                        (dsftDominant === "AFFECTIVE" && name.includes("EMOTIONAL")) ||
                        (dsftDominant === "PERSUASIVE" && name.includes("PERSUASIVE"));
    console.log(`   DSFT Correct: ${dsftCorrect ? "✓" : "✗"}`);
  }
  
  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("📊 BENCHMARK SUMMARY");
  console.log("=".repeat(70));
  
  let dsftCorrectCount = 0;
  let total = 0;
  for (const [name, result] of Object.entries(results.dsft)) {
    total++;
    const expected = (name.includes("TECH") || name.includes("LONG")) ? "ANALYTICAL" :
                     name.includes("EMOTIONAL") ? "AFFECTIVE" :
                     name.includes("EXPLORATORY") ? "EXPLORATORY" :
                     name.includes("PERSUASIVE") ? "PERSUASIVE" : null;
    if (expected && result.dominant === expected) dsftCorrectCount++;
  }
  
  console.log(`\nDSFT Accuracy: ${dsftCorrectCount}/${total} (${(dsftCorrectCount/total*100).toFixed(1)}%)`);
  
  // Average stability
  const avgStability = Object.values(results.dsft).reduce((sum, r) => sum + r.stability, 0) / total;
  console.log(`Average DSFT Stability: ${avgStability.toFixed(4)}`);
  
  // Baseline comparison
  const baselineNames = Object.keys(results.baselines);
  for (const baselineName of baselineNames) {
    let correct = 0;
    let bTotal = 0;
    for (const [name, result] of Object.entries(results.baselines[baselineName])) {
      bTotal++;
      const expected = (name.includes("TECH") || name.includes("LONG")) ? "TECHNICAL" :
                       name.includes("EMOTIONAL") ? "EMOTIONAL" :
                       name.includes("EXPLORATORY") ? "EXPLORATORY" :
                       name.includes("PERSUASIVE") ? "PERSUASIVE" : null;
      if (expected && result === expected) correct++;
    }
    console.log(`${baselineName} Accuracy: ${correct}/${bTotal} (${(correct/bTotal*100).toFixed(1)}%)`);
  }
  
  console.log("\n✅ Benchmark complete");
}

runBenchmark();
