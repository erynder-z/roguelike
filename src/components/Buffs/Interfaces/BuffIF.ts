export interface TickIF {
  tick(time: number): void;
}

export interface BuffIF {
  buff: number;
  time: number;
  effect: TickIF | undefined;
}
