import { BaseScreen } from './baseScreen';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';

/**
 * Represents a screen for displaying additional content.
 */
export class SomeScreen extends BaseScreen {
  public name = 'SomeScreen';

  constructor(game: GameState, make: ScreenMaker) {
    super(game, make);
  }

  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {}
}
