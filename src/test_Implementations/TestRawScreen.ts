import { InteractiveScreen } from '../interfaces/Terminal/InteractiveScreen';
import { Terminal } from '../components/Terminal/Terminal';
import { TestTerminal } from './TestTerminal';

/**
 * A test implementation of a raw screen for a terminal application.
 *
 */
export class TestRawScreen implements InteractiveScreen {
  /**
   * The name associated with the test raw screen.
   *
   * @type {string}
   */
  name: string = 'TestRawScreen';

  /**
   * The last pressed key on the test raw screen.
   *
   * @type {string}
   */
  key: string = '-';

  /**
   * Handles the keydown event by updating the last pressed key on the test raw screen.
   *
   * @param {KeyboardEvent} e - The keyboard event to be handled.
   */
  handleKeyDownEvent(e: KeyboardEvent): void {
    this.key = e.key;
  }

  /**
   * Draws a test pattern on the provided terminal based on the last pressed key.
   *
   * @param {Terminal} term - The terminal on which the test pattern will be drawn.
   */
  drawTerminal(term: Terminal): void {
    TestTerminal.drawPatternTest(term, this.key);
  }
}
