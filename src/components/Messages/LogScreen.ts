import { GameIF } from '../../interfaces/Builder/Game';
import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
import { Stack } from '../../interfaces/Terminal/Stack';
import { BaseScreen } from '../Screen/BaseScreen';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  name: string = 'LogScreen';
  messageLog: string[];

  /**
   * Creates an instance of LogScreen.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} make - The screen maker.
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
    this.messageLog = game.log.archive;
  }

  /**
   * Draws the log screen on the terminal.
   * @param {DrawableTerminal} term - The drawable terminal.
   * @returns {void}
   */
  drawScreen(term: DrawableTerminal): void {
    const x = 0;
    const y = 0;
    term.drawText(x, y, 'Log: ', 'yellow', 'black');

    const log = this.messageLog;
    let range = term.dimensions.y - 1;
    if (log.length < range) range = log.length;

    const offset = log.length - range;

    for (let p = 0; p < range; ++p) {
      const pos = offset + p;
      if (pos < 0) continue;
      const row = log[pos];
      term.drawText(0, 1 + p, `${p} ${row}`, 'yellow', 'black');
    }
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    stack.pop();
    return true;
  }
}
