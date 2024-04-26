import { ActiveBuffs } from '../Buffs/ActiveBuffs';
import { Buff } from '../Buffs/BuffEnum';
import { Glyph } from '../Glyphs/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mood } from './MoodEnum';

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
  mood: Mood = Mood.Asleep;
  level: number = 0;
  buffs: ActiveBuffs = new ActiveBuffs();
is(buff: Buff): boolean {
  return this.buffs.is(buff);
}

sinceMove:number = 0;

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
