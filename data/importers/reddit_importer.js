/**
 * Reddit Data Importer
 * Imports real Reddit conversations for validation
 * Note: Requires Reddit API access or pre-downloaded datasets
 */

const fs = require('fs');
const path = require('path');

class RedditImporter {
  constructor(dataDir = './data/real/reddit') {
    this.dataDir = dataDir;
  }
  
  /**
   * Import Reddit JSON data
   * Expected format: array of objects with 'title', 'body', 'comments'
   */
  importFromJSON(filepath) {
    if (!fs.existsSync(filepath)) {
      console.error(`File not found: ${filepath}`);
      return [];
    }
    
    const raw = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(raw);
    
    return this.parseRedditData(data);
  }
  
  parseRedditData(data) {
    const conversations = [];
    
    for (const item of data) {
      const turns = [];
      
      // Add post title/body as first turn
      if (item.title) {
        turns.push({
          role: 'user',
          text: item.title,
          source: 'reddit_post'
        });
      }
      
      if (item.body) {
        turns.push({
          role: 'user',
          text: item.body,
          source: 'reddit_body'
        });
      }
      
      // Add comments as assistant turns
      if (item.comments && Array.isArray(item.comments)) {
        for (const comment of item.comments.slice(0, 10)) { // Limit to 10 comments
          turns.push({
            role: 'assistant',
            text: comment.body || comment,
            source: 'reddit_comment'
          });
        }
      }
      
      if (turns.length > 0) {
        conversations.push({
          id: item.id || `reddit_${Date.now()}_${conversations.length}`,
          source: 'reddit',
          turns: turns,
          metadata: {
            subreddit: item.subreddit || 'unknown',
            score: item.score || 0,
            date: item.created_utc || null
          }
        });
      }
    }
    
    return conversations;
  }
  
  /**
   * Import from sample file (for testing without real API)
   */
  importSample() {
    // Sample Reddit-like data for testing
    const sampleData = [
      {
        id: "reddit_sample_1",
        title: "The Jacobian matrix approach seems mathematically sound",
        body: "I've been studying the convergence guarantees and they appear robust.",
        subreddit: "MachineLearning",
        score: 42,
        comments: [
          { body: "But have you considered the non-linear case? The literature suggests limitations." },
          { body: "I'm genuinely concerned about practical implementation though." },
          { body: "The theoretical framework is solid. The evidence supports the conclusion." }
        ]
      },
      {
        id: "reddit_sample_2",
        title: "I'm really worried about the direction this field is taking",
        body: "The emotional toll of working in this environment is becoming unsustainable.",
        subreddit: "academia",
        score: 156,
        comments: [
          { body: "I understand your concern. Many of us feel the same pressure." },
          { body: "The data shows productivity actually increases with proper support systems." },
          { body: "We need to implement changes immediately to address this crisis." }
        ]
      },
      {
        id: "reddit_sample_3",
        title: "Perhaps we should reconsider our fundamental assumptions",
        body: "There might be alternative frameworks that better explain these observations.",
        subreddit: "PhilosophyofScience",
        score: 89,
        comments: [
          { body: "That's an interesting perspective. Could you elaborate?" },
          { body: "The current paradigm has served us well, but I'm open to exploration." },
          { body: "Evidence from multiple fields suggests we need a new approach." }
        ]
      }
    ];
    
    return this.parseRedditData(sampleData);
  }
  
  saveConversations(conversations, outputFile = './data/real/reddit_imported.json') {
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputFile, JSON.stringify(conversations, null, 2));
    console.log(`💾 Saved ${conversations.length} conversations to ${outputFile}`);
  }
}

module.exports = { RedditImporter };
