# Release Notes v2.1.0

## DSFT-TD: Dynamic Semantic Field Theory - Temporal Framework

### Release Date: May 20, 2026
### Status: Stable Research Core

---

## 🎯 What's New

### Core Improvements
- **Early Transition Detection:** 7 turns BEFORE dominance
- **Optimized Parameters:** α=0.2, γ=0.5 (faster response)
- **False Alarm Reduction:** 3.3% in controlled tests

### New Components
- **Reproducibility Pack:** Unified runner, config system, fixed seed
- **Baselines:** Keyword and pattern comparison
- **Real-Data Validation:** Reddit import and validation

### Documentation
- Complete theoretical framework
- Preprint-ready paper
- Evaluation protocol (falsification document)

---

## 📊 Performance Summary

| Metric | Value |
|--------|-------|
| Classification | 4/4 (controlled) |
| Early Detection | 7 turns BEFORE |
| False Alarms | 3.3% |
| Long-Form Stability | 40+ turns |

---

## 📁 Files

```

src/transition/
├── dsft_td_v2.js
├── transitionMatrix.js
├── semanticMomentum.js
├── transitionEntropy.js
├── hysteresis.js
├── forceDisentanglement.js
└── earlyPredictor.js

benchmarks/
├── runner.js
├── v2_complete_validation.js
├── transition_metrics/
├── drift_prediction/
└── long_form/

config/
└── benchmark.config.js

baselines/
├── keyword.js
└── pattern.js

validation/
├── real_data_validator.js
└── run_real_validation.js

```

---

## 🔧 Quick Commands

```bash
# Run all benchmarks
npm run benchmark:all

# Individual benchmarks
npm run benchmark:transitions
npm run benchmark:latency
npm run benchmark:drift
npm run benchmark:stability

# Real-data validation
npm run validate:real

# Verify reproducibility
npm run test:reproducibility
```

---

⚠️ Known Limitations

1. Synthetic data: Primary validation on controlled data
2. Real-data scale: Only 3 samples validated
3. Language: English only
4. Baseline: Simple classifiers only (no transformers)

---

🔮 Next (Phase 3 - External Evaluation)

· Real-data validation at scale
· Human annotation
· Transformer comparison
· Multilingual validation

---

📚 Documentation

· README.md
· CHANGELOG.md
· DSFT_PAPER_V2.md
· EVALUATION_PROTOCOL.md
· REPRODUCIBILITY.md

---

🏷️ Tags

stable-research-core v2.1.0 dsft-td temporal-semantic-dynamics

