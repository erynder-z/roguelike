import { GameIF } from '../Builder/Interfaces/GameIF';
import { Command } from '../Commands/Interfaces/Command';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { StepIF } from './Interfaces/StepIF';
import { TimedStep } from './TimedStep';

/**
 * Represents a payload step that fires a payload command in a specified direction.
 */
export class PayloadStep extends TimedStep {
  constructor(
    public actor: Mob,
    public game: GameIF,
    public payload: Command,
    public target: Mob | null = null,
    public pos: WorldPoint | null = null,
  ) {
    super();
  }

  /**
   * Represents a timed step that draws a step screen for a given amount of time. Most methods are placeholders to be implemented in subclasses.
   */
  setTarget(tgt: Mob): void {
    this.target = tgt;
  }

  /**
   * Sets the position of the object to the specified world point.
   *
   * @param {WorldPoint} pos - The world point to set the position to.
   * @return {void} This function does not return anything.
   */
  setPos(pos: WorldPoint): void {
    this.pos = pos.copy();
  }

  /**
   * Executes the step and performs the payload action on the target mob.
   *
   * @return {StepIF | null} The executed step or null if no target is found.
   */
  executeStep(): StepIF | null {
    let tgt = this.target;
    if (!tgt) tgt = this.targetFromPosition();
    if (tgt) {
      this.payload.setTarget(tgt);
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
  targetFromPosition(): Mob | null {
    if (this.pos) {
      const map = <MapIF>this.game.currentMap();
      const cell = map.cell(this.pos);
      if (cell.mob) return cell.mob;
    }
    return null;
  }
}
