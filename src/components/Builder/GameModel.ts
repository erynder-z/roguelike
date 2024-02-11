import { GameIF } from '../../interfaces/Builder/Game';
import { GameMap } from '../MapModel/GameMap';
import { RandomGenerator } from '../MapModel/RandomGenerator';

export class Game implements GameIF {
  constructor(public rnd: RandomGenerator) {}
  map: GameMap | null = null;
  currentMap(): GameMap | null {
    return this.map;
  }
}
