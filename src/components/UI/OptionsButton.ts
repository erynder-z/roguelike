export class OptionsButton extends HTMLElement {
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
          align-items: center;
        }

        button {
          font-size: 1.5rem;
          flex: 1;
          border-radius: 0;
          background-color: var(--whiteTransparent);
          color: var(--white);
          border: none;
          padding: 1rem;
          cursor: pointer;
          writing-mode: vertical-rl;
       /*    transform: rotate(180deg);  */
        }

        button:hover {
          background-color: var(--accent);
        }

        button:focus {
          border: none;
          outline: none;
        }
      </style>

      <button id="options-button">Options</button>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  connectedCallback() {
    this.activateMenuButton();
  }

  /**
   * Activates the menu button by adding an event listener to the 'options-button' element.
   * When the button is clicked, it calls the handleMenuButtonClick method.
   *
   * @return {void} This function does not return anything.
   */
  private activateMenuButton(): void {
    const helpBtn = this.shadowRoot?.getElementById('options-button');

    helpBtn?.addEventListener('click', () => {
      this.handleMenuButtonClick();
    });
  }

  /**
   * Handles the click event on the menu button.
   *
   * If a 'options-screen' element does not exist, it creates a new 'options-screen' element and
   * prepends it to the 'body1' element.
   *
   * @return {void} This function does not return anything.
   */
  private handleMenuButtonClick(): void {
    if (!document.querySelector('options-screen')) {
      const body = document.getElementById('body1');
      const menuScreen = document.createElement('options-screen');
      body?.prepend(menuScreen);
    }
  }
}

customElements.define('options-display', OptionsButton);
