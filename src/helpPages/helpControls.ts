import controlsData from './controls.json';
import controlSchemes from '../controls/control_schemes.json';
import {
  ControlSchemeName,
  ControlSchemeType,
} from '../types/controls/controlSchemeType';
import { gameConfigManager } from '../gameConfigManager/gameConfigManager';

export class HelpControls extends HTMLElement {
  private gameConfig = gameConfigManager.getConfig();
  private controlSchemeName: ControlSchemeName = this.gameConfig.control_scheme;
  private availableControlSchemes = Object.keys(
    controlSchemes,
  ) as ControlSchemeName[];

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

        .control-scheme-button-container {
          display: flex;
          margin-top: 1rem;
        }

        .control-scheme-button {
          font-family: 'UASQUARE';
          padding: 0.5rem 1.25rem;
          background: none;
          border: none;
          color: var(--white);
          font-size: 1.25rem;
          cursor: pointer;
        }

        .control-scheme-button:hover {
          background-color: var(--whiteTransparent);
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

        .underline {
          text-decoration: underline;
        }
      </style>

      <div class="container">
        <div class="control-scheme-button-container">
          <button id="prev-scheme-button" class="control-scheme-button"><span class="underline">&lt;</span></button>
          <div id="controls-scheme-name" class="control-scheme-name">${this.controlSchemeName.toUpperCase()} - controls</div>
          <button id="next-scheme-button" class="control-scheme-button"><span class="underline">&gt;</span></button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="controls-list">
          </tbody>
        </table>
      </div>
   `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));

    this.bindEvents();
    this.populateControlsTable(this.controlSchemeName);
  }

  /**
   * Binds events to the elements inside the controls help page.
   *
   * The function binds the following events:
   * - Click event on the previous control scheme button
   * - Click event on the next control scheme button
   * - Keydown event on the document
   *
   * @return {void}
   */
  private bindEvents(): void {
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleControlSchemeButtonClick =
      this.handleControlSchemeButtonClick.bind(this);

    this.manageEventListener(
      'prev-scheme-button',
      'click',
      () => this.handleControlSchemeButtonClick('prev'),
      true,
    );
    this.manageEventListener(
      'next-scheme-button',
      'click',
      () => this.handleControlSchemeButtonClick('next'),
      true,
    );

    document.addEventListener('keydown', this.handleKeyPress);
  }

  /**
   * Manage event listeners for an element.
   *
   * If the add parameter is true, the callback is added to the element's event
   * listeners. If the add parameter is false, the callback is removed from the
   * element's event listeners.
   *
   * @param {string} elementId - The ID of the element on which to add or remove
   * the event listener.
   * @param {string} eventType - The type of event to listen for.
   * @param {EventListener} callback - The callback function to be called when the
   * event is fired.
   * @param {boolean} add - Whether to add or remove the event listener.
   * @return {void}
   */
  private manageEventListener(
    elementId: string,
    eventType: string,
    callback: EventListener,
    add: boolean,
  ): void {
    const element = this.shadowRoot?.getElementById(elementId);
    if (add) {
      element?.addEventListener(eventType, callback);
    } else {
      element?.removeEventListener(eventType, callback);
    }
  }

  /**
   * Handles the click event of the control scheme buttons.
   *
   * The function takes care of switching the current control scheme to the
   * previous or next one in the list of available control schemes.
   *
   * @param {'prev' | 'next'} buttonDirection - The direction of the control
   * scheme button that was clicked.
   * @return {void}
   */
  private handleControlSchemeButtonClick(
    buttonDirection: 'prev' | 'next',
  ): void {
    const schemes = this.availableControlSchemes;
    const currentIndex = schemes.indexOf(this.controlSchemeName);
    const newIndex =
      buttonDirection === 'prev'
        ? (currentIndex - 1 + schemes.length) % schemes.length
        : (currentIndex + 1) % schemes.length;

    this.controlSchemeName = schemes[newIndex];
    this.updateControlSchemeName();
    this.populateControlsTable(this.controlSchemeName);
  }

/**
 * Updates the displayed name of the control scheme in the UI.
 *
 * This function selects the HTML element with the ID 'controls-scheme-name'
 * and sets its text content to the uppercase version of the current
 * control scheme name, followed by '- controls'.
 */

  private updateControlSchemeName() {
    const schemeNameElement = this.shadowRoot?.querySelector(
      '#controls-scheme-name',
    ) as HTMLDivElement;
    schemeNameElement.textContent = `${this.controlSchemeName.toUpperCase()} - controls`;
  }

  /**
   * Populates the controls table with the controls data for the given control
   * scheme.
   *
   * The function takes the given control scheme name and looks up the
   * associated control scheme in the controlSchemes object. It then uses the
   * controls data to populate the controls table in the UI.
   *
   * @param {ControlSchemeName} controlSchemeName - The name of the control scheme
   * to populate the table with.
   * @return {void}
   */
  private populateControlsTable(controlSchemeName: ControlSchemeName): void {
    const controlsListElement = this.shadowRoot?.querySelector(
      '#controls-list',
    ) as HTMLTableSectionElement;

    if (!controlsListElement) return;

    controlsListElement.innerHTML = '';

    const selectedScheme: ControlSchemeType = controlSchemes[controlSchemeName];
    if (!selectedScheme) return;

    controlsData.controls.forEach(({ action, description }) => {
      const row = document.createElement('tr');
      const keyCell = document.createElement('td');
      const actionCell = document.createElement('td');

      const keys = selectedScheme[action];
      keyCell.textContent = keys ? keys.join(' / ') : 'N/A';
      keyCell.classList.add('key-cell');

      actionCell.textContent = description;
      actionCell.classList.add('action-cell');

      row.append(keyCell, actionCell);
      controlsListElement.appendChild(row);
    });
  }

/**
 * Handles key presses for navigating between control schemes.
 *
 * This function listens for the '<' and '>' keys to switch to the previous
 * or next control scheme, respectively. If either key is pressed, it triggers
 * the corresponding control scheme button click handler.
 *
 * @param {KeyboardEvent} event - The keyboard event object containing
 * details about the key press.
 * @return {void}
 */

  private handleKeyPress(event: KeyboardEvent): void {
    switch (event.key) {
      case '<':
        this.handleControlSchemeButtonClick('prev');
        break;
      case '>':
        this.handleControlSchemeButtonClick('next');
        break;
      default:
        break;
    }
  }

  /**
   * Removes event listeners for keydown and click events.
   *
   * This function is called when the custom element is removed from the DOM.
   * It removes event listeners for keydown and click events that were added in the
   * connectedCallback function.
   *
   * @return {void}
   */
  disconnectedCallback(): void {
    this.manageEventListener(
      'prev-scheme-button',
      'click',
      () => this.handleControlSchemeButtonClick('prev'),
      false,
    );
    this.manageEventListener(
      'next-scheme-button',
      'click',
      () => this.handleControlSchemeButtonClick('next'),
      false,
    );

    document.removeEventListener('keydown', this.handleKeyPress);
  }
}
