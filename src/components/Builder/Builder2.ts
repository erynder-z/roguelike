import { MobAI } from '../Mobs/Interfaces/MobAI';
import { Build2 } from './Interfaces/Builder2';
import { GameIF } from './Interfaces/Game';
import { Map } from '../MapModel/Interfaces/Map';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { AISwitcher } from '../Mobs/AISwitcher';
import { Mob } from '../Mobs/Mob';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { Game } from './GameModel';
import { MapGenerator1 } from '../MapGenerator/MapGenerator';
import { ObjectTypes } from '../ItemObjects/ObjectTypes';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Slot } from '../ItemObjects/Slot';

/**
 * Represents a builder for creating games, levels and mobs.
 */
export class Builder2 implements Build2 {
  /**
   * Create and return a new GameIF instance.
   *
   * @return {GameIF} The newly created GameIF instance
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(99);
    const player = this.makePlayer();
    const game = new Game(rnd, player, this);
    game.dungeon.level = 1;
    this.enterFirstLevel(game);
    game.ai = this.makeAI();
    this.initLevel1(game);

    return game;
  }

  /**
   * A function to make a level using the given random generator and level number.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level number
   * @return {Map} the generated map
   */
  makeLevel(rnd: RandomGenerator, level: number): Map {
    const map = this.makeMap(rnd, level);
    this.addLevelStairs(map, level, rnd);
    this.addItems(map, rnd);
    this.addMobsToLevel(map, rnd);
    return map;
  }

  /**
   * Generates a map using the given random generator and level number.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level-number for the map
   * @return {Map} the generated map
   */
  makeMap(rnd: RandomGenerator, level: number): Map {
    const dim = TerminalPoint.StockDimensions;
    const wdim = new WorldPoint(dim.x, dim.y);

    let map;

    switch (level) {
      case 0:
        map = TestMap2.test(wdim, rnd, level);
        break;
      case 1:
        map = MapGenerator1.test(level);
        break;
      default:
        map = MapGenerator1.test(level);
        break;
    }
    return map;
  }

  /**
   * enterFirstLevel0 function enters the first level of the game.
   *
   * @param {Game} game - the game object
   * @return {void}
   */
  enterFirstLevel0(game: Game): void {
    const map = <Map>game.currentMap();
    const np = this.centerPos(map.dimensions);
    map.enterMap(game.player, np);
  }

  /**
   * enter the first level of the game.
   *
   * @param {Game} game - the game object
   * @return {void}
   */
  enterFirstLevel(game: Game): void {
    const dungeon = game.dungeon;
    const map = dungeon.currentMap(game);
    const np = this.centerPos(map.dimensions);
    game.dungeon.playerSwitchLevel(dungeon.level, np, game);
  }
  /**
   * Calculates the center position of the given WorldPoint dimensions.
   *
   * @param {WorldPoint} dim - the dimensions for which to calculate the center position
   * @return {WorldPoint} the center position of the given dimensions
   */
  centerPos(dim: WorldPoint): WorldPoint {
    return new WorldPoint(Math.floor(dim.x / 2), Math.floor(dim.y / 2));
  }

  /**
   * Creates a new player Mob.
   *
   * @return {Mob} a new player Mob
   */
  makePlayer(): Mob {
    const player = new Mob(Glyph.Player, 20, 12);
    player.hp = 69;
    player.maxhp = 69;
    return player;
  }

  /**
   * Create and return a new MobAI instance, or null if unable to create one.
   *
   * @return {MobAI | null} The created MobAI instance, or null if unable to create one.
   */
  makeAI(): MobAI | null {
    return new AISwitcher();
  }

  makeRingOfCats(map: Map, rnd: RandomGenerator): void {
    this.makeRingOfMobs(Glyph.Cat, map, rnd);
  }

  /**
   * Generates a ring of mobs around a central point on the map.
   *
   * @param {Glyph} glyph - the glyph representing the mob
   * @param {Map} map - the map on which the mobs will be generated
   * @param {RandomGenerator} rnd - the random generator for determining mob positions
   * @return {void}
   */
  makeRingOfMobs(glyph: Glyph, map: Map, rnd: RandomGenerator): void {
    const dim = map.dimensions;
    const c = new WorldPoint(Math.floor(dim.x / 2), Math.floor(dim.y / 2));
    const p = new WorldPoint();

    for (p.y = 1; p.y < dim.y - 1; p.y++) {
      for (p.x = 1; p.x < dim.x - 1; p.x++) {
        const d = c.distanceTo(p);
        if (d < 7 || d > 9) {
          continue;
        }
        if (map.isBlocked(p)) {
          continue;
        }
        this.addNPC(glyph, p.x, p.y, map, 0);
      }
    }
  }
  /**
   * Adds a new non-playable character to the map at the specified position and level.
   *
   * @param {Glyph} glyph - the visual representation of the NPC
   * @param {number} x - the x-coordinate of the NPC on the map
   * @param {number} y - the y-coordinate of the NPC on the map
   * @param {Map} map - the map to which the NPC is being added
   * @param {number} level - the level of the NPC
   * @return {Mob} the newly added NPC
   */
  addNPC(glyph: Glyph, x: number, y: number, map: Map, level: number): Mob {
    const mob = new Mob(glyph, x, y);
    this.setLevelStats(mob, level);
    map.addNPC(mob);
    return mob;
  }

  /**
   * Sets the level-related statistics of a Mob.
   *
   * @param {Mob} mob - The Mob whose statistics are being set.
   * @param {number} mobLevel - The level of the Mob.
   * @return {void}
   */
  setLevelStats(mob: Mob, mobLevel: number): void {
    mob.level = mobLevel;
    mob.maxhp = mobLevel * 5;
    mob.hp = mob.maxhp;
  }

  /**
   * Adds level stairs to the map based on the level and random generator provided.
   * @param {Map} map - The map to which stairs are being added.
   * @param {number} level - The level for which stairs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding stairs.
   * @returns {void}
   */
  addLevelStairs(map: Map, level: number, rnd: RandomGenerator): void {
    level === 0 ? this.addStairs0(map) : this.addStairs(map, rnd);
  }

  /**
   * Adds stairs for level to the map at a specified position.
   * @param {Map} map - The map to which stairs are being added.
   * @returns {void}
   */
  addStairs0(map: Map): void {
    const pos = this.centerPos(map.dimensions);
    const x = 3;
    const y = 0;
    const p = new WorldPoint(x, y).addTo(pos);

    map.cell(p).env = Glyph.StairsDown;
  }

  /**
   * Adds stairs for a level to the map.
   * @param {Map} map - The map to which stairs are being added.
   * @returns {void}
   */
  addStairs(map: Map, rnd: RandomGenerator): void {
    this.addStair(map, rnd, Glyph.StairsDown);
    this.addStair(map, rnd, Glyph.StairsUp);
  }

  /**
   * Adds stairs to the map based on the provided glyph and random generator.
   * @param {Map} map - The map to which stairs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding stairs.
   * @param {Glyph} stair - The glyph representing the stairs.
   * @returns {boolean} True if stairs are successfully added, otherwise false.
   */
  addStair(map: Map, rnd: RandomGenerator, stair: Glyph): boolean {
    const p = <WorldPoint>FindFreeSpace.findFree(map, rnd);
    map.cell(p).env = stair;
    return true;
  }

  /**
   * Adds mobs to the level based on the map and random generator provided.
   * @param {Map} map - The map to which mobs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding mobs.
   * @returns {void}
   */
  addMobsToLevel(map: Map, rnd: RandomGenerator): void {
    switch (map.level) {
      case 0:
        this.makeRingOfCats(map, rnd);
        break;
      default:
        this.makeMobs(map, rnd, 15);
        break;
    }
  }

  /**
   * Makes mobs on the map using the provided random generator and glyph.
   * @param {Map} map - The map on which the mobs will be created.
   * @param {RandomGenerator} rnd - The random generator used to determine the placement of the mobs.
   * @param {Glyph} glyph - The glyph representing the mobs.
   * @param {number} rate - The rate of mob creation.
   * @returns {void}
   */
  makeMobs(map: Map, rnd: RandomGenerator, rate: number): void {
    const dim = map.dimensions;
    const p = new WorldPoint();
    for (p.y = 1; p.y < dim.y - 1; ++p.y) {
      for (p.x = 1; p.x < dim.x - 1; ++p.x) {
        if (map.isBlocked(p)) {
          continue;
        }
        if (!rnd.isOneIn(rate)) {
          continue;
        }
        this.addMobToMapWithAdjustedLevel(p, map, rnd);
      }
    }
  }

  /**
   * Adds a mob to the map with an adjusted level.
   *
   * @param {WorldPoint} pos - The position where the mob is added.
   * @param {Map} map - The map to which the mob is being added.
   * @param {RandomGenerator} rnd - The random generator used for adjusting the level.
   * @return {Mob} The added mob.
   */
  addMobToMapWithAdjustedLevel(
    pos: WorldPoint,
    map: Map,
    rnd: RandomGenerator,
  ): Mob {
    const baseLevel = map.level;
    let level = rnd.adjustLevel(baseLevel);

    if (level < 1) level = 1;

    const glyphIndex = level + Glyph.Ant - 1;
    const glyph = GlyphMap.indexToGlyph(glyphIndex);

    return this.addNPC(glyph, pos.x, pos.y, map, level);
  }

  /**
   * Maps a level to a glyph.
   *
   * @param {number} level - The level to map.
   * @return {Glyph} The glyph representing the level.
   */
  level2Glyph(level: number): Glyph {
    const glyph_index: number = level + Glyph.Ant - 1;
    const g = GlyphMap.indexToGlyph(glyph_index);

    return g;
  }

  /**
   * Adds items to the map.
   *
   * @param {Map} map - The map to which the mob is being added.
   * @param {RandomGenerator} rnd - The random generator used for adjusting the level.
   */
  addItems(map: Map, rnd: RandomGenerator): void {
    for (let p = new WorldPoint(); p.y < map.dimensions.y; ++p.y) {
      for (p.x = 0; p.x < map.dimensions.x; ++p.x) {
        if (map.isBlocked(p)) {
          continue;
        }
        if (!rnd.isOneIn(40)) {
          continue;
        }
        ObjectTypes.addRandomObjectForLevel(p, map, rnd, map.level);
      }
    }
  }

  initLevel1(game: Game): void {
    const L1 = game.dungeon.getLevel(1, game);
    this.addItemToPlayerInventory(<Inventory>game.inventory);
    this.addItemNextToPlayer(game.player, L1);
  }

  addItemNextToPlayer(player: Mob, map: Map): void {
    const a = player.pos;

    let p = new WorldPoint(a.x + 1, a.y);
    map.addObject(new ItemObject(Glyph.Shield, Slot.OffHand), p);
    map.cell(p).env = Glyph.Floor;

    p = new WorldPoint(a.x, a.y + 1);
    map.addObject(new ItemObject(Glyph.Shield, Slot.OffHand), p);
    map.cell(p).env = Glyph.Floor;
  }

  addItemToPlayerInventory(inv: Inventory): void {
    inv.add(new ItemObject(Glyph.Dagger, Slot.MainHand));
  }
}
