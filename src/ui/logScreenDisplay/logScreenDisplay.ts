import { LogMessage } from '../../gameLogic/messages/logMessage';
import { BuffColors } from '../buffs/buffColors';

export class LogScreenDisplay extends HTMLElement {
  private colorizer = new BuffColors();
  private messageLog: LogMessage[] = [];

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        .log-screen-display {
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
        }

        .log-screen-display::-webkit-scrollbar {
          width: 0.25rem;
        }

        .log-screen-display::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-foreground);
          border-radius: 4px;
        }

        .log-screen-display::-webkit-scrollbar-track {
          background-color: var(--scrollbar-background);
        }

        .log-screen-heading {
        font-size: 1.5rem;
          text-align: center;
          margin: 2rem;
        }

        .log-screen-list ul li:nth-child(odd) {
          background-color: var(--whiteTransparent);
        }

        .log-screen-list ul{
          padding: 0 2rem;
        }

        .log-screen-list ul li {
        list-style-type: none;


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
      <div class="log-screen-display">
        <div class="log-screen-heading">Log: (Press Esc to close)</div>
        <div class="log-screen-list"></div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the log messages and triggers a render.
   * @param {LogMessage[]} messages - The log messages to display.
   */
  set log(messages: LogMessage[]) {
    this.messageLog = messages;
    this.generateMessageList();
  }

  /**
   * Renders the log messages into the component.
   */
  private generateMessageList(): void {
    const logScreenList = this.shadowRoot?.querySelector(
      '.log-screen-list',
    ) as HTMLElement;
    if (logScreenList) {
      logScreenList.innerHTML = '';
      const messageList = document.createElement('ul');
      const fragment = document.createDocumentFragment();

      for (let i = this.messageLog.length - 1; i >= 0; i--) {
        const m = this.messageLog[i];
        const listItem = document.createElement('li');
        listItem.textContent = m.message;
        this.colorizer.colorBuffs(listItem);
        fragment.appendChild(listItem);
      }

      messageList.appendChild(fragment);
      logScreenList.appendChild(messageList);
    }
  }

  /**
   * Adds the 'fade-out' class to the element and returns a promise that resolves
   * when the fade out animation ends.
   * @returns {Promise<void>}
   */
  public fadeOut(): Promise<void> {
    return new Promise(resolve => {
      this.classList.add('fade-out');
      this.addEventListener('animationend', () => resolve(), { once: true });
    });
  }
}
