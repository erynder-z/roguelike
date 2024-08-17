import { AISwitcher } from '../Mobs/AISwitcher';
import { Build } from './Types/Build';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { Game } from './GameModel';
import { GameState } from './Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { ItemObjectManager } from '../ItemObjects/ItemObjectManager';
import { Map } from '../MapModel/Types/Map';
import { MapGenerator1 } from '../MapGenerator/MapGenerator';
import { MapGenerator_Cave } from '../MapGenerator/MapGenerator_Cave';
import { MapGenerator_Maze } from '../MapGenerator/MapGenerator_Maze';
import { Mob } from '../Mobs/Mob';
import { MobAI } from '../Mobs/Types/MobAI';
import { MoodAI } from '../Mobs/MoodAI';
import { Overworld } from '../../staticMaps/Overworld';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Slot } from '../ItemObjects/Slot';
import { Spell } from '../Spells/Spell';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * The builder for creating games, levels and mobs.
 */
export class Builder implements Build {
  /**
   * Create and return a new Game instance.
   *
   * @return {GameState} The newly created Game instance
   */
  public makeGame(): GameState {
    const rand = new RandomGenerator(99);
    const player = this.makePlayer();
    const game = new Game(rand, player, this);
    game.dungeon.level = 0;
    this.enterFirstLevel(game, rand);
    game.ai = this.makeAI();
    this.initLevel0(game);

    return game;
  }

  /**
   * A function to make a level using the given random generator and level number.
   *
   * @param {RandomGenerator} rand - the random generator to use
   * @param {number} level - the level number
   * @return {Map} the generated map
   */
  public makeLevel(rand: RandomGenerator, level: number): Map {
    const map = this.makeMap(rand, level);
    this.addLevelStairs(map, level, rand);
    this.addMobsToLevel(map, rand);
    this.addItems(map, rand);
    return map;
  }

  /**
   * Generates a map using the given random generator and level number.
   *
   * @param {RandomGenerator} rand - the random generator to use
   * @param {number} level - the level-number for the map
   * @return {Map} the generated map
   */
  public makeMap(rand: RandomGenerator, level: number): Map {
    const dim = TerminalPoint.MapDimensions;
    const wdim = new WorldPoint(dim.x, dim.y);

    let map;

    switch (level) {
      case 0:
        map = Overworld.generate(rand, level);
        break;
      case 1:
        map = MapGenerator1.generate(wdim, rand, level);
        break;
      case 2:
        map = MapGenerator_Cave.generate(rand, level);
        break;
      case 3:
        map = MapGenerator_Maze.generate(rand, level);
        break;
      default:
        map = MapGenerator1.generate(wdim, rand, level);
        break;
    }

    map.setEnvironmentDescriptions();

    // add a 10% chance of the map being dark if it's not level 0
    if (level !== 0 && rand.isOneIn(10)) {
      map.isDark = true;
    }

    return map;
  }

  /**
   * enter the first level of the game.
   *
   * @param {GameState} game - the game object
   * @return {void}
   */
  private enterFirstLevel(game: GameState, rand: RandomGenerator): void {
    const dungeon = game.dungeon;
    const map = dungeon.currentMap(game);
    /*     const np = this.centerPos(map.dimensions); */

    const np = <WorldPoint>FindFreeSpace.findFree(map, rand);

    game.dungeon.playerSwitchLevel(dungeon.level, np, game);
  }
  /**
   * Calculates the center position of the given WorldPoint dimensions.
   *
   * @param {WorldPoint} dim - the dimensions for which to calculate the center position
   * @return {WorldPoint} the center position of the given dimensions
   */
  private centerPos(dim: WorldPoint): WorldPoint {
    return new WorldPoint(Math.floor(dim.x / 2), Math.floor(dim.y / 2));
  }

  /**
   * Creates a new player Mob.
   *
   * @return {Mob} a new player Mob
   */
  public makePlayer(): Mob {
    const player = new Mob(Glyph.Player, 20, 12);
    player.hp = 9999;
    player.maxhp = 9999;
    return player;
  }

  /**
   * Create and return a new MobAI instance, or null if unable to create one.
   *
   * @return {MobAI | null} The created MobAI instance, or null if unable to create one.
   */
  public makeAI(): MobAI | null {
    return new AISwitcher(MoodAI.stockMoodShootAI(1, 8));
  }

  /**
   * Generates a ring of mobs around a central point on the map.
   *
   * @param {Glyph} glyph - the glyph representing the mob
   * @param {Map} map - the map on which the mobs will be generated
   * @param {RandomGenerator} rand - the random generator for determining mob positions
   * @return {void}
   */
  public makeRingOfMobs(glyph: Glyph, map: Map, rand: RandomGenerator): void {
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

  private makeTestMob(map: Map, ply: Mob): void {
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
   * @param {Map} map - the map to which the NPC is being added
   * @param {number} level - the level of the NPC
   * @return {Mob} the newly added NPC
   */
  public addNPC(
    glyph: Glyph,
    x: number,
    y: number,
    map: Map,
    level: number,
  ): Mob {
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
  private setLevelStats(mob: Mob, mobLevel: number): void {
    mob.level = mobLevel;
    mob.maxhp = mobLevel * 5;
    mob.hp = mob.maxhp;
  }

  /**
   * Adds level stairs to the map based on the level and random generator provided.
   * @param {Map} map - The map to which stairs are being added.
   * @param {number} level - The level for which stairs are being added.
   * @param {RandomGenerator} rand - The random generator used for adding stairs.
   * @returns {void}
   */
  private addLevelStairs(map: Map, level: number, rand: RandomGenerator): void {
    if (level === 0) {
      this.addStairs0(map, rand);
    } else {
      this.addStairs(map, rand);
    }
  }

  /**
   * Adds stairs for level to the map at a specified position.
   * @param {Map} map - The map to which stairs are being added.
   * @returns {void}
   */
  private addStairs0(map: Map, rand: RandomGenerator): void {
    const pos = this.centerPos(map.dimensions);
    const x = 3;
    const y = 0;
    const p = new WorldPoint(x, y).addTo(pos);

    if (!map.cell(p).isBlocked) {
      map.cell(p).env = Glyph.StairsDown;
      map.addStairInfo(Glyph.StairsDown, p);
    } else {
      this.addStair(map, rand, Glyph.StairsDown);
    }
  }

  /**
   * Adds stairs for a level to the map.
   * @param {Map} map - The map to which stairs are being added.
   * @returns {void}
   */
  private addStairs(map: Map, rand: RandomGenerator): void {
    this.addStair(map, rand, Glyph.StairsDown);
    this.addStair(map, rand, Glyph.StairsUp);
  }

  /**
   * Adds stairs to the map based on the provided glyph and random generator.
   * @param {Map} map - The map to which stairs are being added.
   * @param {RandomGenerator} rand - The random generator used for adding stairs.
   * @param {Glyph} stair - The glyph representing the stairs.
   * @returns {boolean} True if stairs are successfully added, otherwise false.
   */
  private addStair(
    map: Map,
    rand: RandomGenerator,
    stair: Glyph.StairsUp | Glyph.StairsDown,
  ): boolean {
    const p = <WorldPoint>FindFreeSpace.findFree(map, rand);
    map.cell(p).env = stair;
    map.addStairInfo(stair, p);

    return true;
  }

  /**
   * Adds mobs to the level based on the map and random generator provided.
   * @param {Map} map - The map to which mobs are being added.
   * @param {RandomGenerator} rand - The random generator used for adding mobs.
   * @returns {void}
   */
  private addMobsToLevel(map: Map, rand: RandomGenerator): void {
    switch (map.level) {
      case 0:
        //TODO this.makeFriendlyNPCs(map, rand);
        break;
      default:
        this.makeMobs(map, rand, 15);
        break;
    }
  }

  /**
   * Makes mobs on the map using the provided random generator and glyph.
   * @param {Map} map - The map on which the mobs will be created.
   * @param {RandomGenerator} rand - The random generator used to determine the placement of the mobs.
   * @param {Glyph} glyph - The glyph representing the mobs.
   * @param {number} rate - The rate of mob creation.
   * @returns {void}
   */
  private makeMobs(map: Map, rand: RandomGenerator, rate: number): void {
    const dim = map.dimensions;
    const p = new WorldPoint();
    for (p.y = 1; p.y < dim.y - 1; ++p.y) {
      for (p.x = 1; p.x < dim.x - 1; ++p.x) {
        if (map.isBlocked(p)) {
          continue;
        }
        if (!rand.isOneIn(rate)) {
          continue;
        }
        this.addMapLevel_Mob(p, map, rand);
      }
    }
  }

  /**
   * Adds a mob to the map with an adjusted level.
   *
   * @param {WorldPoint} p - The position where the mob is added.
   * @param {Map} map - The map to which the mob is being added.
   * @param {RandomGenerator} rand - The random generator used for adjusting the level.
   * @return {void} This function does not return anything.
   */
  public addMapLevel_Mob(p: WorldPoint, map: Map, rand: RandomGenerator): void {
    this.addMobToMapWithAdjustedLevel(p, map, rand);
  }

  /**
   * Adds a mob to the map with an adjusted level.
   *
   * @param {WorldPoint} pos - The position where the mob is added.
   * @param {Map} map - The map to which the mob is being added.
   * @param {RandomGenerator} rand - The random generator used for adjusting the level.
   * @return {Mob} The added mob.
   */
  private addMobToMapWithAdjustedLevel(
    pos: WorldPoint,
    map: Map,
    rand: RandomGenerator,
  ): Mob {
    const baseLevel = map.level;
    let level = rand.adjustLevel(baseLevel);

    if (level < 1) level = 1;

    const glyphIndex = level + Glyph.Ant - 1;
    const glyph = GlyphMap.indexToGlyph(glyphIndex);

    return this.addNPC(glyph, pos.x, pos.y, map, level);
  }

  /**
   * Adds items to the map.
   *
   * @param {Map} map - The map to which the mob is being added.
   * @param {RandomGenerator} rand - The random generator used for adjusting the level.
   */
  private addItems(map: Map, rand: RandomGenerator): void {
    for (let p = new WorldPoint(); p.y < map.dimensions.y; ++p.y) {
      for (p.x = 0; p.x < map.dimensions.x; ++p.x) {
        if (map.isBlocked(p)) {
          continue;
        }
        if (!rand.isOneIn(40)) {
          continue;
        }
        ItemObjectManager.addRandomObjectForLevel(p, map, rand, map.level);
      }
    }
  }

  /**
   * Initializes level 0 of the game.
   *
   * @param {Game} game - The game object.
   * @return {void} No return value.
   */
  private initLevel0(game: Game): void {
    const L0 = game.dungeon.getLevel(0, game);
    this.addItemToPlayerInventory(<Inventory>game.inventory);
    this.addItemNextToPlayer(game.player, L0);
    this.makeTestMob(L0, game.player);
  }

  /**
   * Adds items next to the player on the map.
   *
   * @param {Mob} player - The player object.
   * @param {Map} map - The map where items are added.
   * @return {void} No return value.
   */
  private addItemNextToPlayer(player: Mob, map: Map): void {
    const a = player.pos;
    let p = new WorldPoint(a.x, a.y + 2);
    map.addObject(new ItemObject(Glyph.Shield, Slot.OffHand), p);
    map.cell(p).env = Glyph.Floor;

    p = new WorldPoint(a.x, a.y + 1);
    map.addObject(new ItemObject(Glyph.Rune, Slot.NotWorn, Spell.Poison), p);
    map.cell(p).env = Glyph.Floor;
  }

  /**
   * Adds items to the player's inventory.
   *
   * @param {Inventory} inv - The inventory to add the item to.
   * @return {void} This function does not return anything.
   */
  private addItemToPlayerInventory(inv: Inventory): void {
    inv.add(new ItemObject(Glyph.Dagger, Slot.MainHand));

    inv.add(new ItemObject(Glyph.Potion, Slot.NotWorn, Spell.Heal));

    const rune1 = new ItemObject(Glyph.Rune, Slot.NotWorn, Spell.Teleport);
    rune1.charges = 2;
    inv.add(rune1);

    const rune2 = new ItemObject(Glyph.Rune, Slot.NotWorn, Spell.Bullet);
    inv.add(rune2);

    /*     const pistol = new ItemObject(Glyph.Pistol, Slot.NotWorn);
    pistol.charges = 10;
    inv.add(pistol); */
  }
}
