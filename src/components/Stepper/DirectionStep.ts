import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { StepIF } from './Interfaces/StepIF';
import { TimedStep } from './TimedStep';

/**
 * Represents a timed step that moves an object in a specified direction.
 */
export class DirectionStep extends TimedStep {
  map: MapIF;
  direction: WorldPoint | null = null;

  constructor(
    public effect: StepIF | null,
    public next: StepIF | null,
    public sprite: Glyph,
    public pos: WorldPoint,
    public g: GameIF,
  ) {
    super();
    this.map = <MapIF>g.currentMap();
  }

  /**
   * Sets the direction of the object to the specified world point.
   *
   * @param {WorldPoint} dir - The world point to set the direction to.
   * @return {void} This function does not return anything.
   */
  setDirection(dir: WorldPoint): void {
    this.direction = dir;
  }

  /**
   * Executes the step for moving an object in a specified direction.
   *
   * @return {StepIF | null} The next step to execute or null if the current step is done.
   */
  executeStep(): StepIF | null {
    const p = this.pos;
    const map = this.map;

    map.cell(p).sprite = undefined;

    if (this.direction == null) throw 'no dir';

    p.addTo(this.direction);

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
}
