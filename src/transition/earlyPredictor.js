/**
 * Early Transition Predictor (ETP)
 * Predicts next state: P(F_{t+1}|F_t, M_t, H_t)
 * Enables predictive semantics
 */

class EarlyTransitionPredictor {
  constructor() {
    this.history = [];
    this.confidenceThreshold = 0.6;
  }
  
  predict(currentForces, momentum, transitionEntropy, hysteresis) {
    const predictions = {};
    const confidence = {};
    
    // Base prediction from momentum
    const momentumSignature = momentum.getMomentumSignature();
    const basePrediction = momentumSignature.dominantVelocity.force;
    let baseConfidence = Math.abs(momentumSignature.dominantVelocity.value) * 2;
    
    // Adjust by transition entropy
    const avgTurbulence = transitionEntropy.getAverageTurbulence();
    if (avgTurbulence > 0.15) {
      baseConfidence *= 0.7;  // High turbulence reduces prediction confidence
    }
    
    // Adjust by hysteresis resistance
    const persistence = hysteresis.getPersistence();
    const resistanceFactor = 1 - persistence[basePrediction] * 0.3;
    baseConfidence *= resistanceFactor;
    
    // Adjust by current force value
    const currentValue = currentForces[basePrediction];
    if (currentValue > 0.7) {
      baseConfidence *= 1.2;  // Strong current force = more likely to stay
    }
    
    // Final confidence clamped
    const finalConfidence = Math.min(0.95, Math.max(0.05, baseConfidence));
    
    // Generate alternative predictions
    const alternatives = [];
    for (const [force, value] of Object.entries(currentForces)) {
      if (force !== basePrediction && value > 0.4) {
        alternatives.push({ force, likelihood: value });
      }
    }
    
    return {
      predictedForce: basePrediction,
      confidence: finalConfidence,
      isConfident: finalConfidence > this.confidenceThreshold,
      alternatives: alternatives.sort((a, b) => b.likelihood - a.likelihood),
      willTransition: momentumSignature.isTransitioning
    };
  }
  
  recordActual(actualForce, prediction) {
    this.history.push({
      actual: actualForce,
      predicted: prediction.predictedForce,
      confidence: prediction.confidence,
      wasCorrect: actualForce === prediction.predictedForce,
      timestamp: Date.now()
    });
    
    if (this.history.length > 50) this.history.shift();
  }
  
  getAccuracy() {
    if (this.history.length === 0) return 0;
    const correct = this.history.filter(h => h.wasCorrect).length;
    return correct / this.history.length;
  }
  
  getConfidenceCalibration() {
    if (this.history.length === 0) return null;
    
    const highConfCorrect = this.history.filter(h => h.confidence > 0.7 && h.wasCorrect).length;
    const highConfTotal = this.history.filter(h => h.confidence > 0.7).length;
    
    return {
      highConfidenceAccuracy: highConfTotal > 0 ? highConfCorrect / highConfTotal : 0,
      averageConfidence: this.history.reduce((sum, h) => sum + h.confidence, 0) / this.history.length
    };
  }
  
  reset() {
    this.history = [];
  }
}

module.exports = { EarlyTransitionPredictor };
