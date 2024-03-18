import { DrawableTerminal } from '../components/Terminal/Interfaces/DrawableTerminal';
import { StackScreen } from '../components/Terminal/Interfaces/StackScreen';
import { TestTerminal } from './TestTerminal';

/**
 * Represents a test implementation of a screen for the game.
 * This screen is designed to be part of a stack of screens and provides basic handling of keyboard events.
 */
export class TestStackScreen implements StackScreen {
  /**
   * The name associated with the test stack screen.
   *
   * @type {string}
   */
  name: string = 'test2';

  /**
   * Handles keyboard events on the test stack screen.
   * Currently, this method is a placeholder (TODO).
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @param {Stack} stack - The stack to which the screen belongs.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    // TODO
  }

  /**
   * Draws a test pattern on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which the test pattern will be drawn.
   */
  drawScreen(term: DrawableTerminal): void {
    TestTerminal.drawPatternTest(term, '-');
  }
}
