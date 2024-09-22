import { initParams, InitParamsType } from '../../initParams/InitParams';
import { boyishImage, girlishImage } from '../ImageHandler/portraitImages';

export class PlayerSetup extends HTMLElement {
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

        .appearance {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 4rem 0;
        }

        .portrait {
          transition: filter 0.2s ease;
          cursor: pointer;
        }

        img {
          width: auto;
          height: 12rem;
        }

        .highlight {
          filter: none;
        }

        .grayscale {
          filter: grayscale(100%);
        }

        .name-container {
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          cursor: default;
        }

        .name {
          cursor: pointer;
          flex: 1;
          font-family: 'UASQUARE';
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--white);
          padding: 0;
          outline: none;
          background: none;
          transition: font-size 0.2s ease-in-out;
        }

        .name-input {
          display: none;
          font-family: 'UASQUARE';
          font-size: 2.5rem;
          font-weight: bold;
          background: none;
          border: none;
          outline: none;
          color: var(--white);
          padding: 0;
          flex: 1;
          transition: font-size 0.2s ease-in-out;
        }

        .name-input:focus {
          font-size: 3.5rem;
        }
      </style>

      <div class="container">
        <h1>Player setup</h1>
        <div class="player-about">
          <div class="appearance">
            <div id="player-portrait-1" class="portrait"></div>
            <div id="player-portrait-2" class="portrait"></div>
          </div>
          <div class="name-container">
            <span class="underline">N</span>ame:&nbsp;
            <input
              id="player-name-input"
              class="name-input"
              type="text"
              autocomplete="off"
              maxlength="30"
            />
            <div id="player-name" class="name"></div>
          </div>
        </div>
        <div class="buttons-container">
          <button id="return-button">
            <span class="underline">R</span>eturn
          </button>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.toggleAppearance = this.toggleAppearance.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.returnToPreviousScreen = this.returnToPreviousScreen.bind(this);

    shadowRoot
      .getElementById('player-portrait-1')
      ?.addEventListener('click', this.toggleAppearance);
    shadowRoot
      .getElementById('player-portrait-2')
      ?.addEventListener('click', this.toggleAppearance);
    shadowRoot
      .getElementById('player-name')
      ?.addEventListener('click', this.enableNameEditing.bind(this));
    shadowRoot
      .getElementById('return-button')
      ?.addEventListener('click', this.returnToPreviousScreen);

    document.addEventListener('keydown', this.handleKeyPress);

    this.displayPlayer(initParams.player);
  }

  private handleKeyPress(event: KeyboardEvent) {
    const inputElement = this.shadowRoot?.getElementById(
      'player-name-input',
    ) as HTMLInputElement;

    const isFocused = this.shadowRoot?.activeElement === inputElement;

    if (isFocused) {
      return; // Return early if the name input is focused.
    } else {
      event.preventDefault();
    }

    switch (event.key) {
      case 'N':
        this.enableNameEditing();

        break;
      case 'R':
        this.returnToPreviousScreen();
        break;
      case 'ArrowLeft':
        if (event.ctrlKey) {
          this.toggleAppearance();
        }
        break;
      case 'ArrowRight':
        if (event.ctrlKey) {
          this.toggleAppearance();
        }
        break;
      case 'y':
        break;
      default:
        break;
    }
  }

  private displayPlayer(player: InitParamsType['player']) {
    const isGirlish = player.appearance === 'girlish';
    this.renderPortraitElement('player-portrait-1', girlishImage, isGirlish);
    this.renderPortraitElement('player-portrait-2', boyishImage, !isGirlish);

    this.renderNameElement('player-name', player.name);
  }

  private renderPortraitElement(
    elementId: string,
    imageHTML: string,
    isHighlighted: boolean,
  ) {
    const element = this.shadowRoot?.getElementById(
      elementId,
    ) as HTMLDivElement;
    if (element) {
      element.innerHTML = imageHTML;
      element.classList.toggle('highlight', isHighlighted);
      element.classList.toggle('grayscale', !isHighlighted);
    }
  }

  private renderNameElement(elementId: string, content: string) {
    const element = this.shadowRoot?.getElementById(
      elementId,
    ) as HTMLDivElement;
    if (element) {
      element.textContent = content;
    }
  }

  private toggleAppearance() {
    const player = initParams.player;
    player.appearance = player.appearance === 'girlish' ? 'boyish' : 'girlish';
    this.displayPlayer(player);
  }

  private enableNameEditing() {
    const inputElement = this.shadowRoot?.getElementById(
      'player-name-input',
    ) as HTMLInputElement;
    const nameElement = this.shadowRoot?.getElementById(
      'player-name',
    ) as HTMLDivElement;

    inputElement.style.display = 'flex';
    inputElement.value = initParams.player.name;
    nameElement.style.display = 'none';
    inputElement.focus();

    inputElement.addEventListener('blur', this.handleNameInputChange);
    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.handleNameInputChange();
      }
    });
  }

  private handleNameInputChange() {
    const inputElement = this.shadowRoot?.getElementById(
      'player-name-input',
    ) as HTMLInputElement;
    const nameElement = this.shadowRoot?.getElementById(
      'player-name',
    ) as HTMLDivElement;

    if (inputElement) {
      const newName = inputElement.value.trim();
      initParams.player.name = newName || 'Unnamed';
      this.renderNameElement('player-name', initParams.player.name);
      nameElement.style.display = 'inline';
      inputElement.style.display = 'none';
    }
  }

  public returnToPreviousScreen() {
    const titleScreenContent = document
      .querySelector('title-screen')
      ?.shadowRoot?.getElementById('title-screen-content');

    if (titleScreenContent) {
      titleScreenContent.innerHTML = '';
      titleScreenContent.appendChild(document.createElement('title-menu'));
    }
  }

  private disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyPress);

    const shadowRoot = this.shadowRoot;
    if (shadowRoot) {
      shadowRoot
        .getElementById('return-button')
        ?.removeEventListener('click', this.returnToPreviousScreen);
    }
  }
}
customElements.define('player-setup', PlayerSetup);
