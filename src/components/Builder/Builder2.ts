import { MobAI } from '../../interfaces/AI/MobAI';
import { Build2 } from '../../interfaces/Builder/Builder2';
import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { Glyph } from '../MapModel/Glyph';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { MobAI1_Pawn } from '../Mobs/MobAI1_Pawn';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { Game } from './GameModel';

/**
 * Represents a builder for creating games, levels and mobs.
 */
export class Builder2A implements Build2 {
  /**
   * Create and return a new GameIF instance.
   *
   * @return {GameIF} The newly created GameIF instance
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(99);
    const game = new Game(rnd);
    game.player = this.makePlayer();
    game.map = this.makeLevel(rnd, 0);
    game.ai = this.makeAI();
    this.enterFirstLevel0(game);

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
    this.makeRingOfPawns(map, rnd);
    return map;
  }

  /**
   * Generates a map using the given random generator and level.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level for the map
   * @return {Map} the generated map
   */
  makeMap(rnd: RandomGenerator, level: number): Map {
    const dim = TerminalPoint.StockDimensions;
    const wdim = new WorldPoint(dim.x, dim.y);
    return TestMap2.test(wdim, rnd, level);
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
    return new MobAI1_Pawn();
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
}
