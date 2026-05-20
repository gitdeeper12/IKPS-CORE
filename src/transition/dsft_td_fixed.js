/**
 * DSFT-TD FIXED: Dynamic Semantic Field Theory - Transition Dynamics
 * Lower inertia, higher transition probabilities
 */

class DSFT_TD_FIXED {
  constructor() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.history = [];
    
    // FIXED: Much lower inertia for faster transitions
    this.alpha = 0.3;  // was 0.6
    
    // FIXED: Higher momentum gain
    this.gamma = 0.4;  // was 0.15
    
    // FIXED: Lower threshold for transitions
    this.transitionThreshold = 0.1;
    
    // Force persistence tracking
    this.persistence = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
  }
  
  detectMarkers(text) {
    const lower = text.toLowerCase();
    let analytical = 0, exploratory = 0, affective = 0, persuasive = 0;
    
    // FIXED: Higher marker intensities
    // Analytical markers
    if (lower.includes("jacobian") || lower.includes("eigenvalues")) analytical += 0.5;
    if (lower.includes("therefore") || lower.includes("consequently")) analytical += 0.4;
    if (lower.includes("stability") || lower.includes("convergence")) analytical += 0.3;
    if (lower.includes("system") || lower.includes("model") || lower.includes("data")) analytical += 0.2;
    if (lower.includes("must") || lower.includes("guarantee")) analytical += 0.3;
    
    // Exploratory markers
    if (lower.includes("perhaps") || lower.includes("maybe")) exploratory += 0.5;
    if (lower.includes("explore") || lower.includes("interpretations")) exploratory += 0.4;
    if (lower.includes("interesting") || lower.includes("perspective")) exploratory += 0.3;
    if (lower.includes("could") || lower.includes("might")) exploratory += 0.3;
    if (lower.includes("alternative") || lower.includes("different")) exploratory += 0.2;
    
    // Affective markers
    if (lower.includes("worried") || lower.includes("concern")) affective += 0.5;
    if (lower.includes("frustrated") || lower.includes("overwhelmed")) affective += 0.4;
    if (lower.includes("stress") || lower.includes("anxiety")) affective += 0.3;
    if (lower.includes("feel") || lower.includes("emotion")) affective += 0.2;
    if (lower.includes("danger") || lower.includes("crisis")) affective += 0.4;
    
    // Persuasive markers
    if (lower.includes("solution") || lower.includes("implement")) persuasive += 0.4;
    if (lower.includes("proven") || lower.includes("effective")) persuasive += 0.4;
    if (lower.includes("delivers") || lower.includes("results")) persuasive += 0.3;
    if (lower.includes("approach") || lower.includes("methodology")) persuasive += 0.3;
    if (lower.includes("guaranteed") || lower.includes("customers")) persuasive += 0.4;
    
    return { analytical, exploratory, affective, persuasive };
  }
  
  updateForces(markers) {
    const oldForces = { ...this.forces };
    const newForces = {};
    
    // FIXED: Much lower inertia (30% memory, 70% new input)
    for (const [force, value] of Object.entries(this.forces)) {
      let markerValue = 0;
      switch(force) {
        case 'ANALYTICAL': markerValue = markers.analytical; break;
        case 'EXPLORATORY': markerValue = markers.exploratory; break;
        case 'AFFECTIVE': markerValue = markers.affective; break;
        case 'PERSUASIVE': markerValue = markers.persuasive; break;
      }
      
      // Core update: 30% inertia + 70% input + momentum
      let newValue = this.alpha * value + (1 - this.alpha) * markerValue;
      
      // Add momentum from previous change
      if (this.history.length > 0) {
        const prevChange = this.history[this.history.length - 1].forces[force] - oldForces[force];
        newValue += this.gamma * prevChange;
      }
      
      // Clamp
      newForces[force] = Math.min(0.9, Math.max(0.1, newValue));
    }
    
    return newForces;
  }
  
  getDominant(forces) {
    let max = "ANALYTICAL";
    let maxVal = forces.ANALYTICAL;
    if (forces.EXPLORATORY > maxVal) { maxVal = forces.EXPLORATORY; max = "EXPLORATORY"; }
    if (forces.AFFECTIVE > maxVal) { maxVal = forces.AFFECTIVE; max = "AFFECTIVE"; }
    if (forces.PERSUASIVE > maxVal) { maxVal = forces.PERSUASIVE; max = "PERSUASIVE"; }
    return max;
  }
  
  processTurn(text) {
    // Detect markers
    const markers = this.detectMarkers(text);
    
    // Update forces
    const newForces = this.updateForces(markers);
    
    // Get dominant force before and after
    const oldDominant = this.getDominant(this.forces);
    const newDominant = this.getDominant(newForces);
    
    // Store forces
    this.forces = newForces;
    
    // Record history
    this.history.push({
      forces: { ...this.forces },
      markers,
      dominant: newDominant
    });
    if (this.history.length > 50) this.history.shift();
    
    // Update persistence
    for (const [force, value] of Object.entries(this.persistence)) {
      if (force === newDominant) {
        this.persistence[force] = Math.min(1.0, this.persistence[force] + 0.1);
      } else {
        this.persistence[force] = Math.max(0, this.persistence[force] - 0.05);
      }
    }
    
    // Calculate turbulence (how much forces changed)
    let turbulence = 0;
    if (this.history.length > 1) {
      const prev = this.history[this.history.length - 2].forces;
      for (const [force, value] of Object.entries(this.forces)) {
        turbulence += Math.abs(value - prev[force]);
      }
    }
    
    // Detect if transition occurred
    const transition = (oldDominant !== newDominant);
    
    return {
      forces: this.forces,
      dominant: newDominant,
      transition,
      turbulence,
      persistence: { ...this.persistence }
    };
  }
  
  processDialogue(turns) {
    const results = [];
    for (const turn of turns) {
      results.push(this.processTurn(turn));
    }
    return results;
  }
  
  reset() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.history = [];
    this.persistence = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
  }
}

module.exports = { DSFT_TD_FIXED };
