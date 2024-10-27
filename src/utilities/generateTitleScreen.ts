import { Builder } from '../gameBuilder/builder';
import { gameConfig } from '../gameConfig/gameConfig';
import { DynamicScreenMaker } from '../gameLogic/screens/dynamicScreenMaker';
import { GlyphLoader } from '../loaders/glyphLoader';

export class GenerateTitleScreen {
  /**
   * Generates a title screen and inserts it at the start of the document.
   * The title screen will be passed the given seed.
   * The title screen will dispatch a 'start-new-game' event when the user chooses to start the game.
   * The title screen will dispatch a 'change-seed' event when the user chooses to change the seed.
   */
  public static async generate() {
    const body = document.getElementById('body-main');

    if (!body) {
      console.error('Body element not found');
      return;
    }

    const titleScreen = document.createElement('title-screen');
    const titleContainer = document.createElement('div');
    titleContainer.id = 'title-container';
    titleContainer.appendChild(titleScreen);

    // Ensure the titleContainer is the first child of the body
    if (body.firstChild) {
      body.insertBefore(titleContainer, body.firstChild);
    } else {
      body.appendChild(titleContainer);
    }

    // Add event listeners to start a new game
    titleScreen.addEventListener('start-new-game', async () => {
      try {
        titleContainer.remove();
        await GlyphLoader.initializeGlyphs();
        DynamicScreenMaker.runBuilt_InitialGameSetup(
          new Builder(gameConfig.seed, gameConfig.player),
          gameConfig.seed,
        );
      } catch (error) {
        console.error('Error starting new game:', error);
      }
    });
  }
}
