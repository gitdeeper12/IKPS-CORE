/**
 * DSFT-TD v2 - Optimized for Early Detection
 * Lower inertia, higher sensitivity, residual tracking
 */

class DSFT_TD_V2 {
  constructor() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.residuals = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.history = [];
    
    // Optimized parameters for early detection
    this.alpha = 0.2;        // Lower inertia (was 0.3) - faster response
    this.gamma = 0.5;        // Higher momentum (was 0.4) - better trend detection
    this.residualDecay = 0.7; // Residual influence
    this.transitionThreshold = 0.35;  // Lower threshold for early detection
  }
  
  detectMarkers(text) {
    const lower = text.toLowerCase();
    let analytical = 0, exploratory = 0, affective = 0, persuasive = 0;
    
    // Enhanced marker detection with weights
    // Analytical markers
    if (lower.includes("jacobian") || lower.includes("eigenvalues")) analytical += 0.6;
    if (lower.includes("therefore") || lower.includes("consequently")) analytical += 0.5;
    if (lower.includes("stability") || lower.includes("convergence")) analytical += 0.4;
    if (lower.includes("system") || lower.includes("model") || lower.includes("data")) analytical += 0.3;
    if (lower.includes("must") || lower.includes("guarantee")) analytical += 0.4;
    if (lower.includes("logically") || lower.includes("mathematically")) analytical += 0.35;
    
    // Exploratory markers
    if (lower.includes("perhaps") || lower.includes("maybe")) exploratory += 0.6;
    if (lower.includes("explore") || lower.includes("interpretations")) exploratory += 0.5;
    if (lower.includes("interesting") || lower.includes("perspective")) exploratory += 0.4;
    if (lower.includes("could") || lower.includes("might")) exploratory += 0.4;
    if (lower.includes("alternative") || lower.includes("different")) exploratory += 0.35;
    if (lower.includes("possibility") || lower.includes("potential")) exploratory += 0.3;
    
    // Affective markers
    if (lower.includes("worried") || lower.includes("concern")) affective += 0.6;
    if (lower.includes("frustrated") || lower.includes("overwhelmed")) affective += 0.55;
    if (lower.includes("stress") || lower.includes("anxiety")) affective += 0.45;
    if (lower.includes("feel") || lower.includes("emotion")) affective += 0.35;
    if (lower.includes("danger") || lower.includes("crisis")) affective += 0.5;
    if (lower.includes("deeply") || lower.includes("genuinely")) affective += 0.4;
    
    // Persuasive markers
    if (lower.includes("solution") || lower.includes("implement")) persuasive += 0.5;
    if (lower.includes("proven") || lower.includes("effective")) persuasive += 0.5;
    if (lower.includes("delivers") || lower.includes("results")) persuasive += 0.45;
    if (lower.includes("approach") || lower.includes("methodology")) persuasive += 0.4;
    if (lower.includes("guaranteed") || lower.includes("customers")) persuasive += 0.5;
    if (lower.includes("evidence") || lower.includes("demonstrates")) persuasive += 0.45;
    
    return { analytical, exploratory, affective, persuasive };
  }
  
  updateForces(markers) {
    const oldForces = { ...this.forces };
    const newForces = {};
    
    for (const [force, value] of Object.entries(this.forces)) {
      let markerValue = 0;
      switch(force) {
        case 'ANALYTICAL': markerValue = markers.analytical; break;
        case 'EXPLORATORY': markerValue = markers.exploratory; break;
        case 'AFFECTIVE': markerValue = markers.affective; break;
        case 'PERSUASIVE': markerValue = markers.persuasive; break;
      }
      
      // Residual influence from previous force dominance
      let residualEffect = 0;
      for (const [resForce, resValue] of Object.entries(this.residuals)) {
        if (resForce !== force) {
          residualEffect += resValue * 0.15;
        }
      }
      
      // Core update with lower inertia
      let newValue = this.alpha * value + (1 - this.alpha) * markerValue + residualEffect;
      
      // Momentum from previous change
      if (this.history.length > 0) {
        const prevChange = this.history[this.history.length - 1].forces[force] - oldForces[force];
        newValue += this.gamma * prevChange;
      }
      
      // Clamp
      newForces[force] = Math.min(0.9, Math.max(0.05, newValue));
    }
    
    return newForces;
  }
  
  updateResiduals(newForces, oldDominant, newDominant) {
    // Update residuals - forces leave traces after dominance
    for (const [force, value] of Object.entries(newForces)) {
      if (force === oldDominant && force !== newDominant) {
        // Leaving force leaves a residual
        this.residuals[force] = Math.min(0.5, this.residuals[force] + 0.15);
      } else {
        // Decay residuals
        this.residuals[force] *= this.residualDecay;
      }
    }
  }
  
  getDominant(forces) {
    let max = "ANALYTICAL";
    let maxVal = forces.ANALYTICAL;
    if (forces.EXPLORATORY > maxVal) { maxVal = forces.EXPLORATORY; max = "EXPLORATORY"; }
    if (forces.AFFECTIVE > maxVal) { maxVal = forces.AFFECTIVE; max = "AFFECTIVE"; }
    if (forces.PERSUASIVE > maxVal) { maxVal = forces.PERSUASIVE; max = "PERSUASIVE"; }
    return max;
  }
  
  getPrecursorProbability(forceValues, targetForce) {
    if (forceValues.length < 3) return 0;
    
    // Get values for target force
    const targetHistory = forceValues.map(f => f[targetForce] || 0);
    const recent = targetHistory.slice(-5);
    const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
    
    // Check trend (increasing)
    let trend = 0;
    if (recent.length >= 2) {
      trend = (recent[recent.length - 1] - recent[0]) / recent.length;
    }
    
    // Higher probability if value is rising and approaching threshold
    let probability = mean + Math.max(0, trend) * 2;
    
    // Boost if residuals indicate emerging force
    if (this.residuals[targetForce] > 0.1) {
      probability += this.residuals[targetForce];
    }
    
    return Math.min(0.95, Math.max(0.05, probability));
  }
  
  processTurn(text) {
    // Detect markers
    const markers = this.detectMarkers(text);
    
    // Get old dominant
    const oldDominant = this.getDominant(this.forces);
    
    // Update forces
    const newForces = this.updateForces(markers);
    const newDominant = this.getDominant(newForces);
    
    // Update residuals
    this.updateResiduals(newForces, oldDominant, newDominant);
    
    // Store forces
    this.forces = newForces;
    
    // Calculate precursor probabilities
    const precursorProbs = {
      ANALYTICAL: this.getPrecursorProbability(this.history.concat([{ forces: this.forces }]), 'ANALYTICAL'),
      EXPLORATORY: this.getPrecursorProbability(this.history.concat([{ forces: this.forces }]), 'EXPLORATORY'),
      AFFECTIVE: this.getPrecursorProbability(this.history.concat([{ forces: this.forces }]), 'AFFECTIVE'),
      PERSUASIVE: this.getPrecursorProbability(this.history.concat([{ forces: this.forces }]), 'PERSUASIVE')
    };
    
    // Record history
    this.history.push({
      forces: { ...this.forces },
      markers,
      dominant: newDominant,
      residuals: { ...this.residuals },
      precursorProbs: { ...precursorProbs }
    });
    if (this.history.length > 50) this.history.shift();
    
    // Calculate turbulence
    let turbulence = 0;
    if (this.history.length > 1) {
      const prev = this.history[this.history.length - 2].forces;
      for (const [force, value] of Object.entries(this.forces)) {
        turbulence += Math.abs(value - prev[force]);
      }
    }
    
    // Detect transition
    const transition = (oldDominant !== newDominant);
    
    return {
      forces: this.forces,
      dominant: newDominant,
      transition,
      turbulence,
      residuals: { ...this.residuals },
      precursorProbs: { ...precursorProbs }
    };
  }
  
  reset() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.residuals = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.history = [];
  }
}

module.exports = { DSFT_TD_V2 };
