import './cssReset.css';
import './style.css';
import { Builder } from './components/Builder/Builder';
import { DynamicScreenMaker } from './components/Screens/DynamicScreenMaker';

const SHOW_MENU = false;

const showTitleScreen = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.getElementById('title-container');

    document
      .querySelector('title-screen')
      ?.addEventListener('start-new-game', () => {
        if (titleContainer) {
          titleContainer.remove();
        }

        DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder());
      });
  });
};

const runGameDirectly = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const titleContainer = document.getElementById('title-container');

    if (titleContainer) titleContainer.remove();

    DynamicScreenMaker.runBuilt_InitialGameSetup(new Builder());
  });
};

SHOW_MENU ? showTitleScreen() : runGameDirectly();
