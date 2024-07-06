import { BuffColors } from './BuffColors';
import { LogMessage } from '../Messages/LogMessage';

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
          gap: 1rem;
          padding: 0 0.5rem;
          width: 100%;
        }

        .messages-display {
          flex-grow: 1;
          overflow: auto;
        }

        h1 {
          margin: 0;
          text-align: center;
        }

        ul {
          padding: 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        li {
          list-style: none;
          padding: 0 0.5rem;
        }

        li:nth-child(odd) {
          background-color: var(--whiteTransparent);
        }
      </style>

      <h1>Messages</h1>
      <div class="messages-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  public setMessages(messageLog: LogMessage[]) {
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

customElements.define('messages-display', MessagesDisplay);
