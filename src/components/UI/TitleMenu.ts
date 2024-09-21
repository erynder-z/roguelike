import { dialog } from '@tauri-apps/api';
import { exit } from '@tauri-apps/api/process';
import { WebviewWindow } from '@tauri-apps/api/window';
import { initParams } from '../../initParams/InitParams';

export class TitleMenu extends HTMLElement {
  constructor() {
    super();

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
          height: 100%;
          gap: 0.5rem;
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
      </style>

      <div class="container">
        <h1>Meikai: Roguelike Journey to the Center of the Earth</h1>
        <div class="buttons-container">
          <button id="new-game-button">
            <span class="underline">N</span>ew Game
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

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.playerSetup = this.playerSetup.bind(this);
    this.changeSeed = this.changeSeed.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this.quitGame = this.quitGame.bind(this);

    shadowRoot
      .getElementById('new-game-button')
      ?.addEventListener('click', this.startNewGame);
    shadowRoot
      .getElementById('player-setup-button')
      ?.addEventListener('click', this.playerSetup);
    shadowRoot
      .getElementById('change-seed-button')
      ?.addEventListener('click', this.changeSeed);
    shadowRoot
      .getElementById('help-button')
      ?.addEventListener('click', this.showHelp);
    shadowRoot
      .getElementById('about-window-button')
      ?.addEventListener('click', this.showAbout);
    shadowRoot
      .getElementById('quit-window-button')
      ?.addEventListener('click', this.quitGame);
    document.addEventListener('keydown', this.handleKeyPress);

    this.addEventListeners();
  }

  /**
   * Adds event listeners to the title menu buttons.
   *
   * This function adds event listeners to the 'new game' and 'change seed'
   * buttons. The 'new game' button will dispatch a 'start-new-game' event
   * when clicked. The 'change seed' button will dispatch a 'change-seed'
   * event when clicked.
   *
   * @return {void} This function does not return anything.
   */
  private addEventListeners(): void {
    this.displayCurrentSeed(initParams.seed);

    this.shadowRoot
      ?.getElementById('new-game-button')
      ?.addEventListener('click', this.startNewGame);
    this.shadowRoot
      ?.getElementById('change-seed-button')
      ?.addEventListener('click', this.changeSeed);
  }

  /**
   * Handles key presses.
   *
   * Listens for the keys N (new game), C (change seed), and Q (quit).
   * @param {KeyboardEvent} event - The keyboard event.
   */
  private handleKeyPress(event: KeyboardEvent) {
    switch (event.key) {
      case 'N':
        this.startNewGame();
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
   * @param {number} seed - The current seed.
   */
  private displayCurrentSeed(seed: number) {
    const seedDisplay = this.shadowRoot?.getElementById(
      'current-seed-display',
    ) as HTMLDivElement;
    if (seedDisplay) {
      seedDisplay.innerHTML = `Current seed: ${seed}`;
    }
  }

  /**
   * Dispatches a 'start-new-game' event.
   *
   * This event can be listened for by other components to start a new game.
   *
   * @return {void} This function does not return anything.
   */
  public startNewGame(): void {
    this.dispatchEvent(
      new CustomEvent('start-new-game', { bubbles: true, composed: true }),
    );
  }

  /**
   * Changes the current seed to a random value.
   *
   * This function will also update the displayed seed in the title menu.
   *
   * @return {void} This function does not return anything.
   */
  public changeSeed(): void {
    initParams.seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.displayCurrentSeed(initParams.seed);
  }

  /**
   * Shows the player setup screen.
   *
   * This function will query the first 'title-screen' element in the document
   * and replace its content with a 'player-setup' element. This element will
   * allow the user to modify their player's name and appearance.
   *
   * @return {void} This function does not return anything.
   */
  public playerSetup(): void {
    const titleScreen = document.querySelector('title-screen');
    if (titleScreen) {
      const titleScreenShadow = titleScreen.shadowRoot;
      const titleScreenContent = titleScreenShadow?.getElementById(
        'title-screen-content',
      );
      if (titleScreenContent) {
        titleScreenContent.innerHTML = '';
        const playerSetup = document.createElement('player-setup');
        titleScreenContent.appendChild(playerSetup);
      }
    }
  }

  /**
   * Opens a new window with the game's help documentation.
   */
  private showHelp() {
    const webview = new WebviewWindow('help', {
      url: 'help.html',
      title: 'Meikai - Help',
      fullscreen: true,
      visible: false,
    });

    webview.once('tauri://created', () => {
      const helpWindow = WebviewWindow.getByLabel('help');

      webview.listen('content-loaded', () => {
        helpWindow?.show();
      });
    });

    webview.once('tauri://error', e => {
      console.error(e);
    });
  }

  private showAbout() {
    alert('About');
  }

  private async quitGame() {
    const confirm = await dialog.confirm('Are you sure you want to quit?', {
      title: 'Confirm Quit',
      type: 'warning',
    });

    if (confirm) {
      await exit();
    }
  }

  /**
   * Removes event listeners for keydown and click events.
   *
   * This function is called when the custom element is removed from the DOM.
   * It removes event listeners for keydown and click events that were added in the
   * connectedCallback function.
   */
  private disconnectedCallback() {
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

customElements.define('title-menu', TitleMenu);
