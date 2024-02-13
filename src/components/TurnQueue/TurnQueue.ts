import { Mob } from '../Mobs/Mob';

/**
 * Represents a turn queue for managing the order of mobs' turns.
 */
export class TurnQueue {
  mobs: Mob[] = [];
  /**
   * A method that returns the current mob.
   *
   * @return {Mob} the first mob in the mobs array
   */
  currentMob(): Mob {
    return this.mobs[0];
  }

  /**
   * Pushes a mob into the mobs array.
   *
   * @param {Mob} m - the mob to be pushed
   * @return {void}
   */
  pushMob(m: Mob) {
    this.mobs.push(m);
  }
  /**
   * A description of the entire function.
   *
   * @return {Mob} the first item removed from the mobs array
   */
  popMob() {
    return <Mob>this.mobs.shift();
  }

  /**
   * Removes the specified Mob from the list of mobs.
   *
   * @param {Mob} m - the Mob to be removed
   * @return {void}
   */
  removeMob(m: Mob): void {
    const index = this.mobs.indexOf(m);
    if (index > -1) {
      this.mobs.splice(index, 1);
    }
  }

  /**
   * Pushes the given mob to the front of the mobs array.
   *
   * @param {Mob} m - the mob to be pushed to the front
   * @return {void}
   */
  pushMobToFront(m: Mob) {
    this.mobs.unshift(m);
  }

  /**
   * A method to move to the next item in the list.
   *
   * @return {Mob} the next mob
   */
  next(): Mob {
    this.pushMob(this.popMob());
    return this.currentMob();
  }
}
