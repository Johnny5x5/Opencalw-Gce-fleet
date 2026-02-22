const Scribe = require('../packages/national-library/src/ingest');
const Librarian = require('../packages/national-library/src/search');

async function verifyLibrary() {
  console.log("=== Verifying Sovereign National Library (Fully Federated) ===");

  const scribe = new Scribe();
  const libraryRoot = './src/knowledge/library';

  // 1. Ingest the Entire Library (Legal + Linguistic + Religious + Economic)
  console.log(`\n[Test] Ingesting Directory: ${libraryRoot}`);
  try {
    const stats = await scribe.ingestDirectory(libraryRoot);
    console.log(`[Success] Ingested ${stats.total_docs} documents across all pillars.`);
  } catch (error) {
    console.error(`[Failure] Ingestion Failed: ${error}`);
    process.exit(1);
  }

  // 2. Verify Legal Pillar
  console.log("\n[Test] Verifying Legal Pillar (Penal Code)");
  if (scribe.library_index['urn:lex:sovereign:decree:penal_code:title_1']) {
    console.log("[Success] Found 'urn:lex:sovereign:decree:penal_code:title_1'");
  } else {
    console.error("[Failure] Missing Penal Code");
    process.exit(1);
  }

  // 3. Verify Religious Pillar
  console.log("\n[Test] Verifying Religious Pillar (Deuteronomy 15)");
  if (scribe.library_index['urn:lex:bible:ot:deuteronomy:15']) {
    console.log("[Success] Found 'urn:lex:bible:ot:deuteronomy:15'");
  } else {
    console.error("[Failure] Missing Scripture");
    process.exit(1);
  }

  // 4. Verify Linguistic Pillar
  console.log("\n[Test] Verifying Linguistic Pillar (Definition: Jubilee)");
  if (scribe.library_index['urn:lex:sovereign:def:jubilee']) {
    console.log("[Success] Found 'urn:lex:sovereign:def:jubilee'");
  } else {
    console.error("[Failure] Missing Definition");
    process.exit(1);
  }

  // 5. Verify Economic Pillar
  console.log("\n[Test] Verifying Economic Pillar (Sovereign Trust)");
  if (scribe.library_index['urn:lex:economic:protocol:sovereign_trust']) {
    console.log("[Success] Found 'urn:lex:economic:protocol:sovereign_trust'");
  } else {
    console.error("[Failure] Missing Sovereign Trust Protocol");
    process.exit(1);
  }

  console.log("\n[Test] Verifying Economic Pillar (Sovereign Credit)");
  if (scribe.library_index['urn:lex:economic:asset:sovereign_credit']) {
    console.log("[Success] Found 'urn:lex:economic:asset:sovereign_credit'");
  } else {
    console.error("[Failure] Missing Sovereign Credit Definition");
    process.exit(1);
  }

  console.log("\n=== ALL SYSTEMS OPERATIONAL ===");
}

verifyLibrary();
