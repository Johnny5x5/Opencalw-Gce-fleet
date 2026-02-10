const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * OpenClaw Skill: Android Operator
 *
 * Provides an interface to the Android Debug Bridge (ADB) and Android SDK Tools.
 * Allows the agent to interact with connected (or emulated) Android devices.
 *
 * Prerequisites:
 * - ANDROID_HOME and PATH must be set (done by bootstrap_agent.sh).
 * - ADB server must be running (or auto-started).
 */

module.exports = {
  name: 'android-operator',
  description: 'Manage and interact with Android devices using ADB and SDK tools.',

  actions: {
    /**
     * Lists connected devices/emulators.
     */
    list_devices: async () => {
      try {
        const { stdout } = await execPromise('adb devices -l');
        return stdout.trim();
      } catch (error) {
        throw new Error(`ADB List Failed: ${error.message}`);
      }
    },

    /**
     * Installs an APK from a local path or URL (downloaded first).
     * @param {string} apk_path - Local path to the APK file.
     */
    install_apk: async ({ device_id, apk_path }) => {
      const target = device_id ? `-s ${device_id}` : '';
      try {
        const { stdout } = await execPromise(`adb ${target} install "${apk_path}"`);
        return stdout.trim();
      } catch (error) {
        throw new Error(`APK Install Failed: ${error.message}`);
      }
    },

    /**
     * Runs a shell command on the Android device.
     * @param {string} command - The shell command to run (e.g., 'pm list packages').
     */
    shell_exec: async ({ device_id, command }) => {
      const target = device_id ? `-s ${device_id}` : '';
      try {
        // Sanitize command somewhat or trust the agent?
        // For now, we trust the agent but wrap in quotes if needed.
        const { stdout } = await execPromise(`adb ${target} shell "${command}"`);
        return stdout.trim();
      } catch (error) {
        throw new Error(`Shell Command Failed: ${error.message}`);
      }
    },

    /**
     * Lists installed SDK packages using sdkmanager.
     */
    list_sdk_packages: async () => {
      try {
        const { stdout } = await execPromise('sdkmanager --list_installed');
        return stdout.trim();
      } catch (error) {
        throw new Error(`SDK Manager List Failed: ${error.message}`);
      }
    }
  }
};
