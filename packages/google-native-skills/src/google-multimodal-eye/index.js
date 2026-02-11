const { VertexAI } = require('@google-cloud/vertexai');

/**
 * OpenClaw Skill: Google Multimodal Eye
 *
 * Provides agents with "Vision" capabilities using Google's Gemini Pro Vision model via Vertex AI.
 * Agents can analyze images (from GCS or Base64) and answer questions about them.
 *
 * Prerequisites:
 * - Vertex AI API enabled.
 * - Project Location (e.g., us-central1).
 */

// Initialize Vertex AI
// Note: Project ID and Location should be injected or detected from environment.
const project = process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GCP_REGION || 'us-central1';

const vertex_ai = new VertexAI({ project: project, location: location });
const model = 'gemini-1.5-pro-preview-0409'; // Use latest stable multimodal model

// Instantiate the model
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    "max_output_tokens": 2048,
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32
  },
});

module.exports = {
  name: 'google-multimodal-eye',
  description: 'Analyze images and video frames using Gemini Multimodal AI.',

  actions: {
    /**
     * Analyze an image and answer a prompt about it.
     * @param {string} prompt - The question (e.g., "What is wrong with this device?").
     * @param {string} mime_type - Mime type of the image (e.g., "image/jpeg").
     * @param {string} data_base64 - Base64 encoded image data.
     */
    analyze_image: async ({ prompt, mime_type, data_base64 }) => {
      const request = {
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mime_type, data: data_base64 } }
          ]
        }]
      };

      try {
        const streamingResp = await generativeModel.generateContentStream(request);
        const aggregatedResponse = await streamingResp.response;
        return aggregatedResponse.candidates[0].content.parts[0].text;
      } catch (error) {
        throw new Error(`Gemini Vision Failed: ${error.message}`);
      }
    },

    /**
     * Analyze a document or image stored in GCS.
     * @param {string} prompt - The question.
     * @param {string} gcs_uri - The URI (gs://bucket/object).
     * @param {string} mime_type - Mime type.
     */
    analyze_gcs_file: async ({ prompt, gcs_uri, mime_type }) => {
       const request = {
        contents: [{
          role: 'user',
          parts: [
            { text: prompt },
            { file_data: { mime_type: mime_type, file_uri: gcs_uri } }
          ]
        }]
      };

      try {
        const streamingResp = await generativeModel.generateContentStream(request);
        const aggregatedResponse = await streamingResp.response;
        return aggregatedResponse.candidates[0].content.parts[0].text;
      } catch (error) {
        throw new Error(`Gemini Vision (GCS) Failed: ${error.message}`);
      }
    }
  }
};
