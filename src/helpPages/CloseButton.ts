import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

export class CloseButton extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          display: inline-block;
          margin-top: 2rem;
        }

        .close-button {
          font-family: 'UASQUARE';
          padding: 0.5rem 1.25rem;
          background: none;
          border: none;
          color: var(--white);
          font-size: 1.25rem;
          cursor: pointer;
          position: fixed;
          bottom: 1rem;
          right: 1rem;
        }

        .close-button:hover {
          background-color: var(--whiteTransparent);
        }

        .underline {
          text-decoration: underline;}
      </style>

      <button class="close-button">
        <span class="underline">C</span>lose help
      </button>
    `;

    shadowRoot.appendChild(template.content.cloneNode(true));
    this.activateCloseButton();
  }

  /**
   * Adds event listeners for click and keyboard events to the button for closing the help window.
   */
  private activateCloseButton = () => {
    const helpWindow = getCurrentWebviewWindow();
    const button = this.shadowRoot?.querySelector('.close-button');

    const closeWindow = () => {
      if (helpWindow) helpWindow.close();
    };

    if (button) {
      button.addEventListener('click', closeWindow);
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'C') {
        closeWindow();
      }
    });
  };
}
