export class OptionsDisplay extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        button {
          flex-grow: 1;
          border-radius: 0;
          height: 4rem;
          background-color: var(--whiteTransparent);
          color: var(--white);
          border: none;
          padding: 1rem;
          cursor: pointer;
        }

        button:hover {
          background-color: var(--accent);
        }

        button:focus {
          border: none;
          outline: none;
        }
      </style>

      <button id="scanlines-button">
        Scanlines ON
      </button>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  getScanlinesButton() {
    return this.shadowRoot?.getElementById('scanlines-button');
  }
}

customElements.define('options-display', OptionsDisplay);
