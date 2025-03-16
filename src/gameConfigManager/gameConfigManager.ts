import { getRandomName } from '../utilities/getRandomName';
import { GameConfigType } from '../types/gameConfig/gameConfigType';
import {
  BaseDirectory,
  readTextFile,
  writeTextFile,
  mkdir,
  open,
} from '@tauri-apps/plugin-fs';

/**
 * Handles initializing and updating the game configuration that is used to create UI and build the game.
 */
class GameConfigManager {
  private static instance: GameConfigManager;
  private config: GameConfigType;
  private readonly defaultParams: GameConfigType = {
    SHOW_MENU: true,
    show_scanlines: true,
    scanline_style: 'light',
    show_images: true,
    message_display: 'left',
    message_count: 25,
    image_display: 'left',
    seed: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
    control_scheme: 'default',
    player: {
      name: getRandomName('girlish'),
      appearance: 'girlish',
      color: '#ffffff',
      avatar: '@',
    },
    blood_intensity: 1,
    terminal: {
      dimensions: {
        width: 64,
        height: 40,
      },
      scaling_factor: 0.8,
      font: 'DejaVu Sans Mono',
    },
  };

  private constructor() {
    this.config = this.defaultParams;
  }

  /**
   * Gets the single instance of the GameConfigManager.
   * @returns The single instance of the GameConfigManager.
   */
  public static getInstance(): GameConfigManager {
    if (!GameConfigManager.instance) {
      GameConfigManager.instance = new GameConfigManager();
    }
    return GameConfigManager.instance;
  }

  /**
   * Initializes the configuration by loading from gameConfig.json if available.
   * Creates the file with default parameters if it doesn't exist.
   */
  public async initialize(): Promise<void> {
    try {
      const params = await readTextFile('gameConfig.json', {
        baseDir: BaseDirectory.AppData,
      });
      this.config = { ...this.config, ...JSON.parse(params) };
    } catch (error) {
      console.error(
        'Error loading parameters or file not found, creating new file:',
        error,
      );

      try {
        await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true });
        await this.saveConfig();
      } catch (writeError) {
        console.error(
          'Error writing default parameters to gameConfig.json:',
          writeError,
        );
      }

      this.config = this.defaultParams;
    }
  }

  /**
   * Returns the current game configuration.
   */
  public getConfig(): GameConfigType {
    return this.config;
  }

  /**
   * Saves the current in-memory configuration to gameConfig.json.
   * If the file does not exist, it is created with write permissions.
   */
  public async saveConfig(): Promise<void> {
    try {
      const contents = JSON.stringify(this.config, null, 2);

      // Ensure file exists with write permissions
      const file = await open('gameConfig.json', {
        write: true,
        create: true,
        baseDir: BaseDirectory.AppData,
      });

      await writeTextFile('gameConfig.json', contents, {
        baseDir: BaseDirectory.AppData,
      });

      await file.close();
      console.log('Configuration saved successfully.');
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }
}

export const gameConfigManager = GameConfigManager.getInstance();
