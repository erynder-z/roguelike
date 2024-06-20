export class TitleScreen extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
        <style>
          .title-screen {
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
          }
          .title-screen h1 {
            margin-bottom: 2rem;
          }
          .title-screen button {
            padding: 1rem 2rem;
            font-size: 1.5rem;
            font-weight: bold;
            background: var(--accent);
            color: var(--white);
            border: none;
          }

          .title-screen button:hover {
           cursor: pointer;
          }

          .underline {
            text-decoration: underline;
          }
        </style>
  
        <div class="title-screen">
          <h1>Meikai: Roguelike Journey to the Center of the Earth</h1>
          <button id="new-game-button"><span class="underline">N</span>ew Game</button>
        </div>
      `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.startNewGame = this.startNewGame.bind(this);

    shadowRoot
      .getElementById('new-game-button')
      ?.addEventListener('click', this.startNewGame);
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

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
}

customElements.define('title-screen', TitleScreen);
