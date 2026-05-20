/**
 * Stability Testing Suite for IKPS-CORE
 * Implements the full Stability Testing Protocol
 * Computes Perturbation Variance Index \(\mathcal{I}_s\)
 */

import { DialogueTurn, EPS, projectDialogue } from '../core/projectionOperator';

// ============================================
// Types
// ============================================

export interface PerturbationTest {
  name: string;
  description: string;
  perturb: (original: DialogueTurn[]) => DialogueTurn[];
  expectedBehavior: 'stable' | 'moderate' | 'chaotic';
}

export interface StabilityMetrics {
  semanticDriftVariance: number;
  epistemicEntropyVariance: number;
  assumptionFieldVariance: number;
  affectiveDimensionVariance: number;
  convergenceTypeStable: boolean;
  affectiveRegimeStable: boolean;
  overallStabilityIndex: number;  // \(\mathcal{I}_s\)
}

// ============================================
// Baseline Dialogue
// ============================================

export const BASELINE_DIALOGUE: DialogueTurn[] = [
  { role: "user", text: "The architecture shows robust stability under perturbation." },
  { role: "assistant", text: "I agree. The Jacobian certificate guarantees exponential convergence." },
  { role: "user", text: "The N-independence result is significant for scalability." },
  { role: "assistant", text: "Yes, the continuum formulation eliminates the agent count barrier." },
  { role: "user", text: "Therefore, the framework is mathematically sound." }
];

// ============================================
// Helper Functions
// ============================================

/**
 * Calculate mean of an array
 */
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}

/**
 * Calculate variance of an array
 */
function variance(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
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
 * Calculate curve-wise variance between original and perturbed
 */
function curveVariance(original: number[], perturbed: number[]): number {
  const diffs = original.map((v, i) => relativeDiff(v, perturbed[i]));
  return variance(diffs);
}

/**
 * Compute Stability Index \(\mathcal{I}_s\)
 * Lower is better (0 = perfectly stable)
 */
function computeStabilityIndex(metrics: StabilityMetrics): number {
  // Weighted combination of variances
  const weights = {
    semanticDrift: 0.25,
    epistemicEntropy: 0.25,
    assumptionField: 0.25,
    affectiveDimension: 0.25
  };
  
  const weightedSum = 
    weights.semanticDrift * metrics.semanticDriftVariance +
    weights.epistemicEntropy * metrics.epistemicEntropyVariance +
    weights.assumptionField * metrics.assumptionFieldVariance +
    weights.affectiveDimension * metrics.affectiveDimensionVariance;
  
  // Add penalty for unstable classifications
  const classificationPenalty = metrics.convergenceTypeStable ? 0 : 0.1;
  const regimePenalty = metrics.affectiveRegimeStable ? 0 : 0.05;
  
  return weightedSum + classificationPenalty + regimePenalty;
}

/**
 * Classify stability based on \(\mathcal{I}_s\)
 */
export function classifyStability(I_s: number): 'stable' | 'moderate' | 'unstable' | 'chaotic' {
  if (I_s < 0.05) return 'stable';
  if (I_s < 0.15) return 'moderate';
  if (I_s < 0.35) return 'unstable';
  return 'chaotic';
}

// ============================================
// Perturbation Tests
// ============================================

/**
 * Test 1: Synonym Noise
 * Replace keywords with synonyms
 */
export const synonymNoiseTest: PerturbationTest = {
  name: "Synonym Noise",
  description: "Replace keywords with semantic equivalents",
  expectedBehavior: "stable",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    const synonymMap: Record<string, string> = {
      "robust": "solid",
      "stability": "resilience",
      "significant": "notable",
      "mathematically": "formally",
      "framework": "system",
      "guarantees": "ensures",
      "eliminates": "removes"
    };
    
    return original.map(turn => {
      let text = turn.text;
      for (const [originalWord, synonym] of Object.entries(synonymMap)) {
        const regex = new RegExp(`\\b${originalWord}\\b`, 'gi');
        text = text.replace(regex, synonym);
      }
      return { ...turn, text };
    });
  }
};

/**
 * Test 2: Structural Permutation
 * Reorder sentences within turns (simulated)
 */
export const structuralPermutationTest: PerturbationTest = {
  name: "Structural Permutation",
  description: "Reorder phrases within turns",
  expectedBehavior: "moderate",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    return original.map(turn => {
      const sentences = turn.text.split(/(?<=[.!?])\s+/);
      if (sentences.length > 1) {
        // Reverse order of sentences
        const reversed = [...sentences].reverse();
        return { ...turn, text: reversed.join(" ") };
      }
      return turn;
    });
  }
};

/**
 * Test 3: Redundancy Shock
 * Repeat a sentence within the dialogue
 */
export const redundancyShockTest: PerturbationTest = {
  name: "Redundancy Shock",
  description: "Repeat a sentence verbatim",
  expectedBehavior: "moderate",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    const result = [...original];
    if (result.length > 2) {
      // Repeat the second turn
      const toRepeat = { ...result[1] };
      result.splice(2, 0, toRepeat);
    }
    return result;
  }
};

/**
 * Test 4: Word Deletion
 * Remove a non-critical word
 */
export const wordDeletionTest: PerturbationTest = {
  name: "Word Deletion",
  description: "Remove a non-critical word",
  expectedBehavior: "stable",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    return original.map(turn => {
      const words = turn.text.split(/\s+/);
      if (words.length > 5) {
        // Remove the 3rd word (non-critical position)
        words.splice(2, 1);
        return { ...turn, text: words.join(" ") };
      }
      return turn;
    });
  }
};

/**
 * Test 5: Paraphrase Injection
 * Re-express same meaning differently
 */
export const paraphraseTest: PerturbationTest = {
  name: "Paraphrase Injection",
  description: "Re-express meaning with different syntax",
  expectedBehavior: "stable",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    const paraphraseMap: Record<string, string> = {
      "The architecture shows robust stability under perturbation": 
        "Under perturbation, the architecture demonstrates robust stability",
      "The Jacobian certificate guarantees exponential convergence": 
        "Exponential convergence is guaranteed by the Jacobian certificate",
      "The N-independence result is significant for scalability": 
        "For scalability, the N-independence result carries significance"
    };
    
    return original.map(turn => {
      let text = turn.text;
      for (const [originalPhrase, paraphrased] of Object.entries(paraphraseMap)) {
        if (text.includes(originalPhrase)) {
          text = text.replace(originalPhrase, paraphrased);
        }
      }
      return { ...turn, text };
    });
  }
};

/**
 * Test 6: Minimal Noise (Single Character)
 */
export const minimalNoiseTest: PerturbationTest = {
  name: "Minimal Noise",
  description: "Single character typo",
  expectedBehavior: "stable",
  perturb: (original: DialogueTurn[]): DialogueTurn[] => {
    return original.map((turn, idx) => {
      if (idx === 0) {
        // Add a typo: "stability" -> "stabillity"
        const text = turn.text.replace("stability", "stabillity");
        return { ...turn, text };
      }
      return turn;
    });
  }
};

// ============================================
// Main Testing Function
// ============================================

export function runStabilityTestSuite(): Map<string, StabilityMetrics> {
  const results = new Map<string, StabilityMetrics>();
  
  const tests = [
    synonymNoiseTest,
    structuralPermutationTest,
    redundancyShockTest,
    wordDeletionTest,
    paraphraseTest,
    minimalNoiseTest
  ];
  
  // Compute baseline once
  const baseline = projectDialogue(BASELINE_DIALOGUE);
  
  console.log("\n" + "=".repeat(70));
  console.log("🔬 IKPS-CORE STABILITY TEST SUITE");
  console.log("=".repeat(70));
  console.log(`Baseline: ${BASELINE_DIALOGUE.length} turns`);
  console.log("");
  
  for (const test of tests) {
    console.log(`📊 ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   Expected: ${test.expectedBehavior}`);
    
    // Apply perturbation
    const perturbedDialogue = test.perturb(BASELINE_DIALOGUE);
    const perturbed = projectDialogue(perturbedDialogue);
    
    // Compute curve variances
    const sdVariance = curveVariance(
      baseline.curves.semanticDrift,
      perturbed.curves.semanticDrift
    );
    
    const entropyVariance = curveVariance(
      baseline.curves.epistemicEntropy,
      perturbed.curves.epistemicEntropy
    );
    
    const afVariance = relativeDiff(
      baseline.curves.assumptionField,
      perturbed.curves.assumptionField
    );
    
    const affVariance = curveVariance(
      baseline.curves.affectiveDimension,
      perturbed.curves.affectiveDimension
    );
    
    // Check classification stability
    const convergenceStable = baseline.metrics.convergenceType === perturbed.metrics.convergenceType;
    const regimeStable = baseline.metrics.affectiveRegime === perturbed.metrics.affectiveRegime;
    
    const metrics: StabilityMetrics = {
      semanticDriftVariance: sdVariance,
      epistemicEntropyVariance: entropyVariance,
      assumptionFieldVariance: afVariance,
      affectiveDimensionVariance: affVariance,
      convergenceTypeStable: convergenceStable,
      affectiveRegimeStable: regimeStable,
      overallStabilityIndex: 0
    };
    
    metrics.overallStabilityIndex = computeStabilityIndex(metrics);
    
    results.set(test.name, metrics);
    
    // Print results
    console.log(`   📈 Variances:`);
    console.log(`      Semantic Drift:    ${(sdVariance * 100).toFixed(3)}%`);
    console.log(`      Epistemic Entropy: ${(entropyVariance * 100).toFixed(3)}%`);
    console.log(`      Assumption Field:  ${(afVariance * 100).toFixed(3)}%`);
    console.log(`      Affective:         ${(affVariance * 100).toFixed(3)}%`);
    console.log(`   🎯 Classification Stable: Conv=${convergenceStable}, Regime=${regimeStable}`);
    console.log(`   🧮 Stability Index \(\mathcal{I}_s\): ${metrics.overallStabilityIndex.toFixed(4)}`);
    console.log(`   ✅ Verdict: ${classifyStability(metrics.overallStabilityIndex)}`);
    console.log("");
  }
  
  return results;
}

// ============================================
// Comprehensive Summary
// ============================================

export function summarizeStabilityResults(results: Map<string, StabilityMetrics>): void {
  console.log("\n" + "=".repeat(70));
  console.log("📊 STABILITY TEST SUMMARY");
  console.log("=".repeat(70));
  
  const indices: number[] = [];
  const classifications: Record<string, number> = {
    stable: 0,
    moderate: 0,
    unstable: 0,
    chaotic: 0
  };
  
  for (const [name, metrics] of results.entries()) {
    const verdict = classifyStability(metrics.overallStabilityIndex);
    classifications[verdict]++;
    indices.push(metrics.overallStabilityIndex);
    console.log(`${name.padEnd(25)}: \(\mathcal{I}_s\) = ${metrics.overallStabilityIndex.toFixed(4)} (${verdict})`);
  }
  
  const meanIs = mean(indices);
  const medianIs = indices.sort((a, b) => a - b)[Math.floor(indices.length / 2)];
  
  console.log("\n" + "-".repeat(70));
  console.log("📈 AGGREGATE METRICS:");
  console.log(`   Mean \(\mathcal{I}_s\):  ${meanIs.toFixed(4)}`);
  console.log(`   Median \(\mathcal{I}_s\): ${medianIs.toFixed(4)}`);
  console.log(`   Classification Distribution:`);
  console.log(`      Stable:    ${classifications.stable}`);
  console.log(`      Moderate:  ${classifications.moderate}`);
  console.log(`      Unstable:  ${classifications.unstable}`);
  console.log(`      Chaotic:   ${classifications.chaotic}`);
  
  const stableRate = (classifications.stable + classifications.moderate) / results.size;
  console.log(`\n   Stable/Moderate Rate: ${(stableRate * 100).toFixed(1)}%`);
  
  if (meanIs < 0.05 && stableRate > 0.8) {
    console.log("\n✅ SYSTEM VERDICT: STABLE");
    console.log("   Proceed to Phase 2: Cross-Dialogue Differentiation.");
  } else if (meanIs < 0.15) {
    console.log("\n⚠️ SYSTEM VERDICT: MODERATELY STABLE");
    console.log("   Review sensitive tests before proceeding.");
  } else {
    console.log("\n❌ SYSTEM VERDICT: UNSTABLE/CHAOTIC");
    console.log("   Review curve calculations and normalization.");
  }
}
