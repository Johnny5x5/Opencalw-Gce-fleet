#!/bin/bash
# Build script for The Iron Ledger Whitepaper (LaTeX)

DOC_NAME="iron_ledger"
SRC_DIR="docs/research_paper"

echo "🔨 Building ${DOC_NAME}.pdf..."

# Check for pdflatex
if command -v pdflatex &> /dev/null; then
    cd "${SRC_DIR}"
    pdflatex -interaction=nonstopmode "${DOC_NAME}.tex"
    pdflatex -interaction=nonstopmode "${DOC_NAME}.tex" # Run twice for refs
    echo "✅ Build complete: ${SRC_DIR}/${DOC_NAME}.pdf"
else
    echo "⚠️  'pdflatex' not found. Skipping build."
    echo "ℹ️  To build manually: install TeX Live or MacTeX."
    exit 0
fi
