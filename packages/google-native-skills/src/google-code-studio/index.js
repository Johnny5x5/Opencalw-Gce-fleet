const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * OpenClaw Skill: Google Code Studio
 *
 * Provides agents with "Hands" to write code, run tests, and manage git.
 * Essential for the Engineering Department.
 */

module.exports = {
  name: 'google-code-studio',
  description: 'Execute shell commands, git operations, and manage the file system.',

  actions: {
    /**
     * Run a shell command.
     * @param {string} command - The command to run (e.g., 'npm test').
     * @param {string} cwd - Working directory (optional).
     */
    shell_exec: async ({ command, cwd }) => {
      try {
        const { stdout, stderr } = await execPromise(command, { cwd: cwd || process.cwd() });
        return `STDOUT:\n${stdout}\nSTDERR:\n${stderr}`;
      } catch (error) {
        return `ERROR: ${error.message}\nSTDOUT:\n${error.stdout}\nSTDERR:\n${error.stderr}`;
      }
    },

    /**
     * Commit changes to git.
     * @param {string} message - Commit message.
     */
    git_commit: async ({ message }) => {
      try {
        await execPromise('git add .');
        const { stdout } = await execPromise(`git commit -m "${message}"`);
        return stdout;
      } catch (error) {
        throw new Error(`Git Commit Failed: ${error.message}`);
      }
    }
  }
};
