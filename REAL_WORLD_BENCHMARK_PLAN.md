# Real-World Benchmark Plan

## Objective
Validate DSFT-TD V2 on natural, uncurated dialogues to ensure generalizability beyond synthetic tests.

## Data Sources

| Source | Type | Size | Access |
|--------|------|------|--------|
| Reddit (r/changemyview) | Debate/persuasion | 1000 threads | Public API |
| Reddit (r/relationships) | Emotional/support | 500 threads | Public API |
| Reddit (r/askscience) | Technical/analytical | 500 threads | Public API |
| Reddit (r/philosophy) | Exploratory | 500 threads | Public API |
| ConvAI2 | Chatbot training | 1000 dialogues | Public |
| DailyDialog | Multi-purpose | 1000 dialogues | Public |

## Success Criteria

| Metric | Target |
|--------|--------|
| Transition detection | >70% |
| Early warning | 3-5 turns |
| False alarms | <10% |
| Long-form stability | No collapse over 50+ turns |

## Baseline Comparisons

| Baseline | Type |
|----------|------|
| TF-IDF + SVM | Static classifier |
| BERT-base | Transformer |
| LSTM (sequence) | Temporal |
| HMM | State transition |
| Sentiment drift | Simple temporal |

## Protocol

1. Extract dialogue turns from source
2. Run DSFT-TD V2 on each
3. Calculate metrics (dominance, transitions, latency)
4. Compare with baselines
5. Report results

## Timeline

| Phase | Duration | Output |
|-------|----------|--------|
| Data collection | 2 weeks | Raw dataset |
| Annotation (if needed) | 2 weeks | Labels |
| Evaluation | 1 week | Metrics |
| Analysis | 1 week | Report |

