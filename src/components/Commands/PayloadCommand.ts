import { Command } from './Types/Command';
import { CommandBase } from './CommandBase';
import { DirectionStep } from '../Stepper/DirectionStep';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { Mob } from '../Mobs/Mob';
import { PayloadStep } from '../Stepper/PayloadStep';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { Step } from '../Stepper/Types/Step';
import { StepScreen } from '../Screens/StepScreen';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command fires a given payload in a specified direction.
 */
export class PayloadCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameState,
    public stack: Stack,
    public make: ScreenMaker,
    public payload: Command,
    public dir: WorldPoint = new WorldPoint(),
  ) {
    super(me, game);
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
    const { game, me } = this;

    const sprite = Glyph.Bullet;
    const effect = null;
    const next = new PayloadStep(me, game, this.payload);
    const step: Step = new DirectionStep(
      effect,
      next,
      sprite,
      me.pos.copy(),
      game,
    );
    step.setDirection(this.dir);
    this.stack.push(new StepScreen(game, this.make, step));
    return false;
  }
}
