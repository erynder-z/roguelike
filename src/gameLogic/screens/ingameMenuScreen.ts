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
   * Draws the options screen on the terminal if it does not already exist.
   *
   * @return {void} This function does not return anything.
   */
  public drawScreen(): void {
    if (!document.querySelector('ingame-menu')) {
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
