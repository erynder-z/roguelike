import { Buff } from '../buffs/buffEnum';
import { BuffCommand } from './buffCommand';
import { CleanseBuffCommand } from './cleanseBuffCommand';
import { EventCategory } from '../messages/logMessage';
import { GameState } from '../../types/gameBuilder/gameState';
import { Glyph } from '../glyphs/glyph';
import { HealthAdjust } from './healthAdjust';
import { LogMessage } from '../messages/logMessage';
import { Map } from '../../types/gameLogic/maps/mapModel/map';
import { MapCell } from '../../maps/mapModel/mapCell';
import { Mob } from '../mobs/mob';

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
      if (this.cell.env !== Glyph.Shallow_Water) {
        // Shallow water is handled in this.handleWater()
        const duration = 5;
        new BuffCommand(
          Buff.Slow,
          this.me,
          this.game,
          this.me,
          duration,
        ).execute();
      }
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

    if (this.cell.isWater()) this.handleWater(this.me);
    if (this.cell.isChasm()) this.handleChasm(this.me);
  }

  /**
   * Handles the effect of a mob entering a water cell, specifically removing fire buffs.
   *
   * @param {Mob} mob - the current mob
   * @return {void}
   */
  private handleWater(mob: Mob): void {
    const duration = 2;
    new BuffCommand(Buff.Slow, mob, this.game, mob, duration).execute();

    const fireBuffs = [Buff.Burn, Buff.Lava];
    const activeBuffs = mob.buffs;

    fireBuffs.forEach(buff => {
      if (activeBuffs.is(buff)) {
        new CleanseBuffCommand(buff, mob, this.game).execute();
      }
    });
  }

  /**
   * Handle falling into a chasm.
   *
   * @param {Mob} mob - the current mob
   * @return {void}
   */
  private handleChasm(mob: Mob): void {
    const s = mob.isPlayer ? 'You fall' : `${mob.name} falls`;
    const msg = new LogMessage(
      `${s} into the abyss!`,
      EventCategory.playerDeath,
    );
    this.game.message(msg);
    HealthAdjust.killMob(mob, this.game);
  }
}
