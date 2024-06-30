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

  public setStats(stats: string) {
    const statsDisplay = this.shadowRoot?.querySelector('.stats-display');
    if (statsDisplay) statsDisplay.textContent = stats;
  }
}

customElements.define('stats-display', StatsDisplay);
