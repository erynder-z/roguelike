export enum EventCategory {
  buff,
  mobDamage,
  mobDeath,
  heal,
  unknown,
  unable,
  dig,
  door,
  drop,
  equip,
  playerDamage,
  playerDeath,
  attack,
  layingObject,
  pickup,
  lvlChange,
  moving,
  rangedAttack,
  wait,
  look,
  none,
  teleport,
  use,
  mobSpawn,
  trap,
}
export class LogMessage {
  constructor(
    public message: string,
    public category: EventCategory,
  ) {}
}
