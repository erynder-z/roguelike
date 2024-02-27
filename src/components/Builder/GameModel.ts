import { MobAI } from '../../interfaces/AI/MobAI';
import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { MessageLog } from '../Messages/MessageLog';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { Dungeon } from '../MapModel/Dungeon';
import { Build0 } from '../../interfaces/Builder/Builder0';

/**
 * Represents a game instance implementing the GameIF interface.
 */
export class Game implements GameIF {
  constructor(
    public rand: RandomGenerator,
    public player: Mob,
    public build: Build0,
  ) {}
  map: Map | null = null;

  /**
   * Retrieve the current map.
   *
   * @return {Map | null} The current map, or null if not available.
   */
  currentMap(): Map | null {
    return this.dungeon.currentMap(this);
  }

  ai: MobAI | null = null;

  log: MessageLog = new MessageLog();

  /**
   * Adds a message to the message log.
   * @param {string} s - The message to add.
   * @returns {void}
   */
  message(s: string): void {
    const isFlashMsg = false;
    this.log.message(s, isFlashMsg);
  }

  /**
   * Displays a flash message.
   * @param {string} s - The message to add.
   * @returns {void}
   */
  flash(s: string): void {
    const isFlashMsg = true;
    this.log.message(s, isFlashMsg);
  }

  dungeon: Dungeon = new Dungeon();
}
