# 🧠 DSFT-TD V2: Dynamic Semantic Field Theory

## Temporal Framework for Semantic Force Dynamics

---

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-crimson.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](CHANGELOG.md)
[![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-green.svg)](https://nodejs.org/)
[![Status](https://img.shields.io/badge/status-Stable_Research_Core-brightgreen.svg)]()

</div>

---

> *"Meaning is not a point in space. It is the dynamics of interaction between opposing forces."*

> *"The observer is not neutral — it actively modifies the field it measures."*

---

## 📖 Overview

**DSFT-TD V2** is a temporal framework for modeling semantic dynamics as interacting forces rather than static classifications. Unlike traditional NLP classifiers that assign single labels to text, DSFT treats dialogue as a field of four interacting semantic forces.

### Key Capabilities

| Capability | Performance |
|------------|-------------|
| **Force Classification** | 100% (4/4) |
| **Early Transition Detection** | 7 turns BEFORE dominance |
| **False Alarm Rate** | 3.3% |
| **Long-Form Stability** | 40+ turns without collapse |
| **Observer Modes** | 4 (Passive, Active, Reflexive, Meta) |

---

## 🧠 The Four Semantic Forces

| Force | Symbol | Description |
|-------|--------|-------------|
| **Analytical Pressure** | \(F_A\) | Logical reasoning, deductive structure |
| **Exploratory Expansion** | \(F_E\) | Open-ended exploration, possibility |
| **Affective Resonance** | \(F_R\) | Emotional valence, concern, urgency |
| **Persuasive Drift** | \(F_P\) | Rhetorical influence, directed conclusion |

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

## 📊 Key Results

### Transition Detection

| Transition | Latency |
|------------|---------|
| Analytical → Affective | 7 turns BEFORE |
| Analytical → Persuasive | 7 turns BEFORE |
| Affective → Persuasive | 7 turns BEFORE |
| Persuasive → Exploratory | 7 turns BEFORE |
| Exploratory → Analytical | 7 turns BEFORE |

**Average Latency:** 7.0 turns before dominance

### Stability Metrics

| Test | Result |
|------|--------|
| Stable Technical (20 turns) | 90% ANALYTICAL, 4 transitions |
| Chaotic Oscillation (30 turns) | 86.2% change rate, no collapse |
| Semantic Drift (40 turns) | 1 transition, stable |
| False Alarm Rate | 3.3% |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gitdeeper12/IKPS-CORE.git
cd IKPS-CORE

# Install dependencies
npm install

# Run complete validation suite
node benchmarks/v2_complete_validation.js

# Run transition latency metrics
node benchmarks/transition_metrics/transition_latency_v2.js

# Run semantic drift prediction
node benchmarks/drift_prediction/drift_prediction.js

# Run long-form stress tests
node benchmarks/long_form/long_duration_tests.js
```

---

📁 Project Structure

```
IKPS-CORE/
├── README.md                       # This file
├── DSFT_PAPER.md                   # Minimal formal paper
├── CHANGELOG.md                    # Version history
├── REAL_WORLD_BENCHMARK_PLAN.md    # Validation roadmap
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
│   ├── v2_complete_validation.js  # Full validation suite
│   ├── long_form/                 # Extended dialogue tests
│   ├── drift_prediction/          # Early detection tests
│   └── transition_metrics/        # Latency measurement
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

Key finding: The observer is not neutral — different modes produce different field dynamics.

---

🔗 Links

Resource Link
GitHub https://github.com/gitdeeper12/IKPS-CORE
Documentation https://ikps.netlify.app
Paper DSFT_PAPER.md

---

📝 Citation

```bibtex
@software{baladi2026dsft,
  author       = {Baladi, Samir},
  title        = {DSFT-TD V2: Dynamic Semantic Field Theory},
  year         = {2026},
  version      = {2.0.0},
  url          = {https://github.com/gitdeeper12/IKPS-CORE}
}
```

---

👤 Author

Samir Baladi
Independent Researcher — Ronin Institute / Rite of Renaissance

· 📧 gitdeeper@gmail.com
· 🔗 ORCID: 0009-0003-8903-0029

---

📜 License

MIT License — see LICENSE for details.

---

DSFT-TD V2 — From Static Classification to Temporal Semantic Dynamics 🧠

"The observer is not neutral — it actively modifies the field it measures."

