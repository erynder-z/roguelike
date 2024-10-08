export class StatsDisplay extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        .stats-display {
          font-size: large;
          margin: auto;
        }
      </style>

      <div class="stats-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the text content of the stats display to the given stats.
   *
   * @param {string} stats - The text to display in the stats display.
   * @return {void}
   */
  public setStats(stats: string): void {
    const statsDisplay = this.shadowRoot?.querySelector('.stats-display');
    if (statsDisplay) statsDisplay.textContent = stats;
  }
}


