/**
 * Affective Dimension - Curve 4
 * Measures contextual emotional/cognitive intensity
 * Observable: α(t) ∈ [0, 1]
 */

export interface AffectiveDimensionConfig {
  highIntensityMarkers: string[];
  lowIntensityMarkers: string[];
  decayRate: number;      // Temporal decay for contextual history
  sensitivity: number;    // β parameter for tanh scaling
}

const DEFAULT_CONFIG: AffectiveDimensionConfig = {
  highIntensityMarkers: [
    "must", "danger", "crisis", "urgent", "critical", "essential",
    "immediately", "required", "necessary", "vital"
  ],
  lowIntensityMarkers: [
    "perhaps", "maybe", "possibly", "might", "could", "somewhat",
    "approximately", "roughly", "seems", "appears"
  ],
  decayRate: 0.7,
  sensitivity: 2.0
};

/**
 * Detect emotional intensity from text
 * Returns value in [0, 1]
 */
export function detectIntensity(text: string, config: AffectiveDimensionConfig = DEFAULT_CONFIG): number {
  const lowerText = text.toLowerCase();
  
  let highCount = 0;
  let lowCount = 0;
  
  for (const marker of config.highIntensityMarkers) {
    if (lowerText.includes(marker)) {
      highCount++;
    }
  }
  
  for (const marker of config.lowIntensityMarkers) {
    if (lowerText.includes(marker)) {
      lowCount++;
    }
  }
  
  // Raw intensity in [-1, 1]
  let rawIntensity = (highCount - lowCount) / (Math.max(1, highCount + lowCount));
  
  // Normalize to [0, 1]
  let normalized = (rawIntensity + 1) / 2;
  
  return Math.max(0, Math.min(1, normalized));
}

/**
 * Track rate of change of intensity
 */
export function intensityDerivative(intensityHistory: number[], dt: number = 1): number {
  if (intensityHistory.length < 2) return 0;
  const prev = intensityHistory[intensityHistory.length - 2];
  const curr = intensityHistory[intensityHistory.length - 1];
  if (dt === 0) return 0;
  return (curr - prev) / dt;
}

/**
 * Compute affective dimension with temporal dynamics
 * α(t) = tanh(β · dI/dt)
 */
export function computeAffectiveDimension(
  intensityHistory: number[],
  config: AffectiveDimensionConfig = DEFAULT_CONFIG
): number {
  const derivative = intensityDerivative(intensityHistory);
  const tanhValue = Math.tanh(config.sensitivity * derivative);
  
  // Map tanh output from [-1, 1] to [0, 1]
  return (tanhValue + 1) / 2;
}

/**
 * Compute full affective curve from dialogue turns
 */
export function computeAffectiveCurve(
  turns: string[],
  config: AffectiveDimensionConfig = DEFAULT_CONFIG
): number[] {
  // First pass: compute intensity per turn
  const rawIntensities: number[] = turns.map(t => detectIntensity(t, config));
  
  // Apply temporal decay (cumulative contextual memory)
  const contextualIntensities: number[] = [];
  let cumulative = 0;
  
  for (let i = 0; i < rawIntensities.length; i++) {
    cumulative = cumulative * config.decayRate + rawIntensities[i];
    contextualIntensities.push(Math.max(0, Math.min(1, cumulative)));
  }
  
  // Compute affective dimension from derivative
  const affectiveValues: number[] = [];
  
  for (let i = 0; i < contextualIntensities.length; i++) {
    const history = contextualIntensities.slice(0, i + 1);
    const alpha = computeAffectiveDimension(history, config);
    affectiveValues.push(alpha);
  }
  
  return affectiveValues;
}

/**
 * Classify emotional regime based on affective curve
 */
export type AffectiveRegime = 'stable' | 'rising' | 'falling' | 'volatile';

export function classifyAffectiveRegime(affectiveValues: number[]): AffectiveRegime {
  if (affectiveValues.length < 3) return 'stable';
  
  const recent = affectiveValues.slice(-5);
  const mean = recent.reduce((sum, v) => sum + v, 0) / recent.length;
  const variance = recent.reduce((sum, v) => sum + (v - mean) ** 2, 0) / recent.length;
  
  const trend = affectiveValues[affectiveValues.length - 1] - affectiveValues[0];
  
  if (variance > 0.1) return 'volatile';
  if (trend > 0.1) return 'rising';
  if (trend < -0.1) return 'falling';
  return 'stable';
}
