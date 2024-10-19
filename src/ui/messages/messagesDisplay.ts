import { BuffColors } from '../buffs/buffColors';
import { LogMessage } from '../../gameLogic/messages/logMessage';

export class MessagesDisplay extends HTMLElement {
  private colorizer: BuffColors;

  constructor() {
    super();
    this.colorizer = new BuffColors();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        * {
          margin: var(--margin);
          padding: var(--padding);
          box-sizing: border-box;
        }

        ::selection {
          color: var(--selection-color);
          background-color: var(--selection-background);
        }

        :host {
          display: flex;
          flex-direction: column;
          padding: 0 0.5rem;
          width: 100%;
        }

        .messages-display {
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
        }

        h1 {
          margin: 0;
          font-size: 0.75rem;
        }

        .messages-display ul {
          display: flex;
          flex-direction: column-reverse;
        }

        li {
          list-style: none;
          padding: 0 0.5rem;
        }

        li:nth-child(odd) {
          background-color: var(--whiteTransparent);
        }
      </style>

      <h1>messages:</h1>
      <div class="messages-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the messages to be displayed in the component.
   *
   * @param {LogMessage[]} messageLog - The array of log messages to display.
   * @return {void}
   */
  public setMessages(messageLog: LogMessage[]): void {
    const messagesDisplay = this.shadowRoot?.querySelector('.messages-display');
    if (!messagesDisplay) return;

    const ulElement = document.createElement('ul');
    const fragment = document.createDocumentFragment();

    messageLog.forEach(m => {
      const liElement = document.createElement('li');
      liElement.textContent = m.message;
      this.colorizer.colorBuffs(liElement);
      fragment.appendChild(liElement);
    });

    ulElement.appendChild(fragment);
    messagesDisplay.innerHTML = '';
    messagesDisplay.appendChild(ulElement);
  }
}
