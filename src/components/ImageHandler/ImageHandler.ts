import attackImages from './attackImages';
import deathImages from './deathImages';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import hurtImages from './hurtImages';
import movingImages from './movingImages';
import neutralImages from './neutralImages';
import pistolImages from './pistolImages';
import smileImages from './smileImages';
import {
  lvlTier00Images,
  lvlTier01Images,
  lvlTier02Images,
  lvlTier03Images,
  lvlTier04Images,
  lvlTier05Images,
  lvlTier06Images,
  lvlTier07Images,
  lvlTier08Images,
  lvlTier09Images,
} from './levelImages';

/**
 * Handles displaying action images on the screen.
 */
export class ImageHandler {
  name: string = 'image-handler';

  private static instance: ImageHandler | null = null;

  private constructor() {}

  /**
   * Returns the singleton instance of the ImageHandler class.
   *
   * @return {ImageHandler} The singleton instance of the ImageHandler class.
   */
  public static getInstance(): ImageHandler {
    if (!ImageHandler.instance) {
      ImageHandler.instance = new ImageHandler();
    }
    return ImageHandler.instance;
  }

  /**
   * Retrieves the value of the 'data-image' attribute of the first child element
   * of the 'image-container' element. This should be the currently displayed image. If the attribute exists, its value is returned.
   * Otherwise, null is returned.
   *
   * @return {string | null} The value of the 'data-image' attribute, or null if it doesn't exist.
   */
  private getCurrentImageDataAttribute(): string | null {
    const imageContainer = document.getElementById('image-container');
    const image = imageContainer?.firstChild as HTMLImageElement;
    const dataAttribute = image?.getAttribute('data-image');

    if (dataAttribute) {
      return dataAttribute;
    }
    return null;
  }

  /**
   * Displays an image on the screen.
   *
   * @param {HTMLImageElement} img - The image element to display.
   * @param {string} type - The type of the image.
   */
  public displayImage(img: HTMLImageElement, type: string) {
    img.setAttribute('class', 'hud-image');
    img.setAttribute('data-image', type);

    const imageContainer = document.getElementById('image-container');

    if (imageContainer) {
      imageContainer.innerHTML = '';
      imageContainer.appendChild(img);
    }
  }

  /**
   * Displays an action image on the screen when attacking.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleAttackImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];
    const randomImage = rand.getRandomImageFromArray(attackImages);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage =
      this.getCurrentImageDataAttribute() !== 'mobDamage' &&
      this.getCurrentImageDataAttribute() !== 'attack';

    const maybeDrawImage = rand.randomIntegerClosedRange(0, 2) === 0;

    if (shouldDrawImage) {
      // If not currently attacking, display the image
      this.displayImage(image, evt);
    } else {
      // There's a 1/3 chance of displaying a different image. If not, the current image remains shown.
      if (maybeDrawImage) this.displayImage(image, evt);
    }
    game.log.removeCurrentEvent();
  }

  /**
   * Displays an action image on the screen when taking damage.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleHurtImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(hurtImages);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }

  /**
   * Displays an action image on the screen when killing a mob.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleSmileImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(smileImages);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }

  /**
   * Displays an action image on the screen when the player is moving.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleMovingImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(movingImages);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage = this.getCurrentImageDataAttribute() !== 'moving';
    const maybeDrawImage = rand.randomIntegerClosedRange(0, 9) === 0;

    if (shouldDrawImage) {
      // If not currently moving, display the image
      this.displayImage(image, evt);
    } else {
      // There's a 10% chance of displaying a different image. If not, the current image remains shown.
      if (maybeDrawImage) this.displayImage(image, evt);
    }
    game.log.removeCurrentEvent();
  }

  /**
   * Displays a random action image from the pistolImages array on the game screen.
   *
   * @param {GameState} game - The game instance.
   * @return {void}
   */
  public handlePistolImageDisplay(game: GameState): void {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(pistolImages);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }

  /**
   * Displays a random action image from the neutralmages array on the game screen.
   *
   * @param {GameState} game - The game instance.
   * @return {void}
   */
  public handleNeutralImageDisplay(game: GameState): void {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(neutralImages);
    const image = new Image();
    image.src = randomImage;
    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }

  /**
   * Handles the display of a random death image on the game screen.
   *
   * @param {GameState} game - The game state object containing the necessary data.
   * @return {void} This function does not return anything.
   */
  public handleDeathImageDisplay(game: GameState): void {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = rand.getRandomImageFromArray(deathImages);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }

  /**
   * Handles the display of the level image based on the current game state.
   *
   * @param {GameState} game - The current game state.
   * @return {void} This function does not return a value.
   */
  public handleLevelImageDisplay(game: GameState): void {
    const { rand } = game;
    const evt = EventCategory[game.log.currentEvent];

    const lvl = game.dungeon.level;

    if (lvl == null || isNaN(lvl) || lvl < 0) return;

    const levelImageMapping = [
      lvlTier00Images, // Levels 0
      lvlTier01Images, // Levels 1-4
      lvlTier02Images, // Levels 5-8
      lvlTier03Images, // Levels 9-12
      lvlTier04Images, // Levels 13-16
      lvlTier05Images, // Levels 17-20
      lvlTier06Images, // Levels 21-24
      lvlTier07Images, // Levels 25-28
      lvlTier08Images, // Levels 29-32
      lvlTier09Images, // Levels 33-36
    ];

    const maxLevelIndex = levelImageMapping.length - 1;
    const index = Math.min(Math.floor(lvl / 4), maxLevelIndex);
    const images = levelImageMapping[index] || neutralImages;

    const randomImage = rand.getRandomImageFromArray(images);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }
}
