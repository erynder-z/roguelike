export class EquipmentScreenDisplay extends HTMLElement {
  private equipmentItems: {
    char: string;
    slot: string;
    description: string;
  }[] = [];
  private menuKey: string = 'Esc';

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        ::-webkit-scrollbar {
          width: 0.25rem;
        }

        ::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-foreground);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-track {
          background-color: var(--scrollbar-background);
        }

        .equipment-screen-display {
          background: var(--backgroundDefaultTransparent);
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .equipment-heading {
          font-size: 1.5rem;
          text-align: center;
          margin: 2rem;
        }

        .equipment-list ul {
          padding: 0 2rem;
        }

        .equipment-list ul li {
          list-style-type: none;
          padding: 0.5rem;
          cursor: pointer;
        }

        .equipment-list ul li:hover {
          background-color: var(--hover-bg-color, #222);
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
      <div class="equipment-screen-display">
        <div class="equipment-heading">Equipped Items: (Press ${this.menuKey} to close)</div>
        <div class="equipment-list"></div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the equipment items to display.
   * @param {{ slot: string; description: string }[]} items - The equipment items.
   */
  set items(items: { char: string; slot: string; description: string }[]) {
    this.equipmentItems = items;
    this.renderEquipmentList();
  }

  /**
   * Sets the menu key text displayed in the heading.
   * @param {string} key - The menu key.
   */
  set menuKeyText(key: string) {
    this.menuKey = key;
    const heading = this.shadowRoot?.querySelector(
      '.equipment-heading',
    ) as HTMLElement;
    if (heading) {
      heading.textContent = `Equipped Items: (Press ${this.menuKey} to close)`;
    }
  }

  /**
   * Renders the equipment list items.
   *
   * Clears the equipment list container, then creates a new unordered list
   * element with list items for each equipment item.
   */
  private renderEquipmentList(): void {
    const equipmentListContainer = this.shadowRoot?.querySelector(
      '.equipment-list',
    ) as HTMLElement;
    if (equipmentListContainer) {
      equipmentListContainer.innerHTML = '';
      const itemList = document.createElement('ul');
      const fragment = document.createDocumentFragment();

      this.equipmentItems.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.char} - ${item.slot}: ${item.description}`; // Include character
        fragment.appendChild(listItem);
      });

      itemList.appendChild(fragment);
      equipmentListContainer.appendChild(itemList);
    }
  }

  /**
   * Triggers a fade-out animation and resolves when it completes.
   * @returns {Promise<void>}
   */
  public fadeOut(): Promise<void> {
    return new Promise(resolve => {
      this.classList.add('fade-out');
      this.addEventListener('animationend', () => resolve(), { once: true });
    });
  }
}
