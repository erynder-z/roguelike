import { Buff } from '../Buffs/BuffEnum';
import { BuffCommand } from './BuffCommand';
import { CleanseBuffCommand } from './CleanseBuffCommand';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from './HealthAdjust';
import { Map } from '../MapModel/Types/Map';
import { MapCell } from '../MapModel/MapCell';
import { Mob } from '../Mobs/Mob';

/**
 * Manages adding effects to a mob at a given position.
 */
export class CellEffects {
  constructor(
    public me: Mob,
    public game: GameState,
    public map: Map,
    public cell: MapCell,
  ) {}

  /**
   * Applies cell effects based on the given map and position.
   *
   * @return {void} This function does not return anything.
   */
  public applyCellEffects(): void {
    if (this.cell.isCausingSlow()) {
      const duration = 1;
      new BuffCommand(
        Buff.Slow,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }
    if (this.cell.isCausingBurn()) {
      const duration = 9;
      new BuffCommand(
        Buff.Lava,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }
    if (this.cell.isCausingBleed()) {
      const duration = 5;
      new BuffCommand(
        Buff.Bleed,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }
    if (this.cell.isCausingPoison()) {
      const duration = 5;
      new BuffCommand(
        Buff.Poison,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }
    if (this.cell.isCausingConfusion()) {
      const duration = 5;
      new BuffCommand(
        Buff.Confuse,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }

    this.handleWater(this.cell, this.me);
    this.handleChasm(this.cell, this.me);
  }

  private handleWater(cell: MapCell, player: Mob): void {
    if (cell.isWater()) {
      const fireBuffs = [Buff.Burn, Buff.Lava];
      fireBuffs.forEach(buff =>
        new CleanseBuffCommand(buff, player, this.game).execute(),
      );
    }
  }

  /**
   * Handle falling into a chasm if the player is on a chasm cell.
   *
   * @param {MapCell} cell - the current cell of the player
   * @param {Mob} player - the player
   * @return {void}
   */
  private handleChasm(cell: MapCell, player: Mob): void {
    if (cell.isChasm()) {
      this.fallIntoChasm(player);
    }
  }

  /**
   * Handles the fall into a chasm event for the player.
   *
   * @param {Mob} player - the player who falls into the chasm
   * @return {void} This function does not return a value.
   */
  private fallIntoChasm(player: Mob): void {
    const msg = new LogMessage(
      'You fall into the abyss!',
      EventCategory.playerDeath,
    );
    this.game.message(msg);
    HealthAdjust.killMob(player, this.game);
  }
}
