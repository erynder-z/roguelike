import { BaseScreen } from './baseScreen';
import { DrawableTerminal } from '../../terminal/types/drawableTerminal';
import { DrawUI } from '../../renderer/drawUI';
import { GameMap } from '../../maps/mapModel/gameMap';
import { GameState } from '../../gameBuilder/types/gameState';
import { ScreenMaker } from './types/ScreenMaker';
import { Stack } from '../../terminal/types/stack';

export class DebuggerScreen extends BaseScreen {
  public name = 'debugger-screen';

  constructor(game: GameState, make: ScreenMaker) {
    super(game, make);
  }

  /**
   * Draws the game screen for the debugger.
   *
   * @param {DrawableTerminal} term - the terminal to draw on
   * @return {void}
   */
  public drawScreen(term: DrawableTerminal): void {
    DrawUI.debugDrawMap(
      term,
      <GameMap>this.game.currentMap(),
      this.game.player.pos,
    );
  }

  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    switch (event.code) {
      case 'Home':
        stack.pop();
        break;
    }
  }
}
