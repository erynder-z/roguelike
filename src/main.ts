import './styles/cssReset.css';
import './styles/style-main.css';
import { Builder } from './components/Builder/Builder';
import { DynamicScreenMaker } from './components/Screens/DynamicScreenMaker';
import { GenerateTitleScreen } from './components/Utilities/GenerateTitleScreen';
import { ColorLoader } from './components/Colors/ColorLoader';
import { invoke } from '@tauri-apps/api/tauri';
import { GlyphMap } from './components/Glyphs/GlyphMap';

const SHOW_MENU: boolean = true;
const seed: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
/* const seed: number = 1337; */

const initializeGame = async () => {
  await ColorLoader.initializeColors();
  await GlyphMap.initializeGlyphs();

  if (SHOW_MENU) {
    GenerateTitleScreen.generate(seed);
  } else {
    const titleContainer = document.getElementById('title-container');
    if (titleContainer) titleContainer.remove();

    DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder(seed), seed);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  await initializeGame();
  await invoke('close_splashscreen');
});
