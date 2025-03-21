import { ask } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, readFile } from '@tauri-apps/plugin-fs';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameConfigType } from '../../types/gameConfig/gameConfigType';
import { exit } from '@tauri-apps/plugin-process';
import { invoke } from '@tauri-apps/api/core';

export class TitleMenu extends HTMLElement {
  private shouldEnableLoadGameKeyboardShortcuts: boolean = true;
  private gameConfig = gameConfigManager.getConfig();
  constructor() {
    super();
  }

  /**
   * Sets up the element's shadow root and styles it with a template.
   * This method is called when the element is inserted into the DOM.
   * It is called after the element is created and before the element is connected
   * to the DOM.
   *
   */
  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
    <style>
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 100%;
        background: var(--backgroundDefaultTransparent);
      }

      .container h1 {
        margin: 8rem 0 0 0;
        text-align: center;
        z-index: 1;
      }

      .container button {
        font-family: 'UASQUARE';
        padding: 1rem;
        font-size: 2.5rem;
        font-weight: bold;
        background: none;
        color: var(--white);
        border: none;
        transition: all 0.2s ease-in-out;
      }

      .container button:hover {
        cursor: pointer;
        transform: scale(1.1);
      }

      .underline {
        text-decoration: underline;
      }

      .buttons-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;
        height: 100%;
      }

      .bottom-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        margin-top: auto;
      }

      .seed-display {
        padding: 0 1rem;
        font-size: 1.5rem;
      }

      .seed-display span {
        font-size: 1.75rem;
      }

      .version-display {
        padding: 0 1rem;
        font-size: 1.5rem;
      }

       button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
      }
    </style>

    <div class="container">
      <h1>Meikai: Roguelike Journey to the Center of the Earth</h1>
      <div class="buttons-container">
        <button id="new-game-button">
          <span class="underline">N</span>ew game
        </button>
        <button id="load-game-button" disabled>
          <span class="underline">L</span>oad game
        </button>
        <button id="player-setup-button">
          <span class="underline">P</span>layer setup
        </button>
        <button id="change-seed-button">
          <span class="underline">C</span>hange seed
        </button>
        <button id="help-button">
          <span class="underline">H</span>elp
        </button>
        <button id="about-window-button">
          <span class="underline">A</span>bout
        </button>
        <button id="quit-window-button">
          <span class="underline">Q</span>uit
        </button>
      </div>
      <div class="bottom-container">
        <div class="version-display">version: alpha</div>
        <div id="current-seed-display" class="seed-display">current Seed</div>
      </div>
    </div>
  `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.displayCurrentSeed(this.gameConfig.seed);
    this.checkForSaveState();

    this.bindEvents();
  }

  /**
   * Binds events to the elements inside the title menu.
   *
   * The function binds the following events:
   * - New game button click event
   * - Player setup button click event
   * - Change seed button click event
   * - Help button click event
   * - About button click event
   * - Quit button click event
   * - Keydown event on the document
   * @return {void}
   */
  private bindEvents(): void {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.loadGame = this.loadGame.bind(this);
    this.playerSetup = this.playerSetup.bind(this);
    this.changeSeed = this.changeSeed.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this.quitGame = this.quitGame.bind(this);

    this.manageEventListener(
      'new-game-button',
      'click',
      this.startNewGame,
      true,
    );
    this.manageEventListener('load-game-button', 'click', this.loadGame, true);
    this.manageEventListener(
      'player-setup-button',
      'click',
      this.playerSetup,
      true,
    );
    this.manageEventListener(
      'change-seed-button',
      'click',
      this.changeSeed,
      true,
    );
    this.manageEventListener('help-button', 'click', this.showHelp, true);
    this.manageEventListener(
      'about-window-button',
      'click',
      this.showAbout,
      true,
    );
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
   * Handles key presses.
   *
   * Listens for the keys N (new game), C (change seed), and Q (quit).
   * @param {KeyboardEvent} event - The keyboard event.
   * @return {void}
   */
  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case 'N':
        this.startNewGame();
        break;
      case 'L':
        if (this.shouldEnableLoadGameKeyboardShortcuts) this.loadGame();
        break;
      case 'P':
        this.playerSetup();
        break;
      case 'C':
        this.changeSeed();
        break;
      case 'H':
        this.showHelp();
        break;
      case 'A':
        this.showAbout();
        break;
      case 'Q':
        this.quitGame();
        break;
      default:
        break;
    }
  }

  /**
   * Displays the current seed in the title menu.
   *
   * @param {GameConfigType['seed']} seed - The current seed.
   * @return {void}
   */
  private displayCurrentSeed(seed: GameConfigType['seed']): void {
    const seedDisplay = this.shadowRoot?.getElementById(
      'current-seed-display',
    ) as HTMLDivElement;
    if (seedDisplay) seedDisplay.innerHTML = `Current seed: ${seed}`;
  }

  /**
   * Checks for the existence of a saved game state file.
   *
   * This function attempts to read the 'savestate.bin' file from the application's
   * data directory. If the file is found and contains data, it enables the load game button.
   * Logs an error message to the console if there is an issue accessing the file.
   *
   * @return {Promise<void>} A promise that resolves when the check is completed.
   */

  private async checkForSaveState(): Promise<void> {
    try {
      const binaryData = await readFile('savestate.bin', {
        baseDir: BaseDirectory.AppData,
      });
      if (binaryData) {
        this.enableLoadGameButton();
        this.enableLoadGameKeyboardShortcut();
      }
    } catch (error) {
      console.error('Error checking for saved game:', error);
    }
  }

  /**
   * Enables the load game button.
   *
   * This function removes the 'disabled' attribute from the load game button,
   * allowing the user to load a saved game. It is typically called after
   * confirming the presence of a saved game state.
   */

  private enableLoadGameButton(): void {
    const loadGameButton = this.shadowRoot?.getElementById('load-game-button');
    if (loadGameButton) loadGameButton.removeAttribute('disabled');
  }

  /**
   * Enables the load game keyboard shortcut.
   *
   * Sets the flag to allow keyboard shortcuts for loading a game. This function
   * is typically called after confirming the presence of a saved game state.
   */

  private enableLoadGameKeyboardShortcut(): void {
    this.shouldEnableLoadGameKeyboardShortcuts = true;
  }

  /**
   * Dispatches a 'start-new-game' event.
   *
   * This event can be listened for by other components to start a new game.
   *
   * @return {void}
   */
  public startNewGame(): void {
    this.dispatchEvent(
      new CustomEvent('start-new-game', { bubbles: true, composed: true }),
    );
  }

  /**
   * Dispatches a 'load-game' event.
   *
   * This event can be listened to by other components to load a saved game.
   *
   * @return {void}
   */
  public loadGame(): void {
    this.dispatchEvent(
      new CustomEvent('load-game', { bubbles: true, composed: true }),
    );
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

  /**
   * Shows the player setup screen.
   *
   * This function will query the first 'title-screen' element in the document
   * and replace its content with a 'player-setup' element. This element will
   * allow the user to modify their player's name and appearance.
   *
   * @return {void}
   */
  public playerSetup(): void {
    const titleScreenContent = document
      .querySelector('title-screen')
      ?.shadowRoot?.getElementById('title-screen-content');

    if (titleScreenContent) {
      titleScreenContent.innerHTML = '';
      titleScreenContent.appendChild(document.createElement('player-setup'));
    }
  }

  /**
   * Opens a new window with the game's help documentation.
   * @return {void}
   */
  private showHelp(): void {
    invoke('create_hidden_help_window');
  }

  private showAbout() {
    alert('About');
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

      if (confirmation) await exit();
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
   * @return {void}
   */
  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      shadowRoot
        .getElementById('new-game-button')
        ?.removeEventListener('click', this.startNewGame);
      shadowRoot
        .getElementById('change-seed-button')
        ?.removeEventListener('click', this.changeSeed);
      shadowRoot
        .getElementById('help-button')
        ?.removeEventListener('click', this.showHelp);
      shadowRoot
        .getElementById('about-window-button')
        ?.removeEventListener('click', this.showAbout);
      shadowRoot
        .getElementById('quit-window-button')
        ?.removeEventListener('click', this.quitGame);
    }
  }
}
