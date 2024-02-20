import { GameIF } from '../../interfaces/Builder/Game';
import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { Stack } from '../../interfaces/Terminal/Stack';
import { BaseScreen } from './BaseScreen';

/**
 * Represents a screen for displaying additional content.
 */
export class MoreScreen extends BaseScreen {
  name = 'MoreScreen';

  /**
   * Creates an instance of MoreScreen.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} make - The screen maker.
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
  }

  /**
   * Handles the key down event.
   * Dequeues a message from the log and pops the screen stack if no more messages are available.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {void}
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    const log = this.game.log;
    log.dequeue();
    if (!log.hasQueuedMessages()) stack.pop();
  }
}
