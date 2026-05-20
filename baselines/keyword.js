/**
 * Keyword Baseline Classifier
 * Simple keyword-matching baseline for comparison
 */

class KeywordBaseline {
  constructor() {
    this.keywords = {
      ANALYTICAL: ['jacobian', 'eigenvalues', 'therefore', 'stability', 'convergence', 'system', 'model'],
      EXPLORATORY: ['perhaps', 'maybe', 'explore', 'could', 'might', 'alternative', 'perspective'],
      AFFECTIVE: ['worried', 'concern', 'frustrated', 'stress', 'anxiety', 'feel', 'danger'],
      PERSUASIVE: ['solution', 'implement', 'proven', 'effective', 'delivers', 'guaranteed', 'evidence']
    };
  }
  
  classify(text) {
    const lower = text.toLowerCase();
    const scores = {
      ANALYTICAL: 0,
      EXPLORATORY: 0,
      AFFECTIVE: 0,
      PERSUASIVE: 0
    };
    
    for (const [force, words] of Object.entries(this.keywords)) {
      for (const word of words) {
        if (lower.includes(word)) {
          scores[force] += 1;
        }
      }
    }
    
    let maxForce = "ANALYTICAL";
    let maxScore = scores.ANALYTICAL;
    for (const [force, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxForce = force;
      }
    }
    
    return maxForce;
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

module.exports = { KeywordBaseline };
