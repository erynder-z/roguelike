import { Command } from './Types/Command';
import { CommandBase } from './CommandBase';
import { DamageStep, RangedWeaponType } from '../Stepper/DamageStep';
import { DirectionStep } from '../Stepper/DirectionStep';
import { EventCategory } from '../Messages/LogMessage';
import { Glyph } from '../Glyphs/Glyph';
import { GameState } from '../Builder/Types/GameState';
import { ImageHandler } from '../ImageHandler/ImageHandler';
import { Mob } from '../Mobs/Mob';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { Step } from '../Stepper/Types/Step';
import { Stack } from '../Terminal/Types/Stack';
import { StepScreen } from '../Screens/StepScreen';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command to fire a ranged weapon.
 */
export class BulletCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameState,
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
    const { game, me } = this;

    const dmg = 4;
    const type = RangedWeaponType.Pistol;
    const sprite = Glyph.Bullet;
    const effect = null;
    const next = new DamageStep(dmg, type, me, game);
    const step: Step = new DirectionStep(
      effect,
      next,
      sprite,
      me.pos.copy(),
      game,
    );

    step.setDirection(this.direction);
    this.stack.push(new StepScreen(game, this.make, step));

    if (me.isPlayer) {
      this.game.addCurrentEvent(EventCategory.rangedAttack);
      const imageHandler = ImageHandler.getInstance();

      imageHandler.handlePistolImageDisplay(game);
    }

    return false;
  }
}
