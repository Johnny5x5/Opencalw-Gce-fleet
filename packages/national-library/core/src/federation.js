// The Federation Protocol: Public Metadata Routing
// Purpose: Enables Corporate Silos to route public metadata to the National Library.

class FederationProtocol {
  constructor(library) {
    this.library = library;
    this.routes = [];
  }

  /**
   * Registers a new Corporate Silo for metadata routing.
   * @param {string} siloName - The name of the corporate entity (e.g., "Sovereign Engineering").
   * @param {string} endpoint - The API endpoint for the silo's Private Library.
   */
  registerSilo(siloName, endpoint) {
    console.log(`[FEDERATION] Registering route for silo: ${siloName} -> ${endpoint}`);
    this.routes.push({ name: siloName, endpoint });
    return true;
  }

  /**
   * Receives a metadata update from a registered silo.
   * @param {string} siloName - The source silo.
   * @param {object} metadata - The metadata payload (RDF/JSON-LD).
   */
  async routeMetadata(siloName, metadata) {
    console.log(`[FEDERATION] Routing metadata from ${siloName}: ${JSON.stringify(metadata)}`);

    // 1. Validate Source
    const silo = this.routes.find(r => r.name === siloName);
    if (!silo) {
      throw new Error(`Access Denied: Silo '${siloName}' is not registered.`);
    }

    // 2. Filter for PUBLIC/CIVIC content
    if (metadata.classification !== "PUBLIC" && metadata.classification !== "CIVIC") {
      console.log(`[FEDERATION] Dropping private metadata from ${siloName}.`);
      return false;
    }

    // 3. Ingest into National Library Index (Metadata Only)
    // The actual content remains in the silo, but the metadata is searchable centrally.
    await this.library.scribe.ingest(`federated://${siloName}/${metadata.id}`, metadata);

    return true;
  }
}

module.exports = FederationProtocol;
