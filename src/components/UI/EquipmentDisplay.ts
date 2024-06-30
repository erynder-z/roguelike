import { Equipment } from '../Inventory/Equipment';
import { Slot } from '../ItemObjects/Slot';

export class EquipmentDisplay extends HTMLElement {
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

        .equipment-display {
          overflow: auto;
          display: flex;
          gap: 5rem;
        }

        h1 {
          margin: 0;
          text-align: center;
        }

        .hands,
        .body {
          display: flex;
          flex-direction: column;
        }

        .equipment-slot {
          display: flex;
        }

        .equipment-slot > div:first-child {
          width: 100px;
          font-weight: bold;
        }

      </style>

      <h1>Equipment</h1>

      <div class="equipment-display">
        <div class="hands">
          <div class="equipment-slot">
            <div>Main hand:&nbsp;</div>
            <div id="MainHand">empty</div>
          </div>
          <div class="equipment-slot">
            <div>Off hand:&nbsp;</div>
            <div id="OffHand">empty</div>
          </div>
        </div>

        <div class="body">
          <div class="equipment-slot">
            <div>Head:&nbsp;</div>
            <div id="Head">empty</div>
          </div>
          <div class="equipment-slot">
            <div>Hands:&nbsp;</div>
            <div id="Hands">empty</div>
          </div>
          <div class="equipment-slot">
            <div>Back:&nbsp;</div>
            <div id="Back">empty</div>
          </div>
          <div class="equipment-slot">
            <div>Legs:&nbsp;</div>
            <div id="Legs">empty</div>
          </div>
          <div class="equipment-slot">
            <div>Feet:&nbsp;</div>
            <div id="Feet">empty</div>
          </div>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  public setEquipment(equipment: Equipment | undefined) {
    const slots = [
      Slot.MainHand,
      Slot.OffHand,
      Slot.Head,
      Slot.Hands,
      Slot.Back,
      Slot.Legs,
      Slot.Feet,
    ];

    slots.forEach(slot => {
      const slotElement = this.shadowRoot?.getElementById(Slot[slot]);
      const itemDescription = equipment?.get(slot)?.description() ?? 'empty';

      if (slotElement) {
        slotElement.textContent = itemDescription;
      }
    });
  }
}

customElements.define('equipment-display', EquipmentDisplay);
