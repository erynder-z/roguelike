import { getRandomName } from '../components/Utilities/GetRandomName';

export type InitParamsType = {
  SHOW_MENU: boolean;
  seed: number;
  player: {
    name: string;
    appearance: 'boyish' | 'girlish';
    color: string;
  };
};

/**
 * Creates the initial parameters for a game.
 *
 * @return {InitParamsType} The created initial parameters.
 */
const createInitParams = (): InitParamsType => {
  const color = '#ffffff';
  const appearance: 'boyish' | 'girlish' = 'girlish';
  const name = getRandomName(appearance);

  return {
    SHOW_MENU: true,
    /* seed: 1337, */
    seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    player: {
      name,
      appearance,
      color,
    },
  };
};

export const initParams: InitParamsType = createInitParams();
