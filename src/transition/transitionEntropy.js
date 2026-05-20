/**
 * Transition Entropy Layer (TEL)
 * Measures turbulence, semantic shock, and phase transition intensity
 * H_T = Σ|F_i(t) - F_i(t-1)|
 */

class TransitionEntropy {
  constructor() {
    this.history = [];
    this.thresholds = {
      low: 0.05,      // Stable system
      medium: 0.15,   // Natural transition
      high: 0.30      // Semantic rupture
    };
  }
  
  compute(forces, previousForces) {
    let turbulence = 0;
    for (const [force, value] of Object.entries(forces)) {
      turbulence += Math.abs(value - (previousForces?.[force] || 0.3));
    }
    
    const classification = this.classifyTurbulence(turbulence);
    this.history.push({ turbulence, classification, forces, timestamp: Date.now() });
    
    if (this.history.length > 20) this.history.shift();
    
    return { turbulence, classification };
  }
  
  classifyTurbulence(turbulence) {
    if (turbulence < this.thresholds.low) return "STABLE";
    if (turbulence < this.thresholds.medium) return "NATURAL_TRANSITION";
    if (turbulence < this.thresholds.high) return "PHASE_TRANSITION";
    return "SEMANTIC_RUPTURE";
  }
  
  getAverageTurbulence() {
    if (this.history.length === 0) return 0;
    return this.history.reduce((sum, h) => sum + h.turbulence, 0) / this.history.length;
  }
  
  detectShock() {
    if (this.history.length < 2) return false;
    const recent = this.history.slice(-2);
    return recent[1].turbulence - recent[0].turbulence > 0.15;
  }
  
  getEntropyProfile() {
    const stableCount = this.history.filter(h => h.classification === "STABLE").length;
    const transitionCount = this.history.filter(h => h.classification === "NATURAL_TRANSITION").length;
    const phaseCount = this.history.filter(h => h.classification === "PHASE_TRANSITION").length;
    const ruptureCount = this.history.filter(h => h.classification === "SEMANTIC_RUPTURE").length;
    
    return {
      stable: stableCount,
      naturalTransition: transitionCount,
      phaseTransition: phaseCount,
      semanticRupture: ruptureCount,
      dominant: this.history.length > 0 ? this.classifyTurbulence(this.getAverageTurbulence()) : "UNKNOWN"
    };
  }
  
  reset() {
    this.history = [];
  }
}

module.exports = { TransitionEntropy };
