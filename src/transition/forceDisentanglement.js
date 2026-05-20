/**
 * Force Disentanglement Layer (FDL)
 * Separates Structural Logic from Intentional Influence
 * Solves the PERSUASIVE ≈ ANALYTICAL problem
 */

class ForceDisentanglement {
  constructor() {
    // Markers with weighted contributions to multiple forces
    this.markerWeights = {
      // Analytical markers (structural logic)
      "jacobian": { STRUCTURAL: 0.8, PERSUASIVE: 0.1 },
      "therefore": { STRUCTURAL: 0.7, PERSUASIVE: 0.2 },
      "must": { STRUCTURAL: 0.6, PERSUASIVE: 0.3 },
      "guarantee": { STRUCTURAL: 0.5, PERSUASIVE: 0.4 },
      "system": { STRUCTURAL: 0.6, PERSUASIVE: 0.2 },
      "model": { STRUCTURAL: 0.6, PERSUASIVE: 0.2 },
      "data": { STRUCTURAL: 0.5, PERSUASIVE: 0.3 },
      
      // Persuasive markers (intentional influence)
      "prove": { STRUCTURAL: 0.3, PERSUASIVE: 0.6 },
      "customers": { STRUCTURAL: 0.1, PERSUASIVE: 0.8 },
      "results": { STRUCTURAL: 0.3, PERSUASIVE: 0.6 },
      "solution": { STRUCTURAL: 0.3, PERSUASIVE: 0.6 },
      "effective": { STRUCTURAL: 0.2, PERSUASIVE: 0.7 },
      "delivers": { STRUCTURAL: 0.1, PERSUASIVE: 0.8 },
      "approach": { STRUCTURAL: 0.4, PERSUASIVE: 0.5 }
    };
  }
  
  disentangle(text) {
    const lower = text.toLowerCase();
    let structural = 0;
    let intentional = 0;
    
    for (const [marker, weights] of Object.entries(this.markerWeights)) {
      if (lower.includes(marker)) {
        structural += weights.STRUCTURAL;
        intentional += weights.PERSUASIVE;
      }
    }
    
    // Normalize
    structural = Math.min(0.7, structural);
    intentional = Math.min(0.7, intentional);
    
    return {
      ANALYTICAL: structural,
      PERSUASIVE: intentional,
      // Other forces unaffected
      EXPLORATORY: 0,
      AFFECTIVE: 0
    };
  }
  
  // Compute disentangled force updates
  computeUpdates(text, currentForces) {
    const markers = this.disentangle(text);
    
    return {
      ANALYTICAL: currentForces.ANALYTICAL * 0.7 + markers.ANALYTICAL * 0.3,
      PERSUASIVE: currentForces.PERSUASIVE * 0.7 + markers.PERSUASIVE * 0.3,
      // Other forces unchanged
      EXPLORATORY: currentForces.EXPLORATORY,
      AFFECTIVE: currentForces.AFFECTIVE
    };
  }
  
  reset() {
    // No state to reset
  }
}

module.exports = { ForceDisentanglement };
