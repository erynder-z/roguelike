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

  private handleWater(cell: MapCell, mob: Mob): void {
    if (cell.isWater()) {
      const fireBuffs = [Buff.Burn, Buff.Lava];
      const activeBuffs = mob.buffs;

      fireBuffs.forEach(buff => {
        if (activeBuffs.is(buff)) {
          new CleanseBuffCommand(buff, mob, this.game).execute();
        }
      });
    }
  }

  /**
   * Handle falling into a chasm if the mob is on a chasm cell.
   *
   * @param {MapCell} cell - the current cell of the mob
   * @param {Mob} mob - the current mob
   * @return {void}
   */
  private handleChasm(cell: MapCell, mob: Mob): void {
    if (cell.isChasm()) {
      this.fallIntoChasm(mob);
    }
  }

  /**
   * Handles the fall into a chasm event for the mob.
   *
   * @param {Mob} mob - the mob who falls into the chasm
   * @return {void} This function does not return a value.
   */
  private fallIntoChasm(mob: Mob): void {
    const s = mob.isPlayer ? 'You fall' : `${mob.name} falls`;
    const msg = new LogMessage(
      `${s} into the abyss!`,
      EventCategory.playerDeath,
    );
    this.game.message(msg);
    HealthAdjust.killMob(mob, this.game);
  }
}
