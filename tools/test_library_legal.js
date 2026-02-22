const Scribe = require('../packages/national-library/src/ingest');
const Librarian = require('../packages/national-library/src/search');

async function verifyLibrary() {
  console.log("=== Verifying Sovereign National Library (Phase 1) ===");

  const scribe = new Scribe();
  const libraryRoot = './src/knowledge/library/legal';

  // 1. Ingest the Legal Library
  console.log(`\n[Test] Ingesting Directory: ${libraryRoot}`);
  try {
    const stats = await scribe.ingestDirectory(libraryRoot);
    console.log(`[Success] Ingested ${stats.total_docs} laws.`);
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

  // 4. Verify Validation Logic (Jubilee Cap)
  // We will manually try to ingest a BAD file to see if the Guardian catches it.
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
