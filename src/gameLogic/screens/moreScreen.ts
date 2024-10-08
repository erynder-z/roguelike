import { BaseScreen } from './baseScreen';
import { GameState } from '../../gameBuilder/types/gameState';
import { ScreenMaker } from './types/ScreenMaker';
import { Stack } from '../../terminal/types/stack';

/**
 * Represents a screen for displaying additional content.
 */
export class MoreScreen extends BaseScreen {
  public name = 'MoreScreen';

  constructor(game: GameState, make: ScreenMaker) {
    super(game, make);
  }

  /**
   * Handles the key down event.
   * Dequeues a message from the log and pops the screen stack if no more messages are available.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {void}
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    const { log } = this.game;

    log.dequeue();
    if (!log.hasQueuedMessages()) stack.pop();
  }
}
