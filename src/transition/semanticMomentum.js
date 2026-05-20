/**
 * Semantic Momentum Engine (SME)
 * Tracks direction and acceleration of force changes
 * Enables prediction of transitions before they occur
 */

class SemanticMomentum {
  constructor() {
    this.velocity = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.acceleration = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.history = [];
  }
  
  update(forces) {
    const prevForces = this.history.length > 0 ? this.history[this.history.length - 1].forces : forces;
    
    // Calculate velocity (first derivative)
    const newVelocity = {};
    for (const [force, value] of Object.entries(forces)) {
      newVelocity[force] = value - prevForces[force];
    }
    
    // Calculate acceleration (second derivative)
    const newAcceleration = {};
    for (const [force, value] of Object.entries(newVelocity)) {
      newAcceleration[force] = value - this.velocity[force];
    }
    
    this.velocity = newVelocity;
    this.acceleration = newAcceleration;
    this.history.push({ forces, velocity: { ...this.velocity }, acceleration: { ...this.acceleration } });
    
    if (this.history.length > 20) this.history.shift();
    
    return { velocity: this.velocity, acceleration: this.acceleration };
  }
  
  predictDominant(forces) {
    // Predict next force based on momentum
    const predictions = {};
    for (const [force, value] of Object.entries(forces)) {
      // value + velocity + 0.5 * acceleration
      predictions[force] = value + this.velocity[force] + 0.5 * this.acceleration[force];
    }
    
    let predictedForce = "ANALYTICAL";
    let maxPrediction = predictions.ANALYTICAL;
    for (const [force, pred] of Object.entries(predictions)) {
      if (pred > maxPrediction) {
        maxPrediction = pred;
        predictedForce = force;
      }
    }
    
    return {
      predictedForce,
      confidence: Math.min(0.95, Math.max(0.05, maxPrediction - 0.3)),
      predictions
    };
  }
  
  isAcceleratingToward(force, threshold = 0.05) {
    return this.acceleration[force] > threshold;
  }
  
  getMomentumSignature() {
    const dominantVelocity = Object.entries(this.velocity).reduce((a, b) => Math.abs(a[1]) > Math.abs(b[1]) ? a : b);
    const dominantAcceleration = Object.entries(this.acceleration).reduce((a, b) => Math.abs(a[1]) > Math.abs(b[1]) ? a : b);
    
    return {
      dominantVelocity: { force: dominantVelocity[0], value: dominantVelocity[1] },
      dominantAcceleration: { force: dominantAcceleration[0], value: dominantAcceleration[1] },
      isTransitioning: Math.abs(dominantVelocity[1]) > 0.05
    };
  }
  
  reset() {
    this.velocity = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.acceleration = { ANALYTICAL: 0, EXPLORATORY: 0, AFFECTIVE: 0, PERSUASIVE: 0 };
    this.history = [];
  }
}

module.exports = { SemanticMomentum };
