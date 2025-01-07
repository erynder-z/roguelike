import { ask } from '@tauri-apps/plugin-dialog';
import { BaseDirectory, writeTextFile, open } from '@tauri-apps/plugin-fs';
import { ControlSchemeManager } from '../../controls/controlSchemeManager';
import { exit } from '@tauri-apps/plugin-process';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameState } from '../../types/gameBuilder/gameState';
import { invoke } from '@tauri-apps/api/core';
import { PopupHandler } from '../../utilities/popupHandler';
import { SaveStateHandler } from '../../utilities/saveStateHandler';

export class IngameMenu extends HTMLElement {
  private _game: GameState | null = null;
  private _isRendered = false;

  private gameConfig = gameConfigManager.getConfig();
  private currentScheme = this.gameConfig.control_scheme || 'default';
  public controlSchemeManager: ControlSchemeManager;
  public activeControlScheme: Record<string, string[]>;

  set currentGame(value: GameState | null) {
    this._game = value;
  }

  get currentGame(): GameState | null {
    return this._game;
  }

  set isRendered(value: boolean) {
    this._isRendered = value;
  }

  get isRendered(): boolean {
    return this._isRendered;
  }

  constructor() {
    super();

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
          position: absolute;
          bottom: 0;
          left: 0;
          margin: 0 1rem;
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
          <button id="return-to-game-button">
            <span class="underline">R</span>eturn to game
          </button>
          <button id="show-options-button">
            <span class="underline">O</span>ptions
          </button>
          <button id="help-button">
            <span class="underline">H</span>elp
          </button>
          <button id="save-game-button">
            <span class="underline">S</span>ave game
          </button>
          <button id="return-to-title-button">
            Return to <span class="underline">t</span>itle
          </button>
          <button id="quit-app-button">
            <span class="underline">Q</span>uit game and exit
          </button>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.bindEvents();

    // use animation frame to ensure isRendered is set to true only after the element is fully rendered
    requestAnimationFrame(() => {
      this.isRendered = true;
    });
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
    this.saveGame = this.saveGame.bind(this);
    this.returnToTitle = this.returnToTitle.bind(this);
    this.quitApp = this.quitApp.bind(this);

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
    this.manageEventListener('save-game-button', 'click', this.saveGame, true);
    this.manageEventListener(
      'return-to-title-button',
      'click',
      this.returnToTitle,
      true,
    );
    this.manageEventListener('quit-app-button', 'click', this.quitApp, true);

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
    // Prevent keyboard events before the element is fully rendered. In particular, this prevents the initial {menu} keypress to close the menu the moment it's being rendered.
    if (!this.isRendered) return;

    switch (event.key) {
      case this.activeControlScheme.menu.toString():
      case 'R':
        this.returnToGame();
        break;
      case 'O':
        this.showOptions();
        break;
      case 'H':
        this.showHelp();
        break;
      case 'S':
        this.saveGame();
        break;
      case 't':
        this.returnToTitle();
        break;
      case 'Q':
        this.quitApp();
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
    const event = new CustomEvent('open-options-menu', { bubbles: true });
    this.dispatchEvent(event);
    this.remove();
  }

  /**
   * Opens a new window with the game's help documentation.
   *
   * @return {void}
   */
  private showHelp(): void {
    // Help window will start hidden and will be shown when the help-window DOM content is rendered.
    invoke('create_hidden_help_window');
  }

  /**
   * Saves the current game state to a file in the application's data directory.
   *
   * This function is called when the user clicks the "save" button on the ingame menu.
   * It serializes the game state to a JSON object and then saves it to a file named
   * "savestate.json" in the application's data directory.
   *
   * @return {Promise<void>} A promise that resolves when the game is saved.
   */
  private async saveGame(): Promise<void> {
    if (!this._game) return;

    try {
      const saveStateHandler = new SaveStateHandler();
      const gameState = this._game;
      const preparedGameState = saveStateHandler.prepareForSave(gameState);
      const contents = JSON.stringify(preparedGameState, null, 2);

      const file = await open('savestate.json', {
        write: true,
        create: true,
        baseDir: BaseDirectory.AppData,
      });

      await writeTextFile('savestate.json', contents, {
        baseDir: BaseDirectory.AppData,
      });

      await file.close();

      PopupHandler.showGoodPopup('Game saved successfully.');
      console.log('Game saved successfully.');
    } catch (error) {
      PopupHandler.showBadPopup('Error saving game.');
      console.error('Error saving game:', error);
    }
  }

  /**
   * Returns to the title screen. Asks for confirmation before quitting.
   *
   * If the user confirms, the page is reloaded, which causes the game to restart.
   *
   * @return {Promise<void>} A promise that resolves when the screen is updated.
   */
  private async returnToTitle(): Promise<void> {
    try {
      const confirmation = await ask(
        'Game progress will be lost. Are you sure?',
        { title: 'Confirm Quit', kind: 'warning' },
      );

      if (confirmation) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to return to title:', error);
    }
  }

  /**
   * Calls the Tauri backend to quit the game. Asks for confirmation before quitting.
   *
   * @return {Promise<void>} A promise that resolves when the game is exited.
   */
  private async quitApp(): Promise<void> {
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
  disconnectedCallback(): void {
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
        .getElementById('return-title-button')
        ?.removeEventListener('click', this.returnToTitle);
      shadowRoot
        .getElementById('quit-app-button')
        ?.removeEventListener('click', this.quitApp);
    }
  }
}
