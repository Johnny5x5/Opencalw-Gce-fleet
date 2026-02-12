const { exec } = require('child_process');
const fs = require('fs/promises');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

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
