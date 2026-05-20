/**
 * Stability Testing Suite for IKPS-CORE
 * Tests sensitivity of the four epistemic curves to input perturbations
 */

import { projectDialogue, DialogueTurn, EPS } from '../src/core/projectionOperator';
import { computeSemanticDrift } from '../src/core/semanticDrift';
import { computeEpistemicEntropy } from '../src/core/epistemicEntropy';
import { computeAssumptionField } from '../src/core/assumptionField';
import { computeAffectiveCurve } from '../src/core/affectiveDimension';

// ============================================
// Test Helpers
// ============================================

/**
 * Calculate mean of an array
 */
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

/**
 * Calculate standard deviation
 */
function std(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

/**
 * Calculate relative difference between two values
 */
function relativeDiff(a: number, b: number): number {
  const maxVal = Math.max(Math.abs(a), Math.abs(b));
  if (maxVal === 0) return 0;
  return Math.abs(a - b) / maxVal;
}

/**
 * Compare two EPS objects and return stability metrics
 */
function compareEPS(original: EPS, perturbed: EPS): {
  curveStability: {
    semanticDrift: number;
    epistemicEntropy: number;
    assumptionField: number;
    affectiveDimension: number;
  };
  metricStability: {
    cumulativeDrift: number;
    finalEntropy: number;
    convergenceType: boolean;
    affectiveRegime: boolean;
  };
} {
  // Curve stability (mean relative difference across all turns)
  const sdStability = mean(
    original.curves.semanticDrift.map((v, i) => 
      relativeDiff(v, perturbed.curves.semanticDrift[i])
    )
  );
  
  const entropyStability = mean(
    original.curves.epistemicEntropy.map((v, i) => 
      relativeDiff(v, perturbed.curves.epistemicEntropy[i])
    )
  );
  
  const afStability = relativeDiff(
    original.curves.assumptionField,
    perturbed.curves.assumptionField
  );
  
  const affStability = mean(
    original.curves.affectiveDimension.map((v, i) => 
      relativeDiff(v, perturbed.curves.affectiveDimension[i])
    )
  );
  
  // Metric stability
  const driftStability = relativeDiff(
    original.metrics.cumulativeDrift,
    perturbed.metrics.cumulativeDrift
  );
  
  const entropyMetricStability = relativeDiff(
    original.metrics.finalEntropy,
    perturbed.metrics.finalEntropy
  );
  
  const convergenceStable = original.metrics.convergenceType === perturbed.metrics.convergenceType;
  const regimeStable = original.metrics.affectiveRegime === perturbed.metrics.affectiveRegime;
  
  return {
    curveStability: {
      semanticDrift: sdStability,
      epistemicEntropy: entropyStability,
      assumptionField: afStability,
      affectiveDimension: affStability
    },
    metricStability: {
      cumulativeDrift: driftStability,
      finalEntropy: entropyMetricStability,
      convergenceType: convergenceStable,
      affectiveRegime: regimeStable
    }
  };
}

/**
 * Classify stability level
 */
function stabilityLevel(meanRelativeDiff: number): 'stable' | 'moderate' | 'unstable' | 'chaotic' {
  if (meanRelativeDiff < 0.05) return 'stable';
  if (meanRelativeDiff < 0.15) return 'moderate';
  if (meanRelativeDiff < 0.35) return 'unstable';
  return 'chaotic';
}

// ============================================
// Base Dialogue (Technical)
// ============================================

const BASE_DIALOGUE: DialogueTurn[] = [
  { role: "user", text: "The architecture shows robust stability under perturbation." },
  { role: "assistant", text: "I agree. The Jacobian certificate guarantees exponential convergence." },
  { role: "user", text: "The N-independence result is significant for scalability." },
  { role: "assistant", text: "Yes, the continuum formulation eliminates the agent count barrier." },
  { role: "user", text: "Therefore, the framework is mathematically sound." }
];

// ============================================
// Test 1: Single Word Change
// ============================================

console.log("\n📊 TEST 1: Single Word Change");
console.log("=".repeat(50));

const original = projectDialogue(BASE_DIALOGUE);

// Change one word: "robust" -> "weak"
const perturbed1: DialogueTurn[] = BASE_DIALOGUE.map((turn, idx) => {
  if (idx === 0 && turn.role === "user") {
    return { ...turn, text: turn.text.replace("robust", "weak") };
  }
  return turn;
});

const perturbedEPS1 = projectDialogue(perturbed1);
const stability1 = compareEPS(original, perturbedEPS1);

console.log("Curve Stability:");
console.log(`  Semantic Drift:    ${(stability1.curveStability.semanticDrift * 100).toFixed(2)}% diff`);
console.log(`  Epistemic Entropy: ${(stability1.curveStability.epistemicEntropy * 100).toFixed(2)}% diff`);
console.log(`  Assumption Field:  ${(stability1.curveStability.assumptionField * 100).toFixed(2)}% diff`);
console.log(`  Affective:         ${(stability1.curveStability.affectiveDimension * 100).toFixed(2)}% diff`);

const meanDiff1 = mean(Object.values(stability1.curveStability));
console.log(`\nOverall Stability: ${stabilityLevel(meanDiff1)} (mean diff: ${(meanDiff1 * 100).toFixed(2)}%)`);

// ============================================
// Test 2: Synonym Replacement
// ============================================

console.log("\n📊 TEST 2: Synonym Replacement");
console.log("=".repeat(50));

// Replace multiple synonyms
const synonymMap: Record<string, string> = {
  "robust": "solid",
  "stability": "resilience",
  "significant": "notable",
  "mathematically": "formally"
};

const perturbed2: DialogueTurn[] = BASE_DIALOGUE.map(turn => {
  let text = turn.text;
  for (const [originalWord, synonym] of Object.entries(synonymMap)) {
    text = text.replace(new RegExp(originalWord, 'g'), synonym);
  }
  return { ...turn, text };
});

const perturbedEPS2 = projectDialogue(perturbed2);
const stability2 = compareEPS(original, perturbedEPS2);

console.log("Curve Stability:");
console.log(`  Semantic Drift:    ${(stability2.curveStability.semanticDrift * 100).toFixed(2)}% diff`);
console.log(`  Epistemic Entropy: ${(stability2.curveStability.epistemicEntropy * 100).toFixed(2)}% diff`);
console.log(`  Assumption Field:  ${(stability2.curveStability.assumptionField * 100).toFixed(2)}% diff`);
console.log(`  Affective:         ${(stability2.curveStability.affectiveDimension * 100).toFixed(2)}% diff`);

const meanDiff2 = mean(Object.values(stability2.curveStability));
console.log(`\nOverall Stability: ${stabilityLevel(meanDiff2)} (mean diff: ${(meanDiff2 * 100).toFixed(2)}%)`);

// ============================================
// Test 3: Sentence Reordering
// ============================================

console.log("\n📊 TEST 3: Sentence Reordering (Minimal Impact Expected)");
console.log("=".repeat(50));

// Reverse order of turns
const perturbed3: DialogueTurn[] = [...BASE_DIALOGUE].reverse();
const perturbedEPS3 = projectDialogue(perturbed3);
const stability3 = compareEPS(original, perturbedEPS3);

console.log("Curve Stability:");
console.log(`  Semantic Drift:    ${(stability3.curveStability.semanticDrift * 100).toFixed(2)}% diff`);
console.log(`  Epistemic Entropy: ${(stability3.curveStability.epistemicEntropy * 100).toFixed(2)}% diff`);
console.log(`  Assumption Field:  ${(stability3.curveStability.assumptionField * 100).toFixed(2)}% diff`);
console.log(`  Affective:         ${(stability3.curveStability.affectiveDimension * 100).toFixed(2)}% diff`);

const meanDiff3 = mean(Object.values(stability3.curveStability));
console.log(`\nOverall Stability: ${stabilityLevel(meanDiff3)} (mean diff: ${(meanDiff3 * 100).toFixed(2)}%)`);

// ============================================
// Test 4: Noise Injection (Random Words)
// ============================================

console.log("\n📊 TEST 4: Noise Injection (Random Words)");
console.log("=".repeat(50));

const noiseWords = ["actually", "basically", "honestly", "literally", "technically"];

const perturbed4: DialogueTurn[] = BASE_DIALOGUE.map(turn => {
  const words = turn.text.split(" ");
  if (words.length > 3) {
    const insertPos = Math.floor(Math.random() * (words.length - 1)) + 1;
    const noiseWord = noiseWords[Math.floor(Math.random() * noiseWords.length)];
    words.splice(insertPos, 0, noiseWord);
    return { ...turn, text: words.join(" ") };
  }
  return turn;
});

const perturbedEPS4 = projectDialogue(perturbed4);
const stability4 = compareEPS(original, perturbedEPS4);

console.log("Curve Stability:");
console.log(`  Semantic Drift:    ${(stability4.curveStability.semanticDrift * 100).toFixed(2)}% diff`);
console.log(`  Epistemic Entropy: ${(stability4.curveStability.epistemicEntropy * 100).toFixed(2)}% diff`);
console.log(`  Assumption Field:  ${(stability4.curveStability.assumptionField * 100).toFixed(2)}% diff`);
console.log(`  Affective:         ${(stability4.curveStability.affectiveDimension * 100).toFixed(2)}% diff`);

const meanDiff4 = mean(Object.values(stability4.curveStability));
console.log(`\nOverall Stability: ${stabilityLevel(meanDiff4)} (mean diff: ${(meanDiff4 * 100).toFixed(2)}%)`);

// ============================================
// Test 5: Turn Deletion
// ============================================

console.log("\n📊 TEST 5: Turn Deletion (Remove Middle Turn)");
console.log("=".repeat(50));

const perturbed5: DialogueTurn[] = BASE_DIALOGUE.filter((_, idx) => idx !== 2);
const perturbedEPS5 = projectDialogue(perturbed5);
const stability5 = compareEPS(original, perturbedEPS5);

console.log("Curve Stability:");
console.log(`  Semantic Drift:    ${(stability5.curveStability.semanticDrift * 100).toFixed(2)}% diff`);
console.log(`  Epistemic Entropy: ${(stability5.curveStability.epistemicEntropy * 100).toFixed(2)}% diff`);
console.log(`  Assumption Field:  ${(stability5.curveStability.assumptionField * 100).toFixed(2)}% diff`);
console.log(`  Affective:         ${(stability5.curveStability.affectiveDimension * 100).toFixed(2)}% diff`);

const meanDiff5 = mean(Object.values(stability5.curveStability));
console.log(`\nOverall Stability: ${stabilityLevel(meanDiff5)} (mean diff: ${(meanDiff5 * 100).toFixed(2)}%)`);

// ============================================
// Summary Report
// ============================================

console.log("\n");
console.log("========================================");
console.log("📊 STABILITY TEST SUMMARY");
console.log("========================================");

const results = [
  { test: "Single Word Change", stability: stabilityLevel(meanDiff1), diff: meanDiff1 },
  { test: "Synonym Replacement", stability: stabilityLevel(meanDiff2), diff: meanDiff2 },
  { test: "Sentence Reordering", stability: stabilityLevel(meanDiff3), diff: meanDiff3 },
  { test: "Noise Injection", stability: stabilityLevel(meanDiff4), diff: meanDiff4 },
  { test: "Turn Deletion", stability: stabilityLevel(meanDiff5), diff: meanDiff5 }
];

console.log("\n| Test | Stability | Mean Diff |");
console.log("|------|-----------|-----------|");
for (const r of results) {
  console.log(`| ${r.test.padEnd(18)} | ${r.stability.padEnd(9)} | ${(r.diff * 100).toFixed(2)}% |`);
}

const avgDiff = mean(results.map(r => r.diff));
console.log(`\n📈 Average Sensitivity: ${(avgDiff * 100).toFixed(2)}%`);

if (avgDiff < 0.05) {
  console.log("\n✅ SYSTEM VERDICT: STABLE");
  console.log("   The system shows low sensitivity to input perturbations.");
  console.log("   Proceed to Phase 2: Cross-Dialogue Differentiation.");
} else if (avgDiff < 0.15) {
  console.log("\n⚠️ SYSTEM VERDICT: MODERATELY STABLE");
  console.log("   Some sensitivity detected. Review before proceeding.");
} else {
  console.log("\n❌ SYSTEM VERDICT: UNSTABLE/CHAOTIC");
  console.log("   High sensitivity to input changes.");
  console.log("   Review curve calculations before Phase 2.");
}
