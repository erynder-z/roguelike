/**
 * Handles displaying action images on the screen.
 */
export class ImageHandler {
  name: string = 'image-handler';

  private static instance: ImageHandler | null = null;

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

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
  getCurrentImageDataAttribute(): string | null {
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
  displayImage(img: HTMLImageElement, type: string) {
    img.setAttribute('class', 'hud-image');
    img.setAttribute('data-image', type);
    const imageContainer = document.getElementById('image-container');
    if (imageContainer) {
      imageContainer.innerHTML = '';
      imageContainer.appendChild(img);
    }
  }
}
