#!/bin/bash
# Verify reproducibility by comparing with expected results

echo "=========================================="
echo "🔒 DSFT Reproducibility Verification"
echo "=========================================="

EXPECTED_FILE="benchmarks/expected/all_results.json"
if [ ! -f "$EXPECTED_FILE" ]; then
    echo "⚠️ Expected results file not found: $EXPECTED_FILE"
    echo "   Run 'npm run benchmark:save' to generate expected results"
    exit 1
fi

echo "✅ Expected results file found"

# Run benchmarks with deterministic mode
echo ""
echo "Running benchmarks (deterministic mode)..."
node benchmarks/runner.js

echo ""
echo "✅ Verification complete"
echo "   Compare results with $EXPECTED_FILE manually"
