import { AutoHeal } from '../../Commands/AutoHeal';
import { Builder } from '../Builder';
import { MapHandler } from '../MapHandler';
import { Equipment } from '../../Inventory/Equipment';
import { Inventory } from '../../Inventory/Inventory';
import { LogMessage, EventCategory } from '../../Messages/LogMessage';
import { Map } from '../../MapModel/Types/Map';
import { Mob } from '../../Mobs/Mob';
import { MobAI } from '../../Mobs/Types/MobAI';
import { MessageLog } from '../../Messages/MessageLog';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { Stats } from '../../Stats/Stats';

export type GameState = {
  rand: RandomGenerator;
  player: Mob;
  ai: MobAI | null;
  log: MessageLog;
  dungeon: MapHandler;
  build: Builder;
  autoHeal: AutoHeal | undefined;
  inventory: Inventory | undefined;
  equipment: Equipment | undefined;
  stats: Stats;
  currentMap(): Map | null;
  message(msg: LogMessage): void;
  flash(msg: LogMessage): void;
  addCurrentEvent(evt: EventCategory): void;
};
