/**
 * Hysteresis System
 * Resists transitions based on persistence history
 * Real cognitive systems resist change and retain memory
 */

class HysteresisSystem {
  constructor() {
    this.persistence = {
      ANALYTICAL: 0,
      EXPLORATORY: 0,
      AFFECTIVE: 0,
      PERSUASIVE: 0
    };
    this.history = [];
    this.lambda = 0.15;  // Resistance coefficient
  }
  
  update(forces, dominantForce) {
    // Increment persistence for dominant force
    for (const [force, value] of Object.entries(this.persistence)) {
      if (force === dominantForce) {
        this.persistence[force] = Math.min(1.0, this.persistence[force] + 0.05);
      } else {
        this.persistence[force] = Math.max(0, this.persistence[force] - 0.02);
      }
    }
    
    // Calculate resistance factor
    const resistance = {};
    for (const [force, value] of Object.entries(forces)) {
      resistance[force] = 1 - this.lambda * this.persistence[force];
    }
    
    this.history.push({ forces, dominantForce, persistence: { ...this.persistence }, resistance: { ...resistance } });
    if (this.history.length > 20) this.history.shift();
    
    return resistance;
  }
  
  applyResistance(proposedForces) {
    const resisted = {};
    for (const [force, value] of Object.entries(proposedForces)) {
      const factor = 1 - this.lambda * this.persistence[force];
      resisted[force] = value * Math.max(0.5, Math.min(1.0, factor));
    }
    return resisted;
  }
  
  getPersistence() {
    return { ...this.persistence };
  }
  
  getDominantPersistence() {
    let dominant = "ANALYTICAL";
    let maxPersist = this.persistence.ANALYTICAL;
    for (const [force, persist] of Object.entries(this.persistence)) {
      if (persist > maxPersist) {
        maxPersist = persist;
        dominant = force;
      }
    }
    return { force: dominant, persistence: maxPersist };
  }
  
  wouldTransitionBeResistant(from, to) {
    // Higher persistence means higher resistance to change
    const resistance = this.lambda * this.persistence[from];
    return resistance > 0.3;
  }
  
  reset() {
    this.persistence = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.history = [];
  }
}

module.exports = { HysteresisSystem };
