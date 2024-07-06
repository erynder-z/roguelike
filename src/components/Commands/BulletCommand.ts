import { DamageStep, RangedWeaponType } from '../Stepper/DamageStep';
import { DirectionStep } from '../Stepper/DirectionStep';
import { EventCategory } from '../Messages/LogMessage';
import { Glyph } from '../Glyphs/Glyph';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { ImageHandler } from '../ImageHandler/ImageHandler';
import { Mob } from '../Mobs/Mob';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
import { StepIF } from '../Stepper/Interfaces/StepIF';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StepScreen } from '../Screens/StepScreen';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Command } from './Interfaces/Command';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to fire a ranged weapon.
 */
export class BulletCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameIF,
    public stack: Stack,
    public make: ScreenMaker,
    public direction: WorldPoint = new WorldPoint(),
  ) {
    super(me, game);
  }

  /**
   * Sets the direction for the command.
   *
   * @param {WorldPoint} direction - The direction to set.
   * @return {Command} The command object.
   */
  public setDirection(direction: WorldPoint): Command {
    this.direction = direction;
    return this;
  }

  /**
   * Executes the bullet command..
   *
   * @return {boolean} The result of the function execution.
   */
  public execute(): boolean {
    const g = this.game;
    const m = this.me;
    const dmg = 4;
    const type = RangedWeaponType.Pistol;
    const sprite = Glyph.Bullet;
    const effect = null;
    const next = new DamageStep(dmg, type, m, g);
    const step: StepIF = new DirectionStep(
      effect,
      next,
      sprite,
      m.pos.copy(),
      g,
    );

    step.setDirection(this.direction);
    this.stack.push(new StepScreen(g, this.make, step));

    if (m.isPlayer) {
      this.game.addCurrentEvent(EventCategory.rangedAttack);
      const imageHandler = ImageHandler.getInstance();

      imageHandler.handlePistolImageDisplay(g);
    }

    return false;
  }
}
