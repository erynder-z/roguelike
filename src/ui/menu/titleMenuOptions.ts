import controls from '../../controls/control_schemes.json';
import { ControlSchemeManager } from '../../controls/controlSchemeManager';
import { ControlSchemeName } from '../../types/controls/controlSchemeType';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameConfigType } from '../../types/gameConfig/gameConfigType';
import { LayoutManager } from '../layoutManager/layoutManager';
import { OptionsMenuButtonManager } from './buttonManager/optionsMenuButtonManager';
import { ScanlinesHandler } from '../../renderer/scanlinesHandler';
import { KeypressScrollHandler } from '../../utilities/KeypressScrollHandler';

export class TitleMenuOptions extends HTMLElement {
  private layoutManager: LayoutManager;
  private buttonManager: OptionsMenuButtonManager;
  private gameConfig = gameConfigManager.getConfig();
  public controlSchemeManager: ControlSchemeManager;
  private currentScheme = this.gameConfig.control_scheme;
  private availableControlSchemes = Object.keys(
    controls,
  ) as ControlSchemeName[];
  public activeControlScheme: Record<string, string[]>;
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.layoutManager = new LayoutManager();
    this.buttonManager = new OptionsMenuButtonManager(shadowRoot);
    this.controlSchemeManager = new ControlSchemeManager(this.currentScheme);
    this.activeControlScheme = this.controlSchemeManager.getActiveScheme();
  }

  /**
   * Sets up the element's shadow root and styles it with a template.
   * This method is called when the element is inserted into the DOM.
   * It is called after the element is created and before the element is connected
   * to the DOM.
   *
   */
  connectedCallback(): void {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        ::-webkit-scrollbar {
          width: 0.25rem;
        }

        ::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-foreground);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-track {
          background-color: var(--scrollbar-background);
        }

        .options-menu {
          font-family: 'UASQUARE';
          font-size: 2rem;
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          background: var(--backgroundDefaultTransparent);
          color: var(--white);
          z-index: 1;
          overflow-x: auto;
        }

        .options-menu button {
          font-family: 'UASQUARE';
          padding: 1rem;
          font-size: 2rem;
          font-weight: bold;
          background: none;
          color: var(--white);
          border: none;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }

        .options-menu button:hover {
          transform: rotate(4deg);
        }

        .underline {
          text-decoration: underline;
        }

        .info-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          gap: 0.5rem;
        }

        .info-span {
          font-size: 2.5rem;
          width: 45%;
        }

        .info-span::after {
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background-color: var(--white);
        }

        .info-container div {
          width: max-content;
          margin: 0 auto;
        }

        .info-text {
          text-align: center;
          font-weight: bold;
          color: var(--grayedOut);
          cursor: not-allowed;
        }

        .explanation {
          font-size: 1rem;
        }

        .options-menu button.disabled {
          color: var(--grayedOut);
          pointer-events: none;
          cursor: not-allowed;
        }

        .message-count-input {
          font-family: 'UASQUARE';
          background: none;
          border: none;
          border-bottom: 2px solid var(--white);
          color: var(--white);
          font-weight: bold;
          font-size: 2rem;
        }

        .message-count-input:focus {
          outline: none;
        }

        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .title {
          position: fixed;
          bottom: 0;
          left: 0;
          margin: 0 1rem;
          z-index: 1;
          font-size: 5rem;
        }

        .options-menu .back-button {
          position: fixed;
          bottom: 0;
          right: 0;
          margin: 0 1rem;
          z-index: 1;
          font-size: 2.5rem;
        }
      </style>

      <div class="options-menu">
        <span class="info-span">Core</span>
        <div class="info-container">
          <button id="current-seed-button" class="current-seed-display">
            Current see<span class="underline">d</span>: ${this.gameConfig.seed}
          </button>
          <button id="current-font-button" class="current-font-display">
            Current font: ${this.gameConfig.terminal.font}
          </button>
          <div class="info-text">
            Current terminal dimensions: ${this.gameConfig.terminal.dimensions.width} x ${this.gameConfig.terminal.dimensions.height} *
          </div>
          <div class="explanation">
            * Changing these will alter any saved games!
          </div>
        </div>
        <span class="info-span">Controls</span>
        <div class="info-container">
          <button id="switch-controls-button">
            <span class="underline">C</span>ontrol scheme
          </button>
        </div>
        <span class="info-span">Graphics</span>
        <div class="info-container">
          <button id="toggle-scanlines-button">
            <span class="underline">S</span>canlines
          </button>
          <button id="switch-scanline-style-button">
            Scanlines s<span class="underline">t</span>yle
          </button>
        </div>
        <span class="info-span">UI</span>
        <div class="info-container">
          <button id="message-display-align-button">
            <span class="underline">M</span>essage display
          </button>
          <button id="show-images-button">
            S<span class="underline">h</span>ow images
          </button>
          <button id="image-align-button">
            <span class="underline">I</span>mage alignment
          </button>
          <button id="message-count-input-button">
            <label for="message-count-input">
              M<span class="underline">e</span>ssages to Display (1-50):
            </label>
            <input
              type="number"
              id="message-count-input"
              class="message-count-input"
              min="1"
              max="50"
              value="${this.gameConfig.message_count}"
            />
          </button>
        </div>
        <span class="info-span">Misc</span>
        <div class="info-container">
          <button id="blood-intensity-button">
            <span class="underline">B</span>lood intensity
          </button>
        </div>
        <div class="title">Options</div>
        <button id="back-button" class="back-button">
          <span class="underline">R</span>eturn to previous menu
        </button>
      </div>
    `;

    this.shadowRoot?.appendChild(templateElement.content.cloneNode(true));

    this.buttonManager.updateControlSchemeButton(this.currentScheme);
    this.buttonManager.updateScanlinesToggleButton(
      this.gameConfig.show_scanlines,
    );
    this.buttonManager.updateScanlineStyleButton(
      this.gameConfig.scanline_style,
    );
    this.buttonManager.updateMessageAlignButton(
      this.gameConfig.message_display,
    );
    this.buttonManager.updateShowImagesButton(this.gameConfig.show_images);
    this.buttonManager.updateImageAlignButton(this.gameConfig.image_display);
    this.setupMessageCountInput();
    this.buttonManager.updateBloodIntensityButton(
      this.gameConfig.blood_intensity,
    );
    this.bindEvents();
  }

  /**
   * Binds events to the elements inside the options menu.
   *
   * The function binds the following events:
   * - Toggle scanlines button click event
   * - Back button click event
   * - Keydown event on the document
   *
   * @return {void}
   */
  private bindEvents(): void {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.changeSeed = this.changeSeed.bind(this);
    this.toggleControlScheme = this.toggleControlScheme.bind(this);
    this.toggleScanlines = this.toggleScanlines.bind(this);
    this.returnToPreviousScreen = this.returnToPreviousScreen.bind(this);

    this.manageEventListener(
      'current-seed-button',
      'click',
      this.changeSeed,
      true,
    );
    this.manageEventListener(
      'current-font-button',
      'click',
      this.changeFont,
      true,
    );
    this.manageEventListener(
      'switch-controls-button',
      'click',
      this.toggleControlScheme,
      true,
    );
    this.manageEventListener(
      'toggle-scanlines-button',
      'click',
      this.toggleScanlines,
      true,
    );
    this.manageEventListener(
      'switch-scanline-style-button',
      'click',
      this.switchScanlineStyle.bind(this),
      true,
    );
    this.manageEventListener(
      'message-display-align-button',
      'click',
      this.toggleMessageAlignment.bind(this),
      true,
    );
    this.manageEventListener(
      'show-images-button',
      'click',
      this.toggleShowImages.bind(this),
      true,
    );
    this.manageEventListener(
      'image-align-button',
      'click',
      this.toggleImageAlignment.bind(this),
      true,
    );
    this.manageEventListener(
      'message-count-input-button',
      'click',
      this.focusAndSelectMessageCountInput.bind(this),
      true,
    );
    this.manageEventListener(
      'blood-intensity-button',
      'click',
      this.toggleBloodIntensity.bind(this),
      true,
    );
    this.manageEventListener(
      'back-button',
      'click',
      this.returnToPreviousScreen,
      true,
    );

    document.addEventListener('keydown', this.handleKeyPress);
  }

  /**
   * Manages event listeners for an element.
   *
   * If the add parameter is true, the callback is added to the element's event
   * listeners. If the add parameter is false, the callback is removed from the
   * element's event listeners.
   *
   * @param {string} elementId - The ID of the element on which to add or remove
   * the event listener.
   * @param {string} eventType - The type of event to listen for.
   * @param {EventListener} callback - The callback function to be called when the
   * event is fired.
   * @param {boolean} add - Whether to add or remove the event listener.
   * @return {void}
   */
  private manageEventListener(
    elementId: string,
    eventType: string,
    callback: EventListener,
    add: boolean,
  ): void {
    const element = this.shadowRoot?.getElementById(elementId);
    if (add) {
      element?.addEventListener(eventType, callback);
    } else {
      element?.removeEventListener(eventType, callback);
    }
  }

  /**
   * Displays the current seed in the title menu.
   *
   * @param {GameConfigType['seed']} seed - The current seed.
   * @return {void}
   */
  private displayCurrentSeed(seed: GameConfigType['seed']): void {
    const seedButton = this.shadowRoot?.getElementById(
      'current-seed-button',
    ) as HTMLDivElement;
    if (seedButton) seedButton.innerHTML = `Current seed: ${seed}`;
  }

  /**
   * Changes the current seed to a random value.
   *
   * This function will also update the displayed seed in the title menu.
   *
   * @return {void}
   */
  public async changeSeed(): Promise<void> {
    this.gameConfig.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.displayCurrentSeed(this.gameConfig.seed);

    try {
      await gameConfigManager.saveConfig();
    } catch (error) {
      console.error(error);
    }
  }

  private displayCurrentFont(): void {
    const fontButton = this.shadowRoot?.getElementById(
      'current-font-button',
    ) as HTMLDivElement;
    if (fontButton)
      fontButton.innerHTML = `Current font: ${this.gameConfig.terminal.font}`;
  }

  public async changeFont(): Promise<void> {
    try {
      await gameConfigManager.saveConfig();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Toggles the control scheme setting on or off.
   *
   * Updates the {@link gameConfig.control_scheme} property, and toggles the
   * displayed text of the control scheme button.
   *
   * @return {void}
   */
  private toggleControlScheme(): void {
    const currentSchemeIndex = this.availableControlSchemes.indexOf(
      this.gameConfig.control_scheme,
    );
    const nextSchemeIndex =
      (currentSchemeIndex + 1) % this.availableControlSchemes.length;
    const nextScheme = this.availableControlSchemes[nextSchemeIndex];

    this.gameConfig.control_scheme = nextScheme;
    this.currentScheme = nextScheme;

    this.buttonManager.updateControlSchemeButton(this.currentScheme);
  }

  /**
   * Toggles the scanlines setting on or off.
   *
   * Updates the {@link gameConfig.show_scanlines} property, and toggles the
   * 'scanlines' class on the main container element. The button text is also
   * updated based on the current state.
   *
   * @return {void}
   */
  private toggleScanlines(): void {
    this.gameConfig.show_scanlines = !this.gameConfig.show_scanlines;

    const mainContainer = document.getElementById('main-container');

    if (mainContainer) ScanlinesHandler.handleScanlines(mainContainer);

    this.buttonManager.updateScanlinesToggleButton(
      this.gameConfig.show_scanlines,
    );
    this.buttonManager.updateScanlineStyleButton(
      this.gameConfig.scanline_style,
    );
  }

  /**
   * Switches the scanline style to the next available style.
   *
   * Updates the {@link gameConfig.scanline_style} property, and updates the
   * button text with the new style.
   *
   * Applies the new style to the main container element.
   *
   * Tries to save the updated config to local storage.
   *
   * @return {void}
   */
  private switchScanlineStyle(): void {
    const availableStyles = ScanlinesHandler.SCANLINES_STYLES;
    const currentStyleIndex = availableStyles.indexOf(
      this.gameConfig.scanline_style,
    );

    const nextStyleIndex = (currentStyleIndex + 1) % availableStyles.length;
    const nextStyle = availableStyles[nextStyleIndex];

    this.gameConfig.scanline_style = nextStyle;

    this.buttonManager.updateScanlineStyleButton(
      this.gameConfig.scanline_style,
    );
  }

  /**
   * Toggles the message alignment between left and right.
   *
   * Updates the {@link gameConfig.message_display} property, updates the
   * message alignment button, and sets the layout of the main container based on
   * the current message alignment.
   *
   * @return {void}
   */
  private toggleMessageAlignment(): void {
    this.gameConfig.message_display =
      this.gameConfig.message_display === 'left' ? 'right' : 'left';

    this.buttonManager.updateMessageAlignButton(
      this.gameConfig.message_display,
    );
    this.layoutManager.setMessageDisplayLayout(this.gameConfig.message_display);
  }

  /**
   * Toggles the visibility of images in the game.
   *
   * Flips the {@link gameConfig.show_images} property between true and false,
   * updates the show images button accordingly, and adjusts the disabled status
   * of the image alignment button based on the new state. Ensures that the UI
   * reflects the current setting for image display.
   *
   * @return {void}
   */

  private toggleShowImages(): void {
    this.gameConfig.show_images = !this.gameConfig.show_images;

    this.layoutManager.setImageDisplay(this.gameConfig.show_images);
    this.buttonManager.updateShowImagesButton(this.gameConfig.show_images);
    this.buttonManager.shouldDisableImageAlignButton =
      !this.gameConfig.show_images;
    this.buttonManager.updateImageAlignButton(this.gameConfig.image_display);
  }

  /**
   * Toggles the image alignment between left and right.
   *
   * Updates the {@link gameConfig.image_display} property and refreshes the
   * text and state of the image alignment button to reflect the current
   * alignment setting.
   *
   * @return {void}
   */

  private toggleImageAlignment(): void {
    this.gameConfig.image_display =
      this.gameConfig.image_display === 'left' ? 'right' : 'left';

    this.layoutManager.setImageDisplayLayout(this.gameConfig.image_display);
    this.buttonManager.updateImageAlignButton(this.gameConfig.image_display);
  }

  /**
   * Sets up the event listener for the message count input element.
   *
   * Attaches an 'input' event listener to the message count input element
   * within the shadow DOM. The listener triggers the handleMessageCountChange
   * method whenever the input value changes.
   *
   * @return {void}
   */
  private setupMessageCountInput(): void {
    const messageCountInput = this.shadowRoot?.getElementById(
      'message-count-input',
    ) as HTMLInputElement;

    if (messageCountInput) {
      messageCountInput.addEventListener(
        'input',
        this.handleMessageCountChange,
      );
    }
  }

  /**
   * Handles the input event on the message count input element.
   *
   * @param {Event} event The input event from the message count input element.
   * @return {void}
   */
  private handleMessageCountChange = (event: Event): void => {
    const input = event.target as HTMLInputElement;
    const newCount = parseInt(input.value, 10);

    if (!isNaN(newCount) && newCount >= 1 && newCount <= 50) {
      this.gameConfig.message_count = newCount;
    } else {
      input.value = this.gameConfig.message_count.toString();
    }
  };

  /**
   * Cycles through the blood intensity options (0 = no blood, 1 = light blood, 2 = medium blood, 3 = heavy blood).
   *
   * Updates the {@link gameConfig.blood_intensity} property, updates the blood intensity button,
   * and sets the blood intensity of the game.
   *
   * @return {void}
   */
  private toggleBloodIntensity(): void {
    this.gameConfig.blood_intensity = (this.gameConfig.blood_intensity + 1) % 4;
    this.buttonManager.updateBloodIntensityButton(
      this.gameConfig.blood_intensity,
    );
  }

  /**
   * Saves the current build parameters to a file and returns to the previous screen.
   *
   * This function is called when the user clicks the "start game" button on the player setup
   * screen. It saves the current build parameters to a file and then returns to the previous
   * screen by replacing the content of the title screen with the title menu element.
   * @return {Promise<void>} A promise for when the file is saved and the screen is updated.
   */
  private async returnToPreviousScreen(): Promise<void> {
    try {
      await gameConfigManager.saveConfig();
    } catch (error) {
      console.error(error);
    }

    const titleScreenContent = document
      .querySelector('title-screen')
      ?.shadowRoot?.getElementById('title-screen-content');

    if (titleScreenContent) {
      titleScreenContent.innerHTML = '';
      titleScreenContent.appendChild(document.createElement('title-menu'));
    }
  }

  /**
   * Sets focus to the message count input element and selects its content.
   *
   * This function is called when the user presses the "e" key on the options menu.
   * It finds the input element in the shadow DOM and sets focus to it. To select
   * the content of the input element, it uses setTimeout to delay the selection
   * by 10 milliseconds, so that the focus event is processed before the selection
   * is triggered.
   *
   * @return {void}
   */
  private focusAndSelectMessageCountInput(): void {
    const messageCountInput = this.shadowRoot?.getElementById(
      'message-count-input',
    ) as HTMLInputElement;
    if (messageCountInput) {
      messageCountInput.focus();
      setTimeout(() => {
        messageCountInput.select();
      }, 10);
    }
  }

  /**
   * Checks if the Alt or Meta key is pressed.
   */
  private isAltKeyPressed(event: KeyboardEvent): boolean {
    return event.altKey || event.metaKey;
  }

  /**
   * Handles key presses on the options menu.
   *
   * Listens for the following keys and calls the corresponding method to update the game config:
   * - d: changeSeed
   * - C: toggleControlScheme
   * - S: toggleScanlines
   * - t: switchScanlineStyle
   * - M: toggleMessageAlignment
   * - e: focusAndSelectMessageCountInput
   * - h: toggleShowImages
   * - I: toggleImageAlignment
   * - B: toggleBloodIntensity
   * - R or this.activeControlScheme.menu.toString(): returnToPreviousScreen
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @return {void}
   */
  private handleKeyPress(event: KeyboardEvent): void {
    // scroll via keypress when alt or meta key is pressed
    if (this.isAltKeyPressed(event)) {
      const titleScreen = document.querySelector('title-screen') as HTMLElement;
      const menuOptions = titleScreen?.shadowRoot?.querySelector(
        'title-menu-options',
      ) as HTMLElement;
      const targetElement = menuOptions?.shadowRoot?.querySelector(
        '.options-menu',
      ) as HTMLElement;

      new KeypressScrollHandler(targetElement).handleVirtualScroll(event);
    }

    switch (event.key) {
      case 'd':
        this.changeSeed();
        break;
      case 'C':
        this.toggleControlScheme();
        break;
      case 'S':
        this.toggleScanlines();
        break;
      case 't':
        this.switchScanlineStyle();
        break;
      case 'M':
        this.toggleMessageAlignment();
        break;
      case 'e':
        this.focusAndSelectMessageCountInput();
        break;
      case 'h':
        this.toggleShowImages();
        break;
      case 'I':
        this.toggleImageAlignment();
        break;
      case 'B':
        this.toggleBloodIntensity();
        break;
      case this.activeControlScheme.menu.toString():
      case 'R':
        this.returnToPreviousScreen();
        break;
      default:
        break;
    }
  }

  /**
   * Removes event listeners for keydown and click events.
   *
   * This function is called when the custom element is removed from the DOM.
   * It removes event listeners for keydown and click events that were added in the
   * connectedCallback function, and dispatches a custom event to open the ingame menu.
   *
   * @return {void}
   */
  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      shadowRoot
        .getElementById('switch-controls-button')
        ?.removeEventListener('click', this.toggleControlScheme);
      shadowRoot
        .getElementById('toggle-scanlines-button')
        ?.removeEventListener('click', this.toggleScanlines);
      shadowRoot
        .getElementById('switch-scanline-style-button')
        ?.removeEventListener('click', this.switchScanlineStyle);
      shadowRoot
        .getElementById('message-display-align-button')
        ?.removeEventListener('click', this.toggleMessageAlignment);
      shadowRoot
        .getElementById('show-images-button')
        ?.removeEventListener('click', this.toggleShowImages);
      shadowRoot
        .getElementById('image-align-button')
        ?.removeEventListener('click', this.toggleImageAlignment);
      shadowRoot
        .getElementById('blood-intensity-button')
        ?.removeEventListener('click', this.toggleBloodIntensity);
      shadowRoot
        .getElementById('back-button')
        ?.removeEventListener('click', this.returnToPreviousScreen);
    }
  }
}
