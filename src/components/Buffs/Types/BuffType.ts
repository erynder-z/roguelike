export type Tick = {
  tick(duration: number, timeLeft: number): void;
};

export type BuffType = {
  buff: number;
  duration: number;
  timeLeft: number;
  effect: Tick | undefined;
};
