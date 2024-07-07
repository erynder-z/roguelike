import { GameState } from '../Builder/Types/GameState';
import { LogMessage } from '../Messages/LogMessage';
import { MessageLog } from '../Messages/MessageLog';

export class FlashDisplay extends HTMLElement {
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
          position: absolute;
          left: 0;
          bottom: 0;
        }

        .flash-display {
          padding: 1rem 1.5rem;
          color: var(--yellow);
          font-size: 1.25rem;
        }

        .more-span {
          font-weight: bold;
        }
      </style>
      <div class="flash-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  public setFlash(msg: LogMessage, log: MessageLog) {
    const flashDisplay = <HTMLElement>(
      this.shadowRoot?.querySelector('.flash-display')
    );

    if (flashDisplay) {
      flashDisplay.innerHTML = '';
      flashDisplay.textContent = msg.message;

      if (log.hasQueuedMessages()) {
        const fragment = document.createDocumentFragment();
        this.addMoreSpanToFragment(fragment, log);
        flashDisplay.appendChild(fragment);
      }
    }
  }

  private addMoreSpanToFragment(fragment: DocumentFragment, log: MessageLog) {
    const numberOfQueueMessages: number = log.len() - 1;
    const s =
      numberOfQueueMessages >= 2
        ? `(+${numberOfQueueMessages} more messages)`
        : `(+${numberOfQueueMessages} more message)`;
    const moreSpan = document.createElement('span');
    moreSpan.textContent = s;
    moreSpan.classList.add('more-span');
    fragment.appendChild(moreSpan);
  }

  public clearFlash(game: GameState) {
    game.log.clearQueue();

    const flashDisplay = this.shadowRoot?.querySelector('.flash-display');
    if (flashDisplay) flashDisplay.textContent = '';
  }
}

customElements.define('flash-display', FlashDisplay);
