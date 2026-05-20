/**
 * Pattern Baseline Classifier
 * Simple pattern-matching baseline for comparison
 */

class PatternBaseline {
  constructor() {
    this.patterns = {
      ANALYTICAL: /\b(therefore|consequently|thus|hence|because|since)\b/i,
      EXPLORATORY: /\b(perhaps|maybe|could|might|possibly|perhaps)\b/i,
      AFFECTIVE: /\b(worried|concern|frustrated|stress|anxiety|feel|danger)\b/i,
      PERSUASIVE: /\b(solution|implement|proven|effective|delivers|guaranteed)\b/i
    };
  }
  
  classify(text) {
    for (const [force, pattern] of Object.entries(this.patterns)) {
      if (pattern.test(text)) {
        return force;
      }
    }
    return "ANALYTICAL";
  }
  
  classifyDialogue(turns) {
    const predictions = turns.map(t => this.classify(t));
    const counts = {};
    for (const p of predictions) {
      counts[p] = (counts[p] || 0) + 1;
    }
    
    let dominant = "ANALYTICAL";
    let maxCount = 0;
    for (const [force, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        dominant = force;
      }
    }
    
    return { predictions, dominant, counts };
  }
}

module.exports = { PatternBaseline };
