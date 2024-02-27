import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
import { Stack } from '../../interfaces/Terminal/Stack';
import { StackScreen } from '../../interfaces/Terminal/StackScreen';

/**
 * Represents a game over screen implementation that is part of a terminal-based application stack.
 *
 */
export class GameOverScreen implements StackScreen {
  name: string = 'gameover';

  /**
   * Create an instance of the GameOverScreen class.
   *
   * @type {ScreenMaker}
   */
  constructor(public make: ScreenMaker) {}

  /**
   * Draws the content of the game over screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which the game over screen content is drawn.
   */
  drawScreen(term: DrawableTerminal): void {
    term.drawText(1, 1, 'Game Over', 'yellow', 'red');
  }

  /**
   * Handles keyboard events specific to the game over screen.
   * Pops the current screen from the stack and pushes a new game screen.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @param {Stack} stack - The stack to which the game over screen belongs.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    stack.pop();
    stack.push(this.make.newGame());
  }
}
