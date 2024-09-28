import { initParams, InitParamsType } from '../../initParams/InitParams';
import { boyishImage, girlishImage } from '../ImageHandler/portraitImages';
import { getRandomName } from '../Utilities/GetRandomName';

export class PlayerSetup extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          width: 100%;
          line-height: 1.75;
        }

        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 45ch;
        }

        .container h1 {
          margin: 8rem 0 0 0;
          text-align: center;
          z-index: 1;
        }

        .player-about {
          background: var(--whiteTransparent);
          padding: 2rem;
          width: 45ch;
          border-radius: 1rem;
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

        button.randomize-name-button {
          font-size: 1.5rem;
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
          justify-content: space-evenly;
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

        .inactive {
          filter: grayscale(100%) brightness(50%);
        }

        .name-container,
        .color-container {
          display: flex;
          justify-content: left;
          align-items: center;
          font-weight: bold;
          cursor: default;
        }

        .name {
          cursor: pointer;
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
          width: 100%;
          font-family: 'UASQUARE';
          font-size: 2.5rem;
          font-weight: bold;
          background: none;
          border: none;
          outline: none;
          color: var(--white);
          padding: 0;
          transition: font-size 0.2s ease-in-out;
        }

        .randomize-name-button {
          padding: 0 0 0 1rem;
          font-size: 1.75rem;
        }

        .color-input-container {
          width: 100%;
        }

        .color-input {
          display: flex;
          height: 2.5rem;
          border-radius: 5%;
          padding: 0;
          margin: 0;
          background: none;
          outline: none;
          border: none;
          cursor: pointer;
        }

        .info-container {
          width: 100%;
          font-size: 1.25rem;
          text-align: left;
          margin-top: 1rem;
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
            <button id="randomize-name-button" class="randomize-name-button">
              (randomi<span class="underline">z</span>e)
            </button>
          </div>
          <div class="color-container">
            <span class="underline">C</span>olor:&nbsp;
            <div class="color-input-container">
              <input
                id="player-color-input"
                class="color-input"
                type="color"
                value="#FFFFFF"
              />
            </div>
          </div>
        </div>
        <div class="info-container">Ctrl + Arrow keys to toggle appearance</div>
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
    this.randomizeName = this.randomizeName.bind(this);
    this.handleColorInputChange = this.handleColorInputChange.bind(this);
    this.changeColor = this.changeColor.bind(this);
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
      .getElementById('randomize-name-button')
      ?.addEventListener('click', this.randomizeName.bind(this));
    shadowRoot
      .getElementById('player-color-input')
      ?.addEventListener('input', this.handleColorInputChange.bind(this));
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
      case 'z':
        this.randomizeName();
        break;
      case 'C':
        this.changeColor();
        break;
      case 'R':
        this.returnToPreviousScreen();
        break;
      case 'ArrowLeft':
        if (event.ctrlKey) this.toggleAppearance();

        break;
      case 'ArrowRight':
        if (event.ctrlKey) this.toggleAppearance();

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
      element.classList.toggle('inactive', !isHighlighted);
    }
  }

  private renderNameElement(elementId: string, content: string) {
    const element = this.shadowRoot?.getElementById(
      elementId,
    ) as HTMLDivElement;
    if (element) element.textContent = content;
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
    const randomizeButton = this.shadowRoot?.getElementById(
      'randomize-name-button',
    ) as HTMLButtonElement;

    randomizeButton.style.display = 'none';
    inputElement.style.display = 'flex';
    inputElement.value = initParams.player.name;
    nameElement.style.display = 'none';
    inputElement.focus();

    inputElement.addEventListener('blur', this.handleNameInputChange);
    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') this.handleNameInputChange();
    });
  }

  private handleNameInputChange() {
    const inputElement = this.shadowRoot?.getElementById(
      'player-name-input',
    ) as HTMLInputElement;
    const nameElement = this.shadowRoot?.getElementById(
      'player-name',
    ) as HTMLDivElement;
    const randomizeButton = this.shadowRoot?.getElementById(
      'randomize-name-button',
    ) as HTMLButtonElement;

    if (inputElement) {
      const newName = inputElement.value.trim();
      initParams.player.name = newName || 'Unnamed';
      this.renderNameElement('player-name', initParams.player.name);
      nameElement.style.display = 'inline';
      inputElement.style.display = 'none';
      randomizeButton.style.display = 'inline';
    }
  }

  private randomizeName() {
    initParams.player.name = getRandomName(initParams.player.appearance);
    this.renderNameElement('player-name', initParams.player.name);
  }

  private handleColorInputChange() {
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;
    initParams.player.color = colorInput?.value;
  }

  private changeColor() {
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;
    if (colorInput) colorInput.click();
  }

  private returnToPreviousScreen() {
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
        ?.getElementById('player-portrait-1')
        ?.addEventListener('click', this.toggleAppearance);
      shadowRoot
        ?.getElementById('player-portrait-2')
        ?.addEventListener('click', this.toggleAppearance);
      shadowRoot
        ?.getElementById('player-name')
        ?.addEventListener('click', this.enableNameEditing.bind(this));
      shadowRoot
        ?.getElementById('return-button')
        ?.addEventListener('click', this.returnToPreviousScreen);
    }
  }
}
customElements.define('player-setup', PlayerSetup);
