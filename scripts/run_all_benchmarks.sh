#!/bin/bash
# Run all DSFT benchmarks

echo "=========================================="
echo "🧪 DSFT Complete Benchmark Suite"
echo "=========================================="

# Run unified runner
node benchmarks/runner.js

# Run individual benchmarks (optional)
echo ""
echo "📊 Running individual benchmarks..."

echo "   → Transition Latency V2"
node benchmarks/transition_metrics/transition_latency_v2.js

echo "   → Complete Validation Suite"
node benchmarks/v2_complete_validation.js

echo "   → Long-Form Stress Tests"
node benchmarks/long_form/long_duration_tests.js

echo "   → Drift Prediction"
node benchmarks/drift_prediction/drift_prediction.js

echo ""
echo "✅ All benchmarks complete"
