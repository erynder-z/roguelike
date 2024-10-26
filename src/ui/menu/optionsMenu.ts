import { gameConfig } from '../../gameConfig/gameConfig';
import { saveConfig } from '../../utilities/saveConfig';
import { LayoutManager } from '../layoutManager/layoutManager';

export class OptionsMenu extends HTMLElement {
  private layoutManager: LayoutManager;
  constructor() {
    super();

    this.layoutManager = new LayoutManager();

    this.layoutManager.setMessageDisplayLayout(gameConfig.message_display);
    this.layoutManager.setImageDisplayLayout(gameConfig.image_display);

    const shadowRoot = this.attachShadow({ mode: 'open' });

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
        </style>
  
        <div class="options-menu">
          <h1>Options</h1>
          <div class="buttons-container">
             
            <button id="toggle-scanlines-button"><span class="underline">S</span>canlines</button>
            <button id="message-display-align-button"><span class="underline">M</span>essage display</button>
            <button id="image-align-button"><span class="underline">I</span>mage alignment</button>
            <button id="back-button"><span class="underline">R</span>eturn to previous menu</button>
          </div>
        </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.updateScanlinesButton();
    this.updateMessageAlignButton();
    this.updateImageAlignButton();
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
      'message-display-align-button',
      'click',
      this.toggleMessageAlignment.bind(this),
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
   * Updates the text of the scanlines button based on the current state.
   *
   * If the main container has the class 'scanlines', the button text is
   * set to 'Scanlines ON'. Otherwise, the button text is set to
   * 'Scanlines OFF'.
   *
   * @return {void}
   */
  private updateScanlinesButton(): void {
    const mainContainer = document.getElementById('main-container');
    const scanLineBtn = this.shadowRoot?.getElementById(
      'toggle-scanlines-button',
    );

    if (mainContainer && scanLineBtn) {
      const hasScanLinesClass = mainContainer.classList.contains('scanlines');
      scanLineBtn.innerHTML = hasScanLinesClass
        ? '<span class="underline">S</span>canlines ON'
        : '<span class="underline">S</span>canlines OFF';
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
  private updateMessageAlignButton(): void {
    const messageAlignBtn = this.shadowRoot?.getElementById(
      'message-display-align-button',
    );

    if (messageAlignBtn) {
      messageAlignBtn.innerHTML =
        gameConfig.message_display === 'left'
          ? '<span class="underline">M</span>essage display: LEFT'
          : '<span class="underline">M</span>essage display: RIGHT';
    }
  }

  /**
   * Updates the text of the image alignment button based on the current state.
   *
   * If the current image alignment is 'left', the button text is set to
   * 'Image display: LEFT'. Otherwise, the button text is set to
   * 'Image display: RIGHT'.
   *
   * @return {void}
   */
  private updateImageAlignButton(): void {
    const imageAlignBtn = this.shadowRoot?.getElementById('image-align-button');

    if (imageAlignBtn) {
      imageAlignBtn.innerHTML =
        gameConfig.image_display === 'left'
          ? '<span class="underline">I</span>mage display: LEFT'
          : '<span class="underline">I</span>mage display: RIGHT';
    }
  }

  /**
   * Toggles the scanlines setting on or off.
   *
   * Updates the {@link gameConfig.scanlines} property, and toggles the
   * 'scanlines' class on the main container element. The button text is also
   * updated based on the current state.
   *
   * @return {void}
   */
  private toggleScanlines(): void {
    gameConfig.scanlines = !gameConfig.scanlines;

    const mainContainer = document.getElementById('main-container');
    const scanLineBtn = this.shadowRoot?.getElementById(
      'toggle-scanlines-button',
    );

    if (mainContainer) {
      mainContainer.classList.toggle('scanlines');
      const hasScanLinesClass = mainContainer.classList.contains('scanlines');

      if (scanLineBtn) {
        scanLineBtn.innerHTML = hasScanLinesClass
          ? '<span class="underline">S</span>canlines ON'
          : '<span class="underline">S</span>canlines OFF';
      }
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
    gameConfig.message_display =
      gameConfig.message_display === 'left' ? 'right' : 'left';

    this.updateMessageAlignButton();
    this.layoutManager.setMessageDisplayLayout(gameConfig.message_display);
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
    gameConfig.image_display =
      gameConfig.image_display === 'left' ? 'right' : 'left';

    this.updateImageAlignButton();
    this.layoutManager.setImageDisplayLayout(gameConfig.image_display);
  }

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
      await saveConfig();
    } catch (error) {
      console.error(error);
    }
    this.remove();
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
      case 'M':
        this.toggleMessageAlignment();
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
  private disconnectedCallback(): void {
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
        .getElementById('message-display-align-button')
        ?.removeEventListener('click', this.toggleMessageAlignment);
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
