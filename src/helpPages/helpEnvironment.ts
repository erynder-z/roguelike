import environmentData from '../gameLogic/environment/environmentData/environment.json';

export class HelpEnvironment extends HTMLElement {
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

         .container {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;

        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--whiteTransparent);
        }

        th {
          background-color: var(--whiteTransparent);
        }

        tbody {
        font: 1rem DejaVu Sans Mono, monospace;
        }

        .env-cell {
          font-size: 1.75rem;
        }

        .name-cell {
          font-weight: bold;
        }

        .about-cell {
          font-style: italic;
        }
      </style>

    <div class="container">
        <table>
          <thead>
            <tr>
              <th>Environment</th>
              <th>Name</th>
              <th>About</th>
            </tr>
          </thead>
          <tbody id="environment-list">
          <!-- Environment will be mapped here -->
          </tbody>
        </table>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.populateEnvironmentList();
  }

  /**
   * Populates the environment list table with data from environment.json.
   *
   * Loops over the environment data and creates a table row for each environment,
   * with the character in the first column, the name in the second column, and the
   * about text in the third column.
   */
  private populateEnvironmentList(): void {
    const environmentListElement = this.shadowRoot?.querySelector(
      '#environment-list',
    ) as HTMLTableSectionElement;

    environmentData.environment
      .filter(env => env.help.show)
      .forEach(env => {
        const rowElement = document.createElement('tr');

        const environmentCellElement = this.createTableCell('env-cell');
        const nameCellElement = this.createTableCell('name-cell');
        const aboutCellElement = this.createTableCell('about-cell');

        const characterSpan = document.createElement('span');
        characterSpan.textContent = env.char;
        characterSpan.style.display = 'inline-block';
        characterSpan.style.width = '2ch';
        characterSpan.style.height = '2ch';
        characterSpan.style.textAlign = 'center';
        characterSpan.style.backgroundColor = env.bgCol;
        characterSpan.style.color = env.fgCol;

        environmentCellElement.appendChild(characterSpan);

        nameCellElement.textContent = env.name;
        aboutCellElement.textContent = env.help.about;

        rowElement.append(
          environmentCellElement,
          nameCellElement,
          aboutCellElement,
        );
        environmentListElement.appendChild(rowElement);
      });
  }

  /**
   * Creates a table cell element with the specified class name.
   *
   * @param {string} className - The class name to add to the cell element.
   * @return {HTMLTableCellElement} The newly created table cell element.
   */
  private createTableCell(className: string): HTMLTableCellElement {
    const cellElement = document.createElement('td');
    cellElement.classList.add(className);
    return cellElement;
  }
}
