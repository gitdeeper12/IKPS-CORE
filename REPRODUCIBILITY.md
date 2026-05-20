# DSFT Reproducibility Guide

## Overview

This document provides instructions for reproducing all DSFT benchmark results.

## Environment Setup

```bash
# Clone repository
git clone https://github.com/gitdeeper12/IKPS-CORE.git
cd IKPS-CORE

# Install dependencies
npm install
```

Running Benchmarks

Run all benchmarks

```bash
npm run benchmark:all
# or
./scripts/run_all_benchmarks.sh
```

Run individual benchmarks

```bash
# Transition detection
node benchmarks/v2_complete_validation.js

# Latency measurement
node benchmarks/transition_metrics/transition_latency_v2.js

# Drift prediction
node benchmarks/drift_prediction/drift_prediction.js

# Long-form stability
node benchmarks/long_form/long_duration_tests.js
```

Using the unified runner

```bash
# Default configuration
node benchmarks/runner.js

# Custom configuration (edit config/benchmark.config.js)
```

Configuration

All benchmark parameters are in config/benchmark.config.js:

Parameter Default Description
seed 42 Random seed for reproducibility
deterministic true Disable random variation
testLength 40 Maximum test length in turns
iterations 10 Number of iterations per test

Expected Results

Benchmark Expected Outcome
Transition Detection 5/5 transitions detected
Latency 7 turns before dominance
Stability 80% ANALYTICAL in stable tests
False Alarms <5%

Deterministic Mode

To ensure reproducibility:

1. Set deterministic: true in config
2. Use fixed seed (42)
3. Run with same Node.js version

Output Format

Results are saved to ./results/benchmark_<timestamp>.json with:

· Configuration used
· Raw results
· Summary metrics

Troubleshooting

Inconsistent results

· Ensure deterministic: true in config
· Check Node.js version (v18+ recommended)
· Clear ./results directory before re-running

Missing expected results

Generate expected results:

```bash
# Run once to generate baseline
node benchmarks/runner.js
# Then manually copy to benchmarks/expected/
```

Citation

If you use these benchmarks, please cite:

```bibtex
@software{baladi2026dsft,
  author = {Baladi, Samir},
  title = {DSFT-TD V2: Dynamic Semantic Field Theory},
  year = {2026},
  url = {https://github.com/gitdeeper12/IKPS-CORE}
}
```

License

MIT License - see LICENSE file for details.

