import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { StepIF } from './Interfaces/StepIF';

/**
 * Represents a timed step that draws a step screen for a given amount of time. Most methods are placeholders to be implemented in subclasses.
 */
export class TimedStep implements StepIF {
  public time: number = 0;

  /**
   * Executes the step.
   *
   * @return {StepIF | null} The function always throws an error.
   */
  public executeStep(): StepIF | null {
    throw 'no executeStep';
  }

  /**
   * Sets the position of the object to the specified world point.
   *
   * @param {WorldPoint} pos - The world point to set the position to.
   * @return {void} This function does not return anything.
   */
  public setPos(pos: WorldPoint): void {
    throw 'no setPos';
  }

  /**
   * Sets the direction of the object to the specified world point.
   *
   * @param {WorldPoint} dir - The world point to set the direction to.
   * @return {void} This function does not return anything.
   */
  public setDirection(dir: WorldPoint): void {
    throw 'no setDir';
  }

  /**
   * Sets the target of the function to the specified Mob.
   *
   * @param {Mob} tgt - The Mob object to set as the target.
   * @return {void} This function does not return anything.
   */
  public setTarget(tgt: Mob): void {
    throw 'no setTarget';
  }

  /**
   * Sets the time value of the object.
   *
   * @param {number} time - The time value to be set.
   * @return {void} This function does not return anything.
   */
  public setTime(time: number): void {
    this.time = time;
  }
}
