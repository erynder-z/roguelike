export type InitParamsType = {
  SHOW_MENU: boolean;
  seed: number;
  player: {
    name: string;
    appearance: 'boyish' | 'girlish';
    color: string;
  };
};

export const initParams: InitParamsType = {
  SHOW_MENU: true,
  /* seed: 1337, */
  seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  player: {
    name: 'Player',
    appearance: 'girlish',
    color: '#ffffff',
  },
};
