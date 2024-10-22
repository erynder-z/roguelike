import { gameConfig } from '../../gameConfig/gameConfig';
import { saveConfig } from '../../utilities/saveConfig';

export class OptionsMenu extends HTMLElement {
  constructor() {
    super();

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
            <button id="back-button"><span class="underline">R</span>eturn to previous menu</button>
          </div>
        </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.updateScanlinesButton();
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
    this.returnToPreviousScreen = this.returnToPreviousScreen.bind(this);

    this.manageEventListener(
      'toggle-scanlines-button',
      'click',
      this.toggleScanlines,
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
 * Updates the game configuration, creates a new ingame menu element, and ensures it appears on top of the body.
 *
 * This function saves the current game configuration, creates a new ingame menu element, and inserts it as the first child of the body element to ensure it appears on top of the existing content. Finally, it removes the current options menu.
 *
 * @return {Promise<void>} A promise for when the operation is completed.
 */
  private async returnToPreviousScreen(): Promise<void> {
    await saveConfig();

    const body = document.getElementById('body-main');

    if (!body) {
      console.error('Body element not found');
      return;
    }

    const ingameMenu = document.createElement('ingame-menu');

    // Ensure the menu is the first child of the body, therefore appearing on top
    if (body.firstChild) {
      body.insertBefore(ingameMenu, body.firstChild);
    } else {
      body.appendChild(ingameMenu);
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
 * This function is called when the options menu is removed from the DOM.
 * It removes event listeners for keydown on the document and click events
 * on buttons within the shadow DOM that were added in the bindEvents function.
 *
 * @return {void}
 */
  private disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      shadowRoot
        .getElementById('toggle-scanlines-button')
        ?.removeEventListener('click', this.toggleScanlines);
      shadowRoot
        .getElementById('back-button')
        ?.removeEventListener('click', this.returnToPreviousScreen);
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }
}
