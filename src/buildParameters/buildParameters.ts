import { getRandomName } from '../utilities/getRandomName';
import { BuildParametersType } from './types/buildParametersType';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

const defaultParams: BuildParametersType = {
  SHOW_MENU: true,
  seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  player: {
    name: getRandomName('girlish'),
    appearance: 'girlish',
    color: '#ffffff',
    avatar: '@',
  },
};
export let buildParameters: BuildParametersType =
  defaultParams as BuildParametersType;

export const createBuildParameters = async (): Promise<void> => {
  try {
    const params = await readTextFile('buildParamsConfig.json', {
      baseDir: BaseDirectory.AppData,
    });

    const parsedParams = JSON.parse(params);

    buildParameters = {
      SHOW_MENU: parsedParams.SHOW_MENU,
      seed: parsedParams.seed,
      player: {
        name: parsedParams.player.name,
        appearance: parsedParams.player.appearance,
        color: parsedParams.player.color,
        avatar: parsedParams.player.avatar,
      },
    };
  } catch (error) {
    console.error('Error loading parameters, using default parameters:', error);
  }
};

// Call the async function to load user-specific parameters after setting defaults.
createBuildParameters();
