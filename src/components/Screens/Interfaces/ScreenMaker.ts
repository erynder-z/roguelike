import { GameIF } from '../../Builder/Interfaces/Game';
import { StackScreen } from '../../Terminal/Interfaces/StackScreen';

/**
 * Represents an interface for a screen maker that produces different StackScreens for specific game states.
 */
export interface ScreenMaker {
  /**
   * Creates a new game StackScreen.
   *
   * @returns {StackScreen} A StackScreen representing the initial state of a new game.
   */
  newGame(): StackScreen;

  /**
   * Creates a game over StackScreen.
   *
   * @returns {StackScreen} A StackScreen representing the game over state.
   */
  gameOver(): StackScreen;

  more(game: GameIF | null): StackScreen;
}
