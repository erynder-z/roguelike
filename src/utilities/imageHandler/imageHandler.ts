import { EventCategory } from '../../gameLogic/messages/logMessage';
import { GameState } from '../../types/gameBuilder/gameState';
import { gameConfig } from '../../gameConfig/gameConfig';
import { images } from './imageIndex';

/**
 * Handles displaying action images on the screen.
 */
export class ImageHandler {
  name: string = 'image-handler';

  private playerAppearance = gameConfig.player.appearance;

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
   * Selects an image set based on the player's appearance.
   *
   * @template T - The type of the image set.
   * @param {T} boyishSet - The image set for the 'boyish' appearance.
   * @param {T} girlishSet - The image set for the 'girlish' appearance.
   * @return {T} The selected image set based on the player's appearance.
   */
  private getImageSet<T>(boyishSet: T, girlishSet: T): T {
    return this.playerAppearance === 'boyish' ? boyishSet : girlishSet;
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
   * Displays an image on the screen with specified styling and animation.
   *
   * @param {HTMLImageElement} img - The image element to display.
   * @param {string} type - The type of the image to be displayed.
   */
  public displayImage(img: HTMLImageElement, type: keyof typeof EventCategory) {
    const eventName = type;

    img.setAttribute('class', 'hud-image');
    img.setAttribute('data-image', eventName);

    const imageContainer = document.getElementById('image-container');

    if (imageContainer) {
      const currentImage = imageContainer.querySelector('img');
      if (currentImage) currentImage.classList.remove('animation');

      // Insert the new image with opacity 0 (hidden)
      imageContainer.innerHTML = '';
      imageContainer.appendChild(img);

      // Use setTimeout to delay adding the 'fade-in' class, allowing it to animate
      setTimeout(() => {
        img.classList.add('animation');
      }, 10);
    }
  }

  /**
   * Displays an action image on the screen when attacking.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleAttackImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const attackImageSet = this.getImageSet(
      images.attackImages.boyish,
      images.attackImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(attackImageSet);
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const hurtImageSet = this.getImageSet(
      images.hurtImages.boyish,
      images.hurtImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(hurtImageSet);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage =
      this.getCurrentImageDataAttribute() !== 'playerDamage';
    const maybeDrawImage = rand.randomIntegerClosedRange(0, 3) === 0;

    if (shouldDrawImage) {
      // If not already displaying a hurt image, display the image
      this.displayImage(image, evt);
    } else {
      // There's a 25% chance of displaying a different image. If not, the current image remains shown.
      if (maybeDrawImage) this.displayImage(image, evt);
    }
    game.log.removeCurrentEvent();
  }

  /**
   * Displays an action image on the screen when killing a mob.
   *
   * @param {GameState} game - The game information containing the necessary data.
   */
  public handleSmileImageDisplay(game: GameState) {
    const { rand } = game;
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const smileImageSet = this.getImageSet(
      images.smileImages.boyish,
      images.smileImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(smileImageSet);
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const movingImageSet = this.getImageSet(
      images.movingImages.boyish,
      images.movingImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(movingImageSet);
    const image = new Image();
    image.src = randomImage;

    /*    const shouldDrawImage = this.getCurrentImageDataAttribute() !== 'moving'; */
    const shouldDrawImage = this.getCurrentImageDataAttribute() !== 'moving';
    const maybeDrawImage = rand.randomIntegerClosedRange(0, 5) === 0;

    if (shouldDrawImage) {
      // If not currently moving, display the image
      this.displayImage(image, evt);
    } else {
      // There's a 1/6 chance of displaying a different image. If not, the current image remains shown.
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const pistolImageSet = this.getImageSet(
      images.pistolImages.boyish,
      images.pistolImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(pistolImageSet);
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;
    const neutralImageSet = this.getImageSet(
      images.neutralImages.boyish,
      images.neutralImages.girlish,
    );
    const randomImage = rand.getRandomImageFromArray(neutralImageSet);
    const image = new Image();
    image.src = randomImage;

    const shouldDrawImage = this.getCurrentImageDataAttribute() !== 'wait';
    const maybeDrawImage = rand.randomIntegerClosedRange(0, 3) === 0;

    if (shouldDrawImage) {
      // If not currently waiting, display the image
      this.displayImage(image, evt);
    } else {
      // There's a 25% chance of displaying a different image. If not, the current image remains shown.
      if (maybeDrawImage) this.displayImage(image, evt);
    }
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;

    const randomImage = rand.getRandomImageFromArray(images.deathImages);
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
    const evt = EventCategory[
      game.log.currentEvent
    ] as keyof typeof EventCategory;

    const lvl = game.dungeon.level;

    if (lvl == null || isNaN(lvl) || lvl < 0) return;

    const levelImageMapping = [
      images.levelImages.lvlTier00Images, // Levels 0
      images.levelImages.lvlTier01Images, // Levels 1-4
      images.levelImages.lvlTier02Images, // Levels 5-8
      images.levelImages.lvlTier03Images, // Levels 9-12
      images.levelImages.lvlTier04Images, // Levels 13-16
      images.levelImages.lvlTier05Images, // Levels 17-20
      images.levelImages.lvlTier06Images, // Levels 21-24
      images.levelImages.lvlTier07Images, // Levels 25-28
      images.levelImages.lvlTier08Images, // Levels 29-32
      images.levelImages.lvlTier09Images, // Levels 33-36
    ];

    const maxLevelIndex = levelImageMapping.length - 1;
    const index = Math.min(Math.floor(lvl / 4), maxLevelIndex);
    const neutralImageSet = this.getImageSet(
      images.neutralImages.boyish,
      images.neutralImages.girlish,
    );
    const imgs = levelImageMapping[index] || neutralImageSet;

    const randomImage = rand.getRandomImageFromArray(imgs);
    const image = new Image();
    image.src = randomImage;

    this.displayImage(image, evt);
    game.log.removeCurrentEvent();
  }
}
