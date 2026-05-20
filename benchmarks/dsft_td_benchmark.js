/**
 * DSFT-TD Benchmark
 * Tests transition detection and prediction capabilities
 */

const { DSFT_TD } = require('../src/transition/dsft_td');

const TRANSITION_DIALOGUES = [
  {
    name: "Technical → Emotional",
    expected: ["ANALYTICAL", "ANALYTICAL", "AFFECTIVE", "AFFECTIVE"],
    turns: [
      "The Jacobian eigenvalues indicate exponential stability.",
      "Therefore, the system converges to the global attractor Q*.",
      "I'm genuinely worried about the implementation complexity though.",
      "This stress is affecting my team's ability to deliver."
    ]
  },
  {
    name: "Emotional → Persuasive",
    expected: ["AFFECTIVE", "AFFECTIVE", "PERSUASIVE", "PERSUASIVE"],
    turns: [
      "I'm deeply concerned about our current trajectory.",
      "This situation feels completely out of control.",
      "But we can fix this if we implement the new protocol now.",
      "Our solution has proven results in similar cases."
    ]
  },
  {
    name: "Persuasive → Exploratory",
    expected: ["PERSUASIVE", "PERSUASIVE", "EXPLORATORY", "EXPLORATORY"],
    turns: [
      "Our methodology is proven effective in 95% of cases.",
      "The evidence overwhelmingly supports our approach.",
      "However, we might also consider alternative frameworks.",
      "Perhaps a hybrid model could yield better results."
    ]
  },
  {
    name: "Rapid Oscillation",
    expected: ["ANALYTICAL", "EXPLORATORY", "AFFECTIVE", "PERSUASIVE"],
    turns: [
      "The system requires precise mathematical tuning.",
      "But perhaps we could explore more creative solutions?",
      "I'm really worried about the team's burnout, though.",
      "Ultimately, our approach delivers measurable results."
    ]
  }
];

console.log("\n" + "=".repeat(70));
console.log("🚀 DSFT-TD: Transition Dynamics Benchmark");
console.log("=".repeat(70));

let totalAccuracy = 0;
let totalTransitionAccuracy = 0;
let totalPredAccuracy = 0;
let dialogueCount = 0;

for (const dialogue of TRANSITION_DIALOGUES) {
  console.log(`\n📊 ${dialogue.name}`);
  console.log(`   Expected: ${dialogue.expected.join(" → ")}`);
  
  const dsft = new DSFT_TD();
  const predictions = [];
  const turbulences = [];
  
  for (let i = 0; i < dialogue.turns.length; i++) {
    const result = dsft.processTurn(dialogue.turns[i]);
    predictions.push(result.dominant);
    if (result.turbulence && typeof result.turbulence === 'number') {
      turbulences.push(result.turbulence);
    } else if (result.turbulence && result.turbulence.turbulence) {
      turbulences.push(result.turbulence.turbulence);
    } else {
      turbulences.push(0);
    }
  }
  
  console.log(`   DSFT-TD:   ${predictions.join(" → ")}`);
  
  // Calculate accuracy
  let correct = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === dialogue.expected[i]) correct++;
  }
  const accuracy = correct / predictions.length;
  
  // Check transition detection
  let transitionsCorrect = 0;
  let transitionPositions = [];
  for (let i = 1; i < dialogue.expected.length; i++) {
    if (dialogue.expected[i] !== dialogue.expected[i-1]) {
      transitionPositions.push(i);
      if (predictions[i] === dialogue.expected[i]) transitionsCorrect++;
    }
  }
  
  const transitionAccuracy = transitionPositions.length > 0 ? transitionsCorrect / transitionPositions.length : 1.0;
  
  // Get prediction accuracy from DSFT
  const predAccuracy = dsft.getPredictionAccuracy();
  
  console.log(`   Accuracy: ${(accuracy * 100).toFixed(1)}% | Transition Acc: ${(transitionAccuracy * 100).toFixed(1)}%`);
  console.log(`   Prediction Accuracy: ${(predAccuracy * 100).toFixed(1)}%`);
  
  totalAccuracy += accuracy;
  totalTransitionAccuracy += transitionAccuracy;
  totalPredAccuracy += predAccuracy;
  dialogueCount++;
}

console.log("\n" + "=".repeat(70));
console.log("📊 DSFT-TD SUMMARY");
console.log("=".repeat(70));
console.log(`\nAverage Accuracy:         ${(totalAccuracy / dialogueCount * 100).toFixed(1)}%`);
console.log(`Average Transition Acc:   ${(totalTransitionAccuracy / dialogueCount * 100).toFixed(1)}%`);
console.log(`Average Prediction Acc:   ${(totalPredAccuracy / dialogueCount * 100).toFixed(1)}%`);

console.log("\n✅ DSFT-TD Benchmark Complete");
console.log("=".repeat(70));
