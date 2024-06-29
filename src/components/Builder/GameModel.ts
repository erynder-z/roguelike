import { MobAI } from '../Mobs/Interfaces/MobAI';
import { GameIF } from './Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { MessageLog } from '../Messages/MessageLog';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { Dungeon } from '../MapModel/Dungeon';
import { Builder } from './Builder';
import { AutoHeal } from '../Commands/AutoHeal';
import { Inventory } from '../Inventory/Inventory';
import { Equipment } from '../Inventory/Equipment';
import { LogMessage, EventCategory } from '../Messages/LogMessage';

/**
 * The game instance that holds the game state.
 */
export class Game implements GameIF {
  constructor(
    public rand: RandomGenerator,
    public player: Mob,
    public build: Builder,
  ) {}

  ai: MobAI | null = null;
  log: MessageLog = new MessageLog();
  dungeon: Dungeon = new Dungeon();
  autoHeal: AutoHeal | undefined = new AutoHeal();
  inventory = new Inventory();
  equipment = new Equipment();
  stats = { visRange: 50 };
  playerDmgCount = 0;

  /**
   * Retrieve the current map.
   *
   * @return {MapIF | null} The current map, or null if not available.
   */
  public currentMap(): MapIF | null {
    return this.dungeon.currentMap(this);
  }

  /**
   * Adds a message to the message log.
   * @param {string} s - The message to add.
   * @returns {void}
   */
  public message(msg: LogMessage): void {
    const isFlashMsg = false;
    this.log.message(msg, isFlashMsg);
  }

  /**
   * Displays a flash message.
   * @param {string} s - The message to add.
   * @returns {void}
   */
  public flash(msg: LogMessage): void {
    const isFlashMsg = true;
    this.log.message(msg, isFlashMsg);
  }

  public addCurrentEvent(evt: EventCategory): void {
    this.log.addCurrentEvent(evt);
  }

  public resetPlayerDmgCount(): void {
    this.playerDmgCount = 0;
  }
}
