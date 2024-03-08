import { MobAI } from '../../interfaces/AI/MobAI';
import { Build2 } from '../../interfaces/Builder/Builder2';
import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { Glyph } from '../MapModel/Glyph';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { AISwitcher } from '../Mobs/AISwitcher';
import { Mob } from '../Mobs/Mob';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { FindFreeSpace } from './FindFreeSpace';
import { Game } from './GameModel';
import { MapGenerator1 } from './MapGenerator';

/**
 * Represents a builder for creating games, levels and mobs.
 */
export class Builder2E implements Build2 {
  /**
   * Create and return a new GameIF instance.
   *
   * @return {GameIF} The newly created GameIF instance
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(99);
    const player = this.makePlayer();
    const game = new Game(rnd, player, this);
    this.enterFirstLevel(game);
    game.ai = this.makeAI();

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
        map = TestMap2.test(wdim, rnd, level);
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
    return new Mob(Glyph.Player, 20, 12);
  }

  /**
   * Create and return a new MobAI instance, or null if unable to create one.
   *
   * @return {MobAI | null} The created MobAI instance, or null if unable to create one.
   */
  makeAI(): MobAI | null {
    return new AISwitcher();
  }

  /**
   * A function to make a ring of pawns on the given map using the provided random generator.
   *
   * @param {Map} map - the map on which the ring of pawns will be created
   * @param {RandomGenerator} rnd - the random generator used to determine the placement of the pawns
   * @return {void}
   */
  makeRingOfPawns(map: Map, rnd: RandomGenerator): void {
    this.makeRingOfMobs(Glyph.Pawn, map, rnd);
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
    map.addNPC(mob);
    return mob;
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
      default:
        this.makeRingOfCats(map, rnd);
        break;
      case 1:
        this.makeBatsAndAnts(map, rnd);
        break;
    }
  }

  /**
   * Makes ants on the map using the provided random generator.
   * @param {Map} map - The map on which the ants will be created.
   * @param {RandomGenerator} rnd - The random generator used to determine the placement of the ants.
   * @returns {void}
   */
  makeBatsAndAnts(map: Map, rnd: RandomGenerator): void {
    this.makeMobs(map, rnd, Glyph.Ant, 15);
    this.makeMobs(map, rnd, Glyph.Bat, 15);
  }

  /**
   * Makes mobs on the map using the provided random generator and glyph.
   * @param {Map} map - The map on which the mobs will be created.
   * @param {RandomGenerator} rnd - The random generator used to determine the placement of the mobs.
   * @param {Glyph} glyph - The glyph representing the mobs.
   * @param {number} rate - The rate of mob creation.
   * @returns {void}
   */
  makeMobs(map: Map, rnd: RandomGenerator, glyph: Glyph, rate: number): void {
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
        this.addNPC(glyph, p.x, p.y, map, 0);
      }
    }
  }
}
