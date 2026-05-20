
# 🧠 DSFT-TD V2.1: Dynamic Semantic Field Theory

## Temporal Framework for Semantic Force Dynamics in Dialogue Systems

---

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-crimson.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](CHANGELOG.md)
[![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-Stable_Research_Core-brightgreen.svg)]()

<!-- New Badges -->
[![OSF Preregistration](https://img.shields.io/badge/OSF-Pregistered-blue?logo=osf&logoColor=white)](https://osf.io/muwt4)
[![PyPI](https://img.shields.io/pypi/v/ikps-core?logo=pypi&logoColor=white)](https://pypi.org/project/ikps-core/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20303214.svg)](https://doi.org/10.5281/zenodo.20303214)

</div>

---

> *"Meaning is not a point in space. It is the dynamics of interaction between opposing forces."*

> *"The observer is not neutral — it actively modifies the field it measures."*

---

## 📖 Overview

**DSFT-TD V2.1** (Dynamic Semantic Field Theory - Temporal Dynamics) is a temporal framework for modeling semantic dynamics as interacting forces rather than static classifications. Unlike traditional NLP classifiers that assign single labels to text, DSFT treats dialogue as a field of four interacting semantic forces.

The semantic forces introduced in DSFT are **operational modeling constructs** rather than claims about biological cognition.

### Key Capabilities (Controlled Conditions)

| Capability | Performance |
|------------|-------------|
| **Force Classification** | 4/4 (within benchmark) |
| **Early Transition Detection** | 7 turns BEFORE dominance |
| **False Alarm Rate** | 3.3% |
| **Long-Form Stability** | 40+ turns without collapse |
| **Observer Modes** | 4 (configurable) |

---

## 🧠 The Four Semantic Forces (Operational Constructs)

| Force | Symbol | Description |
|-------|--------|-------------|
| **Analytical Pressure** | \(F_A\) | Logical reasoning, deductive structure |
| **Exploratory Expansion** | \(F_E\) | Open-ended exploration, possibility |
| **Affective Resonance** | \(F_R\) | Emotional valence, concern, urgency |
| **Persuasive Drift** | \(F_P\) | Rhetorical influence, directed conclusion |

*These are operational modeling constructs for analyzing dialogue dynamics, not claims about human cognition.*

---

## 🏗️ Architecture

```

┌─────────────────────────────────────────────────────────┐
│              Marker Detection Layer                     │
│  Extract semantic markers for each force                │
└─────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│         Force Dynamics Engine                           │
│  F_i(t+1) = αF_i(t) + βΣC_ijF_j(t) + γM_i(t) - λR_i(t) │
│  • Inertia (α=0.2) • Momentum (γ=0.5) • Coupling (β=0.25)│
└─────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│         Precursor Detection                             │
│  Early warning before dominance shift (7 turns)         │
└─────────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────┐
│         Observer Layer (Optional)                       │
│  • Passive • Active • Reflexive • Meta                  │
└─────────────────────────────────────────────────────────┘

```

---

## 📐 Core Equation

\[
F_i(t+1) = \alpha F_i(t) + \beta \sum_j C_{ij}F_j(t) + \gamma M_i(t) - \lambda R_i(t) + \varepsilon_i(t)
\]

| Parameter | Value | Role |
|-----------|-------|------|
| \(\alpha\) | 0.2 | Inertia (memory of past) |
| \(\beta\) | 0.25 | Coupling strength |
| \(\gamma\) | 0.5 | Momentum coefficient |
| \(\lambda\) | 0.1 | Hysteresis resistance |

---

## 📊 Key Results (Controlled Benchmark)

### Transition Detection

| Transition | Latency |
|------------|---------|
| Analytical → Affective | 7 turns BEFORE |
| Analytical → Persuasive | 7 turns BEFORE |
| Affective → Persuasive | 7 turns BEFORE |
| Persuasive → Exploratory | 7 turns BEFORE |
| Exploratory → Analytical | 7 turns BEFORE |

**Average Latency:** 7.0 turns before dominance (controlled conditions)

### Stability Metrics

| Test | Result |
|------|--------|
| Stable Technical (20 turns) | 90% ANALYTICAL, 4 transitions |
| Chaotic Oscillation (30 turns) | 86.2% change rate, no collapse |
| Semantic Drift (40 turns) | 1 transition, stable |
| False Alarm Rate | 3.3% (within test environment) |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gitdeeper12/IKPS-CORE.git
cd IKPS-CORE

# Install dependencies
npm install

# Run all benchmarks (unified runner)
npm run benchmark:all

# Run individual benchmarks
npm run benchmark:transitions
npm run benchmark:latency
npm run benchmark:drift
npm run benchmark:stability

# Run real-world validation
npm run validate:real

# Verify reproducibility
npm run test:reproducibility
```

---

📁 Project Structure

```
IKPS-CORE/
├── README.md                       # This file
├── DSFT_PAPER_V2.md                # Minimal formal paper (preprint-ready)
├── CHANGELOG.md                    # Version history
├── REPRODUCIBILITY.md              # Reproduction guide
├── REAL_WORLD_BENCHMARK_PLAN.md    # Validation roadmap
│
├── config/
│   └── benchmark.config.js         # Centralized configuration
│
├── src/transition/
│   ├── dsft_td_v2.js              # Core DSFT-TD V2 engine
│   ├── transitionMatrix.js        # Transition operator
│   ├── semanticMomentum.js        # Momentum tracking
│   ├── transitionEntropy.js       # Turbulence measurement
│   ├── hysteresis.js              # Resistance system
│   ├── forceDisentanglement.js    # Marker disentanglement
│   └── earlyPredictor.js          # Precursor detection
│
├── benchmarks/
│   ├── runner.js                  # Unified benchmark runner
│   ├── v2_complete_validation.js  # Full validation suite
│   ├── long_form/                 # Extended dialogue tests
│   ├── drift_prediction/          # Early detection tests
│   └── transition_metrics/        # Latency measurement
│
├── baselines/
│   ├── keyword.js                 # Keyword baseline
│   └── pattern.js                 # Pattern baseline
│
├── validation/
│   ├── real_data_validator.js     # Real data validation
│   └── run_real_validation.js     # Validation runner
│
├── data/
│   └── importers/
│       └── reddit_importer.js     # Reddit data import
│
├── scripts/
│   ├── run_all_benchmarks.sh      # Run all benchmarks
│   └── verify_reproducibility.sh  # Verify reproducibility
│
└── docs/
    └── THEORETICAL_FRAMEWORK.md   # Complete theory
```

---

📊 Observer Modes

Mode Effect Deviation
PASSIVE No effect 0.0000
ACTIVE Amplifies dominant forces 0.0669
REFLEXIVE Boosts weak signals 0.0000
META Recursive observation 0.0199

Key finding: Observer configuration alters measurement weighting and field response. This is a configurable architectural choice, not a claim about quantum measurement or consciousness.

---

📈 Comparison with Baselines

System Accuracy Early Detection False Alarms
Keyword Baseline 83.3% No N/A
Pattern Baseline 83.3% No N/A
DSFT-TD V2.1 100% (controlled) 7 turns 3.3%

Note: Baseline comparison is preliminary. Full comparison with transformers (BERT, RoBERTa) and sequential models (LSTM, HMM) is planned for future work.

---

👥 Authors

Samir Baladi – Interdisciplinary AI Researcher, Ronin Institute / Rite of Renaissance
📧 gitdeeper@gmail.com | ORCID: 0009-0003-8903-0029

Copyright: Copyright (C) 2026 Samir Baladi. All rights reserved.

Full list of contributors and acknowledgments can be found in AUTHORS.md.

---

🔗 Links & Registrations

Resource Link
GitHub https://github.com/gitdeeper12/IKPS-CORE
GitLab https://gitlab.com/gitdeeper12/IKPS-CORE
Bitbucket https://bitbucket.org/gitdeeper-12/IKPS-CORE
Codeberg https://codeberg.org/gitedeeper12/IKPS-CORE
PyPI https://pypi.org/project/ikps-core/
Zenodo https://doi.org/10.5281/zenodo.20303214
OSF Preregistration https://osf.io/muwt4 – DOI: 10.17605/OSF.IO/NY5S8

Registration details:

· Type: OSF Preregistration
· Registry: OSF Registries
· Associated project: https://osf.io/muwt4
· Date created/registered: May 20, 2026
· License: MIT License

Zenodo Record Details:

· DOI: 10.5281/zenodo.20303214
· Publication date: 2026-05-20
· Version: 2.1.0
· Publisher: Zenodo
· Resource type: Publication / Journal article
· Development Status: Active

---

📚 References

```bibtex
@article{baladi2026dsft,
  author       = {Baladi, Samir},
  title        = {DSFT: A Temporal Framework for Semantic Force Dynamics in Dialogue Systems},
  year         = {2026},
  version      = {2.1.0},
  doi          = {10.5281/zenodo.20303214},
  publisher    = {Zenodo},
  url          = {https://github.com/gitdeeper12/IKPS-CORE}
}

@software{baladi2026swarmica,
  author       = {Baladi, Samir},
  title        = {SWARMICA v1.0.0: Variational and Continuum Mechanics Framework for Autonomous Swarm Systems},
  year         = {2026},
  doi          = {10.5281/zenodo.20168278},
  publisher    = {Zenodo}
}

@software{baladi2026neuropia,
  author       = {Baladi, Samir},
  title        = {NEUROPIA (E-LAB-10): Neural Cognitive Field Unification via Omni-Spectral Fourier Operator},
  year         = {2026},
  doi          = {10.5281/zenodo.20092199},
  publisher    = {Zenodo}
}

@software{baladi2026entropy,
  author       = {Baladi, Samir},
  title        = {Irreducible Path Entropy in Neural Networks},
  year         = {2026},
  doi          = {10.5281/zenodo.20222840},
  publisher    = {Zenodo}
}

@software{baladi2026entoquantum,
  author       = {Baladi, Samir},
  title        = {ENTRO-QUANTUM (E-LAB-07): Quantum-Inspired Entropy Framework},
  year         = {2026},
  doi          = {10.5281/zenodo.19478805},
  publisher    = {Zenodo}
}

@inproceedings{devlin2019bert,
  author       = {Devlin, Jacob and Chang, Ming-Wei and Lee, Kenton and Toutanova, Kristina},
  title        = {BERT: Pre-training of deep bidirectional transformers for language understanding},
  booktitle    = {NAACL-HLT},
  year         = {2019}
}

@inproceedings{vaswani2017attention,
  author       = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and others},
  title        = {Attention is all you need},
  booktitle    = {NeurIPS},
  year         = {2017}
}

@article{blei2003lda,
  author       = {Blei, David M. and Ng, Andrew Y. and Jordan, Michael I.},
  title        = {Latent Dirichlet allocation},
  journal      = {Journal of Machine Learning Research},
  volume       = {3},
  pages        = {993--1022},
  year         = {2003}
}

@article{pang2008sentiment,
  author       = {Pang, Bo and Lee, Lillian},
  title        = {Opinion mining and sentiment analysis},
  journal      = {Foundations and Trends in Information Retrieval},
  volume       = {2},
  number       = {1--2},
  pages        = {1--135},
  year         = {2008}
}

@article{young2013pomdp,
  author       = {Young, Steve and Gašić, Milica and Thomson, Blaise and Williams, Jason D.},
  title        = {POMDP-based statistical spoken dialogue systems: A review},
  journal      = {Proceedings of the IEEE},
  volume       = {101},
  number       = {5},
  pages        = {1160--1179},
  year         = {2013}
}

@inproceedings{reynolds1987flocks,
  author       = {Reynolds, Craig W.},
  title        = {Flocks, herds, and schools: A distributed behavioral model},
  booktitle    = {ACM SIGGRAPH Computer Graphics},
  volume       = {21},
  number       = {4},
  pages        = {25--34},
  year         = {1987}
}

@incollection{kuramoto1975,
  author       = {Kuramoto, Yoshiki},
  title        = {Self-entrainment of a population of coupled non-linear oscillators},
  booktitle    = {International Symposium on Mathematical Problems in Theoretical Physics},
  publisher    = {Springer},
  year         = {1975}
}

@article{toner1995long,
  author       = {Toner, John and Tu, Yuhai},
  title        = {Long-range order in a two-dimensional dynamical XY model: how birds fly together},
  journal      = {Physical Review Letters},
  volume       = {75},
  number       = {23},
  pages        = {4326},
  year         = {1995}
}

@article{shannon1948,
  author       = {Shannon, Claude E.},
  title        = {A mathematical theory of communication},
  journal      = {Bell System Technical Journal},
  volume       = {27},
  number       = {3},
  pages        = {379--423},
  year         = {1948}
}

@article{boltzmann1877,
  author       = {Boltzmann, Ludwig},
  title        = {Über die Beziehung zwischen dem zweiten Hauptsatze der mechanischen Wärmetheorie und der Wahrscheinlichkeitsrechnung},
  journal      = {Wiener Berichte},
  volume       = {76},
  pages        = {373--435},
  year         = {1877}
}
```

---

📝 Citation (Simplified)

```bibtex
@software{baladi2026dsft,
  author       = {Baladi, Samir},
  title        = {DSFT-TD V2.1: Dynamic Semantic Field Theory},
  year         = {2026},
  version      = {2.1.0},
  publisher    = {Zenodo},
  doi          = {10.5281/zenodo.20303214},
  url          = {https://github.com/gitdeeper12/IKPS-CORE}
}

@misc{baladi2026osf,
  author       = {Baladi, Samir},
  title        = {DSFT-TD V2.1 Preregistration},
  year         = {2026},
  howpublished = {OSF Registries},
  doi          = {10.17605/OSF.IO/NY5S8},
  url          = {https://osf.io/muwt4}
}
```

---

📜 License

MIT License — see LICENSE for details.

---

DSFT-TD V2.1 — From Static Classification to Temporal Semantic Dynamics 🧠

"The observer is not neutral — it actively modifies the field it measures."

"The system has moved beyond static classification to temporal semantic dynamics."

```

---