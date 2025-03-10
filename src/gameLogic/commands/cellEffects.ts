import { Buff } from '../buffs/buffEnum';
import { BuffCommand } from './buffCommand';
import { CleanseBuffCommand } from './cleanseBuffCommand';
import { EventCategory } from '../messages/logMessage';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../../types/gameBuilder/gameState';
import { Glyph } from '../glyphs/glyph';
import { HealCommand } from './healCommand';
import { HealthAdjust } from './healthAdjust';
import { LogMessage } from '../messages/logMessage';
import { MapCell } from '../../maps/mapModel/mapCell';
import { Mob } from '../mobs/mob';
import { StatChangeBuffCommand } from './statChangeBuffCommand';

/**
 * Manages adding effects to a mob at a given position.
 */
export class CellEffects {
  constructor(
    public me: Mob,
    public game: GameState,
    public map: GameMapType,
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

    if (this.cell.isCausingBlind()) {
      const duration = 5;
      new BuffCommand(
        Buff.Blind,
        this.me,
        this.game,
        this.me,
        duration,
      ).execute();
    }

    if (this.cell.isCausingAttackUp()) {
      const duration = 50;
      const amount = this.game.rand.randomFloat(0, 1);

      new StatChangeBuffCommand(
        Buff.AttackUp,
        this.me,
        this.game,
        this.me,
        amount,
        duration,
      ).execute();
    }

    if (this.cell.isCausingAttackDown()) {
      const duration = 50;
      const amount = this.game.rand.randomFloat(0, 1);

      new StatChangeBuffCommand(
        Buff.AttackDown,
        this.me,
        this.game,
        this.me,
        amount,
        duration,
      ).execute();
    }

    if (this.cell.isCausingDefenseUp()) {
      const duration = 50;
      const amount = this.game.rand.randomFloat(0, 1);

      new StatChangeBuffCommand(
        Buff.DefenseUp,
        this.me,
        this.game,
        this.me,
        amount,
        duration,
      ).execute();
    }

    if (this.cell.isCausingDefenseDown()) {
      const duration = 50;
      const amount = this.game.rand.randomFloat(0, 1);

      new StatChangeBuffCommand(
        Buff.DefenseDown,
        this.me,
        this.game,
        this.me,
        amount,
        duration,
      ).execute();
    }

    if (this.cell.isHealing()) {
      const randomAmount = this.game.rand.randomInteger(1, this.me.maxhp);
      new HealCommand(randomAmount, this.me, this.game).execute();
    }

    if (this.cell.isWater()) this.handleWater(this.me);
    if (this.cell.isChasm()) this.handleChasm(this.me);
  }

  /**
   * Handles the effects of water on a mob.
   *
   * @param {Mob} mob - The mob to affect.
   *
   * If the mob is bloody, clears the blood.
   * Applies a slow debuff for 2 turns.
   * Removes any active burn or lava buffs.
   */
  private handleWater(mob: Mob): void {
    // remove .5 intensity of blood if mob is bloody
    if (
      mob.bloody.isBloody &&
      (mob.bloody.intensity = Math.max(0, mob.bloody.intensity - 0.5)) === 0
    )
      mob.bloody.isBloody = false;

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
