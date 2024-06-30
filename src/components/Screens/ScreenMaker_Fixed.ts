import { BuildIF } from '../Builder/Interfaces/BuildIF';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { GameOverScreen } from './GameOverScreen';
import { GameScreen } from './GameScreen';
import { MoreScreen } from './MoreScreen';
import { ImageHandler } from '../ImageHandler/ImageHandler';
import neutralImages from '../ImageHandler/neutralImages';

/**
 * Represents a screen maker implementation for creating screens.
 */
export class ScreenMaker_Fixed implements ScreenMaker {
  constructor(
    public build: BuildIF,
    public game: GameIF | null = null,
  ) {}
  /**
   * A function that handles the game over event.
   *
   * @return {StackScreen} the game over screen
   */
  public gameOver(): StackScreen {
    return new GameOverScreen(this);
  }
  /**
   * Creates a new game and returns the corresponding StackScreen.
   *
   * @return {StackScreen} The new game screen.
   */
  public newGame(): StackScreen {
    this.game = this.build.makeGame();
    return new GameScreen(<GameIF>this.game, this);
  }

  public more(game: GameIF | null): StackScreen {
    return new MoreScreen(<GameIF>game, this);
  }

  /**
   * run_InitialGameSetup function runs the initial setup for the game.
   *
   * @param {ScreenMaker} m - the screen maker object
   * @return {void}
   */
  private static run_InitialGameSetup(m: ScreenMaker): void {
    ScreenStack.run_StackScreen(m.newGame());
  }

  /**
   * Static method to create a StockMaker object using the provided Build1 object.
   *
   * @param {BuildIF} build - The Build object used to create the StockMaker.
   * @return {ScreenMaker} A new ScreenMaker object created using the provided Build1 object.
   */
  static StockMaker(build: BuildIF): ScreenMaker {
    return new ScreenMaker_Fixed(build);
  }

  /**
   * Initializes and displays the initial game setup screen.
   * @param {BuildIF} build - The build instance used for game creation.
   * @return {void}
   */
  public static InitialGameSetup(build: BuildIF): void {
    this.activateImageHandler();
    this.run_InitialGameSetup(this.StockMaker(build));
  }

  /**
   * Activates the image handler and displays a random neutral image.
   *
   * @return {void} This function does not return anything.
   */
  private static activateImageHandler(): void {
    const randomImage =
      neutralImages[Math.floor(Math.random() * neutralImages.length)];

    const imageHandler = ImageHandler.getInstance();
    const image = new Image();
    image.src = randomImage;
    imageHandler.displayImage(image, 'neutral');
  }
}
