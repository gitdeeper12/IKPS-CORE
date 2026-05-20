# EVALUATION PROTOCOL v1.0
## External Falsification Document for DSFT-TD V2.1

> **This protocol exists to falsify DSFT-TD, not validate it.**
> 
> Any positive result is not considered success, but rather:
> **survivability under external conditions.**

---

## 1. Purpose (Critical Framing)

This document defines a **controlled external falsification protocol** for DSFT-TD V2.1. The goal is not to demonstrate the system's capabilities, but to identify its boundaries, failure modes, and conditions under which it breaks.

**Core principle:** The protocol is an **instrument of falsification**, not an extension of the theory.

---

## 2. Data Independence Principle

### 2.1 Prohibited Data Sources

| Source | Reason |
|--------|--------|
| Synthetic dialogues | Self-referential validation |
| Force-labeled inputs | Circular evaluation |
| Model-aware test design | Violates independence |
| DSFT-derived data | Cannot falsify own assumptions |

### 2.2 Permitted Data Sources

| Source | Description |
|--------|-------------|
| Human discourse corpora | Natural conversations |
| Reddit/forum archives | Unstructured debates |
| Debate transcripts | Competitive argumentation |
| Multilingual corpora (AR/FR/EN) | Cross-lingual validation |
| Therapy transcripts | Emotional dynamics |
| Technical discussions | Analytical reasoning |

### 2.3 Data Independence Rule

```

DATA ∉ TRAINING
DATA ∉ GENERATED_BY_DSFT
DATA ∉ ALIGNED_WITH_DSFT_FORCES

```

---

## 3. Evaluation Constraints

### 3.1 Prohibited Practices

| Practice | Reason |
|----------|--------|
| Synthetic dialogue generation | Creates self-fulfilling validation |
| Force-labeled inputs | Assumes what needs to be proven |
| Model-aware test design | Introduces bias |
| Pre-tagging by DSFT | Circular reasoning |
| Parameter tuning on test data | Overfitting |

### 3.2 Permitted Practices

| Practice | Description |
|----------|-------------|
| Raw text only | No preprocessing for DSFT |
| External annotations | Human consensus labels |
| Fixed configuration | Same parameters as v2.1 |
| Blind evaluation | Annotators unaware of DSFT predictions |

---

## 4. Metrics (Reframed for Falsification)

### 4.1 Latent Alignment Delay (LAD)

**Definition:** Time between actual human-annotated transition point and DSFT detection point.

\[
\text{LAD} = t_{\text{human\_transition}} - t_{\text{dsft\_detection}}
\]

**Interpretation:**
- LAD > 0 → DSFT detects BEFORE human annotation (potential false positive)
- LAD < 0 → DSFT detects AFTER human annotation (late detection)
- LAD = 0 → Perfect alignment

**Success criteria (falsification-oriented):** Identify cases where LAD is consistently negative or highly variable.

### 4.2 False Structure Detection Rate (FSDR)

**Definition:** Rate at which DSFT detects "transitions" not present in external human annotation.

\[
\text{FSDR} = \frac{\text{DSFT\_transitions\_not\_in\_human}}{\text{Total\_DSFT\_transitions}}
\]

**Success criteria (falsification-oriented):** Identify conditions where FSDR > 30%.

### 4.3 Cross-Linguistic Stability Index (CLSI)

**Definition:** Classification stability across Arabic, French, and English for semantically equivalent content.

\[
\text{CLSI} = 1 - \frac{\text{Variance}(F_{\text{AR}}, F_{\text{FR}}, F_{\text{EN}})}{\text{MaxVariance}}
\]

**Success criteria (falsification-oriented):** Identify languages or constructions where CLSI < 0.6.

### 4.4 External Agreement Rate (EAR)

**Definition:** Agreement between DSFT and human consensus annotation.

\[
\text{EAR} = \frac{\text{Agreements}}{\text{Total\_turns}}
\]

**Success criteria (falsification-oriented):** Not treated as "accuracy" but as survivability measure. EAR < 0.6 indicates falsification domain.

---

## 5. Ground Truth Source (Critical Section)

### 5.1 Ground Truth Requirements

| Requirement | Description |
|-------------|-------------|
| **External** | Not derived from DSFT |
| **Human** | Annotated by humans |
| **Consensus** | Multiple annotators (≥3) |
| **Blind** | Annotators unaware of DSFT |
| **Reproducible** | Annotation guidelines documented |

### 5.2 Annotation Guidelines

Each turn is annotated for:
1. **Primary force** (Analytical / Exploratory / Affective / Persuasive)
2. **Force intensity** (1-5 scale)
3. **Transition point** (if force changes from previous turn)
4. **Confidence** (1-5 scale)

### 5.3 Minimum Annotator Agreement

- κ ≥ 0.7 (Fleiss' kappa) for inclusion
- Disagreements resolved through adjudication

---

## 6. Failure-First Design

### 6.1 Primary Research Question

> Under what conditions does DSFT-TD fail?

### 6.2 Expected Failure Modes

| Failure Mode | Description | Detection Metric |
|--------------|-------------|------------------|
| **Language dependency** | Performance collapse on non-English | CLSI < 0.6 |
| **Length collapse** | Degradation beyond 50 turns | LAD increases |
| **Emotional confusion** | Affective misclassified as Exploratory | FSDR > 30% |
| **Persuasive blindness** | Persuasive not detected | EAR < 0.5 |
| **Rapid oscillation** | Cannot track fast switches | LAD negative |
| **Ambiguous force** | No clear dominant | Stability outside [0.1,0.2] |

### 6.3 Falsification Criteria

DSFT-TD is considered **falsified** if any of the following occur:

1. **CLSI < 0.6** on any language pair
2. **FSDR > 30%** on any dialogue type
3. **LAD consistently negative** (systematically late) over 10+ dialogues
4. **EAR < 0.5** on human-annotated data
5. **Complete collapse** to single force over 50+ turns

---

## 7. Evaluation Philosophy

### 7.1 DSFT-TD as Hypothesis

> DSFT-TD is evaluated not as a model, but as a **hypothesis about temporal semantic structure**.

The hypothesis: Dialogue meaning can be modeled as four interacting semantic forces with measurable transitions.

**Falsification** means rejecting this hypothesis.

### 7.2 What Success Is Not

| Not Success | Why |
|-------------|-----|
| High accuracy | May indicate overfitting or data leakage |
| Early detection | May indicate false positives |
| Consistency with synthetic | Does not imply real-world validity |

### 7.3 What Survivability Means

DSFT-TD "survives" evaluation if it:
- Does NOT systematically fail on any failure mode
- Produces non-random agreement with human annotation
- Maintains stability across languages

Survival does NOT mean "true" or "validated." It means "not yet falsified."

---

## 8. Dataset Requirements

### 8.1 Minimum Dataset Size

| Language | Minimum Turns | Minimum Dialogues |
|----------|--------------|-------------------|
| English | 5,000 | 100 |
| Arabic | 2,000 | 40 |
| French | 2,000 | 40 |

### 8.2 Dialogue Type Distribution

| Type | Percentage |
|------|------------|
| Technical/Analytical | 25% |
| Exploratory/Philosophical | 25% |
| Emotional/Support | 25% |
| Persuasive/Debate | 25% |

### 8.3 Length Distribution

| Length (turns) | Percentage |
|----------------|------------|
| 5-10 | 30% |
| 11-20 | 40% |
| 21-40 | 20% |
| 41+ | 10% |

---

## 9. Reproducibility Requirements

### 9.1 Fixed Configuration

- DSFT-TD V2.1 parameters (α=0.2, γ=0.5, β=0.25, λ=0.1)
- Seed = 42
- Deterministic mode = true

### 9.2 Required Documentation

- Annotation guidelines
- Inter-annotator agreement scores
- Raw data sources
- Preprocessing steps (none except tokenization)
- All results (including failures)

### 9.3 Open Data

All evaluation data must be:
- Publicly available
- Not generated by DSFT
- Not modified for DSFT

---

## 10. Reporting Requirements

### 10.1 Must Report

- [ ] All failure modes encountered
- [ ] Conditions leading to each failure
- [ ] LAD per dialogue type
- [ ] FSDR per dialogue type
- [ ] CLSI per language pair
- [ ] EAR with human annotation
- [ ] Annotator agreement (κ)
- [ ] Any parameter adjustments (none permitted)

### 10.2 Must NOT Report

- ❌ "Accuracy" without ground truth qualification
- ❌ "Success" as primary outcome
- ❌ Claims about "validation" or "verification"

### 10.3 Required Statement

> *"This evaluation protocol is designed to falsify DSFT-TD, not to validate it. Any positive results indicate survivability under specific conditions, not general validity."*

---

## 11. Protocol Execution

### 11.1 Pre-Evaluation Checklist

- [ ] Data confirmed independent (not from DSFT)
- [ ] Annotations blind to DSFT
- [ ] Fixed configuration confirmed
- [ ] Minimum dataset size met
- [ ] Annotator agreement ≥ 0.7

### 11.2 Execution Command

```bash
# Run evaluation (once data is prepared)
npm run evaluate:falsification -- --data ./data/human_corpora --output ./results/falsification
```

11.3 Post-Evaluation

· Report all failures (no cherry-picking)
· Report conditions leading to each failure
· Do not adjust parameters after seeing results

---

12. Conclusion

This protocol is designed to falsify DSFT-TD, not to make it look good.

The question is not:

"How well does DSFT-TD perform?"

The question is:

"Under what conditions does DSFT-TD break?"

Answering this question honestly is the only path to scientific credibility.

---

Evaluation Protocol v1.0
External Falsification Document
Not a theory extension - an instrument of falsification

