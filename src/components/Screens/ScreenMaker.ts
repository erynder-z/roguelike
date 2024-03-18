import { Build2 } from '../Builder/Interfaces/Builder2';
import { GameIF } from '../Builder/Interfaces/Game';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { GameOverScreen } from './GameOverScreen';
import { GameScreen } from './GameScreen';
import { MoreScreen } from './MoreScreen';

/**
 * Represents a screen maker implementation for creating screens.
 */
export class ScreenMaker2_Fixed implements ScreenMaker {
  game: GameIF | null = null;

  constructor(public build: Build2) {}
  /**
   * A function that handles the game over event.
   *
   * @return {StackScreen} the game over screen
   */
  gameOver(): StackScreen {
    return new GameOverScreen(this);
  }
  /**
   * Creates a new game and returns the corresponding StackScreen.
   *
   * @return {StackScreen} The new game screen.
   */
  newGame(): StackScreen {
    this.game = this.build.makeGame();
    return new GameScreen(<GameIF>this.game, this);
  }

  more(game: GameIF | null): StackScreen {
    return new MoreScreen(<GameIF>game, this);
  }

  /**
   * run_InitialGameSetup function runs the initial setup for the game.
   *
   * @param {ScreenMaker} m - the screen maker object
   * @return {void}
   */
  static run_InitialGameSetup(m: ScreenMaker): void {
    ScreenStack.run_StackScreen(m.newGame());
  }

  /**
   * Static method to create a StockMaker object using the provided Build1 object.
   *
   * @param {Build1} build - The Build1 object used to create the StockMaker.
   * @return {ScreenMaker} A new ScreenMaker object created using the provided Build1 object.
   */
  static StockMaker(build: Build2): ScreenMaker {
    return new ScreenMaker2_Fixed(build);
  }

  /**
   * Initializes and displays the initial game setup screen.
   * @param {Build1} build - The build instance used for game creation.
   * @return {void}
   */
  static InitialGameSetup(build: Build2): void {
    this.run_InitialGameSetup(this.StockMaker(build));
  }
}
