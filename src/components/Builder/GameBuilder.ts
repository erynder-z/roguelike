import { Build } from '../../interfaces/Builder/Builder';
import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { TestMap2 } from '../../test_Implementations/TestMap2';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Game } from './GameModel';

export class GameBuilder implements Build {
  makeGame(): GameIF {
    const rnd = new RandomGenerator(42);
    const game = new Game(rnd);
    game.map = this.makeLevel(rnd, 0);
    return game;
  }
  makeLevel(rnd: RandomGenerator, level: number): Map {
    return this.makeMap(rnd, level);
  }
  makeMap(rnd: RandomGenerator, level: number): Map {
    const wdim = WorldPoint.StockDimensions;
    return TestMap2.test(wdim, rnd, level);
  }
}
