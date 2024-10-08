export type BuildParametersType = {
  SHOW_MENU: boolean;
  seed: number;
  player: {
    name: string;
    appearance: 'boyish' | 'girlish';
    color: string;
    avatar: string;
  };
};
