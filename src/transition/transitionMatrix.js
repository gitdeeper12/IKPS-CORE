/**
 * Transition Operator System (TOS)
 * Probability/resistance/speed of transition from force i to force j
 */

class TransitionOperator {
  constructor() {
    // Base transition probabilities
    this.transitionMatrix = {
      ANALYTICAL: {
        EXPLORATORY: 0.25,
        AFFECTIVE: 0.10,
        PERSUASIVE: 0.35,
        SAME: 0.30
      },
      EXPLORATORY: {
        ANALYTICAL: 0.20,
        AFFECTIVE: 0.30,
        PERSUASIVE: 0.15,
        SAME: 0.35
      },
      AFFECTIVE: {
        ANALYTICAL: 0.10,
        EXPLORATORY: 0.25,
        PERSUASIVE: 0.35,
        SAME: 0.30
      },
      PERSUASIVE: {
        ANALYTICAL: 0.25,
        EXPLORATORY: 0.15,
        AFFECTIVE: 0.20,
        SAME: 0.40
      }
    };
    
    // Resistance factors (hysteresis)
    this.resistance = {
      ANALYTICAL: { EXPLORATORY: 0.3, AFFECTIVE: 0.5, PERSUASIVE: 0.2 },
      EXPLORATORY: { ANALYTICAL: 0.2, AFFECTIVE: 0.2, PERSUASIVE: 0.4 },
      AFFECTIVE: { ANALYTICAL: 0.4, EXPLORATORY: 0.2, PERSUASIVE: 0.2 },
      PERSUASIVE: { ANALYTICAL: 0.2, EXPLORATORY: 0.4, AFFECTIVE: 0.3 }
    };
    
    this.history = [];
    this.currentForce = "ANALYTICAL";
    this.persistence = 0;
  }
  
  getTransitionProbability(from, to) {
    if (from === to) return this.transitionMatrix[from].SAME;
    return this.transitionMatrix[from][to];
  }
  
  getResistance(from, to) {
    if (from === to) return 0;
    return this.resistance[from][to];
  }
  
  update(proposedForce, inputIntensity) {
    const from = this.currentForce;
    const to = proposedForce;
    
    // Base probability
    let prob = this.getTransitionProbability(from, to);
    
    // Adjust by resistance (persistence makes transitions harder)
    const resistance = this.getResistance(from, to);
    const persistenceFactor = Math.min(0.5, this.persistence * 0.1);
    prob = prob * (1 - resistance * persistenceFactor);
    
    // Adjust by input intensity (strong input makes transitions more likely)
    prob = prob * (1 + inputIntensity * 0.5);
    
    // Random decision with bias
    const random = Math.random();
    let transition;
    
    if (random < prob) {
      transition = true;
      this.persistence = 0; // Reset on transition
    } else {
      transition = false;
      this.persistence++;
    }
    
    const finalForce = transition ? to : from;
    this.currentForce = finalForce;
    this.history.push({ from, to, transition, prob, finalForce });
    
    return { finalForce, transition, probability: prob };
  }
  
  reset() {
    this.currentForce = "ANALYTICAL";
    this.persistence = 0;
    this.history = [];
  }
  
  getTransitionStats() {
    if (this.history.length === 0) return null;
    
    let transitions = 0;
    for (const h of this.history) {
      if (h.transition) transitions++;
    }
    
    return {
      totalTransitions: transitions,
      transitionRate: transitions / this.history.length,
      averageProbability: this.history.reduce((sum, h) => sum + h.probability, 0) / this.history.length
    };
  }
}

module.exports = { TransitionOperator };
