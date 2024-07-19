import { Buff } from '../Buffs/BuffEnum';
import { BuffType } from '../Buffs/Types/BuffType';
import { BuffColors } from './BuffColors';

export class BuffsDisplay extends HTMLElement {
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

        .buffs-display {
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
      </style>

      <h1>Buffs</h1>
      <div class="buffs-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  public setBuffs(buffMap: Map<Buff, BuffType>) {
    const buffsDisplay = this.shadowRoot?.querySelector('.buffs-display');
    if (buffsDisplay) {
      buffsDisplay.innerHTML = '';

      const ulElement = document.createElement('ul');
      const fragment = document.createDocumentFragment();

      buffMap.forEach((buff, key) => {
        const listItem = document.createElement('li');
        const remainTime = buff.timeLeft;
        listItem.textContent = `${Buff[key]}: ${remainTime}`;

        this.colorizer.colorBuffs(listItem);
        fragment.appendChild(listItem);
      });

      ulElement.appendChild(fragment);
      buffsDisplay.appendChild(ulElement);
    }
  }
}

customElements.define('buffs-display', BuffsDisplay);
