import './styles/cssReset.css';
import './styles/style-main.css';
import { Builder } from './components/Builder/Builder';
import { DynamicScreenMaker } from './components/Screens/DynamicScreenMaker';
import { GenerateTitleScreen } from './components/Utilities/GenerateTitleScreen';
import { initializeColors } from './components/Utilities/color.loader';
import { invoke } from '@tauri-apps/api/tauri';

const SHOW_MENU: boolean = true;
const seed: number = 1337;

const runGameDirectly = () => {
  const titleContainer = document.getElementById('title-container');

  if (titleContainer) titleContainer.remove();

  DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder(seed), seed);
};

if (SHOW_MENU) {
  GenerateTitleScreen.generate(seed);
} else {
  runGameDirectly();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeColors();
  invoke('close_splashscreen');
});
