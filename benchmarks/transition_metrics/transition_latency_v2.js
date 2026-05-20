/**
 * Transition Latency Metrics - DSFT-TD V2
 * Optimized for early detection
 */

const { DSFT_TD_V2 } = require('../../src/transition/dsft_td_v2');

function generateTechnicalToEmotional() {
  const turns = [];
  for (let i = 0; i < 8; i++) turns.push("The Jacobian eigenvalues must be negative for stability. Therefore, convergence is guaranteed.");
  const weak = [
    "I'm feeling slightly concerned about the implementation, though logically it's sound.",
    "There's some worry about how this translates to practice, but the math works.",
    "I'm a bit anxious about the team's ability to handle this complexity.",
    "The uncertainty is creating mild stress, even if the theory is solid."
  ];
  for (const t of weak) turns.push(t);
  const medium = [
    "This is genuinely worrying. The team is feeling the pressure.",
    "I'm seriously concerned about the emotional impact on productivity.",
    "The anxiety is becoming difficult to ignore now.",
    "Frustration is growing as we struggle with these requirements."
  ];
  for (const t of medium) turns.push(t);
  for (let i = 0; i < 4; i++) turns.push("I'm deeply worried and overwhelmed by this situation. The emotional toll is significant.");
  return turns;
}

console.log("\n" + "=".repeat(70));
console.log("⏱️ TRANSITION LATENCY METRICS - DSFT-TD V2");
console.log("=".repeat(70));
console.log("Optimized parameters: α=0.2, γ=0.5, residual tracking\n");

const dsft = new DSFT_TD_V2();
const turns = generateTechnicalToEmotional();

console.log("📊 Technical → Emotional Transition");
console.log("-".repeat(50));

const predictions = [];
const affectiveValues = [];
const precursorProbs = [];

for (let i = 0; i < turns.length; i++) {
  const result = dsft.processTurn(turns[i]);
  predictions.push(result.dominant);
  affectiveValues.push(result.forces.AFFECTIVE);
  precursorProbs.push(result.precursorProbs.AFFECTIVE);
}

console.log(`   Turns: ${turns.length}`);
console.log(`   Predictions: ${predictions.join(" → ")}`);

let firstAffective = -1;
for (let i = 0; i < predictions.length; i++) {
  if (predictions[i] === "AFFECTIVE") {
    firstAffective = i;
    break;
  }
}

let firstPrecursor = -1;
for (let i = 0; i < precursorProbs.length; i++) {
  if (precursorProbs[i] > 0.5) {
    firstPrecursor = i;
    break;
  }
}

console.log(`\n   First AFFECTIVE detection (dominance): turn ${firstAffective + 1}`);
console.log(`   First precursor (P>0.5): turn ${firstPrecursor + 1}`);

const latency = firstAffective - firstPrecursor;
console.log(`\n   Transition Latency (L): ${latency} turns BEFORE dominance`);

console.log(`\n   Precursor Probability Progression:`);
for (let i = 5; i < Math.min(25, precursorProbs.length); i += 2) {
  let symbol = "○";
  if (precursorProbs[i] > 0.7) symbol = "●";
  else if (precursorProbs[i] > 0.5) symbol = "◐";
  else if (precursorProbs[i] > 0.3) symbol = "◑";
  console.log(`      Turn ${i + 1}: ${symbol} P(AFFECTIVE) = ${precursorProbs[i].toFixed(2)}`);
}

console.log(`\n   Force Values Progression:`);
for (let i = 5; i < Math.min(25, affectiveValues.length); i += 2) {
  let bar = "";
  for (let j = 0; j < Math.floor(affectiveValues[i] * 20); j++) bar += "█";
  console.log(`      Turn ${i + 1}: ${bar} ${affectiveValues[i].toFixed(2)}`);
}

if (latency >= 2) {
  console.log("\n   ✅ Excellent early detection!");
  console.log(`      System detects transition ${latency} turns before dominance`);
} else if (latency >= 1) {
  console.log("\n   ✅ Good early detection");
} else if (latency === 0) {
  console.log("\n   ⚠️ Simultaneous detection (no early warning)");
} else {
  console.log("\n   ❌ Late detection (needs improvement)");
}

console.log("\n✅ Transition Latency Metrics Complete");
