import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { StackScreen } from '../../interfaces/Terminal/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { DummyScreen } from './DummyScreen';
import { GameOverScreen } from './GameOverScreen';

export interface Game {
  //TODO
}

export interface GameBuilder {
  makeGame(): Game;
}

/**
 * Represents a dynamic screen maker that can create screens based on provided game states.
 *
 * @implements {ScreenMaker}
 */
export class ScreenMaker_Dynamic implements ScreenMaker {
  game: Game | null = null;

  /**
   * Creates an instance of DynamicScreenMaker.
   *
   * @param {GameBuilder} builder - The builder for creating games.
   * @param {Function} gameScreen - The function to create a game screen.
   * @param {Function} overScreen - The function to create a game over screen.
   * @param {Function} init - The function to initialize screens.
   */
  constructor(
    public builder: GameBuilder,
    public gameScreen: (game: Game, sm: ScreenMaker) => StackScreen,
    public overScreen: (game: Game, sm: ScreenMaker) => StackScreen,
    public init: (sm: ScreenMaker) => StackScreen,
  ) {}

  /**
   * Creates a new game screen.
   *
   * @returns {StackScreen} A StackScreen representing the initial state of a new game.
   */
  newGame(): StackScreen {
    this.game = this.builder.makeGame();
    return this.gameScreen(<Game>this.game, this);
  }

  /**
   * Creates a game over screen.
   *
   * @returns {StackScreen} A StackScreen representing the game over state.
   */
  gameOver(): StackScreen {
    return this.overScreen(<Game>this.game, this);
  }

  /**
   * Runs a dynamic screen sequence.
   *
   * @param {ScreenMaker_Dynamic} dynamicScreenMaker - The dynamic screen maker instance to run.
   */
  static runDynamic(dynamicScreenMaker: ScreenMaker_Dynamic) {
    ScreenStack.run_StackScreen(dynamicScreenMaker.init(dynamicScreenMaker));
  }

  /**
   * Runs a predefined sequence where the game over screen is shown first.
   *
   * @param {GameBuilder} builder - The builder for creating games.
   */
  static runBuilt_GameOverFirst(builder: GameBuilder) {
    const dynamicScreenMaker = new ScreenMaker_Dynamic(
      builder,
      (g: Game, sm: ScreenMaker) => new DummyScreen(sm),
      (g: Game, sm: ScreenMaker) => new GameOverScreen(sm),
      (sm: ScreenMaker) => sm.gameOver(),
    );
    this.runDynamic(dynamicScreenMaker);
  }
}
