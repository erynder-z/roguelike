import { ask } from '@tauri-apps/plugin-dialog';
import { exit } from '@tauri-apps/plugin-process';
import { invoke } from '@tauri-apps/api/core';

export class IngameMenu extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
        <style>
          .ingame-menu {
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
   
          .ingame-menu h1 {
            margin-top: 12rem;  
            text-align: center;
            z-index: 1;
          }
          .ingame-menu button {
            font-family: 'UASQUARE';
            padding: 1rem;
            font-size: 2.5rem;
            font-weight: bold;
            background: none;
            color: var(--white);
            border: none;
            transition: all 0.2s ease-in-out;
          }

          .ingame-menu button:hover {
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
  
        <div class="ingame-menu">
          <h1>Menu</h1>
          <div class="buttons-container">
             <button id="return-to-game-button"><span class="underline">R</span>eturn to game</button>
            <button id="show-options-button"><span class="underline">O</span>ptions</button>
            <button id="help-button"><span class="underline">H</span>elp</button>
            <button id="quit-window-button"><span class="underline">Q</span>uit</button>
          </div>
        </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.bindEvents();
  }

  /**
   * Bind events to the elements inside the options menu.
   *
   * The function binds the following events:
   * - Return to game button click event
   * - Toggle scanlines button click event
   * - Help button click event
   * - Quit button click event
   * - Keydown event on the document
   *
   * @return {void}
   */
  private bindEvents(): void {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.returnToGame = this.returnToGame.bind(this);
    this.showOptions = this.showOptions.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.quitGame = this.quitGame.bind(this);

    this.manageEventListener(
      'return-to-game-button',
      'click',
      this.returnToGame,
      true,
    );
    this.manageEventListener(
      'show-options-button',
      'click',
      this.showOptions,
      true,
    );
    this.manageEventListener('help-button', 'click', this.showHelp, true);
    this.manageEventListener(
      'quit-window-button',
      'click',
      this.quitGame,
      true,
    );

    document.addEventListener('keydown', this.handleKeyPress);
  }

  /**
   * Manage event listeners for an element.
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
   * Handles key presses on the options menu.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   * @return {void}
   */
  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case 'R':
        this.returnToGame();
        break;
      case 'O':
        this.showOptions();
        break;
      case 'H':
        this.showHelp();
        break;
      case 'Q':
        this.quitGame();
        break;
      default:
        break;
    }
  }

  /**
   * Removes the menu screen from the DOM.
   *
   * @return {void}
   */
  private returnToGame(): void {
    const event = new CustomEvent('return-to-game', { bubbles: true });
    this.dispatchEvent(event);
    this.remove();
  }

  private showOptions(): void {
    const body = document.getElementById('body-main');

    if (!body) {
      console.error('Body element not found');
      return;
    }

    const optionsMenu = document.createElement('options-menu');

    // Ensure the titleContainer is the first child of the body
    if (body.firstChild) {
      body.insertBefore(optionsMenu, body.firstChild);
    } else {
      body.appendChild(optionsMenu);
    }

    this.remove();
  }

  /**
   * Opens a new window with the game's help documentation.
   *
   * @return {void}
   */
  private showHelp(): void {
    invoke('show_help_window');
  }

  /**
   * Calls the Tauri backend to quit the game. Asks for confirmation before quitting.
   *
   * @return {Promise<void>} A promise that resolves when the game is exited.
   */
  private async quitGame(): Promise<void> {
    try {
      const confirmation = await ask('Are you sure you want to quit?', {
        title: 'Confirm Quit',
        kind: 'warning',
      });

      if (confirmation) {
        await exit();
      }
    } catch (error) {
      console.error('Failed to quit the game:', error);
    }
  }

  /**
   * Removes event listeners for keydown and click events.
   *
   * This function is called when the custom element is removed from the DOM.
   * It removes event listeners for keydown and click events that were added in the
   * connectedCallback function.
   *
   * @return {void}
   */
  private disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      shadowRoot
        .getElementById('return-to-game-button')
        ?.removeEventListener('click', this.returnToGame);
      shadowRoot
        .getElementById('show-options-button')
        ?.removeEventListener('click', this.showOptions);
      shadowRoot
        .getElementById('help-button')
        ?.removeEventListener('click', this.showHelp);
      shadowRoot
        .getElementById('quit-window-button')
        ?.removeEventListener('click', this.quitGame);
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }
}
