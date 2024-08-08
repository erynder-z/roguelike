import { AutoHeal } from '../Commands/AutoHeal';
import { Builder } from './Builder';
import { MapHandler } from './MapHandler';
import { Equipment } from '../Inventory/Equipment';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from './Types/GameState';
import { Inventory } from '../Inventory/Inventory';
import { LogMessage } from '../Messages/LogMessage';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { MobAI } from '../Mobs/Types/MobAI';
import { MessageLog } from '../Messages/MessageLog';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Stats } from '../Stats/Stats';

/**
 * The game instance that holds the game state.
 */
export class Game implements GameState {
  constructor(
    public rand: RandomGenerator,
    public player: Mob,
    public build: Builder,
  ) {}

  ai: MobAI | null = null;
  log: MessageLog = new MessageLog();
  dungeon: MapHandler = new MapHandler();
  autoHeal: AutoHeal | undefined = new AutoHeal();
  inventory = new Inventory();
  equipment = new Equipment();
  stats = new Stats();

  /**
   * Retrieve the current map.
   *
   * @return {Map | null} The current map, or null if not available.
   */
  public currentMap(): Map | null {
    return this.dungeon.currentMap(this);
  }

  /**
   * Adds a message to the message log.
   * @param {string} msg - The message to add.
   * @returns {void}
   */
  public message(msg: LogMessage): void {
    const isFlashMsg = false;
    this.log.message(msg, isFlashMsg);
  }

  /**
   * Displays a flash message.
   * @param {string} msg - The message to add.
   * @returns {void}
   */
  public flash(msg: LogMessage): void {
    const isFlashMsg = true;
    this.log.message(msg, isFlashMsg);
  }

  /**
   * Adds the given event category to the current event in the message log.
   *
   * @param {EventCategory} evt - The event category to add.
   * @return {void} This function does not return anything.
   */
  public addCurrentEvent(evt: EventCategory): void {
    this.log.addCurrentEvent(evt);
  }
}
