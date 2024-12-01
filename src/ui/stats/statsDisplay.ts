export class StatsDisplay extends HTMLElement {
  constructor() {
    super();
  }

  /**
   * Sets up the element's shadow root and styles it with a template.
   * This method is called when the element is inserted into the DOM.
   * It is called after the element is created and before the element is connected
   * to the DOM.
   *
   */
  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
    <style>
      .stats-display {
        font-size: large;
        margin: auto;
      }
      .yellow-hp {
        color: yellow;
      }
      .red-hp {
        color: red;
      }
    </style>

    <div class="stats-display"></div>
  `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  public setStats(
    hp: number,
    maxhp: number,
    lvl: number,
    nEA: string = '0.00',
    nAC: number = 0,
    nAP: number = 0,
  ): void {
    const yellowHP = hp / maxhp >= 0.25 && hp / maxhp <= 0.5;
    const redHP = hp / maxhp <= 0.25;

    let hpDisplayText = `HP: `;
    if (redHP) {
      hpDisplayText += `<span class="red-hp">${hp}/${maxhp}</span>`;
    } else if (yellowHP) {
      hpDisplayText += `<span class="yellow-hp">${hp}/${maxhp}</span>`;
    } else {
      hpDisplayText += `${hp}/${maxhp}`; // No color if hp is above 50%
    }

    const lvlDisplayText = `LVL: ${lvl}`;
    const nEADisplayText = `nEA: ${nEA}`;
    const nACDisplayText = `nAC: ${nAC}`;
    const nAPDisplayText = `nAP: ${nAP}`;
    const display = `${hpDisplayText} ${nEADisplayText} ${nACDisplayText} ${nAPDisplayText} ${lvlDisplayText}`;

    const statsDisplay = this.shadowRoot?.querySelector('.stats-display');

    if (statsDisplay) statsDisplay.innerHTML = display;
  }
}
