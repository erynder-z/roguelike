import './styles/cssReset.css';
import './styles/style-help.css';
import { ColorLoader } from './loaders/colorLoader';
import { emit } from '@tauri-apps/api/event';
import { GenerateHelpUI } from './utilities/generateHelpUI';

document.addEventListener('DOMContentLoaded', async () => {
  await ColorLoader.initializeColors();
  await GenerateHelpUI.generate();

  // Emit content-loaded event to show the help screen only after the DOM content is loaded
  emit('content-loaded');
});
