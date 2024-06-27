import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { Glyph } from '../Glyphs/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { StairCommand } from './StairCommand';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Act } from './Act';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Buff } from '../Buffs/BuffEnum';
import { BuffCommand } from './BuffCommand';

/**
 * Represents a move command that moves a mob in the game.
 */
export class MoveCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameIF,
    public act: Act = Act.Move,
  ) {
    super(me, game);
  }
  /**
   * Executes the move command for the mob.
   *
   * @returns {boolean} Whether the move was successful or not.
   */
  execute(): boolean {
    const newPosition = this.dir.plus(this.me.pos);
    const map = <MapIF>this.game.currentMap();

    if (this.isMoveLegal(map, newPosition)) {
      this.applyCellEffects(map, newPosition);

      const magneticDirection = this.getMagneticDirection(map, newPosition);
      if (magneticDirection && this.game.rand.isOneIn(2)) {
        this.moveInMagneticDirection(map, magneticDirection);
      } else {
        this.moveAndHandleExtras(map, newPosition);
      }
    }

    if (this.me.isPlayer) {
      this.game.addCurrentEvent(EventCategory.moving);
    }

    return !map.isBlocked(newPosition);
  }

  /**
   * Checks if a move is legal based on the provided map and position.
   *
   * @param {MapIF} map - The map object representing the game world.
   * @param {WorldPoint} position - The position to check if it is legal to move to.
   * @return {boolean} Returns true if the move is legal, false otherwise.
   */
  isMoveLegal(map: MapIF, position: WorldPoint): boolean {
    return !map.isBlocked(position);
  }

  /**
   * Applies cell effects based on the given map and position.
   *
   * @param {MapIF} map - The map interface to apply cell effects on.
   * @param {WorldPoint} position - The position on the map to apply effects to.
   */
  applyCellEffects(map: MapIF, position: WorldPoint): void {
    if (map.cell(position).isSlowing()) {
      new BuffCommand(Buff.Slow, this.me, this.game, this.me, 2).execute();
    }
    if (map.cell(position).isBurning()) {
      new BuffCommand(Buff.Lava, this.me, this.game, this.me).execute();
    }
  }

  /**
   * Calculates the magnetic direction based on the given map and position.
   *
   * @param {MapIF} map - The map object representing the game world.
   * @param {WorldPoint} position - The position to calculate the magnetic direction for.
   * @return {WorldPoint | null} The calculated magnetic direction, or null if there is no magnetism.
   */
  getMagneticDirection(map: MapIF, position: WorldPoint): WorldPoint | null {
    const magneticPosition = this.checkForMagnetism(map, position);
    return this.getMagnetismDirection(this.me.pos, magneticPosition);
  }

  /**
   * Moves the mob in the given magnetic direction if the position is not blocked, otherwise handles extras.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} magneticDirection - The direction in which to move the mob magnetically.
   * @return {void} This function does not return anything.
   */
  moveInMagneticDirection(map: MapIF, magneticDirection: WorldPoint): void {
    const magneticMovePosition = this.me.pos.plus(magneticDirection);
    if (!map.isBlocked(magneticMovePosition)) {
      this.moveMobAndResetCounter(map, magneticMovePosition);
    } else {
      this.moveAndHandleExtras(map, this.dir.plus(this.me.pos));
    }
  }

  /**
   * Moves the mob to the specified position and handles any additional actions if the mob is a player.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} position - The position to move the mob to.
   * @return {void} This function does not return a value.
   */
  moveAndHandleExtras(map: MapIF, position: WorldPoint): void {
    this.moveMobAndResetCounter(map, position);
    if (this.me.isPlayer) {
      this.dealWithStairs(map, position);
      this.flashIfItem();
    }
  }

  /**
   * Moves the mob to the specified position and resets the counter for the number of turns since the last move.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} position - The position to move the mob to.
   * @return {void} This function does not return a value.
   */
  moveMobAndResetCounter(map: MapIF, position: WorldPoint): void {
    this.me.sinceMove = 0;
    map.moveMob(this.me, position);
  }

  /**
   * Deals with stairs in the map.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} position - The position to check for stairs.
   * @return {void} This function does not return a value.
   */
  dealWithStairs(map: MapIF, position: WorldPoint): void {
    const cell = map.cell(position);
    let direction: number | null = null;

    if (cell.env === Glyph.StairsDown) {
      direction = 1;
    } else if (cell.env === Glyph.StairsUp) {
      direction = -1;
    }

    if (direction !== null) {
      new StairCommand(direction, this.game).raw();
    }
  }

  /**
   * Checks if there is an item at the player's current position and flashes a message if there is.
   *
   * @return {void} This function does not return anything.
   */
  flashIfItem(): void {
    const map: MapIF = <MapIF>this.game.currentMap();
    const playerPosition: WorldPoint = this.game.player.pos;
    const item: ItemObject | undefined = map.cell(playerPosition).obj;

    if (item) {
      const message = new LogMessage(
        `${item.description()} is lying here`,
        EventCategory.layingObject,
      );
      this.game.message(message);
    }
  }

  /**
   * Checks for magnetism in the map at a given position and returns the first magnetic neighbor if found.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} position - The position to check for magnetism.
   * @return {WorldPoint | null} The WorldPoint of the magnetic neighbor if found, otherwise null.
   */
  checkForMagnetism(map: MapIF, position: WorldPoint): WorldPoint | null {
    const neighbors = position.getNeighbors(3);

    for (const neighbor of neighbors) {
      if (neighbor.isPositionOutOfBounds(neighbor, map)) {
        continue;
      }

      const cell = map.cell(neighbor);
      if (cell?.isMagnetic()) {
        return neighbor;
      }
    }
    return null;
  }

  /**
   * Calculates the direction from the mob's position to the magnetic position.
   *
   * @param {WorldPoint} mobPos - The position of the mob.
   * @param {WorldPoint | null} magnetPos - The position of the magnetic neighbor, can be null.
   * @return {WorldPoint | null} The direction from the mob to the magnetic position, or null if no magnetic neighbor found.
   */
  getMagnetismDirection(
    mobPos: WorldPoint,
    magnetPos: WorldPoint | null,
  ): WorldPoint | null {
    return magnetPos ? mobPos.directionTo(magnetPos) : null;
  }
}
