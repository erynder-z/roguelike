export class OptionsDisplay extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        
        * {
          margin: var(--margin);
          padding: var(--padding);
          box-sizing: var(--box-sizing);
        }

        * {
          scrollbar-width: var(--scrollbar-width);
          scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
        }

        ::selection {
          color: var(--selection-color);
          background-color: var(--selection-background);
        }

        :host {
          display: flex;
          flex-direction: column;
        }

        button {
          flex: 1;
          border-radius: 0;
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

      <button id="scanlines-button">Scanlines ON</button>
      <button id="help-button">Help</button>
      <button id="menu-button">Menu</button>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  connectedCallback() {
    this.activateScanlinesButtons();
    this.activateHelpButton();
    this.activateMenuButton();
  }

  /**
   * Activates the scanlines buttons by adding an event listener to the 'scanlines-button' element.
   * When the button is clicked, it toggles the 'scanlines' class on the 'main-container' element.
   * It also updates the text content of the 'scanlines-button' element based on whether the 'scanlines' class is present or not.
   *
   * @return {void} This function does not return anything.
   */
  private activateScanlinesButtons(): void {
    const mainContainer = document.getElementById('main-container');
    const scanLineBtn = this.shadowRoot?.getElementById('scanlines-button');

    scanLineBtn?.addEventListener('click', () => {
      mainContainer?.classList.toggle('scanlines');
      const hasScanLinesClass = mainContainer?.classList.contains('scanlines');

      scanLineBtn.textContent = hasScanLinesClass
        ? 'Scanlines ON'
        : 'Scanlines OFF';
    });
  }

  private activateHelpButton(): void {
    const helpBtn = this.shadowRoot?.getElementById('help-button');

    helpBtn?.addEventListener('click', () => {
      alert('Help');
    });
  }

  private activateMenuButton(): void {
    const helpBtn = this.shadowRoot?.getElementById('menu-button');

    helpBtn?.addEventListener('click', () => {
      alert('Menu');
    });
  }
}

customElements.define('options-display', OptionsDisplay);
