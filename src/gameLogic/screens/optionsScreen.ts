import { BaseScreen } from './baseScreen';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';

/**
 * Represents a screen for displaying the options menu.
 */
export class OptionsScreen extends BaseScreen {
  public name = 'options-menu';

  constructor(game: GameState, make: ScreenMaker) {
    super(game, make);
  }

  /**
   * Draws the options screen on the terminal if it does not already exist.
   *
   * @return {void} This function does not return anything.
   */
  public drawScreen(): void {
    if (!document.querySelector('options-menu')) {
      const body = document.getElementById('body-main');
      const menuScreen = document.createElement('options-menu');
      body?.prepend(menuScreen);
    }
  }

  /**
   * Handles key down events for the options screen.
   *
   * This function listens for the 'R' key and pops the current screen from the stack.
   *
   * @param {KeyboardEvent} event - the keyboard event
   * @param {Stack} stack - the stack of screens
   * @return {void}
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    switch (event.key) {
      case 'R':
        stack.pop();
        break;
      default:
        break;
    }
  }
}
