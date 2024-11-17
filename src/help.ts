import './styles/cssReset.css';
import './styles/style-help.css';
import { ColorLoader } from './loaders/colorLoader';
import { emit } from '@tauri-apps/api/event';
import { GenerateHelpUI } from './utilities/generateHelpUI';
import { handleGlobalKeydown } from './utilities/handleGlobalKeyDown';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await ColorLoader.initializeColors();
    await GenerateHelpUI.generate();

    // Emit content-loaded event to show the help screen only after the DOM content is loaded
    emit('content-loaded');
  } catch (error) {
    console.error('Error initializing help:', error);
  }

  document.addEventListener('keydown', handleGlobalKeydown);
});
