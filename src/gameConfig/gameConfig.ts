import { getRandomName } from '../utilities/getRandomName';
import { GameConfigType } from '../types/gameConfig/gameConfigType';
import { BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

const defaultParams: GameConfigType = {
  SHOW_MENU: true,
  scanlines: true,
  seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  player: {
    name: getRandomName('girlish'),
    appearance: 'girlish',
    color: '#ffffff',
    avatar: '@',
  },
};
export let gameConfig: GameConfigType = defaultParams as GameConfigType;

/**
 * Loads the build parameters from the 'gameConfig.json' file in the app data directory.
 *
 * If the file does not exist, or if there is an error reading the file, the default parameters are
 * used.
 *
 * @returns {Promise<void>} A promise for when the file is loaded and the build parameters are
 *          updated.
 */
export const createBuildParameters = async (): Promise<void> => {
  try {
    const params = await readTextFile('gameConfig.json', {
      baseDir: BaseDirectory.AppData,
    });

    const parsedParams = JSON.parse(params);

    gameConfig = {
      SHOW_MENU: parsedParams.SHOW_MENU,
      scanlines: parsedParams.scanlines,
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

createBuildParameters();
