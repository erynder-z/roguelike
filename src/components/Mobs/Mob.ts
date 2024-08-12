import { ActiveBuffs } from '../Buffs/ActiveBuffs';
import { Glyph } from '../Glyphs/Glyph';
import { Mood } from './MoodEnum';
import { Buff } from '../Buffs/BuffEnum';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a mobile entity within the game world. Mob can be either a player or an NPC.
 */
export class Mob {
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
  constructor(glyph: Glyph, x: number, y: number) {
    this.isPlayer = glyph == Glyph.Player;
    this.glyph = glyph;
    this.name = Glyph[glyph];
    this.pos.x = x;
    this.pos.y = y;
  }

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
