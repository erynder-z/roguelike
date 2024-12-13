export class GameOverScreenDisplay extends HTMLElement {
  public playerName: string = '';
  public playerColor: string = '';
  public heading: string = '';
  public postMortem: string = '';
  public info: string = '';

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        .game-over-screen {
          font-family: 'UASQUARE';
          font-size: large;
          background: var(--backgroundDefaultTransparent);
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scrollbar-width: var(--scrollbar-width);
          scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .game-over-screen::-webkit-scrollbar {
          width: 0.25rem;
        }

        .game-over-screen::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-foreground);
          border-radius: 4px;
        }

        .game-over-screen::-webkit-scrollbar-track {
          background-color: var(--scrollbar-background);
        }

        .title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .post-mortem {
          margin: 1rem 0;
          font-size: 1rem;
        }

        .footer {
          font-size: 0.875rem;
          margin-top: 1rem;
        }

        .emphasize {
          color: var(--accent);
          }

        .fade-out {
          animation: fade-out 100ms;
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }

          100% {
            opacity: 0;
          }
        }
      </style>
      <div class="game-over-screen">
        <div class="title"></div>
        <div class="post-mortem"></div>
        <div class="footer"></div>
      </div>
    `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.renderContent();
  }

  /**
   * Renders the game over screen content including the title, post-mortem, and footer information.
   */
  private renderContent(): void {
    if (!this.shadowRoot) return;

    const titleElement = this.shadowRoot.querySelector('.title') as HTMLElement;
    const postMortemElement = this.shadowRoot.querySelector(
      '.post-mortem',
    ) as HTMLElement;
    const footerElement = this.shadowRoot.querySelector(
      '.footer',
    ) as HTMLElement;

    if (titleElement) {
      titleElement.textContent = `${this.playerName} - ${this.heading}`;
      titleElement.style.color = this.playerColor;
    }

    if (postMortemElement) postMortemElement.innerHTML = this.postMortem;

    if (footerElement) footerElement.innerHTML = this.info;
  }
}
