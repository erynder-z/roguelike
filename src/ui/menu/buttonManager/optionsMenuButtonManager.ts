import { gameConfigManager } from '../../../gameConfigManager/gameConfigManager';

/**
 * Handles changing the displayed content of buttons on the options menu.
 */
export class OptionsMenuButtonManager {
  private shadowRoot: ShadowRoot;
  private gameConfig = gameConfigManager.getConfig();
  private shouldDisableScanlineStyleButton = !this.gameConfig.show_scanlines;
  public shouldDisableImageAlignButton = !this.gameConfig.show_images;

  constructor(shadowRoot: ShadowRoot) {
    this.shadowRoot = shadowRoot;
  }

  /**
   * Updates the text of the scanlines toggle button based on the current state.
   *
   * Disables or enables the scanline style button based on the current state.
   *
   * @return {void}
   */
  public updateScanlinesToggleButton(): void {
    const scanlinesButton = this.shadowRoot?.getElementById(
      'toggle-scanlines-button',
    );

    if (scanlinesButton) {
      const scanlinesEnabled = this.gameConfig.show_scanlines;
      this.shouldDisableScanlineStyleButton = !scanlinesEnabled;

      scanlinesButton.innerHTML = scanlinesEnabled
        ? '<span class="underline">S</span>canlines ON'
        : '<span class="underline">S</span>canlines OFF';
    }
  }

  /**
   * Updates the text and disabled state of the scanline style button based on the current state.
   *
   * If the scanline style button is present, the button text is set to
   * 'Scanlines style: <current style>', and the button is disabled or enabled
   * based on the value of the shouldDisableScanlineStyleButton field.
   *
   * @return {void}
   */
  public updateScanlineStyleButton(): void {
    const scanLineStyleBtn = this.shadowRoot?.getElementById(
      'switch-scanline-style-button',
    );

    if (scanLineStyleBtn) {
      scanLineStyleBtn.innerHTML = `Scanlines s<span class="underline">t</span>yle: ${this.gameConfig.scanline_style.toUpperCase()}`;

      scanLineStyleBtn.classList.toggle(
        'disabled',
        this.shouldDisableScanlineStyleButton,
      );
    }
  }

  /**
   * Updates the text of the message alignment button based on the current state.
   *
   * If the current message alignment is 'left', the button text is set to
   * 'Message display: LEFT'. Otherwise, the button text is set to
   * 'Message display: RIGHT'.
   *
   * @return {void}
   */
  public updateMessageAlignButton(): void {
    const messageAlignBtn = this.shadowRoot?.getElementById(
      'message-display-align-button',
    ) as HTMLButtonElement;

    if (messageAlignBtn) {
      messageAlignBtn.innerHTML =
        this.gameConfig.message_display === 'left'
          ? '<span class="underline">M</span>essage display: LEFT'
          : '<span class="underline">M</span>essage display: RIGHT';
    }
  }

  /**
   * Updates the text of the display images button based on the current state.
   *
   * If {@link gameConfig.show_images} is true, the button text is set to
   * 'Show images: YES'. Otherwise, the button text is set to
   * 'Show images: NO'.
   *
   * @return {void}
   */
  public updateShowImagesButton(): void {
    const displayImage = this.shadowRoot?.getElementById(
      'show-images-button',
    ) as HTMLButtonElement;

    if (displayImage) {
      displayImage.innerHTML =
        this.gameConfig.show_images === true
          ? 'S<span class="underline">h</span>ow images: YES'
          : 'S<span class="underline">h</span>ow images: NO';
    }
  }

  /**
   * Updates the text and disabled status of the image alignment button.
   *
   * The text of the button is set to 'Image display: LEFT' if
   * {@link gameConfig.image_display} is 'left', and 'Image display: RIGHT'
   * otherwise. The button is also disabled if
   * {@link shouldDisableImageAlignButton} is true.
   *
   * @return {void}
   */
  public updateImageAlignButton(): void {
    const imageAlignBtn = this.shadowRoot?.getElementById(
      'image-align-button',
    ) as HTMLButtonElement;

    if (imageAlignBtn) {
      imageAlignBtn.innerHTML =
        this.gameConfig.image_display === 'left'
          ? '<span class="underline">I</span>mage display: LEFT'
          : '<span class="underline">I</span>mage display: RIGHT';

      imageAlignBtn.classList.toggle(
        'disabled',
        this.shouldDisableImageAlignButton,
      );
    }
  }
}
