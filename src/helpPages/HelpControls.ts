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

        h1 {
          margin: 0;
          text-align: center;
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

      </style>

      <h1>Controls</h1>
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
    const tbody = this.shadowRoot?.getElementById('controls-list');
    controlsData.controls.forEach(
      (control: { key: string; action: string }) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${control.key}</td>
        <td>${control.action}</td>
      `;
        tbody?.appendChild(row);
      },
    );
  }
}
