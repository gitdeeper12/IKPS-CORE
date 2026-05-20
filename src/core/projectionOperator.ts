/**
 * Projection Operator \(\hat{\mathcal{P}}\)
 * Orchestrates the four epistemic curves into EPS
 * \(\hat{\mathcal{P}}: \mathcal{D}(t) \longrightarrow \mathrm{EPS}(t)\)
 */

import { computeSemanticDrift, detectInflectionPoints, cumulativeDrift } from './semanticDrift';
import { computeEpistemicEntropy, classifyConvergence, entropyDrop } from './epistemicEntropy';
import { computeAssumptionField, PRESUPPOSITION_MARKERS } from './assumptionField';
import { computeAffectiveCurve, classifyAffectiveRegime } from './affectiveDimension';

export interface DialogueTurn {
  role: 'user' | 'assistant';
  text: string;
  embedding?: number[];
}

export interface EPS {
  timestamp: number;
  curves: {
    semanticDrift: number[];
    epistemicEntropy: number[];
    assumptionField: number;
    affectiveDimension: number[];
  };
  metrics: {
    cumulativeDrift: number;
    finalEntropy: number;
    entropyDrop: number;
    inflectionPoints: number[];
    convergenceType: 'open_exploration' | 'organic_convergence' | 'forced_convergence';
    affectiveRegime: 'stable' | 'rising' | 'falling' | 'volatile';
  };
  raw: {
    assumptionGraph?: any;
    presuppositionCounts: number[];
  };
}

/**
 * Generate synthetic embeddings for testing (simplified)
 */
function generateSyntheticEmbedding(text: string, dimension: number = 64): number[] {
  // Simple hash-based embedding for deterministic testing
  const embedding: number[] = new Array(dimension).fill(0);
  let hash = 0;
  
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  
  for (let i = 0; i < dimension; i++) {
    embedding[i] = Math.sin(hash * (i + 1)) * 0.5 + 0.5;
  }
  
  return embedding;
}

/**
 * Main Projection Operator \(\hat{\mathcal{P}}\)
 */
export function projectDialogue(turns: DialogueTurn[]): EPS {
  const timestamp = Date.now();
  
  // Extract texts
  const texts = turns.map(t => t.text);
  
  // Generate embeddings if not provided
  const embeddings = turns.map(t => 
    t.embedding || generateSyntheticEmbedding(t.text, 64)
  );
  
  // 1. Semantic Drift Curve
  const embeddingVectors = embeddings.map(e => ({ values: e }));
  const drifts = computeSemanticDrift(embeddingVectors);
  const inflectionPoints = detectInflectionPoints(drifts);
  const cumulativeDriftValue = cumulativeDrift(drifts);
  
  // 2. Epistemic Entropy Curve
  const entropyValues = computeEpistemicEntropy(embeddings);
  const finalEntropy = entropyValues[entropyValues.length - 1] || 0;
  const entropyDropValue = entropyDrop(entropyValues);
  const convergenceType = classifyConvergence(entropyValues, drifts, inflectionPoints);
  
  // 3. Assumption Field
  const assumptionResult = computeAssumptionField(texts);
  const assumptionFieldValue = assumptionResult.field.reduce((sum, v) => sum + v, 0) / (assumptionResult.field.length || 1);
  
  // Count presuppositions per turn
  const presuppositionCounts = texts.map(text => {
    const lowerText = text.toLowerCase();
    let count = 0;
    for (const marker of PRESUPPOSITION_MARKERS) {
      if (lowerText.includes(marker.toLowerCase())) {
        count++;
      }
    }
    return count;
  });
  
  // 4. Affective Dimension Curve
  const affectiveValues = computeAffectiveCurve(texts);
  const affectiveRegime = classifyAffectiveRegime(affectiveValues);
  
  return {
    timestamp,
    curves: {
      semanticDrift: drifts,
      epistemicEntropy: entropyValues,
      assumptionField: assumptionFieldValue,
      affectiveDimension: affectiveValues
    },
    metrics: {
      cumulativeDrift: cumulativeDriftValue,
      finalEntropy,
      entropyDrop: entropyDropValue,
      inflectionPoints,
      convergenceType,
      affectiveRegime
    },
    raw: {
      assumptionGraph: assumptionResult.graph,
      presuppositionCounts
    }
  };
}

/**
 * Export EPS to JSON format (EntropyLab compatible)
 */
export function exportToJSON(eps: EPS, sessionId: string): object {
  return {
    entropylab: {
      schema_version: "2.0.0",
      project: "IKPS-CORE",
      module: "Epistemic Projection Operator",
      session_id: sessionId,
      timestamp: eps.timestamp
    },
    projection: {
      curves: eps.curves,
      metrics: eps.metrics,
      summary: {
        convergence_type: eps.metrics.convergenceType,
        affective_regime: eps.metrics.affectiveRegime,
        total_drift: eps.metrics.cumulativeDrift,
        final_entropy: eps.metrics.finalEntropy
      }
    }
  };
}
