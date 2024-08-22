import { BaseScreen } from './BaseScreen';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { GameState } from '../Builder/Types/GameState';
import { ScreenMaker } from './Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { DrawUI } from '../Renderer/DrawUI';
import { GameMap } from '../MapModel/GameMap';

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
