/**
 * Assumption Field - Curve 3
 * Models accumulation and diffusion of unstated presuppositions
 * Observable: A(x,t) ∈ [0, 1]
 * Uses Graph Laplacian for discrete semantic space
 */

export interface AssumptionNode {
  id: string;
  value: number;           // Assumption strength at node
  type: string;            // Category of assumption
}

export interface GraphEdge {
  source: number;          // Index of source node
  target: number;          // Index of target node
  weight: number;          // Semantic similarity / interaction strength
}

export interface AssumptionGraph {
  nodes: AssumptionNode[];
  edges: GraphEdge[];
}

export interface AssumptionFieldConfig {
  diffusionCoefficient: number;  // D
  decayRate: number;              // γ
  injectionRate: number;          // η coefficient
  dt: number;                     // Time step for simulation
  steps: number;                  // Simulation steps per dialogue turn
}

const DEFAULT_CONFIG: AssumptionFieldConfig = {
  diffusionCoefficient: 0.3,
  decayRate: 0.05,
  injectionRate: 0.1,
  dt: 0.1,
  steps: 5
};

/**
 * Presupposition markers for injection detection
 */
export const PRESUPPOSITION_MARKERS: string[] = [
  "after", "since", "as agreed", "as mentioned", "obviously",
  "of course", "given that", "assuming", "clearly", "naturally"
];

/**
 * Detect assumption injection from text
 */
export function detectAssumptionInjection(text: string): number {
  const lowerText = text.toLowerCase();
  let count = 0;
  
  for (const marker of PRESUPPOSITION_MARKERS) {
    if (lowerText.includes(marker.toLowerCase())) {
      count++;
    }
  }
  
  // Normalize to [0, 1]
  return Math.min(1, count / 5);
}

/**
 * Compute graph Laplacian: L = D - A
 * where D is degree matrix, A is adjacency matrix
 */
export function computeGraphLaplacian(nodes: AssumptionNode[], edges: GraphEdge[]): number[][] {
  const n = nodes.length;
  
  // Initialize adjacency matrix
  const adjacency: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (const edge of edges) {
    adjacency[edge.source][edge.target] = edge.weight;
    adjacency[edge.target][edge.source] = edge.weight;
  }
  
  // Compute degree matrix
  const degree: number[] = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    degree[i] = adjacency[i].reduce((sum, w) => sum + w, 0);
  }
  
  // Laplacian: L = D - A
  const laplacian: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      laplacian[i][j] = (i === j ? degree[i] : 0) - adjacency[i][j];
    }
  }
  
  return laplacian;
}

/**
 * Apply Laplacian to field: (L·A)_i = Σ_j L_ij * A_j
 */
export function applyLaplacian(laplacian: number[][], field: number[]): number[] {
  const n = field.length;
  const result: number[] = Array(n).fill(0);
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result[i] += laplacian[i][j] * field[j];
    }
  }
  
  return result;
}

/**
 * Simulate assumption field evolution using reaction-diffusion
 * ∂A/∂t = D·∇²A - γ·A + η
 */
export function simulateAssumptionField(
  initialField: number[],
  injection: number[],
  laplacian: number[][],
  config: AssumptionFieldConfig = DEFAULT_CONFIG
): number[] {
  let field = [...initialField];
  const n = field.length;
  
  for (let step = 0; step < config.steps; step++) {
    // Diffusion: D·∇²A
    const laplacianApplied = applyLaplacian(laplacian, field);
    
    const newField: number[] = Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
      const diffusion = config.diffusionCoefficient * laplacianApplied[i];
      const decay = -config.decayRate * field[i];
      const injectionTerm = config.injectionRate * injection[i];
      
      newField[i] = field[i] + config.dt * (diffusion + decay + injectionTerm);
      newField[i] = Math.max(0, Math.min(1, newField[i])); // Clamp to [0,1]
    }
    
    field = newField;
  }
  
  return field;
}

/**
 * Build initial graph from entities
 */
export function buildAssumptionGraph(entities: string[], interactions: number[][]): AssumptionGraph {
  const nodes: AssumptionNode[] = entities.map((id, idx) => ({
    id,
    value: 0,
    type: 'entity'
  }));
  
  const edges: GraphEdge[] = [];
  for (let i = 0; i < interactions.length; i++) {
    for (let j = i + 1; j < interactions[i].length; j++) {
      if (interactions[i][j] > 0) {
        edges.push({
          source: i,
          target: j,
          weight: interactions[i][j]
        });
      }
    }
  }
  
  return { nodes, edges };
}

/**
 * Compute assumption field from dialogue
 */
export function computeAssumptionField(
  turns: string[],
  config: AssumptionFieldConfig = DEFAULT_CONFIG
): { field: number[]; graph: AssumptionGraph } {
  // Extract simple entities (unique words as proxy)
  const allWords = turns.flatMap(t => t.toLowerCase().split(/\s+/));
  const uniqueWords = [...new Set(allWords)];
  const entities = uniqueWords.slice(0, Math.min(20, uniqueWords.length));
  
  // Build simple interaction matrix (co-occurrence)
  const interactions: number[][] = Array(entities.length).fill(null).map(() => Array(entities.length).fill(0));
  for (const turn of turns) {
    const lowerTurn = turn.toLowerCase();
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        if (lowerTurn.includes(entities[i]) && lowerTurn.includes(entities[j])) {
          interactions[i][j] += 1;
          interactions[j][i] += 1;
        }
      }
    }
  }
  
  // Normalize interactions
  const maxInteraction = Math.max(...interactions.flat());
  if (maxInteraction > 0) {
    for (let i = 0; i < entities.length; i++) {
      for (let j = 0; j < entities.length; j++) {
        interactions[i][j] /= maxInteraction;
      }
    }
  }
  
  const graph = buildAssumptionGraph(entities, interactions);
  const laplacian = computeGraphLaplacian(graph.nodes, graph.edges);
  
  // Compute injection per turn
  const injectionsPerTurn = turns.map(t => detectAssumptionInjection(t));
  const cumulativeInjection: number[] = Array(entities.length).fill(0);
  
  // Distribute injection across entities
  for (const injection of injectionsPerTurn) {
    for (let i = 0; i < entities.length; i++) {
      cumulativeInjection[i] += injection / entities.length;
    }
  }
  
  const initialField = Array(entities.length).fill(0);
  const finalField = simulateAssumptionField(initialField, cumulativeInjection, laplacian, config);
  
  // Aggregate field to single value for curve
  const aggregatedValue = finalField.reduce((sum, v) => sum + v, 0) / (finalField.length || 1);
  
  return { field: finalField, graph };
}
