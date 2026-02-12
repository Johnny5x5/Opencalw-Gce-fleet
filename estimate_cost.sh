#!/bin/bash
# Wrapper for the Cost Calculator Tool
# Usage: ./estimate_cost.sh [agents] [storage_gb] [security_level]

AGENTS=${1:-10}
STORAGE=${2:-100}
LEVEL=${3:-1}

echo "Running OpenClaw Cost Estimator..."
node tools/cost_calculator/index.js $AGENTS $STORAGE $LEVEL
