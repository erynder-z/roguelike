import { Command } from './Interfaces/Command';
import { CommandBase } from './CommandBase';
import { DirectionStep } from '../Stepper/DirectionStep';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { Mob } from '../Mobs/Mob';
import { PayloadStep } from '../Stepper/PayloadStep';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StepIF } from '../Stepper/Interfaces/StepIF';
import { StepScreen } from '../Screens/StepScreen';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command fires a given payload in a specified direction.
 */
export class PayloadCommand extends CommandBase {
  constructor(
    public me: Mob,
    public g: GameIF,
    public stack: Stack,
    public make: ScreenMaker,
    public payload: Command,
    public dir: WorldPoint = new WorldPoint(),
  ) {
    super(me, g);
  }

  /**
   * Sets the direction of the command.
   *
   * @param {WorldPoint} direction - The direction to set.
   * @return {Command} The command object.
   */
  public setDirection(direction: WorldPoint): Command {
    this.dir = direction;
    return this;
  }

  /**
   * Executes the command by creating a new PayloadStep, setting its direction, and pushing a new StepScreen onto the stack.
   *
   * @return {boolean} Always returns false.
   */
  public execute(): boolean {
    const g = this.g;
    const m = this.me;
    const sprite = Glyph.Bullet;
    const effect = null;
    const next = new PayloadStep(m, g, this.payload);
    const step: StepIF = new DirectionStep(
      effect,
      next,
      sprite,
      m.pos.copy(),
      g,
    );
    step.setDirection(this.dir);
    this.stack.push(new StepScreen(g, this.make, step));
    return false;
  }
}
