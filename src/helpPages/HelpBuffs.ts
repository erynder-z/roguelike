import { BuffColors } from '../components/UI/BuffColors';
import buffsData from './buffs.json';

export class HelpBuffs extends HTMLElement {
  private colorizer: BuffColors;
  constructor() {
    super();
    this.colorizer = new BuffColors();

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

        .buff-cell {
          font-weight: bold;
        }

        .effect-cell {
          font-style: italic;
        }
      </style>

    <div class="container">
        <table>
          <thead>
            <tr>
              <th>Buff</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody id="buffs-list">
          <!-- Controls will be mapped here -->
          </tbody>
        </table>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.populateBuffsList();
  }

  /**
   * Populates the buffs list table with data from buffsData.
   *
   * Iterates over the buffsData.buffs array and creates a table row for each buff.
   * The row consists of two cells: one for the buff's name and one for its effect.
   * The name cell is colored according to the buff's type.
   */
  private populateBuffsList(): void {
    const buffsListElement = this.shadowRoot?.querySelector(
      '#buffs-list',
    ) as HTMLTableSectionElement;

    buffsData.buffs.forEach(buffData => {
      const rowElement = document.createElement('tr');
      const nameCellElement = document.createElement('td');
      const effectCellElement = document.createElement('td');

      nameCellElement.textContent = buffData.buff;
      nameCellElement.classList.add('buff-cell');
      this.colorizer.colorBuffs(nameCellElement);

      effectCellElement.textContent = buffData.effect;
      effectCellElement.classList.add('effect-cell');

      rowElement.append(nameCellElement, effectCellElement);
      buffsListElement.appendChild(rowElement);
    });
  }
}
