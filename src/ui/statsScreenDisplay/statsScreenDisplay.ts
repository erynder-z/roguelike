import { Buff } from '../../gameLogic/buffs/buffEnum';
import { BuffColors } from '../buffs/buffColors';
import { BuffType } from '../../types/gameLogic/buffs/buffType';
import { Stats } from '../../gameLogic/stats/stats';
import { Mob } from '../../gameLogic/mobs/mob';
import { Equipment } from '../../gameLogic/inventory/equipment';

export class StatsScreenDisplay extends HTMLElement {
  public colorizer: BuffColors = new BuffColors();
  public stats: Stats | undefined;
  public player: Mob | undefined;
  public equipment: Equipment | undefined;
  private menuKey: string = 'Esc';

  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        :host {
          --outer-margin: 6rem;
          --minimal-width: 33%;
          --maximal-width: 100%;
        }

        ::-webkit-scrollbar {
          width: 0.25rem;
        }

        ::-webkit-scrollbar-thumb {
          background-color: var(--scrollbar-foreground);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-track {
          background-color: var(--scrollbar-background);
        }

        .stats-screen-display {
          background: var(--popupBackground);
          position: absolute;
          top: 1rem;
          left: 1rem;
          padding: 2rem;
          border-radius: 1rem;
          display: flex;
          height: calc(var(--maximal-width) - var(--outer-margin));
          width: calc(var(--minimal-width) - var(--outer-margin));
          flex-direction: column;
          color: var(--white);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .stats-screen-heading {
          font-size: 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .stats {
          padding: 0 2rem;
        }

        .buffs-list-heading {
          padding-top: 0.5rem;
        }

        .buffs-list ul {
          padding: 0;
          margin: 0;
        }

        .buffs-list ul li {
          list-style-type: none;
        }

        .yellow-hp {
          color: yellow;
        }
        .red-hp {
          color: red;
        }

        .fade-out {
          animation: fade-out 100ms;
        }

        @keyframes fade-out {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      </style>
      <div class="stats-screen-display">
        <div class="stats-screen-heading">
          Stats: (Press ${this.menuKey} to close).
        </div>
        <div class="stats">
          <div class="player-name">Name: ${this.player?.name}</div>
          <div class="player-hp">HP: ${this.player?.hp}</div>
          <div class="stats-list">
            <div class="armor-class">Armor class: ${this.equipment?.armorClass()}</div>
            <div class="weapon-damage">Weapon damage: ${this.equipment?.weaponDamage()}</div>
            <div class="attack-modifier">Attack modifier: ${this.stats?.damageDealModifier}</div>
            <div class="defense-modifier">Defense modifier: ${this.stats?.damageReceiveModifier}</div>
            <div class="visibility-range">Visibility: ${this.stats?.currentVisibilityRange}</div>
            <div class="mob-kills">Kills: ${this.stats?.mobKillCounter}</div>
          </div>
          <div class="buffs-list-heading">Buffs:</div>
          <div class="buffs-list"></div>
        </div>
      </div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the current stats data.
   * @param {Stats} stats - The new stats data.
   */
  set currentStats(stats: Stats) {
    this.stats = stats;
  }

  /**
   * Sets the current player data.
   * @param {Mob} player - The new player data.
   */

  set currentPlayer(player: Mob) {
    this.player = player;
  }

  /**
   * Sets the current equipment data.
   * @param {Equipment} equipment - The new equipment data.
   */
  set currentEquipment(equipment: Equipment) {
    this.equipment = equipment;
  }

  /**
   * Sets the menu key text displayed in the heading.
   * @param {string} key - The menu key.
   */
  set menuKeyText(key: string) {
    this.menuKey = key;
    const heading = this.shadowRoot?.querySelector(
      '.stats-screen-heading',
    ) as HTMLElement;
    if (heading) {
      heading.textContent = `Stats: (Press ${this.menuKey} to close)`;
    }
  }

  /**
   * Updates the HP display to show the current HP in relation to the player's max HP,
   * with colors red for <= 25%, yellow for 25%-50%, and no color for > 50%.
   */
  public setHPColor(): void {
    const hp = this.player?.hp;
    const maxhp = this.player?.maxhp;

    if (!hp || !maxhp) return;

    const yellowHP = hp / maxhp >= 0.25 && hp / maxhp <= 0.5;
    const redHP = hp / maxhp <= 0.25;

    let hpDisplayText = `HP: `;
    if (redHP) {
      hpDisplayText = `<span class="red-hp">${hp} / ${maxhp}</span>`;
    } else if (yellowHP) {
      hpDisplayText += `<span class="yellow-hp">${hp} / ${maxhp}</span>`;
    } else {
      hpDisplayText += `${hp} / ${maxhp}`; // No color if hp is above 50%
    }

    const hpDisplay = this.shadowRoot?.querySelector('.player-hp');
    if (hpDisplay) hpDisplay.innerHTML = hpDisplayText;
  }

  /**
   * Updates the display of active buffs by populating the "buffs-list" element
   * with a list of buffs. Each buff is displayed as a colored span, based on the
   * buff's type. Buffs are separated by commas.
   *
   * @param {Map<Buff, BuffType>} buffMap - A map containing the buffs and their
   * corresponding types that should be displayed in the buffs list.
   * @return {void}
   */

  public setBuffs(buffMap: Map<Buff, BuffType>): void {
    const buffsList = this.shadowRoot?.querySelector(
      '.buffs-list',
    ) as HTMLElement;
    if (buffsList) {
      buffsList.innerHTML = '';

      const buffText = document.createElement('span');
      buffsList.appendChild(buffText);

      let first = true;

      buffMap.forEach((buff, key) => {
        if (!first) {
          buffsList.appendChild(document.createTextNode(', '));
        }
        first = false;

        const buffSpan = document.createElement('span');
        buffSpan.textContent = `${Buff[key]}`;

        this.colorizer.colorBuffs(buffSpan);
        buffsList.appendChild(buffSpan);
      });
    }
  }

  /**
   * Adds the 'fade-out' class to the element and returns a promise that resolves
   * when the fade out animation ends.
   * @returns {Promise<void>}
   */
  public fadeOut(): Promise<void> {
    return new Promise(resolve => {
      this.classList.add('fade-out');
      this.addEventListener('animationend', () => resolve(), { once: true });
    });
  }
}
