import { Glyph } from '../MapModel/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a mobile entity within the game world. Mob can be either a player or an NPC.
 */
export class Mob {
  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {Glyph} g - the glyph to be assigned
   * @param {number} x - the x-coordinate
   * @param {number} y - the y-coordinate
   */
  constructor(g: Glyph, x: number, y: number) {
    this.isPlayer = g == Glyph.Player;
    this.glyph = g;
    this.name = Glyph[g];
    this.pos.x = x;
    this.pos.y = y;
  }
  pos: WorldPoint = new WorldPoint();
  glyph: Glyph = Glyph.Unknown;
  name: string = '?';
  hp: number = 3;
  maxhp: number = 3;

  isPlayer: boolean = false;
  /**
   * A function that checks if the entity is alive.
   *
   * @return {boolean} the status of the entity
   */
  isAlive(): boolean {
    return this.hp > 0;
  }
}