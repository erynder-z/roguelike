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
 * Represents a dynamic screen maker that can create screens based on provided game states.
 *
 * @implements {ScreenMaker}
 */
export class DynamicScreenMaker implements ScreenMaker {
  game: GameIF | null = null;

  /**
   * Creates an instance of DynamicScreenMaker.
   *
   * @param {GameBuilder} builder - The builder for creating games.
   * @param {Function} gameScreen - The function to create a game screen.
   * @param {Function} overScreen - The function to create a game over screen.
   * @param {Function} init - The function to initialize screens.
   */
  constructor(
    public builder: BuildIF,
    public gameScreen: (game: GameIF, sm: ScreenMaker) => StackScreen,
    public overScreen: (game: GameIF, sm: ScreenMaker) => StackScreen,
    public moreScreen: (game: GameIF, sm: ScreenMaker) => StackScreen,
    public init: (sm: ScreenMaker) => StackScreen,
  ) {}

  /**
   * Creates a new game screen.
   *
   * @returns {StackScreen} A StackScreen representing the initial state of a new game.
   */
  newGame(): StackScreen {
    this.game = this.builder.makeGame();
    return this.gameScreen(<GameIF>this.game, this);
  }

  /**
   * Creates a game over screen.
   *
   * @returns {StackScreen} A StackScreen representing the game over state.
   */
  gameOver(): StackScreen {
    return this.overScreen(<GameIF>this.game, this);
  }

  more(game: GameIF | null): StackScreen {
    return this.moreScreen(<GameIF>game, this);
  }

  /**
   * Runs a dynamic screen sequence.
   *
   * @param {ScreenMaker_Dynamic} dynamicScreenMaker - The dynamic screen maker instance to run.
   */
  static runDynamic(dynamicScreenMaker: DynamicScreenMaker) {
    ScreenStack.run_StackScreen(dynamicScreenMaker.init(dynamicScreenMaker));
  }

  /**
   * Runs a predefined sequence where the game over screen is shown first.
   *
   * @param {GameBuilder} builder - The builder for creating games.
   */
  static runBuilt_InitialGameSetup(builder: BuildIF) {
    const dynamicScreenMaker = new DynamicScreenMaker(
      builder,
      (g: GameIF, sm: ScreenMaker) => new GameScreen(g, sm),
      (g: GameIF, sm: ScreenMaker) => new GameOverScreen(sm),
      (g: GameIF, sm: ScreenMaker) => new MoreScreen(g, sm),
      (sm: ScreenMaker) => sm.newGame(),
    );
    this.activateImageHandler();
    this.runDynamic(dynamicScreenMaker);
  }

  /**
   * Activates the image handler and displays a random neutral image.
   *
   * @return {void} This function does not return anything.
   */
  static activateImageHandler(): void {
    const randomImage =
      neutralImages[Math.floor(Math.random() * neutralImages.length)];

    const imageHandler = ImageHandler.getInstance();
    const image = new Image();
    image.src = randomImage;
    imageHandler.displayImage(image, 'neutral');
  }
}
