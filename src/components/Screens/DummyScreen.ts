import { ScreenMaker } from './Interfaces/ScreenMaker';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';

/**
 * Represents a dummy screen implementation for the game.
 *
 */
export class DummyScreen implements StackScreen {
  name: string = 'dummy2';

  /**
   * Creates a new instance of the DummyScreen class.
   *
   * @type {ScreenMaker}
   */
  constructor(public make: ScreenMaker) {}

  /**
   * Draws the content of the dummy screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which the dummy screen content is drawn.
   */
  drawScreen(term: DrawableTerminal): void {
    term.drawText(1, 1, 'Press key', 'cyan', 'blue');
  }

  /**
   * Handles keyboard events specific to the dummy screen.
   * Pops the current screen from the stack and pushes a new game over screen.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @param {Stack} stack - The stack to which the dummy screen belongs.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    stack.pop();
    stack.push(this.make.gameOver());
  }
}
