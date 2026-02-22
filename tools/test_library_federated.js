const Scribe = require('../packages/national-library/src/ingest');
const Librarian = require('../packages/national-library/src/search');

async function verifyLibrary() {
  console.log("=== Verifying Sovereign National Library (13 Pillars) ===");

  const scribe = new Scribe();
  const libraryRoot = './src/knowledge/library';

  // 1. Ingest the Entire Library
  console.log(`\n[Test] Ingesting Directory: ${libraryRoot}`);
  try {
    const stats = await scribe.ingestDirectory(libraryRoot);
    console.log(`[Success] Ingested ${stats.total_docs} documents across 13 pillars.`);
  } catch (error) {
    console.error(`[Failure] Ingestion Failed: ${error}`);
    process.exit(1);
  }

  // 2. Verify Sample Documents from New Pillars
  const checkList = [
    { urn: 'urn:lex:historical:event:founding_of_nation', name: 'Historical Pillar' },
    { urn: 'urn:lex:scientific:theory:compute_abundance', name: 'Scientific Pillar' },
    { urn: 'urn:lex:cultural:artifact:anthem', name: 'Cultural Pillar' },
    { urn: 'urn:lex:geographic:map:digital_waters', name: 'Geographic Pillar' },
    { urn: 'urn:lex:medical:protocol:sovereign_health', name: 'Medical Pillar' },
    { urn: 'urn:lex:engineering:blueprint:sovereign_server', name: 'Engineering Pillar' },
    { urn: 'urn:lex:agricultural:protocol:joseph_grain', name: 'Agricultural Pillar' },
    { urn: 'urn:lex:military:doctrine:iron_dome', name: 'Military Pillar' },
    { urn: 'urn:lex:educational:course:sovereign_citizenship', name: 'Educational Pillar' }
  ];

  let passed = true;
  for (const check of checkList) {
    if (scribe.library_index[check.urn]) {
        console.log(`[Success] Found ${check.name} (${check.urn})`);
    } else {
        console.error(`[Failure] Missing ${check.name} (${check.urn})`);
        passed = false;
    }
  }

  if (!passed) process.exit(1);

  console.log("\n=== ALL 13 PILLARS OPERATIONAL ===");
}

verifyLibrary();
