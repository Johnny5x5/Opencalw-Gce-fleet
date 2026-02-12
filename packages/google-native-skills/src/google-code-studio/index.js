const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const { VertexAI } = require('@google-cloud/vertexai');

const execPromise = util.promisify(exec);

// Initialize Vertex AI for Code Review (Codey/Gemini)
const project = process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
const location = process.env.GCP_REGION || 'us-central1';
const vertex_ai = new VertexAI({ project: project, location: location });
const codeModel = vertex_ai.preview.getGenerativeModel({ model: 'gemini-1.5-pro-preview-0409' });

/**
 * OpenClaw Skill: Google Code Studio (Enhanced)
 *
 * Provides agents with comprehensive file system and shell access.
 */

module.exports = {
  name: 'google-code-studio',
  description: 'Execute shell commands, manage git, and read/write files.',

  actions: {
    // --- Shell ---
    shell_exec: async ({ command, cwd }) => {
      try {
        const { stdout, stderr } = await execPromise(command, { cwd: cwd || process.cwd() });
        return `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
      } catch (error) {
        return `ERROR: ${error.message}\nSTDOUT:\n${error.stdout}\nSTDERR:\n${error.stderr}`;
      }
    },

    // --- File System ---
    read_file: async ({ filepath }) => {
      try {
        const content = await fs.readFile(filepath, 'utf8');
        return content;
      } catch (error) {
        throw new Error(`Read File Failed: ${error.message}`);
      }
    },

    write_file: async ({ filepath, content }) => {
      try {
        await fs.mkdir(path.dirname(filepath), { recursive: true });
        await fs.writeFile(filepath, content, 'utf8');
        return `File written: ${filepath}`;
      } catch (error) {
        throw new Error(`Write File Failed: ${error.message}`);
      }
    },

    list_dir_recursive: async ({ dir }) => {
      // Simple recursive list using find (Linux)
      try {
        const { stdout } = await execPromise(`find ${dir || '.'} -not -path '*/.*'`, { maxBuffer: 1024 * 1024 * 10 }); // 10MB buffer
        return stdout;
      } catch (error) {
        throw new Error(`List Dir Failed: ${error.message}`);
      }
    },

    // --- AI Code Intelligence ---
    review_code: async ({ code, context }) => {
      const prompt = `
      You are an Expert Senior Software Engineer (Codey).
      Review the following code snippet for logic errors, security vulnerabilities, and style issues.

      Context: ${context || 'General Code Review'}

      Code:
      \`\`\`
      ${code}
      \`\`\`

      Provide a concise review:
      1. Critical Issues (Bugs/Security)
      2. Suggestions for Improvement
      3. Approval Status (APPROVE / REJECT)
      `;

      try {
        const result = await codeModel.generateContent(prompt);
        const response = await result.response;
        return response.candidates[0].content.parts[0].text;
      } catch (error) {
        return `Code Review Failed: ${error.message}`;
      }
    },

    generate_test_plan: async ({ code }) => {
      const prompt = `
      Generate a comprehensive Unit Test Plan for this code.
      Output a list of test cases (Happy Path, Edge Cases, Error States).

      Code:
      \`\`\`
      ${code}
      \`\`\`
      `;
      try {
        const result = await codeModel.generateContent(prompt);
        const response = await result.response;
        return response.candidates[0].content.parts[0].text;
      } catch (error) {
        return `Test Plan Failed: ${error.message}`;
      }
    },

    // --- Security ---
    security_audit: async () => {
      try {
        // Run npm audit
        const { stdout } = await execPromise('npm audit --json');
        const report = JSON.parse(stdout);
        const vulnerabilities = report.metadata.vulnerabilities;
        return `Security Audit Complete. Critical: ${vulnerabilities.critical}, High: ${vulnerabilities.high}, Moderate: ${vulnerabilities.moderate}, Low: ${vulnerabilities.low}`;
      } catch (error) {
        // npm audit returns non-zero exit code if issues found
        if (error.stdout) {
           const report = JSON.parse(error.stdout);
           const vulnerabilities = report.metadata.vulnerabilities;
           return `Security Audit FAILED. Critical: ${vulnerabilities.critical}, High: ${vulnerabilities.high}. Immediate Fix Required.`;
        }
        return `Audit Failed: ${error.message}`;
      }
    },

    // --- Git ---
    git_commit: async ({ message }) => {
      try {
        await execPromise('git config --global user.email "agent@openclaw.ai"');
        await execPromise('git config --global user.name "OpenClaw Engineer"');
        await execPromise('git add .');
        const { stdout } = await execPromise(`git commit -m "${message}"`);
        return stdout;
      } catch (error) {
        // If nothing to commit, return clean status
        if (error.stdout && error.stdout.includes('nothing to commit')) {
          return 'Nothing to commit.';
        }
        throw new Error(`Git Commit Failed: ${error.message}`);
      }
    }
  }
};
