import { MobAI } from '../Mobs/Interfaces/MobAI';
import { BuildIF } from './Interfaces/BuildIF';
import { GameIF } from './Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
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
import { MoodAI } from '../Mobs/MoodAI';
import { Overworld } from '../../staticMaps/Overworld';
import { MapGenerator_Cave } from '../MapGenerator/MapGenerator_Cave';

/**
 * Represents a builder for creating games, levels and mobs.
 */
export class Builder implements BuildIF {
  /**
   * Create and return a new GameIF instance.
   *
   * @return {GameIF} The newly created GameIF instance
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(99);
    const player = this.makePlayer();
    const game = new Game(rnd, player, this);
    game.dungeon.level = 0;
    this.enterFirstLevel(game);
    game.ai = this.makeAI();
    this.initLevel0(game);

    return game;
  }

  /**
   * A function to make a level using the given random generator and level number.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level number
   * @return {MapIF} the generated map
   */
  makeLevel(rnd: RandomGenerator, level: number): MapIF {
    const map = this.makeMap(rnd, level);
    this.addLevelStairs(map, level, rnd);
    this.addMobsToLevel(map, rnd);
    if (level !== 0) this.addItems(map, rnd);
    return map;
  }

  /**
   * Generates a map using the given random generator and level number.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level-number for the map
   * @return {MapIF} the generated map
   */
  makeMap(rnd: RandomGenerator, level: number): MapIF {
    const dim = TerminalPoint.MapDimensions;
    const wdim = new WorldPoint(dim.x, dim.y);

    let map;

    switch (level) {
      case 0:
        map = Overworld.generate(rnd, level);
        break;
      case 1:
        map = MapGenerator1.generate(wdim, rnd, level);
        break;
      default:
        map = MapGenerator_Cave.generate(rnd, level);
        break;
    }

    map.setEnvironmentDescriptions();

    return map;
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
    return new AISwitcher(MoodAI.stockMoodSpellCaster(1, 8));
  }

  makeRingOfCats(map: MapIF, rnd: RandomGenerator): void {
    this.makeRingOfMobs(Glyph.Cat, map, rnd);
  }

  /**
   * Generates a ring of mobs around a central point on the map.
   *
   * @param {Glyph} glyph - the glyph representing the mob
   * @param {MapIF} map - the map on which the mobs will be generated
   * @param {RandomGenerator} rnd - the random generator for determining mob positions
   * @return {void}
   */
  makeRingOfMobs(glyph: Glyph, map: MapIF, rnd: RandomGenerator): void {
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

  makeTestMob(map: MapIF, ply: Mob): void {
    const mob = Glyph.Druid;
    const pos = ply.pos;

    const p = new WorldPoint(pos.x, pos.y);
    let x = pos.x;
    let y = pos.y;

    // Place the mob next to the player
    if (Math.random() < 0.5) {
      x += 1; // Place to the right of the player
    } else {
      x -= 1; // Place to the left of the player
    }

    if (Math.random() < 0.5) {
      y += 1; // Place below the player
    } else {
      y -= 1; // Place above the player
    }

    p.x = x;
    p.y = y;

    this.addNPC(mob, p.x, p.y, map, 1);
  }
  /**
   * Adds a new non-playable character to the map at the specified position and level.
   *
   * @param {Glyph} glyph - the visual representation of the NPC
   * @param {number} x - the x-coordinate of the NPC on the map
   * @param {number} y - the y-coordinate of the NPC on the map
   * @param {MapIF} map - the map to which the NPC is being added
   * @param {number} level - the level of the NPC
   * @return {Mob} the newly added NPC
   */
  addNPC(glyph: Glyph, x: number, y: number, map: MapIF, level: number): Mob {
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
   * @param {MapIF} map - The map to which stairs are being added.
   * @param {number} level - The level for which stairs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding stairs.
   * @returns {void}
   */
  addLevelStairs(map: MapIF, level: number, rnd: RandomGenerator): void {
    level === 0 ? this.addStairs0(map) : this.addStairs(map, rnd);
  }

  /**
   * Adds stairs for level to the map at a specified position.
   * @param {MapIF} map - The map to which stairs are being added.
   * @returns {void}
   */
  addStairs0(map: MapIF): void {
    const pos = this.centerPos(map.dimensions);
    const x = 3;
    const y = 0;
    const p = new WorldPoint(x, y).addTo(pos);

    map.cell(p).env = Glyph.StairsDown;
  }

  /**
   * Adds stairs for a level to the map.
   * @param {MapIF} map - The map to which stairs are being added.
   * @returns {void}
   */
  addStairs(map: MapIF, rnd: RandomGenerator): void {
    this.addStair(map, rnd, Glyph.StairsDown);
    this.addStair(map, rnd, Glyph.StairsUp);
  }

  /**
   * Adds stairs to the map based on the provided glyph and random generator.
   * @param {MapIF} map - The map to which stairs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding stairs.
   * @param {Glyph} stair - The glyph representing the stairs.
   * @returns {boolean} True if stairs are successfully added, otherwise false.
   */
  addStair(map: MapIF, rnd: RandomGenerator, stair: Glyph): boolean {
    const p = <WorldPoint>FindFreeSpace.findFree(map, rnd);
    map.cell(p).env = stair;
    return true;
  }

  /**
   * Adds mobs to the level based on the map and random generator provided.
   * @param {MapIF} map - The map to which mobs are being added.
   * @param {RandomGenerator} rnd - The random generator used for adding mobs.
   * @returns {void}
   */
  addMobsToLevel(map: MapIF, rnd: RandomGenerator): void {
    switch (map.level) {
      case 0:
        //TODO this.makeFriendlyNPCs(map, rnd);
        break;
      default:
        this.makeMobs(map, rnd, 15);
        break;
    }
  }

  /**
   * Makes mobs on the map using the provided random generator and glyph.
   * @param {MapIF} map - The map on which the mobs will be created.
   * @param {RandomGenerator} rnd - The random generator used to determine the placement of the mobs.
   * @param {Glyph} glyph - The glyph representing the mobs.
   * @param {number} rate - The rate of mob creation.
   * @returns {void}
   */
  makeMobs(map: MapIF, rnd: RandomGenerator, rate: number): void {
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
        this.addMapLevel_Mob(p, map, rnd);
      }
    }
  }

  /**
   * Adds a mob to the map with an adjusted level.
   *
   * @param {WorldPoint} p - The position where the mob is added.
   * @param {MapIF} map - The map to which the mob is being added.
   * @param {RandomGenerator} rnd - The random generator used for adjusting the level.
   * @return {void} This function does not return anything.
   */
  addMapLevel_Mob(p: WorldPoint, map: MapIF, rnd: RandomGenerator): void {
    this.addMobToMapWithAdjustedLevel(p, map, rnd);
  }

  /**
   * Adds a mob to the map with an adjusted level.
   *
   * @param {WorldPoint} pos - The position where the mob is added.
   * @param {MapIF} map - The map to which the mob is being added.
   * @param {RandomGenerator} rnd - The random generator used for adjusting the level.
   * @return {Mob} The added mob.
   */
  addMobToMapWithAdjustedLevel(
    pos: WorldPoint,
    map: MapIF,
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
   * @param {MapIF} map - The map to which the mob is being added.
   * @param {RandomGenerator} rnd - The random generator used for adjusting the level.
   */
  addItems(map: MapIF, rnd: RandomGenerator): void {
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

  /**
   * Initializes level 0 of the game.
   *
   * @param {Game} game - The game object.
   * @return {void} No return value.
   */
  initLevel0(game: Game): void {
    const L0 = game.dungeon.getLevel(0, game);
    this.addItemToPlayerInventory(<Inventory>game.inventory);
    this.addItemNextToPlayer(game.player, L0);
    this.makeTestMob(L0, game.player);
  }

  /**
   * Adds items next to the player on the map.
   *
   * @param {Mob} player - The player object.
   * @param {MapIF} map - The map where items are added.
   * @return {void} No return value.
   */
  addItemNextToPlayer(player: Mob, map: MapIF): void {
    const a = player.pos;
    let p = new WorldPoint(a.x, a.y + 2);
    map.addObject(new ItemObject(Glyph.Shield, Slot.OffHand), p);
    map.cell(p).env = Glyph.Floor;

    p = new WorldPoint(a.x, a.y + 1);
    map.addObject(new ItemObject(Glyph.Shield, Slot.OffHand), p);
    map.cell(p).env = Glyph.Floor;
  }

  /**
   * Adds items to the player's inventory.
   *
   * @param {Inventory} inv - The inventory to add the item to.
   * @return {void} This function does not return anything.
   */
  addItemToPlayerInventory(inv: Inventory): void {
    inv.add(new ItemObject(Glyph.Dagger, Slot.MainHand));

    inv.add(new ItemObject(Glyph.Potion, Slot.NotWorn));

    const rune = new ItemObject(Glyph.TeleportRune, Slot.NotWorn);
    rune.charges = 2;
    inv.add(rune);

    const pistol = new ItemObject(Glyph.Pistol, Slot.NotWorn);
    pistol.charges = 10;
    inv.add(pistol);
  }
}
