import { Build1 } from '../../interfaces/Builder/Builder1';
import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { Glyph } from '../MapModel/Glyph';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { Game } from './GameModel';

/**
 * Represents a builder for creating games and levels.
 */
export class Builder1 implements Build1 {
  /**
   * Create and return a new GameIF instance.
   *
   * @return {GameIF} The newly created GameIF instance
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(42);
    const game = new Game(rnd);
    game.player = this.makePlayer();
    game.map = this.makeLevel(rnd, 0);
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
}
