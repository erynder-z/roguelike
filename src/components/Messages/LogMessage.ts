export enum MessageCategory {
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
}
export class LogMessage {
  constructor(
    public message: string,
    public category: MessageCategory,
  ) {}
}
