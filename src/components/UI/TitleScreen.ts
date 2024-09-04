import img from '../../assets/images/title/title.webp';
import { dialog } from '@tauri-apps/api';
import { exit } from '@tauri-apps/api/process';
import { WebviewWindow } from '@tauri-apps/api/window';

export class TitleScreen extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('pass-seed', event =>
      this.handleSeedPassed(event as CustomEvent),
    );

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        .title-screen {
          font-family: 'UASQUARE';
          font-size: 2.5rem;
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          height: 100%;
          width: 100%;
          background: var(--background1);
          color: var(--white);
          z-index: 1;
          overflow: hidden;
        }

        .background-image {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background-image: url('${img}');
          background-size: cover;
          background-position: left;
          animation: pan 25s infinite linear;
          z-index: -1;
        }

        .title-screen h1 {
          margin-top: 12rem;
          text-align: center;
          z-index: 1;
        }

        .title-screen button {
          font-family: 'UASQUARE';
          padding: 1rem;
          font-size: 2.5rem;
          font-weight: bold;
          background: none;
          color: var(--white);
          border: none;
          transition: all 0.2s ease-in-out;
        }

        .title-screen button:hover {
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
          font-weight: bold;
        }

        .version-display {
          padding: 0 1rem;
          font-size: 1.5rem;
        }

        @keyframes pan {
          0% {
            background-position: left;
          }
          50% {
            background-position: right;
          }
          100% {
            background-position: left;
          }
        }
      </style>

      <div class="title-screen">
        <div class="background-image"></div>
        <h1>Meikai: Roguelike Journey to the Center of the Earth</h1>
        <div class="buttons-container">
          <button id="new-game-button">
            <span class="underline">N</span>ew Game
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
          <div id="current-seed-display" class="seed-display">
            current Seed
          </div>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.changeSeed = this.changeSeed.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this.quitGame = this.quitGame.bind(this);

    shadowRoot
      .getElementById('new-game-button')
      ?.addEventListener('click', this.startNewGame);
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
  }

  /**
   * Handles the custom event 'seed-passed' and displays the current seed.
   * @param {CustomEvent} event - The custom event containing the seed.
   */
  private handleSeedPassed(event: CustomEvent) {
    const seed = event.detail.seed;
    this.displayCurrentSeed(seed);
  }

  /**
   * Displays the current seed in the title screen.
   * @param {number} seed - The current seed to display.
   */
  private displayCurrentSeed(seed: number) {
    const seedDisplay = this.shadowRoot?.getElementById(
      'current-seed-display',
    ) as HTMLDivElement;
    if (seedDisplay) {
      seedDisplay.innerHTML = `current seed: <span>${seed} </span>`;
    }
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
   * Dispatches the 'start-new-game' event.
   *
   * @event start-new-game
   * @fires TitleScreen#start-new-game
   */
  public startNewGame() {
    this.dispatchEvent(
      new CustomEvent('start-new-game', { bubbles: true, composed: true }),
    );
  }

  /**
   * Dispatches the 'change-seed' event.
   *
   * @event change-seed
   * @fires TitleScreen#change-seed
   */
  public changeSeed() {
    this.dispatchEvent(
      new CustomEvent('change-seed', { bubbles: true, composed: true }),
    );
  }

  /**
   * Opens a new window with the game's help documentation.
   */
  private showHelp() {
    const webview = new WebviewWindow('help', {
      url: 'help.html',
      title: 'Meikai - Help',
      fullscreen: true,
    });

    webview.once('tauri://created', () => {
      // webview window successfully created
    });
    webview.once('tauri://error', e => {
      console.error(e);
      // an error occurred during webview window creation
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

customElements.define('title-screen', TitleScreen);
