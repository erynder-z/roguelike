import { Command } from '../Commands/Types/Command';
import { GameState } from '../Builder/Types/GameState';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { Step } from './Types/Step';
import { TimedStep } from './TimedStep';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a payload step that fires a payload command in a specified direction.
 */
export class PayloadStep extends TimedStep {
  constructor(
    public actor: Mob,
    public game: GameState,
    public payload: Command,
    public target: Mob | null = null,
    public pos: WorldPoint | null = null,
  ) {
    super();
  }

  /**
   * Represents a timed step that draws a step screen for a given amount of time. Most methods are placeholders to be implemented in subclasses.
   */
  public setTarget(tgt: Mob): void {
    this.target = tgt;
  }

  /**
   * Sets the position of the object to the specified world point.
   *
   * @param {WorldPoint} pos - The world point to set the position to.
   * @return {void} This function does not return anything.
   */
  public setPos(pos: WorldPoint): void {
    this.pos = pos.copy();
  }

  /**
   * Executes the step and performs the payload action on the target mob.
   *
   * @return {StepIF | null} The executed step or null if no target is found.
   */
  public executeStep(): Step | null {
    let { target } = this;

    if (!target) target = this.targetFromPosition();
    if (target) {
      this.payload.setTarget(target);
      this.payload.raw();
    } else {
      console.log('did not hit any target');
    }
    return null;
  }

  /**
   * Retrieves the target Mob based on the current position.
   *
   * @return {Mob | null} The target Mob if found, otherwise null.
   */
  private targetFromPosition(): Mob | null {
    if (this.pos) {
      const map = <Map>this.game.currentMap();
      const cell = map.cell(this.pos);
      if (cell.mob) return cell.mob;
    }
    return null;
  }
}
