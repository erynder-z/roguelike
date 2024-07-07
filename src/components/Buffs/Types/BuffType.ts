export type Tick = {
  tick(time: number): void;
};

export type BuffType = {
  buff: number;
  time: number;
  effect: Tick | undefined;
};
