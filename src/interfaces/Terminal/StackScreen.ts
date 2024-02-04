import { DrawableTerminal } from './DrawableTerminal';
import { Stack } from './Stack';

/**
 * Represents an interface for a screen that can be part of a stack of screens.
 */
export interface StackScreen {
  /**
   * Draws the content of the screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which the screen is drawn.
   */
  drawTerminal(term: DrawableTerminal): void;

  /**
   * Handles keyboard events specific to the screen, considering the current state of the stack.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @param {Stack} stack - The stack to which the screen belongs.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void;

  /**
   * The name associated with the screen. This provides a unique identifier for the screen.
   *
   * @type {string}
   */
  name: string;
}
