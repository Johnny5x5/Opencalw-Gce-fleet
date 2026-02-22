const Scribe = require('../packages/national-library/src/ingest');
const Librarian = require('../packages/national-library/src/search');

async function verifyLibrary() {
  console.log("=== Verifying Sovereign National Library (Phase 1 & 2) ===");

  const scribe = new Scribe();
  const libraryRoot = './src/knowledge/library';

  // 1. Ingest the Entire Library (Legal + Linguistic + Religious)
  console.log(`\n[Test] Ingesting Directory: ${libraryRoot}`);
  try {
    const stats = await scribe.ingestDirectory(libraryRoot);
    console.log(`[Success] Ingested ${stats.total_docs} documents across all pillars.`);
  } catch (error) {
    console.error(`[Failure] Ingestion Failed: ${error}`);
    process.exit(1);
  }

  // 2. Verify Foreign Law (Mirror)
  console.log("\n[Test] Verifying Foreign Mirror (UCC Article 2)");
  if (scribe.library_index['urn:lex:us:ucc:article:2']) {
    console.log("[Success] Found 'urn:lex:us:ucc:article:2'");
  } else {
    console.error("[Failure] Missing UCC Article 2");
    process.exit(1);
  }

  // 3. Verify Sovereign Law (Domestic)
  console.log("\n[Test] Verifying Sovereign Decree (Penal Code Title 1)");
  if (scribe.library_index['urn:lex:sovereign:decree:penal_code:title_1']) {
    console.log("[Success] Found 'urn:lex:sovereign:decree:penal_code:title_1'");
  } else {
    console.error("[Failure] Missing Penal Code Title 1");
    process.exit(1);
  }

  // 4. Verify Linguistic Definitions (Pillar 13)
  console.log("\n[Test] Verifying Linguistic Anchor (Definition: Jubilee)");
  if (scribe.library_index['urn:lex:sovereign:def:jubilee']) {
    console.log("[Success] Found 'urn:lex:sovereign:def:jubilee'");
  } else {
    console.error("[Failure] Missing Definition: Jubilee");
    process.exit(1);
  }

  // 5. Verify Religious Source (Pillar 2)
  console.log("\n[Test] Verifying Religious Source (Deuteronomy 15)");
  if (scribe.library_index['urn:lex:bible:ot:deuteronomy:15']) {
    console.log("[Success] Found 'urn:lex:bible:ot:deuteronomy:15'");
  } else {
    console.error("[Failure] Missing Scripture: Deuteronomy 15");
    process.exit(1);
  }

  // 6. Verify Validation Logic (Jubilee Cap)
  console.log("\n[Test] Verifying Guardian Validation (Jubilee Violation)");
  const badLaw = `
---
id: "urn:lex:sovereign:decree:bad_law"
title: "The Tyrant's Act"
jurisdiction: "Sovereign"
intent_uri: "./none.md"
max_sentence_years: 99
---
# This law should fail validation.
`;

  const mockScribe = new Scribe();
  const { metadata } = mockScribe.parseFrontmatter(badLaw);
  const result = mockScribe.mockGuardianValidation(metadata);

  if (!result.valid && result.error.includes("Jubilee Violation")) {
    console.log(`[Success] Guardian rejected Bad Law: "${result.error}"`);
  } else {
    console.error(`[Failure] Guardian ACCEPTED Bad Law! (Result: ${result.valid})`);
    process.exit(1);
  }

  console.log("\n=== ALL SYSTEMS OPERATIONAL ===");
}

verifyLibrary();
