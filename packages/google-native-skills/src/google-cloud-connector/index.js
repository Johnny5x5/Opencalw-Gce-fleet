const { Firestore } = require('@google-cloud/firestore');
const { PubSub } = require('@google-cloud/pubsub');
const { Storage } = require('@google-cloud/storage');
const { BigQuery } = require('@google-cloud/bigquery');
const { KeyManagementServiceClient } = require('@google-cloud/kms');

/**
 * OpenClaw Skill: Google Cloud Connector
 *
 * Provides native access to Firestore (Memory), Pub/Sub (Communication),
 * Cloud Storage (Filing), BigQuery (Data), and KMS (Signing) using official SDKs.
 */

// Initialize Clients
const firestore = new Firestore();
const pubsub = new PubSub();
const storage = new Storage();
const bigquery = new BigQuery();
const kms = new KeyManagementServiceClient();

module.exports = {
  name: 'google-cloud-connector',
  description: 'Native integration with Google Cloud Firestore, Pub/Sub, and Storage.',

  actions: {
    // --- Memory (Firestore) ---
    remember: async ({ collection, key, data }) => {
      const docRef = firestore.collection(collection).doc(key);
      await docRef.set(data, { merge: true });
      return `Stored data in ${collection}/${key}`;
    },

    recall: async ({ collection, key }) => {
      const docRef = firestore.collection(collection).doc(key);
      const doc = await docRef.get();
      if (!doc.exists) {
        return null;
      }
      return doc.data();
    },

    // --- Communication (Pub/Sub) ---
    send_memo: async ({ topic, message }) => {
      const dataBuffer = Buffer.from(JSON.stringify(message));
      try {
        const messageId = await pubsub.topic(topic).publishMessage({ data: dataBuffer });
        return `Message sent to ${topic} (ID: ${messageId})`;
      } catch (error) {
        throw new Error(`Failed to publish message: ${error.message}`);
      }
    },

    // --- Filing (Cloud Storage) ---
    archive_document: async ({ bucket, filename, content }) => {
      const file = storage.bucket(bucket).file(filename);
      await file.save(content);
      return `File saved to gs://${bucket}/${filename}`;
    },

    retrieve_document: async ({ bucket, filename }) => {
      const file = storage.bucket(bucket).file(filename);
      const [contents] = await file.download();
      return contents.toString();
    },

    // --- Analytics (BigQuery) ---
    log_event: async ({ dataset, table, data }) => {
      // Data must be an object matching the table schema
      // e.g. { agent_id: 'hq-01', timestamp: '...', action: 'login' }
      try {
        await bigquery
          .dataset(dataset)
          .table(table)
          .insert(data);
        return `Logged event to ${dataset}.${table}`;
      } catch (error) {
        // In production, we might want to fail silently or log to stderr
        throw new Error(`BigQuery Insert Failed: ${JSON.stringify(error)}`);
      }
    },

    // --- Finance / Security (KMS Signing) ---
    sign_data: async ({ key_resource_id, data_base64 }) => {
      // key_resource_id: projects/.../locations/.../keyRings/.../cryptoKeys/.../cryptoKeyVersions/1
      try {
        const [response] = await kms.asymmetricSign({
          name: key_resource_id,
          data: Buffer.from(data_base64, 'base64'),
        });
        return response.signature.toString('base64');
      } catch (error) {
        throw new Error(`KMS Signing Failed: ${error.message}`);
      }
    }
  }
};
