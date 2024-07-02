import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { GameMap } from '../MapModel/GameMap';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { MagnetismHandler } from '../Utilities/MagnetismHandler';
import { StepIF } from './Interfaces/StepIF';
import { TimedStep } from './TimedStep';

/**
 * Represents a timed step that moves an object in a specified direction.
 */
export class DirectionStep extends TimedStep {
  constructor(
    public effect: StepIF | null,
    public next: StepIF | null,
    public sprite: Glyph,
    public pos: WorldPoint,
    public g: GameIF,
    public map: MapIF = <MapIF>g.currentMap(),
    public direction: WorldPoint | null = null,
  ) {
    super();
  }

  /**
   * Sets the direction of the object to the specified world point.
   *
   * @param {WorldPoint} dir - The world point to set the direction to.
   * @return {void} This function does not return anything.
   */
  public setDirection(dir: WorldPoint): void {
    this.direction = dir;
  }

  /**
   * Executes the step for moving an object in a specified direction.
   *
   * @return {StepIF | null} The next step to execute or null if the current step is done.
   */
  public executeStep(): StepIF | null {
    const p = this.pos;
    const map = <GameMap>this.map;

    map.cell(p).sprite = undefined;

    if (this.direction == null) throw 'no dir';

    const checkPosition = this.calculateNewPosition(p, this.direction);

    const magneticDirection = MagnetismHandler.getMagnetDirection(
      map,
      p,
      checkPosition,
    );

    if (
      magneticDirection &&
      this.shouldMoveTowardsMagnet(map, magneticDirection)
    ) {
      p.addTo(magneticDirection);
    } else {
      p.addTo(this.direction);
    }

    if (!map.isLegalPoint(p)) return null;

    const cell = map.cell(p);
    const done = cell.isBlocked() && cell.env !== Glyph.DeepWater;

    if (!done) {
      cell.sprite = this.sprite;

      if (this.effect) {
        this.effect.setPos(p);
        this.effect.executeStep();
      }
    } else {
      if (this.next) this.next.setPos(p);
    }
    return done ? this.next : this;
  }

  /**
   * Calculates the new position by adding the direction to the current position.
   *
   * @param {WorldPoint} currentPosition - The current position of the mob.
   * @param {WorldPoint} direction - The direction in which the mob is moving.
   * @return {WorldPoint} The new position after adding the direction to the current position.
   */
  private calculateNewPosition(
    currentPosition: WorldPoint,
    direction: WorldPoint,
  ): WorldPoint {
    return direction.plus(currentPosition);
  }

  /**
   * Determines whether the mob should move towards a magnetic point on the map.
   *
   * @param {GameMap} map - The game map where the mob is located.
   * @param {WorldPoint | null} magneticDirection - The direction towards the magnetic point, or null if no direction.
   * @return {boolean} Returns true if the mob should move towards the magnetic direction, false otherwise.
   */
  private shouldMoveTowardsMagnet(
    map: GameMap,
    magneticDirection: WorldPoint | null,
  ): boolean {
    if (!magneticDirection) return false;

    const magneticMovePosition = this.pos.plus(magneticDirection);
    return this.g.rand.isOneIn(2) && !map.isBlocked(magneticMovePosition);
  }
}
