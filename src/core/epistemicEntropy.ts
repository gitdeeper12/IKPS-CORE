/**
 * Epistemic Entropy - Curve 2
 * Measures uncertainty in the dialogue state
 * Observable: H_ep(t) ∈ [0, 1]
 */

export interface ProbabilityDistribution {
  probabilities: number[];
  categories: string[];
}

export interface EpistemicEntropyConfig {
  base: number;           // Logarithm base (Math.E for nats, 2 for bits)
  smoothing: number;      // Laplace smoothing epsilon
  normalization: boolean; // Normalize to [0, 1]
}

const DEFAULT_CONFIG: EpistemicEntropyConfig = {
  base: Math.E,
  smoothing: 1e-8,
  normalization: true
};

/**
 * Shannon entropy: H = -Σ p_i log(p_i)
 */
export function shannonEntropy(probabilities: number[], config: EpistemicEntropyConfig = DEFAULT_CONFIG): number {
  if (probabilities.length === 0) return 0;
  
  let entropy = 0;
  const total = probabilities.reduce((sum, p) => sum + p, 0);
  
  for (let p of probabilities) {
    const prob = p / (total + config.smoothing);
    if (prob > 0) {
      entropy -= prob * Math.log(prob) / Math.log(config.base);
    }
  }
  
  if (config.normalization) {
    const maxEntropy = Math.log(probabilities.length) / Math.log(config.base);
    if (maxEntropy > 0) {
      entropy = entropy / maxEntropy;
    }
  }
  
  return Math.max(0, Math.min(1, entropy));
}

/**
 * Estimate probability distribution from embedding clusters
 * Simplified: uses frequency distribution of semantic categories
 */
export function estimateDistributionFromEmbeddings(
  embeddings: number[][],
  nCategories: number = 5
): number[] {
  if (embeddings.length === 0) {
    return new Array(nCategories).fill(1 / nCategories);
  }
  
  // Simplified clustering: use magnitude as proxy for category
  const magnitudes = embeddings.map(v => Math.sqrt(v.reduce((sum, x) => sum + x * x, 0)));
  
  const hist = new Array(nCategories).fill(0);
  const minMag = Math.min(...magnitudes);
  const maxMag = Math.max(...magnitudes);
  const range = maxMag - minMag;
  
  for (const mag of magnitudes) {
    let bin = 0;
    if (range > 0) {
      bin = Math.min(nCategories - 1, Math.floor(((mag - minMag) / range) * nCategories));
    }
    hist[bin]++;
  }
  
  return hist;
}

/**
 * Compute epistemic entropy from dialogue turns
 */
export function computeEpistemicEntropy(
  embeddings: number[][],
  config: EpistemicEntropyConfig = DEFAULT_CONFIG
): number[] {
  const entropyValues: number[] = [];
  
  // Compute rolling entropy across turns
  for (let i = 0; i < embeddings.length; i++) {
    const window = embeddings.slice(0, i + 1);
    const distribution = estimateDistributionFromEmbeddings(window);
    const entropy = shannonEntropy(distribution, config);
    entropyValues.push(entropy);
  }
  
  return entropyValues;
}

/**
 * Compute entropy drop (degree of convergence)
 */
export function entropyDrop(entropyValues: number[]): number {
  if (entropyValues.length < 2) return 0;
  const initial = entropyValues[0];
  const final = entropyValues[entropyValues.length - 1];
  if (initial === 0) return 0;
  return (initial - final) / initial;
}

/**
 * Classify convergence type based on entropy behavior
 */
export type ConvergenceType = 'open_exploration' | 'organic_convergence' | 'forced_convergence';

export function classifyConvergence(
  entropyValues: number[],
  drifts: number[],
  inflectionPoints: number[]
): ConvergenceType {
  const finalEntropy = entropyValues[entropyValues.length - 1];
  const entropyDropValue = entropyDrop(entropyValues);
  const hasInflections = inflectionPoints.length > 0;
  
  if (finalEntropy > 0.6) {
    return 'open_exploration';
  }
  
  if (!hasInflections && entropyDropValue < 0.35) {
    return 'organic_convergence';
  }
  
  return 'forced_convergence';
}
