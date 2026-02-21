#!/bin/bash
# Snapshot Protocol (Offline Backup)

LIBRARY_ROOT="src/knowledge/library"
SNAPSHOT_DIR="snapshots"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
ARCHIVE_NAME="sovereign-library-v1-${TIMESTAMP}.tar.zst"

mkdir -p $SNAPSHOT_DIR

echo "[SNAPSHOT] Creating Offline Archive of ${LIBRARY_ROOT}..."

# Create Tarball compressed with Zstandard (simulated with gzip if zstd missing)
if command -v zstd &> /dev/null; then
    tar -I zstd -cf "${SNAPSHOT_DIR}/${ARCHIVE_NAME}" $LIBRARY_ROOT
else
    echo "[WARN] zstd not found, using gzip."
    tar -czf "${SNAPSHOT_DIR}/${ARCHIVE_NAME}.gz" $LIBRARY_ROOT
fi

echo "[SUCCESS] Archive created at ${SNAPSHOT_DIR}/${ARCHIVE_NAME}"
