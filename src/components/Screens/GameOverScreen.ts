import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { ScreenMaker } from './Types/ScreenMaker';

/**
 * Represents a game over screen implementation that is part of a terminal-based application stack.
 */
export class GameOverScreen implements StackScreen {
  public name = 'gameover';
  constructor(public make: ScreenMaker) {}

  /**
   * Draws the content of the game over screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which the game over screen content is drawn.
   */
  public drawScreen(term: DrawableTerminal): void {
    term.drawText(1, 1, 'Game Over', 'yellow', 'red');
  }

  public onTime(): boolean {
    return false;
  }

  /**
   * Handles keyboard events specific to the game over screen.
   * Pops the current screen from the stack and pushes a new game screen.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @param {Stack} stack - The stack to which the game over screen belongs.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    stack.pop();
    stack.push(this.make.newGame());
  }
}
