import buildParams from './buildParametersData/buildParameters.json';
import { BuildParametersType } from './types/buildParametersType';
import { getRandomName } from '../utilities/getRandomName';

export const defaultParams: BuildParametersType = {
  SHOW_MENU: true,
  seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  player: {
    name: getRandomName('girlish'),
    appearance: 'girlish',
    color: '#ffffff',
    avatar: '@',
  },
};

export const createBuildParameters = (): BuildParametersType => {
  const params = buildParams.buildParams as BuildParametersType;

  try {
    return {
      SHOW_MENU: params.SHOW_MENU || defaultParams.SHOW_MENU,
      seed: params.seed || defaultParams.seed,
      player: {
        name: params.player.name || defaultParams.player.name,
        appearance: params.player.appearance || defaultParams.player.appearance,
        color: params.player.color || defaultParams.player.color,
        avatar: params.player.avatar || defaultParams.player.avatar,
      },
    };
  } catch (error) {
    console.error('Error loading parameters:', error);
    // Return default parameters if an error occurs

    return defaultParams;
  }
};

// These cannot be async as they need to be available at runtime!
export const buildParameters = createBuildParameters();
