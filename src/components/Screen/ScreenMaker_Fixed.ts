import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { StackScreen } from '../../interfaces/Terminal/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { DummyScreen } from './DummyScreen';
import { GameOverScreen } from './GameOverScreen';

/**
 * A factory class for creating predefined screens and orchestrating screen sequences.
 *
 * @implements {ScreenMaker}
 */
export class ScreenMaker_Fixed implements ScreenMaker {
  /**
   * Creates a new game screen.
   *
   * @returns {StackScreen} A StackScreen representing the initial state of a new game.
   */
  newGame(): StackScreen {
    return new DummyScreen(this);
  }

  /**
   * Creates a game over screen.
   *
   * @returns {StackScreen} A StackScreen representing the game over state.
   */
  gameOver(): StackScreen {
    return new GameOverScreen(this);
  }

  /**
   * Runs a sequence where the game over screen is shown first.
   *
   * @param {ScreenMaker} m - The screen maker to use for creating screens.
   */
  static run_GameOverFirstSequence(m: ScreenMaker) {
    ScreenStack.run_StackScreen(m.gameOver());
  }

  /**
   * Creates a ScreenMaker instance with stock screen configurations.
   *
   * @returns {ScreenMaker} A ScreenMaker instance with stock screens.
   */
  static createStockScreenMaker(): ScreenMaker {
    return new ScreenMaker_Fixed();
  }

  /**
   * Runs a predefined sequence where the game over screen is shown first using stock screens.
   */
  static run_GameOverFirstWithStockScreens() {
    this.run_GameOverFirstSequence(this.createStockScreenMaker());
  }
}
