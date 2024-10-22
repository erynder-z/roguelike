import { BaseScreen } from './baseScreen';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';

/**
 * This class only creates a custom component for the ingame menu. All logic for the ingame menu is handled in the ingame-menu component.
 */
export class IngameMenuScreen extends BaseScreen {
  public name = 'ingame-menu';
  private stack: Stack;

  constructor(game: GameState, make: ScreenMaker, stack: Stack) {
    super(game, make);
    this.stack = stack;
  }

  /**
   * Draws the in-game menu screen by creating and prepending the 'ingame-menu'
   * element to the main body if it does not already exist, and adds an event listener
   * to handle returning to the game. The screen is only drawn if neither 'ingame-menu'
   * nor 'options-menu' elements are present in the document.
   *
   * @return {void}
   */
  public drawScreen(): void {
    if (
      !document.querySelector('ingame-menu') &&
      !document.querySelector('options-menu')
    ) {
      const body = document.getElementById('body-main');
      const menuScreen = document.createElement('ingame-menu');
      body?.prepend(menuScreen);

      menuScreen.addEventListener('return-to-game', () => {
        this.stack.pop();
      });
    }
  }
}

/* TODO: Find a more elegant way to handle the ingame menu. Right now there are two "screens": this IngameMenuScreen thats is living on the stack and ingame-menu web-coponent that handles all the logic and display */
