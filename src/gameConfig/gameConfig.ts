import { getRandomName } from '../utilities/getRandomName';
import { GameConfigType } from '../types/gameConfig/gameConfigType';
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
  mkdir,
} from '@tauri-apps/plugin-fs';

const defaultParams: GameConfigType = {
  SHOW_MENU: true,
  show_scanlines: true,
  scanline_style: 'light',
  show_images: true,
  message_display: 'left',
  message_count: 25,
  image_display: 'left',
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
 * Ensures the gameConfig.json file exists, creates it if not, and loads the parameters.
 *
 * If the file doesn't exist, or there is an error reading it, default parameters are used and the file is created.
 *
 * @returns {Promise<void>} A promise for when the file is loaded and build parameters are updated.
 */
export const createBuildParameters = async (): Promise<void> => {
  try {
    const params = await readTextFile('gameConfig.json', {
      baseDir: BaseDirectory.AppData,
    });

    const parsedParams = JSON.parse(params);

    gameConfig = {
      SHOW_MENU: parsedParams.SHOW_MENU,
      show_scanlines: parsedParams.show_scanlines,
      scanline_style: parsedParams.scanline_style,
      show_images: parsedParams.show_images,
      message_display: parsedParams.message_display,
      message_count: parsedParams.message_count,
      image_display: parsedParams.image_display,
      seed: parsedParams.seed,
      player: {
        name: parsedParams.player.name,
        appearance: parsedParams.player.appearance,
        color: parsedParams.player.color,
        avatar: parsedParams.player.avatar,
      },
    };
  } catch (error) {
    console.error(
      'Error loading parameters or file not found, creating new file:',
      error,
    );

    try {
      await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });

      await writeTextFile(
        'gameConfig.json',
        JSON.stringify(defaultParams, null, 2),
        {
          baseDir: BaseDirectory.AppData,
        },
      );
      console.log('gameConfig.json file created with default parameters.');
    } catch (writeError) {
      console.error(
        'Error writing default parameters to gameConfig.json:',
        writeError,
      );
    }

    gameConfig = defaultParams;
  }
};

createBuildParameters();
