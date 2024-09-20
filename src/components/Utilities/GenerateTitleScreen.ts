import { Builder } from '../Builder/Builder';
import { DynamicScreenMaker } from '../Screens/DynamicScreenMaker';
import { InitParamsType } from '../../initParams/InitParams';

export class GenerateTitleScreen {
  /**
   * Generates a title screen and inserts it at the start of the document.
   * The title screen will be passed the given seed.
   * The title screen will dispatch a 'start-new-game' event when the user chooses to start the game.
   * The title screen will dispatch a 'change-seed' event when the user chooses to change the seed.
   * @param {InitParamsType} initParams - The initialization parameters to pass to the title screen.
   */
  public static generate(initParams: InitParamsType) {
    const titleScreen = document.createElement('title-screen');
    const titleContainer = document.createElement('div');
    titleContainer.id = 'title-container';
    titleContainer.appendChild(titleScreen);

    document.body.insertBefore(titleContainer, document.body.firstChild);

    titleScreen.dispatchEvent(
      new CustomEvent('pass-initParams', { detail: { initParams } }),
    );

    titleScreen.addEventListener('start-new-game', () => {
      titleContainer.remove();

      DynamicScreenMaker.runBuilt_InitialGameSetup(
        new Builder(initParams.seed),
        initParams.seed,
      );
    });

    titleScreen.addEventListener('change-seed', () => {
      initParams.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

      titleScreen.dispatchEvent(
        new CustomEvent('pass-initParams', { detail: { initParams } }),
      );
    });
  }
}
