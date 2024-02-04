import { DrawableTerminal } from './DrawableTerminal';

/**
 * Represents the interface for a raw screen in a terminal application.
 * Raw screens are responsible for rendering terminal content and handling keyboard events.
 *
 */
export interface InteractiveScreen {
  /**
   * Renders the terminal content on the raw screen.
   *
   * @param {TerminalInterface} term - The terminal interface to be rendered on the screen.
   */
  drawTerminal(term: DrawableTerminal): void;

  /**
   * Handles keyboard events on the raw screen.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   */
  handleKeyDownEvent(event: KeyboardEvent): void;

  /**
   * The name associated with the raw screen. This provides a unique identifier for the screen.
   *
   */
  name: string;
}
