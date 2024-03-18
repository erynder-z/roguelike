import { GameIF } from '../Builder/Interfaces/Game';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';
import { DrawMap } from '../MapModel/DrawMap';
import { GameMap } from '../MapModel/GameMap';
import { Mob } from '../Mobs/Mob';
import { TurnQueue } from '../TurnQueue/TurnQueue';

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
  drawScreen(term: DrawableTerminal): void {
    DrawMap.drawMapPlayer(
      term,
      <GameMap>this.game.currentMap(),
      this.game.player.pos,
      this.game,
    );
    DrawMap.renderStats(term, this.game);
    DrawMap.renderMessage(term, this.game);
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
    const q = map.queue;
    this.finishPlayerTurn(q);
    for (m = queue.next(); !m.isPlayer && !this.over(s); m = queue.next()) {
      this.npcTurn(m, player);
    }
    this.handleMessages(s);
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

  /**
   * Handles messages in the game.
   * @param {Stack} s - The stack of Screens.
   * @returns {void}
   */
  handleMessages(s: Stack): void {
    if (!this.game.log) return;
    if (this.game.log.hasQueuedMessages()) s.push(this.make.more(this.game));
  }

  /**
   * Finish the player's turn.
   *
   * @param {TurnQueue} q - the turn queue
   * @return {void}
   */
  finishPlayerTurn(q: TurnQueue): void {
    const player = q.currentMob();

    if (!player.isPlayer) return;

    if (this.game.autoHeal) this.game.autoHeal.turn(player, this.game);
  }
}
