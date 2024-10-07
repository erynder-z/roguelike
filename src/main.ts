import './styles/cssReset.css';
import './styles/style-main.css';
import { Builder } from './components/Builder/Builder';
import { ColorLoader } from './loaders/ColorLoader';
import { DynamicScreenMaker } from './components/Screens/DynamicScreenMaker';
import { GenerateMainUI } from './components/Utilities/GenerateMainUI';
import { GenerateTitleScreen } from './components/Utilities/GenerateTitleScreen';
import { GlyphLoader } from './loaders/GlyphLoader';
import { initParams } from './initParams/InitParams';
import { invoke } from '@tauri-apps/api/core';

const initializeGame = async () => {
  try {
    if (!initParams) throw new Error('initParams not defined');

    const { SHOW_MENU, seed, player } = initParams;

    // Parallel Initialization of Colors and Glyphs
    await Promise.all([
      ColorLoader.initializeColors(),
      GlyphLoader.initializeGlyphs(),
    ]);

    // Conditional UI Generation Based on SHOW_MENU
    if (SHOW_MENU) {
      await GenerateTitleScreen.generate();
    } else {
      const titleContainer = document.getElementById('title-container');
      if (titleContainer) titleContainer.remove();
      await DynamicScreenMaker.runBuilt_InitialGameSetup(
        new Builder(seed, player),
        seed,
      );
    }

    // Generate Main UI
    await GenerateMainUI.generate();
  } catch (error) {
    console.error('Error initializing game:', error);
  }
};

// DOMContentLoaded Event Listener
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeGame();
    invoke('show_main_window');
  } catch (error) {
    console.error('Failed to initialize the game:', error);
  }
});
