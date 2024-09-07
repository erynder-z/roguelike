import controlsData from './controls.json';

export class HelpControls extends HTMLElement {
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

        .key-cell {
          font-weight: bold;
        }

        .action-cell {
          font-style: italic;
    
        }

      </style>

      <div class="container">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="controls-list">
          <!-- Controls will be mapped here -->
          </tbody>
        </table>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.populateControls();
  }

  /**
   * Populates the controls table with data from controls.json.
   *
   * Loops over the controls data and creates a table row for each control,
   * with the key in the first column and the action in the second column.
   */
  private populateControls() {
    const buffsListElement = this.shadowRoot?.querySelector(
      '#controls-list',
    ) as HTMLTableSectionElement;

    controlsData.controls.forEach(controlData => {
      const rowElement = document.createElement('tr');
      const keyCellElement = document.createElement('td');
      const actionCellElement = document.createElement('td');

      keyCellElement.textContent = controlData.key;
      keyCellElement.classList.add('key-cell');
      actionCellElement.textContent = controlData.action;
      actionCellElement.classList.add('action-cell');

      rowElement.append(keyCellElement, actionCellElement);
      buffsListElement.appendChild(rowElement);
    });
  }
}
