import { ActiveBuffs } from '../Buffs/ActiveBuffs';
import { Buff } from '../Buffs/BuffEnum';
import { Glyph } from '../Glyphs/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mood } from './MoodEnum';

/**
 * Represents a mobile entity within the game world. Mob can be either a player or an NPC.
 */
export class Mob {
  constructor(g: Glyph, x: number, y: number) {
    this.isPlayer = g == Glyph.Player;
    this.glyph = g;
    this.name = Glyph[g];
    this.pos.x = x;
    this.pos.y = y;
  }
  public pos: WorldPoint = new WorldPoint();
  public glyph: Glyph = Glyph.Unknown;
  public name: string = '?';
  public description: string = '';
  public hp: number = 3;
  public maxhp: number = 3;
  public mood: Mood = Mood.Asleep;
  public level: number = 0;
  public sinceMove: number = 0;
  public isPlayer: boolean = false;
  public buffs: ActiveBuffs = new ActiveBuffs();
  public is(buff: Buff): boolean {
    return this.buffs.is(buff);
  }

  /**
   * A function that checks if the entity is alive.
   *
   * @return {boolean} the status of the entity
   */
  public isAlive(): boolean {
    return this.hp > 0;
  }
}
