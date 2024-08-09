import { CellEffects } from '../Commands/CellEffects';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { DrawUI } from '../Renderer/DrawUI';
import { GameState } from '../Builder/Types/GameState';
import { GameMap } from '../MapModel/GameMap';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { Mob } from '../Mobs/Mob';
import { ScreenMaker } from './Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { TurnQueue } from '../TurnQueue/TurnQueue';
import { MapCell } from '../MapModel/MapCell';

/**
 * Represents a base screen implementation that implements the StackScreen interface.
 */
export class BaseScreen implements StackScreen {
  public name = 'BaseScreen';
  constructor(
    public game: GameState,
    public make: ScreenMaker,
  ) {}

  /**
   * Draw the terminal.
   *
   * @param {DrawableTerminal} term - the terminal to draw
   * @return {void}
   */
  public drawScreen(term: DrawableTerminal): void {
    DrawUI.addEnvironmentAreaEffectsToCells(<GameMap>this.game.currentMap());
    DrawUI.drawMapWithPlayerCentered(
      term,
      <GameMap>this.game.currentMap(),
      this.game.player.pos,
      this.game,
    );
    DrawUI.renderStats(this.game);
    DrawUI.renderEquipment(this.game);
    DrawUI.renderMessage(this.game);
    DrawUI.renderFlash(this.game);
    DrawUI.renderActionImage(this.game);
  }

  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {}

  /**
   * Determines if the screen should be updated based on time.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns `true` if the screen should be updated, `false` otherwise.
   */
  public onTime(stack: Stack): boolean {
    return false;
  }

  /**
   * Process the non-player character's turns.
   *
   * @param {Stack} s - the stack to be processed
   * @return {void}
   */
  public npcTurns(s: Stack): void {
    const player = <Mob>this.game.player;
    const map = <GameMap>this.game.currentMap();

    const { queue } = map;

    let m: Mob;

    this.finishPlayerTurn(queue, s);
    if (queue.mobs.length <= 0) return;
    for (m = queue.next(); !m.isPlayer && !this.over(s); m = queue.next()) {
      this.npcTurn(m, player, s);
    }
    this.handleMessages(s);
    if (this.game.stats.currentTurnReceivedDmg >= 0)
      this.game.stats.resetCurrentTurnReceivedDmg();
  }

  /**
   * Perform the NPC's turn in the game.
   *
   * @param {Mob} m - the NPC performing the turn
   * @param {Mob} ply - the player involved in the turn
   */
  private npcTurn(m: Mob, ply: Mob, stack: Stack): void {
    const { ai } = this.game;

    const map = <GameMap>this.game.currentMap();
    const currentCell = map.cell(m.pos);

    if (ai) ai.turn(m, ply, this.game, stack, this.make);
    this.handleCellEffects(currentCell, m);
    this.finishTurn(m);
  }

  /**
   * Determine if the stack is over
   *
   * @param {Stack} s - the stack to check
   * @return {boolean} true if the stack is over, false otherwise
   */
  private over(s: Stack): boolean {
    const over = !this.game.player.isAlive();
    if (over) {
      s.pop();
      s.push(this.make.gameOver());
    }
    return over;
  }

  /**
   * Handle flash messages. Independent from the the Messages-Display component.
   * @param {Stack} s - The stack of Screens.
   * @returns {void}
   */
  private handleMessages(s: Stack): void {
    if (!this.game.log) return;

    if (this.game.stats.currentTurnReceivedDmg >= 1)
      HealthAdjust.handlePlayerDamageEvent(
        this.game.player,
        this.game.stats.currentTurnReceivedDmg,
        this.game,
      );

    if (this.game.log.hasQueuedMessages()) s.push(this.make.more(this.game));
  }

  /**
   * tickBuffs - A function to handle ticking buffs for a mob.
   *
   * @param {Mob} m - The mob to tick buffs for
   * @return {void}
   */
  private tickBuffs(m: Mob): void {
    if (!m.buffs) return;
    m.buffs.ticks(m, this.game);
  }

  /**
   * A method to finish the turn for a given mob.
   *
   * @param {Mob} m - the mob to finish the turn for
   * @return {void}
   */
  private finishTurn(m: Mob): void {
    ++m.sinceMove;
    this.tickBuffs(m);
  }

  /**
   * Finish the player's turn.
   *
   * @param {TurnQueue} q - the turn queue
   * @param {Stack} s - the stack of screens
   * @return {void}
   */
  private finishPlayerTurn(q: TurnQueue, s: Stack): void {
    const player = q.currentMob();
    const map = <GameMap>this.game.currentMap();
    const currentCell = map.cell(player.pos);

    if (!player.isPlayer) return;

    this.finishTurn(player);
    this.handleCellEffects(currentCell, player);

    if (!player.isAlive()) {
      this.over(s);
      return;
    }

    this.handleAutoHeal(player);
    this.game.stats.incrementTurnCounter();
  }

  /**
   * Handle auto-healing for the player.
   *
   * @param {Mob} player - the player
   * @return {void}
   */
  private handleAutoHeal(player: Mob): void {
    if (this.game.autoHeal) {
      this.game.autoHeal.turn(player, this.game);
    }
  }

  /**
   * Handles the effects of a cell on the player.
   *
   * @param {MapCell} cell - The cell to handle effects for.
   * @param {Mob} player - The player to apply effects to.
   * @return {void} This function does not return a value.
   */
  private handleCellEffects(cell: MapCell, player: Mob): void {
    const map = <GameMap>this.game.currentMap();

    new CellEffects(player, this.game, map, cell).applyCellEffects();
  }
  /**
   * Handle cleansing fire buffs if the player is on a cell that removes them.
   *
   * @param {MapCell} cell - the current cell of the player
   * @param {Mob} player - the player
   * @return {void}
   */

  /**
   * Removes the current screen and runs the NPC loop.
   * @param {Stack} s - The stack of Screens.
   * @returns {void}
   */
  public pop_and_runNPCLoop(s: Stack): void {
    s.pop();
    this.npcTurns(s);
  }
}
