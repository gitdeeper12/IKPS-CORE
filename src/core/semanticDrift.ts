/**
 * Semantic Drift - Curve 1
 * Measures how meaning shifts across dialogue turns
 * Observable: σ(t) ∈ [0, 1]
 */

export interface EmbeddingVector {
  values: number[];
}

export interface SemanticDriftConfig {
  method: 'cosine' | 'euclidean' | 'angular';
  smoothingWindow: number;
  normalizationRange: [number, number];
}

const DEFAULT_CONFIG: SemanticDriftConfig = {
  method: 'cosine',
  smoothingWindow: 3,
  normalizationRange: [0, 1]
};

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dot = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Compute Euclidean distance between two vectors
 */
function euclideanDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

/**
 * Normalize value to target range
 */
function normalize(value: number, min: number, max: number, targetRange: [number, number]): number {
  if (max === min) return targetRange[0];
  const normalized = (value - min) / (max - min);
  return targetRange[0] + normalized * (targetRange[1] - targetRange[0]);
}

/**
 * Apply simple moving average smoothing
 */
function smooth(values: number[], window: number): number[] {
  if (values.length < window) return values;
  
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - Math.floor(window / 2)); j <= Math.min(values.length - 1, i + Math.floor(window / 2)); j++) {
      sum += values[j];
      count++;
    }
    result.push(sum / count);
  }
  return result;
}

/**
 * Compute semantic drift from sequence of embeddings
 */
export function computeSemanticDrift(
  embeddings: EmbeddingVector[],
  config: SemanticDriftConfig = DEFAULT_CONFIG
): number[] {
  if (embeddings.length < 2) {
    return new Array(embeddings.length).fill(0);
  }
  
  const drifts: number[] = [0]; // First turn has no drift
  
  for (let i = 1; i < embeddings.length; i++) {
    let similarity: number;
    
    switch (config.method) {
      case 'cosine':
        similarity = cosineSimilarity(embeddings[i].values, embeddings[i-1].values);
        break;
      case 'euclidean':
        const dist = euclideanDistance(embeddings[i].values, embeddings[i-1].values);
        similarity = 1 / (1 + dist);
        break;
      case 'angular':
        const cos = cosineSimilarity(embeddings[i].values, embeddings[i-1].values);
        similarity = Math.acos(Math.min(1, Math.max(-1, cos))) / Math.PI;
        break;
      default:
        similarity = cosineSimilarity(embeddings[i].values, embeddings[i-1].values);
    }
    
    // Drift = 1 - similarity
    let drift = 1 - similarity;
    drift = Math.max(0, Math.min(1, drift));
    drifts.push(drift);
  }
  
  // Apply smoothing
  const smoothed = smooth(drifts, config.smoothingWindow);
  
  // Normalize to target range
  const min = Math.min(...smoothed);
  const max = Math.max(...smoothed);
  return smoothed.map(v => normalize(v, min, max, config.normalizationRange));
}

/**
 * Compute cumulative semantic drift
 */
export function cumulativeDrift(drifts: number[]): number {
  return drifts.reduce((sum, d) => sum + d, 0);
}

/**
 * Detect inflection points (sudden increases in drift)
 */
export function detectInflectionPoints(drifts: number[], threshold: number = 0.15): number[] {
  const inflectionPoints: number[] = [];
  
  for (let i = 1; i < drifts.length; i++) {
    const delta = drifts[i] - drifts[i-1];
    if (delta > threshold) {
      inflectionPoints.push(i);
    }
  }
  
  return inflectionPoints;
}
