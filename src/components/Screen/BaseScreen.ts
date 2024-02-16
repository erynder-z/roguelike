import { GameIF } from '../../interfaces/Builder/Game';
import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
import { Stack } from '../../interfaces/Terminal/Stack';
import { StackScreen } from '../../interfaces/Terminal/StackScreen';
import { DrawMap } from '../MapModel/DrawMap';
import { GameMap } from '../MapModel/GameMap';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a base screen implementation that implements the StackScreen interface.
 */
export class BaseScreen implements StackScreen {
  name: string = 'BaseScreen';
  constructor(
    public game: GameIF,
    public make: ScreenMaker,
  ) {}

  /**
   * Draw the terminal.
   *
   * @param {DrawableTerminal} term - the terminal to draw
   * @return {void}
   */
  drawTerminal(term: DrawableTerminal): void {
    DrawMap.drawMapPlayer(
      term,
      <GameMap>this.game.currentMap(),
      this.game.player.pos,
      this.game,
    );
    DrawMap.renderStats(term, this.game);
  }

  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {}

  /**
   * Process the non-player character's turns.
   *
   * @param {Stack} s - the stack to be processed
   * @return {void}
   */
  npcTurns(s: Stack): void {
    const player = <Mob>this.game.player;
    const map = <GameMap>this.game.currentMap();
    const queue = map.queue;
    let m: Mob;
    for (m = queue.next(); !m.isPlayer && !this.over(s); m = queue.next()) {
      this.npcTurn(m, player);
    }
  }

  /**
   * Perform the NPC's turn in the game.
   *
   * @param {Mob} m - the NPC performing the turn
   * @param {Mob} ply - the player involved in the turn
   */
  npcTurn(m: Mob, ply: Mob) {
    const ai = this.game.ai;
    if (ai) {
      ai.turn(m, ply, this.game);
    }
  }

  /**
   * Determine if the stack is over
   *
   * @param {Stack} s - the stack to check
   * @return {boolean} true if the stack is over, false otherwise
   */
  over(s: Stack): boolean {
    const over = !this.game.player.isAlive();
    if (over) {
      s.pop();
      s.push(this.make.gameOver());
    }
    return over;
  }
}
