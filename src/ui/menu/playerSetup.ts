import { gameConfig } from '../../gameConfig/gameConfig';
import { GameConfigType } from '../../types/gameConfig/gameConfigType';
import { getRandomColor } from '../../utilities/colors/getRandomColor';
import { getRandomUnicodeCharacter } from '../../utilities/getRandomAvatar';
import { getRandomName } from '../../utilities/getRandomName';
import {
  girlishImage,
  boyishImage,
} from '../../utilities/imageHandler/portraitImages';
import { saveConfig } from '../../utilities/saveConfig';

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
          background: var(--backgroundDefaultTransparent);
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
          width: 45ch;
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
          height: 20rem;
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
          display: flex;
          flex-direction: column;
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
            <div id="player-portrait-girlish" class="portrait"></div>
            <div id="player-portrait-boyish" class="portrait"></div>
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
         <span>Ctrl + Arrow keys to toggle appearance</span>
         <span>Ctrl + r to randomize all</span>
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
    this.displayPlayer(gameConfig.player);
  }

  /**
   * Sets up event listeners for player setup screen.
   *
   * Handles events such as:
   * - Clicking on the player portrait to toggle appearance.
   * - Clicking on the player name to enable name editing.
   * - Key presses to randomize name, color, or avatar.
   * - Clicking randomize button to randomize selected attribute.
   * - Clicking return button to go back to previous screen.
   *
   * Also sets up key press event listener.
   * @return {void}
   */
  private bindEvents(): void {
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
    this.randomize = this.randomize.bind(this);
    this.returnToPreviousScreen = this.returnToPreviousScreen.bind(this);

    this.manageEventListener(
      'player-portrait-girlish',
      'click',
      () => {
        this.changeAppearanceTo('girlish');
      },
      true,
    );
    this.manageEventListener(
      'player-portrait-boyish',
      'click',
      () => {
        this.changeAppearanceTo('boyish');
      },
      true,
    );
    this.manageEventListener(
      'player-name',
      'click',
      this.enableNameEditing,
      true,
    );
    this.manageEventListener(
      'randomize-name-button',
      'click',
      () => this.randomize('name'),
      true,
    );
    this.manageEventListener(
      'player-color-input',
      'change',
      this.handleColorInputChange,
      true,
    );
    this.manageEventListener(
      'randomize-color-button',
      'click',
      () => this.randomize('color'),
      true,
    );
    this.manageEventListener(
      'player-avatar',
      'click',
      this.enableAvatarEditing,
      true,
    );
    this.manageEventListener(
      'randomize-avatar-button',
      'click',
      () => this.randomize('avatar'),
      true,
    );
    this.manageEventListener(
      'return-button',
      'click',
      this.returnToPreviousScreen,
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
   * Handle key presses that occur while the player setup screen is active.
   *
   * This function is called whenever a key is pressed while the player setup
   * screen is displayed. It checks if the name input is focused and if so,
   * returns early. Otherwise, it checks if the pressed key corresponds to one
   * of the keys that can be used to control the player setup screen, and if so,
   * calls the appropriate function to handle the key press. If the pressed key
   * does not match any of the handled keys, the function does nothing.
   *
   * @param {KeyboardEvent} event - The event object that contains information
   * about the key press.
   * @return {void}
   */
  private handleKeyPress(event: KeyboardEvent): void {
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
        this.randomize('name');
        break;
      case 'C':
        this.changeColor();
        break;
      case 'o':
        this.randomize('color');
        break;
      case 'A':
        this.enableAvatarEditing();
        break;
      case 'z':
        this.randomize('avatar');
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
      case 'r':
        if (event.ctrlKey) this.randomize('all');
        break;
      default:
        break;
    }
  }

  /**
   * Renders the player's current portrait, name, and avatar in the UI.
   *
   * @param {GameConfigType['player']} player - The player object containing the
   * appearance, name, and avatar information.
   * @return {void}
   */
  private displayPlayer(player: GameConfigType['player']): void {
    const isGirlish = player.appearance === 'girlish';
    this.renderPortraitElement(
      'player-portrait-girlish',
      girlishImage,
      isGirlish,
    );
    this.renderPortraitElement(
      'player-portrait-boyish',
      boyishImage,
      !isGirlish,
    );

    this.renderNameElement('player-name', player.name);
    this.setColorInputValue(player.color);
    this.renderNameElement('player-avatar', player.avatar);
  }

  /**
   * Renders a portrait element with the specified image HTML and highlight status.
   *
   * @param {string} elementId - The ID of the element to render.
   * @param {string} imageHTML - The HTML string of the portrait image.
   * @param {boolean} isHighlighted - Whether the portrait should be highlighted.
   * @return {void}
   */
  private renderPortraitElement(
    elementId: string,
    imageHTML: string,
    isHighlighted: boolean,
  ): void {
    const element = this.shadowRoot?.getElementById(
      elementId,
    ) as HTMLDivElement;
    if (element) {
      element.innerHTML = imageHTML;
      element.classList.toggle('highlight', isHighlighted);
      element.classList.toggle('inactive', !isHighlighted);
    }
  }

  /**
   * Renders a name element with the specified content.
   *
   * @param {string} elementId - The ID of the element to render.
   * @param {string} content - The text content of the element.
   * @return {void}
   */
  private renderNameElement(elementId: string, content: string): void {
    const element = this.shadowRoot?.getElementById(
      elementId,
    ) as HTMLDivElement;
    if (element) element.textContent = content;
  }

  /**
   * Toggles the player's appearance between 'girlish' and 'boyish'. Updates the
   * UI to reflect the new appearance.
   *
   * @return {void}
   */
  private toggleAppearance(): void {
    const player = gameConfig.player;
    player.appearance = player.appearance === 'girlish' ? 'boyish' : 'girlish';
    this.displayPlayer(player);
  }

  private changeAppearanceTo(appearance: 'boyish' | 'girlish'): void {
    const player = gameConfig.player;
    player.appearance = appearance;
    this.displayPlayer(player);
  }

  /**
   * Enables the player name input element for editing, hiding the player name
   * element and the randomize name button.
   *
   * @return {void}
   */
  private enableNameEditing(): void {
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
    inputElement.value = gameConfig.player.name;
    nameElement.style.display = 'none';
    inputElement.focus();

    inputElement.addEventListener('blur', this.handleNameInputChange);
    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') this.handleNameInputChange();
    });
  }

  /**
   * Handles the blur event on the player name input element by saving the new
   * name to gameConfig and hiding the input element.
   *
   * @return {void}
   */
  private handleNameInputChange(): void {
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
      gameConfig.player.name = newName || 'Unnamed';
      this.renderNameElement('player-name', gameConfig.player.name);
      nameElement.style.display = 'inline';
      inputElement.style.display = 'none';
      randomizeButton.style.display = 'inline';
    }
  }

  /**
   * Sets the player's name to a random name based on their appearance.
   *
   * @return {void}
   */
  private randomizeName(): void {
    gameConfig.player.name = getRandomName(gameConfig.player.appearance);
  }

  /**
   * Sets the player's avatar to a random unicode character.
   *
   * @return {void}
   */
  private randomizeAvatar(): void {
    gameConfig.player.avatar = getRandomUnicodeCharacter();
  }

  /**
   * Sets the value of the player color input element to the given color.
   *
   * This function is called when the player's color is changed from the
   * player setup screen.
   *
   * @param {string} color - The new color for the player.
   * @return {void}
   */
  private setColorInputValue(color: string): void {
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;
    if (colorInput) colorInput.value = color;
  }

  /**
   * Handles the change event on the player color input element by saving the
   * new color to gameConfig.
   *
   * @return {void}
   */
  private handleColorInputChange(): void {
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;
    gameConfig.player.color = colorInput?.value;
  }

  /**
   * Simulates a click event on the player color input element, allowing the user
   * to select a color from the color picker.
   *
   * @return {void}
   */
  private changeColor(): void {
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;
    if (colorInput) colorInput.click();
  }

  /**
   * Sets the player's color to a random color.
   *
   * @return {void}
   */
  private randomizeColor(): void {
    const randomColor = getRandomColor();
    const colorInput = this.shadowRoot?.getElementById(
      'player-color-input',
    ) as HTMLInputElement;

    if (colorInput) {
      colorInput.value = randomColor;
      gameConfig.player.color = randomColor;
    }
  }

  /**
   * Enables the avatar input element for editing, hiding the avatar element
   * and randomize button.
   *
   * @return {void}
   */
  private enableAvatarEditing(): void {
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
    inputElement.value = gameConfig.player.avatar;
    avatarElement.style.display = 'none';
    inputElement.focus();

    inputElement.addEventListener('blur', this.handleAvatarInputChange);
    inputElement.addEventListener('keydown', event => {
      if (event.key === 'Enter') this.handleAvatarInputChange();
    });
  }

  /**
   * Handles the blur event on the player avatar input element by saving the new
   * avatar to gameConfig and hiding the input element.
   *
   * @return {void}
   */
  private handleAvatarInputChange(): void {
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
      gameConfig.player.avatar = newAvatar || '@';
      this.renderNameElement('player-avatar', gameConfig.player.avatar);
      avatarElement.style.display = 'inline';
      inputElement.style.display = 'none';
      randomizeButton.style.display = 'inline';
    }
  }

  /**
   * Randomizes the player's appearance.
   *
   * @return {void}
   */
  private randomizeAppearance(): void {
    gameConfig.player.appearance = Math.random() > 0.5 ? 'boyish' : 'girlish';
  }

  /**
   * Randomizes a specified part of the player's settings.
   *
   * Randomizes either the player's appearance, name, color, avatar, or all of
   * the above.
   *
   * @param {string} element The element to randomize. Can be 'appearance',
   * 'name', 'color', 'avatar', or 'all'.
   *
   * @return {void}
   */
  private randomize(
    element: 'appearance' | 'name' | 'color' | 'avatar' | 'all',
  ): void {
    switch (element) {
      case 'appearance':
        this.randomizeAppearance();
        break;
      case 'name':
        this.randomizeName();
        break;
      case 'color':
        this.randomizeColor();
        break;
      case 'avatar':
        this.randomizeAvatar();
        break;
      case 'all':
        this.randomizeAppearance();
        this.randomizeName();
        this.randomizeColor();
        this.randomizeAvatar();
        break;
    }
    this.displayPlayer(gameConfig.player);
  }

  /**
   * Saves the current build parameters to a file and returns to the previous screen.
   *
   * This function is called when the user clicks the "start game" button on the player setup
   * screen. It saves the current build parameters to a file and then returns to the previous
   * screen by replacing the content of the title screen with the title menu element.
   * @return {Promise<void>} A promise for when the file is saved and the screen is updated.
   */
  private async returnToPreviousScreen(): Promise<void> {
    await saveConfig();

    const titleScreenContent = document
      .querySelector('title-screen')
      ?.shadowRoot?.getElementById('title-screen-content');

    if (titleScreenContent) {
      titleScreenContent.innerHTML = '';
      titleScreenContent.appendChild(document.createElement('title-menu'));
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

    this.manageEventListener(
      'player-portrait-1',
      'click',
      this.toggleAppearance,
      false,
    );
    this.manageEventListener(
      'player-portrait-2',
      'click',
      this.toggleAppearance,
      false,
    );
    this.manageEventListener(
      'player-name',
      'click',
      this.enableNameEditing,
      false,
    );
    this.manageEventListener(
      'randomize-name-button',
      'click',
      () => this.randomize('name'),
      false,
    );
    this.manageEventListener(
      'player-color-input',
      'change',
      this.handleColorInputChange,
      false,
    );
    this.manageEventListener(
      'randomize-color-button',
      'click',
      () => this.randomize('color'),
      false,
    );
    this.manageEventListener(
      'player-avatar',
      'click',
      this.enableAvatarEditing,
      false,
    );
    this.manageEventListener(
      'randomize-avatar-button',
      'click',
      () => this.randomize('avatar'),
      false,
    );
    this.manageEventListener(
      'return-button',
      'click',
      this.returnToPreviousScreen,
      false,
    );
  }
}
