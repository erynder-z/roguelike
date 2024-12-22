import { ItemObject } from '../../gameLogic/itemObjects/itemObject';

export class InventoryScreenDisplay extends HTMLElement {
  private inventoryItems: ItemObject[] = [];
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

        .inventory-screen-display {
          background: var(--backgroundDefaultTransparent);
          backdrop-filter: blur(5px);
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          color: var(--white);
        }

        .inventory-heading {
          font-size: 1.5rem;
          text-align: center;
          margin: 2rem;
        }

        .inventory-list ul {
          padding: 0 2rem;
        }

        .inventory-list ul li {
          list-style-type: none;
          padding: 0.5rem;
          cursor: pointer;
        }

        .inventory-list ul li:hover {
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

      <div class="inventory-screen-display">
        <div class="inventory-heading">
          Inventory: (Press ${this.menuKey} to close)
        </div>

        <div class="inventory-list"></div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the inventory items to display.
   * @param {ItemObject[]} items - The inventory items.
   */
  set items(items: ItemObject[]) {
    this.inventoryItems = items;
    this.renderInventoryList();
  }

  /**
   * Sets the menu key text displayed in the heading.
   * @param {string} key - The menu key.
   */
  set menuKeyText(key: string) {
    this.menuKey = key;
    const heading = this.shadowRoot?.querySelector(
      '.inventory-heading',
    ) as HTMLElement;
    if (heading) {
      heading.textContent = `Inventory: (Press ${this.menuKey} to close)`;
    }
  }

  /**
   * Renders the inventory list items.
   *
   * Clears the inventory list container, then creates a new unordered list
   * element with list items for each inventory item. Each list item is assigned
   * a data-index attribute for the associated inventory item index.
   * The list items are then appended to the container.
   */
  private renderInventoryList(): void {
    const inventoryListContainer = this.shadowRoot?.querySelector(
      '.inventory-list',
    ) as HTMLElement;
    if (inventoryListContainer) {
      inventoryListContainer.innerHTML = '';
      const itemList = document.createElement('ul');
      const fragment = document.createDocumentFragment();

      this.inventoryItems.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${String.fromCharCode(97 + index)}: ${item.description()}`;
        listItem.dataset.index = index.toString();
        fragment.appendChild(listItem);
      });

      itemList.appendChild(fragment);
      inventoryListContainer.appendChild(itemList);
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
