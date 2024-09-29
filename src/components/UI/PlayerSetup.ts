import { initParams, InitParamsType } from '../../initParams/InitParams';
import { boyishImage, girlishImage } from '../ImageHandler/portraitImages';
import { getRandomName } from '../Utilities/GetRandomName';
import { getRandomUnicodeCharacter } from '../Utilities/GetRandomAvatar';
import { getRandomColor } from '../Colors/GetRandomColor';

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

        button.randomize-name-button,
        button.randomize-avatar-button,
        button.randomize-color-button {
          font-size: 1.5rem;
          padding: 0 0 0 1rem;
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
        .color-container,
        .avatar-container {
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

        .avatar {
          cursor: pointer;
          font-family: 'DejaVu Sans Mono';
          font-size: 2.5rem;
          font-weight: bold;
          color: var(--white);
          padding: 0;
          outline: none;
          background: none;
          transition: font-size 0.2s ease-in-out;
        }

        .avatar-input {
          display: none;
          width: 100%;
          font-family: 'DejaVu Sans Mono';
          font-size: 2.5rem;
          font-weight: bold;
          background: none;
          border: none;
          outline: none;
          color: var(--white);
          padding: 0;
          transition: font-size 0.2s ease-in-out;
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
              (r<span class="underline">a</span>ndomize)
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
            <button id="randomize-color-button" class="randomize-color-button">
              (rand<span class="underline">o</span>mize)
            </button>
          </div>
          <div class="avatar-container">
            <span class="underline">A</span>vatar:&nbsp;
            <input
              id="player-avatar-input"
              class="avatar-input"
              type="text"
              autocomplete="off"
              maxlength="1"
            />
            <div id="player-avatar" class="avatar"></div>
            <button id="randomize-avatar-button" class="randomize-avatar-button">
              (randomi<span class="underline">z</span>e)
            </button>
          </div>
        </div>
        <div class="info-container">
          Ctrl + Arrow keys to toggle appearance
        </div>
        <div class="buttons-container">
          <button id="return-button">
            <span class="underline">R</span>eturn
          </button>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.bindEvents();
    this.displayPlayer(initParams.player);
  }

  private bindEvents() {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.toggleAppearance = this.toggleAppearance.bind(this);
    this.enableNameEditing = this.enableNameEditing.bind(this);
    this.handleNameInputChange = this.handleNameInputChange.bind(this);
    this.randomizeName = this.randomizeName.bind(this);
    this.handleColorInputChange = this.handleColorInputChange.bind(this);
    this.changeColor = this.changeColor.bind(this);
    this.randomizeColor = this.randomizeColor.bind(this);
    this.enableAvatarEditing = this.enableAvatarEditing.bind(this);
    this.handleAvatarInputChange = this.handleAvatarInputChange.bind(this);
    this.randomizeAvatar = this.randomizeAvatar.bind(this);
    this.returnToPreviousScreen = this.returnToPreviousScreen.bind(this);

    this.addEventListenerToElement('player-portrait-1', this.toggleAppearance);
    this.addEventListenerToElement('player-portrait-2', this.toggleAppearance);
    this.addEventListenerToElement('player-name', this.enableNameEditing);
    this.addEventListenerToElement('randomize-name-button', this.randomizeName);
    this.addEventListenerToElement(
      'player-color-input',
      this.handleColorInputChange,
    );
    this.addEventListenerToElement(
      'randomize-color-button',
      this.randomizeColor,
    );

    this.addEventListenerToElement('player-avatar', this.enableAvatarEditing);
    this.addEventListenerToElement(
      'randomize-avatar-button',
      this.randomizeAvatar,
    );
    this.addEventListenerToElement(
      'return-button',
      this.returnToPreviousScreen,
    );

    document.addEventListener('keydown', this.handleKeyPress);
  }
  private addEventListenerToElement(
    elementId: string,
    callback: EventListener,
  ) {
    const element = this.shadowRoot?.getElementById(elementId);
    if (element) {
      element.addEventListener('click', callback);
    }
  }

  private handleKeyPress(event: KeyboardEvent) {
    const nameInputElement = this.shadowRoot?.getElementById(
      'player-name-input',
    ) as HTMLInputElement;
    const avatarInputElement = this.shadowRoot?.getElementById(
      'player-avatar-input',
    ) as HTMLInputElement;

    const isFocused =
      this.shadowRoot?.activeElement === nameInputElement ||
      this.shadowRoot?.activeElement === avatarInputElement;

    if (isFocused) {
      return; // Return early if the name input is focused.
    } else {
      event.preventDefault();
    }

    switch (event.key) {
      case 'N':
        this.enableNameEditing();
        break;
      case 'a':
        this.randomizeName();
        break;
      case 'C':
        this.changeColor();
        break;
      case 'o':
        this.randomizeColor();
        break;
      case 'A':
        this.enableAvatarEditing();
        break;
      case 'z':
        this.randomizeAvatar();
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
    this.renderNameElement('player-avatar', player.avatar);
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

  private randomizeAvatar() {
    initParams.player.avatar = getRandomUnicodeCharacter();
    this.renderNameElement('player-avatar', initParams.player.avatar);
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

  private randomizeColor() {
    const randomColor = getRandomColor();
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;

    if (colorInput) {
      colorInput.value = randomColor;
      initParams.player.color = randomColor;
    }
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

  private enableAvatarEditing() {
    const inputElement = this.shadowRoot?.getElementById(
      'player-avatar-input',
    ) as HTMLInputElement;
    const avatarElement = this.shadowRoot?.getElementById(
      'player-avatar',
    ) as HTMLDivElement;
    const randomizeButton = this.shadowRoot?.getElementById(
      'randomize-avatar-button',
    ) as HTMLButtonElement;

    randomizeButton.style.display = 'none';
    inputElement.style.display = 'flex';
    inputElement.value = initParams.player.avatar;
    avatarElement.style.display = 'none';
    inputElement.focus();

    inputElement.addEventListener('blur', this.handleAvatarInputChange);
    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') this.handleAvatarInputChange();
    });
  }

  private handleAvatarInputChange() {
    const inputElement = this.shadowRoot?.getElementById(
      'player-avatar-input',
    ) as HTMLInputElement;
    const avatarElement = this.shadowRoot?.getElementById(
      'player-avatar',
    ) as HTMLDivElement;
    const randomizeButton = this.shadowRoot?.getElementById(
      'randomize-avatar-button',
    ) as HTMLButtonElement;

    if (inputElement) {
      const newAvatar = inputElement.value.trim();
      initParams.player.avatar = newAvatar || '@';
      this.renderNameElement('player-avatar', initParams.player.avatar);
      avatarElement.style.display = 'inline';
      inputElement.style.display = 'none';
      randomizeButton.style.display = 'inline';
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
        ?.getElementById('player-avatar')
        ?.addEventListener('click', this.enableAvatarEditing.bind(this));
      shadowRoot
        ?.getElementById('return-button')
        ?.addEventListener('click', this.returnToPreviousScreen);
    }
  }
}
customElements.define('player-setup', PlayerSetup);
