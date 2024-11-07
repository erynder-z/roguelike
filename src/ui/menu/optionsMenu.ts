import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { LayoutManager } from '../layoutManager/layoutManager';
import { OptionsMenuButtonManager } from './buttonManager/optionsMenuButtonManager';
import { ScanlinesHandler } from '../../renderer/scanlinesHandler';

export class OptionsMenu extends HTMLElement {
  private layoutManager: LayoutManager;
  private buttonManager: OptionsMenuButtonManager;
  private gameConfig = gameConfigManager.getConfig();
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.layoutManager = new LayoutManager();
    this.buttonManager = new OptionsMenuButtonManager(shadowRoot);

    this.layoutManager.setMessageDisplayLayout(this.gameConfig.message_display);
    this.layoutManager.setImageDisplayLayout(this.gameConfig.image_display);

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        .options-menu {
          font-family: 'UASQUARE';
          font-size: 2.5rem;
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          height: 100%;
          width: 100%;
          backdrop-filter: brightness(60%) blur(10px);
          color: var(--white);
          z-index: 1;
          overflow: hidden;
        }

        .options-menu h1 {
          margin-top: 12rem;
          text-align: center;
          z-index: 1;
        }

        .options-menu button {
          font-family: 'UASQUARE';
          padding: 1rem;
          font-size: 2.5rem;
          font-weight: bold;
          background: none;
          color: var(--white);
          border: none;
          transition: all 0.2s ease-in-out;
        }

        .options-menu button:hover {
          cursor: pointer;
          transform: scale(1.1);
        }

        .underline {
          text-decoration: underline;
        }

        .buttons-container {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
          gap: 0.5rem;
        }

        .options-menu button.disabled {
          color: var(--grayedOut);
          pointer-events: none;
          cursor: not-allowed;
        }

        .message-count-input-container {
          font-weight: bold;
        }

        .message-count-input {
          font-family: 'UASQUARE';
          background: none;
          border: none;
          border-bottom: 2px solid var(--white);
          color: var(--white);
          font-weight: bold;
          font-size: 2.5rem;
        }

        .message-count-input:focus {
          outline: none;
        }

        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      </style>

      <div class="options-menu">
        <h1>Options</h1>
        <div class="buttons-container">
          <button id="toggle-scanlines-button"><span class="underline">S</span>canlines</button>
          <button id="switch-scanline-style-button">Scanlines s<span class="underline">t</span>yle</button>
          <button id="message-display-align-button"><span class="underline">M</span>essage display</button>
          <button id="show-images-button">S<span class="underline">h</span>ow images</button>
          <button id="image-align-button"><span class="underline">I</span>mage alignment</button>
          <div class="message-count-input-container">
            <label for="message-count-input">M<span class="underline">e</span>ssages to Display (1-50):</label>
            <input
              type="number"
              id="message-count-input"
              class="message-count-input"
              min="1"
              max="50"
              value="${this.gameConfig.message_count}"
            />
          </div>
          <button id="back-button"><span class="underline">R</span>eturn to previous menu</button>
        </div>
      </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.buttonManager.updateScanlinesToggleButton();
    this.buttonManager.updateScanlineStyleButton();
    this.buttonManager.updateMessageAlignButton();
    this.buttonManager.updateShowImagesButton();
    this.buttonManager.updateImageAlignButton();
    this.setupMessageCountInput();
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
    this.toggleScanlines = this.toggleScanlines.bind(this);
    this.returnToIngameMenu = this.returnToIngameMenu.bind(this);

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
      'back-button',
      'click',
      this.returnToIngameMenu,
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

    this.buttonManager.updateScanlinesToggleButton();
    this.buttonManager.updateScanlineStyleButton();
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

    this.buttonManager.updateScanlineStyleButton();

    const mainContainer = document.getElementById('main-container');
    if (mainContainer)
      ScanlinesHandler.applyScanlineStyle(mainContainer, nextStyle);

    try {
      gameConfigManager.saveConfig();
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  /**
   * Toggles the message alignment between left and right.
   *
   * Updates the {@link gameConfig.message_display} property, updates the message
   * alignment button, and sets the layout of the main container based on the
   * current message alignment.
   *
   * @return {void}
   */
  private toggleMessageAlignment(): void {
    this.gameConfig.message_display =
      this.gameConfig.message_display === 'left' ? 'right' : 'left';

    this.buttonManager.updateMessageAlignButton();
    this.layoutManager.setMessageDisplayLayout(this.gameConfig.message_display);
  }

  /**
   * Toggles the show images setting on or off.
   *
   * Updates the {@link gameConfig.show_images} property, updates the show images
   * button, and sets the display of the image container based on the current
   * state. Also updates the disabled status of the image alignment button.
   *
   * @return {void}
   */
  private toggleShowImages(): void {
    this.gameConfig.show_images = !this.gameConfig.show_images;

    this.buttonManager.updateShowImagesButton();
    this.layoutManager.setImageDisplay(this.gameConfig.show_images);
    this.layoutManager.forceSmileImageDisplay();

    this.buttonManager.shouldDisableImageAlignButton =
      !this.gameConfig.show_images;
    this.buttonManager.updateImageAlignButton();
  }

  /**
   * Toggles the image alignment between left and right.
   *
   * Updates the {@link gameConfig.image_display} property, updates the image
   * alignment button, and sets the layout of the main container based on the
   * current image alignment.
   *
   * @return {void}
   */
  private toggleImageAlignment(): void {
    this.gameConfig.image_display =
      this.gameConfig.image_display === 'left' ? 'right' : 'left';

    this.buttonManager.updateImageAlignButton();
    this.layoutManager.setImageDisplayLayout(this.gameConfig.image_display);
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

    const customEvent = new CustomEvent('redraw-message-display', {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  };

  /**
   * Returns to the ingame menu, saving the current game configuration.
   *
   * This function is called when the user clicks the "return to game" button on
   * the options screen. It saves the current game configuration to a file, and
   * then removes the options menu from the DOM.
   *
   * In the disconnect callback, it fires a custom event that renders the ingame menu.
   * This approach is needed to ensure that the menu is removed from the DOM before the ingame in drawn.
   * This allows the ingame menu to be conditionally drawn and prevents the ingame menu and the options menu to be shown at the same time.
   *
   * @return {Promise<void>} A promise that resolves when the configuration is
   * saved and the screen is updated.
   */
  private async returnToIngameMenu(): Promise<void> {
    try {
      await gameConfigManager.saveConfig();
    } catch (error) {
      console.error(error);
    }
    this.remove();
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
   * Handles key presses on the options menu.
   *
   * The function listens for two keys:
   * - S: Toggles scanlines.
   * - R: Returns to the previous screen.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   * @return {void}
   */
  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
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
      case 'R':
        this.returnToIngameMenu();
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
    const event = new CustomEvent('open-ingame-menu', {
      bubbles: true,
    });
    this.dispatchEvent(event);

    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
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
        .getElementById('back-button')
        ?.removeEventListener('click', this.returnToIngameMenu);
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }
}
