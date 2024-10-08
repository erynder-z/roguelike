import './styles/cssReset.css';
import './styles/style-main.css';
import { Builder } from './gameBuilder/builder';
import { buildParameters } from './buildParameters/buildParameters';
import { ColorLoader } from './loaders/colorLoader';
import { DynamicScreenMaker } from './gameLogic/screens/dynamicScreenMaker';
import { GenerateMainUI } from './utilities/generateMainUI';
import { GenerateTitleScreen } from './utilities/generateTitleScreen';
import { GlyphLoader } from './loaders/glyphLoader';
import { invoke } from '@tauri-apps/api/core';

const initializeGame = async () => {
  try {
    if (!buildParameters) throw new Error('buildParameters not defined');

    const { SHOW_MENU, seed, player } = buildParameters;

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
