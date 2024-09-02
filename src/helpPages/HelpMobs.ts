export class HelpMobs extends HTMLElement {
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

        h1 {
          margin: 0;
          text-align: center;
        }
      </style>

      <h1>Mobs</h1>
      <p>Information about mobs.</p>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }
}
