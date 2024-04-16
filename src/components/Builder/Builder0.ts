import { Build0 } from './Interfaces/Builder0';
import { GameIF } from './Interfaces/Game';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Game } from './GameModel';

/**
 * Represents a builder implementation for creating game instances.
 */
export class Builder0 implements Build0 {
  /**
   * Creates a new game object and initializes it with a random generator and a level map.
   *
   * @return {GameIF} The newly created game object.
   */
  makeGame(): GameIF {
    const rnd = new RandomGenerator(42);
    const game = new Game(rnd);
    game.map = this.makeLevel(rnd, 0);
    return game;
  }
  /**
   * A function that creates a level using the given random generator and level number.
   *
   * @param {RandomGenerator} rnd - the random generator to use
   * @param {number} level - the level number
   * @return {MapIF} the created level map
   */
  makeLevel(rnd: RandomGenerator, level: number): MapIF {
    return this.makeMap(rnd, level);
  }
  /**
   * Generate a map using the given random generator and level.
   *
   * @param {RandomGenerator} rnd - the random generator
   * @param {number} level - the level for the map
   * @return {MapIF} the generated map
   */
  makeMap(rnd: RandomGenerator, level: number): MapIF {
    const wdim = WorldPoint.StockDimensions;
    return TestMap2.test(wdim, rnd, level);
  }
}
