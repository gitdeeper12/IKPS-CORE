/**
 * DSFT-TD: Dynamic Semantic Field Theory - Transition Dynamics
 * Integrates all components: TOS, SME, TEL, Hysteresis, FDL, ETP
 * 
 * Core equation:
 * F_i(t+1) = αF_i(t) + βΣC_ijF_j(t) + γM_i(t) - λR_i(t) + ε_i(t)
 */

const { TransitionOperator } = require('./transitionMatrix');
const { SemanticMomentum } = require('./semanticMomentum');
const { TransitionEntropy } = require('./transitionEntropy');
const { HysteresisSystem } = require('./hysteresis');
const { ForceDisentanglement } = require('./forceDisentanglement');
const { EarlyTransitionPredictor } = require('./earlyPredictor');

class DSFT_TD {
  constructor() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.transitionOp = new TransitionOperator();
    this.momentum = new SemanticMomentum();
    this.transitionEntropy = new TransitionEntropy();
    this.hysteresis = new HysteresisSystem();
    this.disentanglement = new ForceDisentanglement();
    this.predictor = new EarlyTransitionPredictor();
    
    // Core parameters
    this.alpha = 0.6;  // Inertia
    this.beta = 0.25;   // Coupling
    this.gamma = 0.15;  // Momentum
    this.lambda = 0.10;  // Hysteresis resistance
  }
  
  detectMarkers(text) {
    const lower = text.toLowerCase();
    let analytical = 0, exploratory = 0, affective = 0, persuasive = 0;
    
    // Analytical
    if (lower.includes("jacobian") || lower.includes("therefore") || lower.includes("must")) analytical += 0.25;
    if (lower.includes("system") || lower.includes("model") || lower.includes("data")) analytical += 0.15;
    
    // Exploratory
    if (lower.includes("perhaps") || lower.includes("maybe") || lower.includes("could")) exploratory += 0.25;
    if (lower.includes("explore") || lower.includes("interesting") || lower.includes("perspective")) exploratory += 0.15;
    
    // Affective
    if (lower.includes("worried") || lower.includes("concern") || lower.includes("frustrated")) affective += 0.25;
    if (lower.includes("stress") || lower.includes("overwhelmed") || lower.includes("difficult")) affective += 0.15;
    
    // Persuasive (using disentanglement)
    const disentangled = this.disentanglement.disentangle(text);
    persuasive = disentangled.PERSUASIVE;
    analytical += disentangled.ANALYTICAL;
    
    return { analytical, exploratory, affective, persuasive };
  }
  
  processTurn(text) {
    // Step 1: Detect input markers
    const markers = this.detectMarkers(text);
    
    // Step 2: Calculate coupling effect
    const coupling = {
      ANALYTICAL: -0.15 * this.forces.EXPLORATORY - 0.10 * this.forces.AFFECTIVE + 0.12 * this.forces.PERSUASIVE,
      EXPLORATORY: -0.12 * this.forces.ANALYTICAL + 0.18 * this.forces.AFFECTIVE - 0.08 * this.forces.PERSUASIVE,
      AFFECTIVE: -0.08 * this.forces.ANALYTICAL + 0.15 * this.forces.EXPLORATORY + 0.10 * this.forces.PERSUASIVE,
      PERSUASIVE: 0.10 * this.forces.ANALYTICAL - 0.05 * this.forces.EXPLORATORY + 0.08 * this.forces.AFFECTIVE
    };
    
    // Step 3: Update momentum
    const momentumUpdate = this.momentum.update(this.forces);
    
    // Step 4: Calculate hysteresis resistance
    const dominantForce = this.getDominant();
    const resistance = this.hysteresis.update(this.forces, dominantForce);
    
    // Step 5: Core update equation
    const newForces = {};
    for (const [force, value] of Object.entries(this.forces)) {
      newForces[force] = 
        this.alpha * value +
        this.beta * coupling[force] +
        this.gamma * momentumUpdate.velocity[force] +
        markers[force] -
        this.lambda * (1 - resistance[force]);
      
      // Clamp
      newForces[force] = Math.min(0.9, Math.max(0.1, newForces[force]));
    }
    
    // Step 6: Apply transition operator
    const proposedForce = this.getDominantFromForces(newForces);
    const transitionResult = this.transitionOp.update(proposedForce, markers[proposedForce] || 0.3);
    
    // Step 7: Finalize forces
    for (const [force, value] of Object.entries(newForces)) {
      this.forces[force] = value;
    }
    
    // Step 8: Update transition entropy
    const turbulence = this.transitionEntropy.compute(this.forces, newForces);
    
    // Step 9: Early prediction for next step
    const prediction = this.predictor.predict(this.forces, this.momentum, this.transitionEntropy, this.hysteresis);
    
    // Step 10: Record actual
    this.predictor.recordActual(this.getDominant(), prediction);
    
    return {
      forces: this.forces,
      dominant: this.getDominant(),
      momentum: momentumUpdate,
      turbulence: turbulence.turbulence,
      transition: transitionResult,
      prediction
    };
  }
  
  getDominant() {
    let max = "ANALYTICAL";
    let maxVal = this.forces.ANALYTICAL;
    if (this.forces.EXPLORATORY > maxVal) { maxVal = this.forces.EXPLORATORY; max = "EXPLORATORY"; }
    if (this.forces.AFFECTIVE > maxVal) { maxVal = this.forces.AFFECTIVE; max = "AFFECTIVE"; }
    if (this.forces.PERSUASIVE > maxVal) { maxVal = this.forces.PERSUASIVE; max = "PERSUASIVE"; }
    return max;
  }
  
  getDominantFromForces(forces) {
    let max = "ANALYTICAL";
    let maxVal = forces.ANALYTICAL;
    if (forces.EXPLORATORY > maxVal) { maxVal = forces.EXPLORATORY; max = "EXPLORATORY"; }
    if (forces.AFFECTIVE > maxVal) { maxVal = forces.AFFECTIVE; max = "AFFECTIVE"; }
    if (forces.PERSUASIVE > maxVal) { maxVal = forces.PERSUASIVE; max = "PERSUASIVE"; }
    return max;
  }
  
  getTransitionStats() {
    return this.transitionOp.getTransitionStats();
  }
  
  getPredictionAccuracy() {
    return this.predictor.getAccuracy();
  }
  
  reset() {
    this.forces = { ANALYTICAL: 0.3, EXPLORATORY: 0.3, AFFECTIVE: 0.3, PERSUASIVE: 0.3 };
    this.transitionOp.reset();
    this.momentum.reset();
    this.transitionEntropy.reset();
    this.hysteresis.reset();
    this.disentanglement.reset();
    this.predictor.reset();
  }
}

module.exports = { DSFT_TD };
