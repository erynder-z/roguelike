import './styles/cssReset.css';
import './styles/style-help.css';
import { ColorLoader } from './loaders/colorLoader';
import { gameConfigManager } from './gameConfigManager/gameConfigManager';
import { GenerateHelpUI } from './utilities/generateHelpUI';
import { handleGlobalKeydown } from './utilities/handleGlobalKeyDown';
import { invoke } from '@tauri-apps/api/core';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await gameConfigManager.initialize();

    // Parallel Initialization of Colors and UI
    await Promise.all([
      ColorLoader.initializeColors(),
      GenerateHelpUI.generate(),
    ]);

    // Unhide the help window that is hidden on initialization for a better user experience
    invoke('show_hidden_help_window');
  } catch (error) {
    console.error('Error initializing help:', error);
  }

  document.addEventListener('keydown', handleGlobalKeydown);
});
