import { MobAI } from '../Mobs/Interfaces/MobAI';
import { GameIF } from './Interfaces/Game';
import { Map } from '../MapModel/Interfaces/Map';
import { MessageLog } from '../Messages/MessageLog';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { Dungeon } from '../MapModel/Dungeon';
import { Build0 } from './Interfaces/Builder0';
import { AutoHeal } from '../Commands/AutoHeal';
import { Inventory } from '../Inventory/Inventory';

/**
 * Represents a game instance implementing the GameIF interface.
 */
export class Game implements GameIF {
  constructor(
    public rand: RandomGenerator,
    public player: Mob,
    public build: Build0,
  ) {}
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
  autoHeal: AutoHeal | undefined = new AutoHeal();
  inventory = new Inventory();
}
