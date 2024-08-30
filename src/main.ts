import './cssReset.css';
import './style.css';
import { Builder } from './components/Builder/Builder';
import { DynamicScreenMaker } from './components/Screens/DynamicScreenMaker';

const SHOW_MENU: boolean = true;
const seed: number = 99;

const showTitleScreen = () => {
  const titleScreen = document.createElement('title-screen');
  const titleContainer = document.createElement('div');
  titleContainer.id = 'title-container';
  titleContainer.appendChild(titleScreen);

  document.body.insertBefore(titleContainer, document.body.firstChild);

  titleScreen.dispatchEvent(new CustomEvent('pass-seed', { detail: { seed } }));
  titleScreen.addEventListener('start-new-game', () => {
    titleContainer.remove();
    DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder(seed), seed);
  });
};

const runGameDirectly = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.getElementById('title-container');

    if (titleContainer) titleContainer.remove();

    DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder(seed), seed);
  });
};

if (SHOW_MENU) {
  showTitleScreen();
} else {
  runGameDirectly();
}
