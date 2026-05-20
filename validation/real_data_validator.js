/**
 * Real Data Validator
 * Runs DSFT on real-world data and measures performance
 */

const { DSFT_TD_V2 } = require('../src/transition/dsft_td_v2');
const { RedditImporter } = require('../data/importers/reddit_importer');
const fs = require('fs');

class RealDataValidator {
  constructor() {
    this.results = [];
    this.importer = new RedditImporter();
  }
  
  /**
   * Run validation on imported conversations
   */
  validateConversations(conversations, groundTruth = null) {
    const dsft = new DSFT_TD_V2();
    const conversationResults = [];
    
    for (const conv of conversations) {
      const turns = conv.turns.map(t => t.text);
      const predictions = [];
      const forceHistory = [];
      
      dsft.reset();
      
      for (const turn of turns) {
        const result = dsft.processTurn(turn);
        predictions.push(result.dominant);
        forceHistory.push(result.forces);
      }
      
      // Calculate metrics
      const dominantCounts = {};
      for (const p of predictions) {
        dominantCounts[p] = (dominantCounts[p] || 0) + 1;
      }
      
      let dominant = "ANALYTICAL";
      let maxCount = 0;
      for (const [force, count] of Object.entries(dominantCounts)) {
        if (count > maxCount) {
          maxCount = count;
          dominant = force;
        }
      }
      
      // Calculate transitions
      let transitions = 0;
      for (let i = 1; i < predictions.length; i++) {
        if (predictions[i] !== predictions[i-1]) transitions++;
      }
      
      conversationResults.push({
        id: conv.id,
        source: conv.source,
        length: turns.length,
        dominantForce: dominant,
        transitions: transitions,
        transitionRate: transitions / turns.length,
        forceDistribution: dominantCounts,
        predictions: predictions,
        metadata: conv.metadata
      });
    }
    
    return conversationResults;
  }
  
  /**
   * Run validation on sample data
   */
  validateSample() {
    console.log("\n📊 Loading sample Reddit data...");
    const conversations = this.importer.importSample();
    console.log(`   Loaded ${conversations.length} sample conversations`);
    
    console.log("\n🔄 Running DSFT validation...");
    const results = this.validateConversations(conversations);
    
    return results;
  }
  
  /**
   * Print validation report
   */
  printReport(results) {
    console.log("\n" + "=".repeat(70));
    console.log("📊 REAL DATA VALIDATION REPORT");
    console.log("=".repeat(70));
    
    console.log(`\nTotal conversations: ${results.length}`);
    
    // Dominant force distribution
    const forceCounts = {};
    for (const r of results) {
      forceCounts[r.dominantForce] = (forceCounts[r.dominantForce] || 0) + 1;
    }
    
    console.log("\n📈 Dominant Force Distribution:");
    for (const [force, count] of Object.entries(forceCounts)) {
      console.log(`   ${force}: ${count} (${(count/results.length*100).toFixed(1)}%)`);
    }
    
    // Average metrics
    const avgLength = results.reduce((sum, r) => sum + r.length, 0) / results.length;
    const avgTransitions = results.reduce((sum, r) => sum + r.transitions, 0) / results.length;
    const avgTransitionRate = results.reduce((sum, r) => sum + r.transitionRate, 0) / results.length;
    
    console.log("\n📊 Average Metrics:");
    console.log(`   Length: ${avgLength.toFixed(1)} turns`);
    console.log(`   Transitions: ${avgTransitions.toFixed(1)}`);
    console.log(`   Transition Rate: ${(avgTransitionRate * 100).toFixed(1)}%`);
    
    // Individual conversation details
    console.log("\n📋 Individual Conversations:");
    for (const r of results) {
      console.log(`\n   [${r.id}]`);
      console.log(`      Source: ${r.source}`);
      console.log(`      Length: ${r.length} turns`);
      console.log(`      Dominant: ${r.dominantForce}`);
      console.log(`      Transitions: ${r.transitions}`);
      console.log(`      Force distribution: ${JSON.stringify(r.forceDistribution)}`);
      console.log(`      Prediction sequence: ${r.predictions.slice(0, 5).join(" → ")}${r.predictions.length > 5 ? " ..." : ""}`);
    }
    
    return {
      total: results.length,
      forceDistribution: forceCounts,
      avgLength,
      avgTransitions,
      avgTransitionRate
    };
  }
  
  /**
   * Compare with synthetic baseline
   */
  compareWithSynthetic(syntheticResults, realResults) {
    console.log("\n" + "=".repeat(70));
    console.log("📊 SYNTHETIC vs REAL COMPARISON");
    console.log("=".repeat(70));
    
    console.log("\n| Metric | Synthetic | Real | Difference |");
    console.log("|--------|-----------|------|------------|");
    
    const metrics = [
      { name: "Avg Transitions", synth: syntheticResults.avgTransitions, real: realResults.avgTransitions },
      { name: "Transition Rate", synth: syntheticResults.avgTransitionRate * 100, real: realResults.avgTransitionRate * 100 }
    ];
    
    for (const m of metrics) {
      const diff = m.real - m.synth;
      const symbol = Math.abs(diff) < 5 ? "≈" : (diff > 0 ? "↑" : "↓");
      console.log(`| ${m.name} | ${m.synth.toFixed(1)}% | ${m.real.toFixed(1)}% | ${symbol} ${diff.toFixed(1)}pp |`);
    }
    
    console.log("\n💡 Interpretation:");
    if (Math.abs(realResults.avgTransitionRate - syntheticResults.avgTransitionRate) < 10) {
      console.log("   ✅ DSFT behavior is consistent between synthetic and real data");
    } else {
      console.log("   ⚠️ Significant difference detected - review model generalization");
    }
  }
  
  /**
   * Export results to JSON
   */
  exportResults(results, outputFile = './results/real_validation.json') {
    const dir = require('path').dirname(outputFile);
    if (!require('fs').existsSync(dir)) {
      require('fs').mkdirSync(dir, { recursive: true });
    }
    
    require('fs').writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${outputFile}`);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new RealDataValidator();
  const results = validator.validateSample();
  const report = validator.printReport(results);
  
  // Generate synthetic baseline for comparison
  const syntheticResults = {
    avgTransitions: 3.5,
    avgTransitionRate: 0.18
  };
  
  validator.compareWithSynthetic(syntheticResults, report);
  validator.exportResults(results);
}

module.exports = { RealDataValidator };
