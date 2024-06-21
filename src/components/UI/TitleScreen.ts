import img from '../../assets/images/title/title.webp';

export class TitleScreen extends HTMLElement {
  constructor() {
    super();

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
            justify-content: center;
            height: 100%;
            width: 100%;
            background: var(--background1);
            color: var(--white);
            z-index: 1;
            overflow: hidden;
          }
          .title-screen::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-image: url('${img}');
            background-size: 150%; 
            background-position: left center; 
            animation: pan 25s infinite alternate linear;
            z-index: -1;
          }
          .title-screen h1 {
            margin-bottom: 2rem;
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

          @keyframes pan {
            0% {
              background-position: left center;
            }
            100% {
              background-position: right center;
            }
          }

          .buttons-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
        </style>
  
        <div class="title-screen">
          <h1>Meikai: Roguelike Journey to the Center of the Earth</h1>
          <div class="buttons-container">
            <button id="new-game-button"><span class="underline">N</span>ew Game</button>
            <button id="help-button"><span class="underline">H</span>elp</button>
            <button id="about-window-button"><span class="underline">A</span>bout</button>
          </div>
        </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
    this.showHelp = this.showHelp.bind(this);
    this.showAbout = this.showAbout.bind(this);

    shadowRoot
      .getElementById('new-game-button')
      ?.addEventListener('click', this.startNewGame);
    shadowRoot
      .getElementById('help-button')
      ?.addEventListener('click', this.showHelp);
    shadowRoot
      .getElementById('about-button')
      ?.addEventListener('click', this.showAbout);
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'N') {
      this.startNewGame();
    }
  }

  startNewGame() {
    this.dispatchEvent(
      new CustomEvent('start-new-game', { bubbles: true, composed: true }),
    );
  }

  showHelp() {
    alert('Help');
  }

  showAbout() {
    alert('About');
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('click', this.startNewGame);
    document.removeEventListener('click', this.showHelp);
    document.removeEventListener('click', this.showAbout);
  }
}

customElements.define('title-screen', TitleScreen);
