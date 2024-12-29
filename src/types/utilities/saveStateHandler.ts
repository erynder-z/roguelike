export type SerializedGameState = {
  serializedAI: { id: string; data: SerializedAIData };
  serializedLog: { id: string; data: SerializedLogData };
  serializedDungeon: { id: string; data: string };
  serializedAutoHeal: { id: string; data: SerializedAutoHealData };
  serializedInventory: { id: string; data: SerializedInventoryData };
  serializedEquipment: { id: string; data: SerializedEquipmentData };
  serializedStats: { id: string; data: SerializedStatsData };
  serializedPlayer: { id: string; data: SerializedPlayerData };
  serializedPlayerBuffs: {
    id: string;
    data: SerializedBuffData[];
  };
  serializedBuild: { id: string; data: string };
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

export type SerializedAutoHealData = {
  amount: number;
  amountToHealMin: number;
  nextWait: number;
  countdown: number;
  timeToHealMax: number;
};

export type SerializedInventoryData = {
  items: {
    glyph: string;
    slot: string;
    spell: string;
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
  pos: {
    x: number;
    y: number;
  };
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
  dimensions: string;
  level: number;
  cells: string[][];
  isDark: boolean;
  upStairPos?: string;
  downStairPos?: string;
  queue: string;
};

export type SerializedMapCell = {
  env: string;
  mob?: string;
  lit: boolean;
  obj?: string;
  sprite?: string;
  corpse?: string;
  environment?: {
    name: string;
    description: string;
    effects: string[];
  };
};

export type SerializedPlayerConfig = {
  name: string;
  appearance: string;
  color: string;
  avatar: string;
};

export type SerializedDungeonData = any;

export type SerializedBuild = any;
