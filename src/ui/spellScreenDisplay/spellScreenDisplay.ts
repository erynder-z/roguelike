export class SpellScreenDisplay extends HTMLElement {
  public title: string = '';
  public spells: { key: string; description: string }[] = [];
  private menuKey: string = 'Esc';

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
        <style>
          .spell-screen {
            background: var(--popupBackground);
            backdrop-filter: blur(5px);
            position: absolute;
            top: 1rem;
            left: 1rem;
            padding: 2rem;
            border-radius: 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .spell-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            text-align: center;
          }
          .spell-options {
            list-style: none;
            padding: 0;
            margin: 0;
            width: 100%;
          }
          .spell-options li {
            margin: 0.5rem 0;
            font-size: 1rem;
            text-align: left;
          }
          .spell-footing {
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #ccc;
          }
        </style>
        <div class="spell-screen">
          <div class="spell-title"></div>
          <ul class="spell-options"></ul>
          <div class="spell-footing">(Press ${this.menuKey} to cancel)</div>
        </div>
      `;
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.renderSpells();
  }

  /**
   * Sets the cancel key text displayed in the footer.
   * @param {string} key - The cancel key.
   */
  set cancelKeyText(key: string) {
    this.menuKey = key;
    const footing = this.shadowRoot?.querySelector(
      '.spell-footing',
    ) as HTMLElement;
    if (footing) footing.textContent = `(Press ${this.menuKey} to cancel)`;
  }

  /**
   * Renders the spell list and title in the component.
   */
  private renderSpells(): void {
    if (!this.shadowRoot) return;

    const titleElement = this.shadowRoot.querySelector('.spell-title');
    const optionsList = this.shadowRoot.querySelector('.spell-options');

    if (titleElement) {
      titleElement.textContent = this.title;
    }

    if (optionsList) {
      optionsList.innerHTML = '';
      this.spells.forEach(spell => {
        const li = document.createElement('li');
        li.textContent = `${spell.key} - ${spell.description}`;
        optionsList.appendChild(li);
      });
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
