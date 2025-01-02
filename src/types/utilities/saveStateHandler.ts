export type SerializedGameState = {
  serializedAI: { id: string; data: SerializedAIData };
  serializedLog: { id: string; data: SerializedLogData };
  serializedDungeon: { id: string; data: SerializedDungeonData };
  serializedAutoHeal: { id: string; data: SerializedAutoHealData };
  serializedInventory: { id: string; data: SerializedInventoryData };
  serializedEquipment: { id: string; data: SerializedEquipmentData };
  serializedStats: { id: string; data: SerializedStatsData };
  serializedPlayer: { id: string; data: SerializedPlayerData };
  serializedPlayerBuffs: {
    id: string;
    data: SerializedBuffData[];
  };
  serializedBuild: { id: string; data: SerializedBuild };
  playerConfig: SerializedPlayerConfig;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SerializedAIData = any;

export type SerializedLogData = {
  archive: {
    id: string;
    message: string;
    category: number;
  }[];
  currentEvent: number;
  queue: {
    id: string;
    message: string;
    category: number;
  }[];
};

export type SerializedDungeonData = {
  level: number;
  maps: SerializedGameMap[];
};

export type SerializedAutoHealData = {
  amount: number;
  amountToHealMin: number;
  nextWait: number;
  countdown: number;
  timeToHealMax: number;
};

export type SerializedInventoryData = {
  items: {
    glyph: number;
    slot: number;
    spell: number;
    charges: number;
    level: number;
    desc: string;
  }[];
};

export type SerializedItemData = {
  charges: number;
  desc: string;
  glyph: number;
  level: number;
  slot: number;
  spell: number;
};
export type SerializedEquipmentData = [number, SerializedItemData][];

export type SerializedStatsData = {
  currentTurnReceivedDmg: number;
  currentVisRange: number;
  damageDealtCounter: number;
  damageReceivedCounter: number;
  defaultVisRange: number;
  mobKillCounter: number;
  turnCounter: number;
};

export type SerializedPlayerData = {
  pos: SerializedWorldPoint;
  name: string;
  hp: number;
  maxhp: number;
  level: number;
};

export type SerializedBuffData = {
  buff: number;
  duration: number;
};

export type SerializedGameMap = {
  dimensions: SerializedWorldPoint;
  level: number;
  cells: SerializedMapCellArray[];
  isDark: boolean;
  upStairPos?: SerializedWorldPoint;
  downStairPos?: SerializedWorldPoint;
  queue: string;
};

export type SerializedMapCellArray = SerializedMapCell[];

export type SerializedMapCell = {
  env: number;
  mob?: SerializedMobData;
  lit: boolean;
  obj?: SerializedItemData;
  sprite?: number;
  corpse?: SerializedCorpseData;
  environment?: {
    name: string;
    description: string;
    effects: number[];
  };
};

export type SerializedBuild = {
  player: SerializedPlayerConfig;
  seed: number;
};

export type SerializedPlayerConfig = {
  name: string;
  appearance: 'boyish' | 'girlish';
  color: string;
  avatar: string;
};

export type SerializedMobData = {
  id: string;
  pos: SerializedWorldPoint;
  glyph: number;
  name: string;
  description: string;
  hp: number;
  maxhp: number;
  mood: SerializedMobMood;
  level: number;
  sinceMove: number;
  isPlayer: boolean;
  buffs: SerializedBuffData[];
};

export type SerializedCorpseData = {
  id: string;
  pos: SerializedWorldPoint;
  glyph: number;
  name: string;
  description: string;
};

export type SerializedWorldPoint = {
  x: number;
  y: number;
};

export type SerializedMobMood = any;
