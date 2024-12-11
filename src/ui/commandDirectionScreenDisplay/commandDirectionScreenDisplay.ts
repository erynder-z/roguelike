export class CommandDirectionScreenDisplay extends HTMLElement {
  public title: string = '';
  public directions: string[][] = [];
  private menuKey: string = 'Esc';

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
          .command-direction-screen {
            background: var(--popupBackground);
            backdrop-filter: blur(5px);
            position: absolute;
            top: 1rem;
            left: 1rem;
            padding: 2rem;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--white);
          }
          .title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          .directions-table {
            display: grid;
            grid-template-columns: repeat(5, auto);
            gap: 0.5rem;
          }
          .cell {
            text-align: center;
            padding: 0.5rem;
            background: var(--cellBackground);
            border-radius: 0.25rem;
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
        </style>
        <div class="command-direction-screen">
          <div class="title"></div>
          <div class="directions-table"></div>
          <div class="spell-footing">(Press ${this.menuKey} to cancel)</div>
        </div>
      `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.renderDirections();
  }

  /**
   * Renders the direction table and title.
   */
  private renderDirections(): void {
    if (!this.shadowRoot) return;

    const titleElement = this.shadowRoot.querySelector('.title');
    const tableElement = this.shadowRoot.querySelector('.directions-table');

    if (titleElement) {
      titleElement.textContent = this.title;
    }

    if (tableElement) {
      tableElement.innerHTML = '';
      this.directions.forEach(row => {
        row.forEach(cell => {
          const cellElement = document.createElement('div');
          cellElement.className = 'cell';
          cellElement.textContent = cell;
          tableElement.appendChild(cellElement);
        });
      });
    }
  }

  /**
   * Adds a 'fade-out' class to the element, triggering a fade-out animation,
   * and returns a promise that resolves when the animation ends.
   * @returns {Promise<void>} A promise that resolves when the fade-out animation completes.
   */
  public fadeOut(): Promise<void> {
    return new Promise(resolve => {
      this.classList.add('fade-out');
      this.addEventListener('animationend', () => resolve(), { once: true });
    });
  }
}
