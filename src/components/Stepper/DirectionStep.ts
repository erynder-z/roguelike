import { GameState } from '../Builder/Types/GameState';
import { Map } from '../MapModel/Types/Map';
import { WorldPoint } from '../MapModel/WorldPoint';
import { GameMap } from '../MapModel/GameMap';
import { Glyph } from '../Glyphs/Glyph';
import { MagnetismHandler } from '../Utilities/MagnetismHandler';
import { Step } from './Types/Step';
import { TimedStep } from './TimedStep';

/**
 * Represents a timed step that moves an object in a specified direction.
 */
export class DirectionStep extends TimedStep {
  constructor(
    public effect: Step | null,
    public next: Step | null,
    public sprite: Glyph,
    public pos: WorldPoint,
    public g: GameState,
    public map: Map = <Map>g.currentMap(),
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
   * @return {Step | null} The next step to execute or null if the current step is done.
   */
  public executeStep(): Step | null {
    const currentPosition = this.pos;
    const map = <GameMap>this.map;

    map.cell(currentPosition).sprite = undefined;

    if (this.direction == null) throw 'no dir';

    const newPosition = currentPosition.plus(this.direction);

    const canGetStuckInWall = true; // Determines whether a magnet can pull an entity towards a wall and using a turn. Bullets and payloads should set this to true.
    const magnetizedPos = MagnetismHandler.getMagnetizedPosition(
      map,
      currentPosition,
      newPosition,
      this.g.rand,
      canGetStuckInWall,
    );

    if (magnetizedPos) {
      currentPosition.addTo(magnetizedPos);
    } else {
      currentPosition.addTo(this.direction);
    }

    if (!map.isLegalPoint(currentPosition)) return null;

    const cell = map.cell(currentPosition);
    const done = cell.isBlockingProjectiles();

    if (!done) {
      cell.sprite = this.sprite;

      if (this.effect) {
        this.effect.setPos(currentPosition);
        this.effect.executeStep();
      }
    } else {
      if (this.next) this.next.setPos(currentPosition);
    }
    return done ? this.next : this;
  }
}
