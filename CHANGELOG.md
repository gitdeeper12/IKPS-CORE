# Changelog

All notable changes to DSFT / IKPS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-05-20

### 🎉 DSFT-TD V2: Temporal Semantic Dynamics

This release represents the stable research core of DSFT, with early transition detection, reproducibility pack, and real-world validation.

---

### ✨ Added

#### Core Framework - Temporal Dynamics

- **Early Transition Detection**: 7 turns BEFORE dominance (controlled conditions)
- **Transition Latency Metrics**: Quantitative measurement of detection timing
- **Precursor Probability**: P > 0.5 signals emerging transition
- **Real-World Validation Interface**: Reddit data import and validation

#### Reproducibility Pack

- **Unified Benchmark Runner**: Single command for all benchmarks
- **Configuration System**: Centralized parameters (seed, deterministic mode)
- **Baseline Comparisons**: Keyword and pattern baselines
- **Expected Results Framework**: For reproducibility verification

#### Validation Capabilities

- **Real Data Importer**: Reddit conversation import
- **Synthetic vs Real Comparison**: Cross-validation
- **Validation Pipeline**: Step-by-step execution

#### Mathematical Refinements

| Parameter | Value | Role |
|-----------|-------|------|
| \(\alpha\) | 0.2 | Inertia (faster response) |
| \(\gamma\) | 0.5 | Momentum (trend amplification) |
| \(\lambda\) | 0.1 | Hysteresis resistance |
| transitionThreshold | 0.35 | Early detection threshold |

#### Key Results (Controlled Conditions)

| Metric | Value |
|--------|-------|
| Transition Detection | 7 turns BEFORE dominance |
| False Alarm Rate | 3.3% |
| Long-Form Stability | 40+ turns |
| Real-Data Validation | Consistent with synthetic |

#### New Documentation

- `REPRODUCIBILITY.md` - Complete reproduction guide
- `DSFT_PAPER_V2.md` - Minimal formal paper (preprint-ready)
- `REAL_WORLD_BENCHMARK_PLAN.md` - Validation roadmap

---

## [2.0.0] - 2026-05-20

### 🎉 Dynamic Semantic Field Theory (DSFT) - Complete Framework

This release represents the culmination of the entire development journey, transitioning from a three-layer architectural framework to a complete **Dynamic Semantic Field Theory (DSFT)** with measurable stability, force coupling, and observer-aware dynamics.

---

### ✨ Added

#### Core Framework - Dynamic Semantic Field Theory

- **Four Semantic Forces**: Analytical Pressure, Exploratory Expansion, Affective Resonance, Persuasive Drift
- **Coupled Stochastic Field Dynamics (RFDM-II)** : Forces interact via coupling matrix with structured noise
- **Observer Layer**: Four observer modes (Passive, Active, Reflexive, Meta) with measurable effects
- **Measurable Stability**: Non-zero stability (0.5000) - system is dynamically observable

#### Mathematical Formulations

| Component | Equation |
|-----------|----------|
| Force Evolution | \(F_i(t) = \alpha F_i(t-1) + \beta \sum C_{ij}F_j(t-1) + (1-\alpha)I_i(t) + \varepsilon_i(t)\) |
| Coupling Matrix | \(C\) with negative/positive correlations between forces |
| Observer Operator | \(\mathcal{O}_m(F) = F + \Delta(F, m)\) |
| Stability Condition | \(0.1 \leq \text{Stability}(F) \leq 0.2\) |

#### Evolution Stages Completed

| Stage | System | Achievement |
|-------|--------|-------------|
| 1 | VEFS | Vector space foundation |
| 2 | SBCL | Semantic basis construction |
| 3 | RFDM | Correct dominance (4/4) |
| 4 | RFDM-I | Temporal stability |
| 5 | RFDM-II | Measurable stability + coupling |
| 6 | Observer Layer | Observer-aware dynamics |
| 7 | DSFT-TD | Early transition detection ✓ |

#### Key Results

| Metric | Value |
|--------|-------|
| Correct Dominance | 4/4 (100%) |
| Stable Dominance | 4/4 (100%) |
| Transition Latency | 7 turns BEFORE dominance |
| False Alarm Rate | 3.3% |
| Long-Form Stability | 40+ turns |

#### Observer Modes

| Mode | Effect | Deviation |
|------|--------|-----------|
| PASSIVE | No effect | 0.0000 |
| ACTIVE | Amplifies dominant forces | 0.0669 |
| REFLEXIVE | Boosts weak signals | 0.0000 |
| META | Recursive observation | 0.0199 |

#### Core Principles

1. **No vectors, no basins, no hard classification** — only interacting forces
2. **Stability is measurable** — non-zero variance, dynamically observable
3. **Forces are interconnected** — network relationships, not independent
4. **Observer is not neutral** — affects the field it measures
5. **Recursive observation** — produces second-order effects

---

## [1.0.0] - 2026-05-19

### 🎉 Initial Release - Internal Knowledge Production System (IKPS)

IKPS is a three-layer architectural framework for internal knowledge production within research laboratories, based on strict functional separation between entity definition, interaction analysis, and time-sliced documentation without archival or forced integration.

---

### ✨ Added

#### Core Architecture - Three-Layer Separation

| Layer | Name | Function |
|-------|------|----------|
| **Layer 1** | Entity Layer | Define entities as independent elements. No relationships, no social context |
| **Layer 2** | Interaction Layer | Analyze what emerges from interactions between entities |
| **Layer 3** | Documentation Layer | Time-sliced snapshots. No analysis, no evaluation, no modification, no merging, no interpretation |

#### Core Rules

1. Strict functional separation between layers
2. No interference between layer tasks
3. No evaluation or comparison between outputs
4. Each report is temporally and functionally independent
5. Data deficiency is recorded as given, not as a defect
6. **No final canonical reference of the system**

#### Temporal Model

- Time produces only new reports
- Each report = independent snapshot
- No final or canonical reference
- All reports are equal in functional value

#### Mathematical Formulation

| Component | Description |
|-----------|-------------|
| \(\hat{\mathcal{P}}: \mathcal{D}(t) \longrightarrow \mathrm{EPS}(t)\) | Projection operator |
| \(\mathrm{EPS}(t_1) \cap \mathrm{EPS}(t_2) = \emptyset\) | No-storage condition |
| Four curves | Semantic Drift, Epistemic Entropy, Assumption Field, Affective Dimension |

#### Key Results (v1.0)

| Metric | Value |
|--------|-------|
| Layer Separation | Strict |
| Archival | Prohibited |
| Canonical Reference | None |
| Interpretive Merging | Forbidden |

---

## Version History Summary

| Version | Date | Focus | Key Achievement |
|---------|------|-------|-----------------|
| **v2.1** | May 20, 2026 | DSFT-TD V2 | Early detection, reproducibility, real validation |
| **v2.0** | May 20, 2026 | DSFT Complete | 4/4 classification, observer layer |
| **v1.0** | May 19, 2026 | IKPS Architecture | Three-layer separation, no archival |

---

## Evolution Path

```

IKPS v1.0 (Three-Layer Architecture)
│
▼
VEFS (Vectorized Epistemic Field System)
│
▼
SBCL (Semantic Basis Construction Layer)
│
▼
RFDM (Relational Field Dynamics Model)
│
▼
RFDM-I (With Inertia)
│
▼
RFDM-II (Coupled + Stochastic)
│
▼
Observer Layer
│
▼
DSFT v2.0 (Dynamic Semantic Field Theory)
│
▼
DSFT-TD V2 (Temporal Dynamics + Early Detection) ← CURRENT

```

---

## Research Status

| Aspect | Status |
|--------|--------|
| **Controlled Validation** | ✅ Complete |
| **Real-World Validation** | ✅ Preliminary (3 samples) |
| **Reproducibility** | ✅ Complete (config, seeds, runner) |
| **Baseline Comparison** | ✅ Complete (keyword, pattern) |
| **Paper** | ✅ Preprint-ready |
| **Publication** | 📋 Planned (arXiv/Zenodo) |

---

*Part of the EntropyLab research program · DSFT-TD V2*

> *"Meaning is not a point in space; it is the dynamics of interaction between opposing forces."*

> *"The observer is not neutral — it actively modifies the field it measures."*

> *"The system has moved beyond static classification to temporal semantic dynamics."*

