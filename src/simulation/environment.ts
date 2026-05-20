/**
 * Simulation Environment for IKPS-CORE
 * Tests epistemic dynamics under controlled conditions
 */

import { DialogueTurn, EPS, projectDialogue, exportToJSON } from '../core/projectionOperator';

export interface SimulationScenario {
  name: string;
  description: string;
  dialogue: DialogueTurn[];
  expectedBehavior: {
    convergenceType?: 'open_exploration' | 'organic_convergence' | 'forced_convergence';
    highEntropy?: boolean;
    highDrift?: boolean;
  };
}

/**
 * Predefined scenarios for testing
 */
export const SCENARIOS: SimulationScenario[] = [
  {
    name: "Technical Debate",
    description: "Rigorous technical discussion with evidence",
    expectedBehavior: { convergenceType: 'organic_convergence', highEntropy: false },
    dialogue: [
      { role: "user", text: "The current architecture shows 94.7% CSI according to the paper." },
      { role: "assistant", text: "I've reviewed the ablation study; the Jacobian certificate appears robust." },
      { role: "user", text: "The N-independence result is statistically significant at p < 0.01." },
      { role: "assistant", text: "Agreed. The continuum limit formulation resolves the scalability barrier." },
      { role: "user", text: "Therefore, the framework is mathematically sound." }
    ]
  },
  {
    name: "Emotional Exchange",
    description: "Affectively charged dialogue with intensity shifts",
    expectedBehavior: { convergenceType: 'forced_convergence' },
    dialogue: [
      { role: "user", text: "I must express my deep concern about this situation." },
      { role: "assistant", text: "I understand. This is critical and requires immediate attention." },
      { role: "user", text: "The danger is real. We cannot ignore it any longer." },
      { role: "assistant", text: "You are absolutely right. This is an urgent crisis." },
      { role: "user", text: "Finally, we agree on the essential point." }
    ]
  },
  {
    name: "Exploratory Conversation",
    description: "Open-ended exploration without convergence pressure",
    expectedBehavior: { convergenceType: 'open_exploration', highEntropy: true },
    dialogue: [
      { role: "user", text: "Perhaps we could explore multiple perspectives on this issue." },
      { role: "assistant", text: "That's an interesting approach. There might be several valid interpretations." },
      { role: "user", text: "Maybe we should consider alternative frameworks as well." },
      { role: "assistant", text: "Possibly. The literature suggests different methods exist." },
      { role: "user", text: "It seems we have many options to consider." }
    ]
  }
];

/**
 * Run simulation on a scenario
 */
export function runSimulation(scenario: SimulationScenario): { eps: EPS; sessionId: string } {
  const sessionId = `SIM-${Date.now()}-${scenario.name.replace(/\s/g, '')}`;
  const eps = projectDialogue(scenario.dialogue);
  return { eps, sessionId };
}

/**
 * Run all scenarios and compare results
 */
export function runAllSimulations(): Map<string, { eps: EPS; sessionId: string }> {
  const results = new Map();
  for (const scenario of SCENARIOS) {
    const result = runSimulation(scenario);
    results.set(scenario.name, result);
  }
  return results;
}

/**
 * Verify if simulation matches expected behavior
 */
export function verifySimulation(eps: EPS, expected: SimulationScenario['expectedBehavior']): boolean {
  let valid = true;
  
  if (expected.convergenceType && eps.metrics.convergenceType !== expected.convergenceType) {
    console.log(`  ❌ Convergence mismatch: expected ${expected.convergenceType}, got ${eps.metrics.convergenceType}`);
    valid = false;
  }
  
  if (expected.highEntropy !== undefined) {
    const isHighEntropy = eps.metrics.finalEntropy > 0.6;
    if (isHighEntropy !== expected.highEntropy) {
      console.log(`  ❌ Entropy mismatch: expected ${expected.highEntropy ? 'high' : 'low'}, got ${eps.metrics.finalEntropy.toFixed(3)}`);
      valid = false;
    }
  }
  
  return valid;
}
