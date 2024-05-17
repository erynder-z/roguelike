import { Buff } from '../Buffs/BuffEnum';
import { BuffIF } from '../Buffs/Interfaces/BuffIF';

export class BuffsDisplay extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
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

  setBuffs(buffMap: Map<Buff, BuffIF>) {
    const buffsDisplay = this.shadowRoot?.querySelector('.buffs-display');
    if (buffsDisplay) {
      buffsDisplay.innerHTML = '';

      const ulElement = document.createElement('ul');

      buffMap.forEach((buff, key) => {
        const listItem = document.createElement('li');
        const remainTime = buff.time;
        listItem.textContent = `${Buff[key]}: ${remainTime}`;
        ulElement.appendChild(listItem);
      });

      if (buffsDisplay) buffsDisplay.appendChild(ulElement);
    }
  }
}

customElements.define('buffs-display', BuffsDisplay);
