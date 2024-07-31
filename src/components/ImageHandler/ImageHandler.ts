import attackImages from './attackImages';
import deathImages from './deathImages';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import hurtImages from './hurtImages';
import movingImages from './movingImages';
import neutralImages from './neutralImages';
import pistolImages from './pistolImages';
import smileImages from './smileImages';

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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];
    const randomImage = r.getRandomImageFromArray(attackImages);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage =
      this.getCurrentImageDataAttribute() !== 'mobDamage' &&
      this.getCurrentImageDataAttribute() !== 'attack';

    const maybeDrawImage = r.randomIntegerClosedRange(0, 2) === 0;

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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(hurtImages);
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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(smileImages);
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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(movingImages);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage = this.getCurrentImageDataAttribute() !== 'moving';
    const maybeDrawImage = r.randomIntegerClosedRange(0, 9) === 0;

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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(pistolImages);
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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(neutralImages);
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
    const r = game.rand;
    const evt = EventCategory[game.log.currentEvent];

    const randomImage = r.getRandomImageFromArray(deathImages);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }
}
