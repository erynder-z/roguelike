import { GlyphMap } from '../../gameLogic/glyphs/glyphMap';
import { Spell } from '../../gameLogic/spells/spell';
import { EnvEffect } from '../../types/gameLogic/maps/mapModel/envEffect';
import { DetailViewEntity } from '../../types/ui/detailViewEntity';
import { SpellColors } from '../../utilities/colors/spellColors';

export class EntityInfoCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback(): void {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        .entity-card {
          position: absolute;
          top: 10%;
          left: 10%;
          background-color: var(--popupBackground);
          color: var(--white);
          padding: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: left;
          flex-direction: column;
          max-width: 25%;
          border-radius: 10px;
          animation: fade-in 0.1s;
          z-index: 999;
        }

        .mob-title,
        .corpse-title,
        .item-title,
        .env-title {
          margin: 0 auto 0.5rem auto;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .mob-glyph,
        .corpse-glyph,
        .item-glyph,
        .env-glyph {
          margin: 0.5rem auto 1rem auto;
          font-size: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.75rem;
          background-color: var(--whiteTransparent);
        }

        .mob-description,
        .corpse-description,
        .item-description,
        .env-description {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }

        .mob-level,
        .mob-hp,
        .item-level,
        .item-spell,
        .item-charges {
          margin: 0 0 0.5rem 0;
        }

        .red-hp {
          color: red;
        }

        .orange-hp {
          color: orange;
        }
        
        .yellow-hp {
          color: yellow;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        .fade-out {
          animation: fade-out 0.1s forwards;
        }
      </style>
      <div class="entity-card"></div>
    `;

    shadowRoot?.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Fills the entity card with the given entity information.
   *
   * @param entity - The entity to fill the card with.
   */
  public fillCardDetails(entity: DetailViewEntity): void {
    const entityCard = this.shadowRoot?.querySelector('.entity-card');
    if (!entityCard) return;

    entityCard.innerHTML = '';

    const name = entity.name;
    const glyphInfo = GlyphMap.getGlyphInfo(entity.glyph);
    const glyphChar = glyphInfo.char;
    const glyphColor = glyphInfo.fgCol;
    const description = entity.description;
    const level = entity.level;
    const hp = entity.hp || 0;
    const maxHp = entity.maxHp || 0;
    const mobHealthMessage = this.getMobHealthMessage(hp, maxHp);
    const charges = entity.charges;
    const spell = entity.spell !== undefined ? Spell[entity.spell] : undefined;
    const envEffects = entity?.envEffects?.map(effect => EnvEffect[effect]);

    const sp = entity.spell ? entity.spell : Spell.None;
    const gCol = sp !== Spell.None ? SpellColors.c[sp][0] : glyphColor;

    switch (entity.type) {
      case 'mob':
        entityCard.innerHTML = `
            <div class="mob-title">${name}</div>
            <div class="mob-glyph" style="color: ${glyphColor}">${glyphChar}</div>
            <div class="mob-level">Mob level: ${level}</div>
            <div class="mob-description">${description}</div>
            <div class="mob-hp">This ${name} looks ${mobHealthMessage}.</div>
          `;
        break;

      case 'corpse':
        entityCard.innerHTML = `
            <div class="corpse-title">${name}</div>
            <div class="corpse-glyph" style="color: ${glyphColor}">${glyphChar}</div>
            <div class="corpse-description">${description}</div>
              `;
        break;

      case 'item':
        entityCard.innerHTML = `
            <div class="item-title">${name}</div>
            <div class="item-glyph" style="color: ${gCol ? gCol : glyphColor}">${glyphChar}</div>
            <div class="item-level">Item level: ${level}</div>
            ${spell !== 'None' ? `<div class="item-spell">Item spell: ${spell}</div>` : ''}
            ${spell !== 'None' ? `<div class="item-charges">Charges: ${charges}</div>` : ''}
            <div class="item-description">${description}</div>
            `;
        break;

      case 'env':
        entityCard.innerHTML = `
            <div class="env-title">${name}</div>
            <div class="env-glyph" style="color: ${glyphColor}">${glyphChar}</div>
            <div class="env-description">${description}</div>
            ${envEffects && envEffects.length > 0 ? `<div class="env-effects">Environment effects: ${envEffects.join(', ')}</div>` : ''}
            `;
        break;

      default:
        entityCard.innerHTML = `
            <div>${name}</div>
            <div style="color: ${glyphColor}">${glyphChar}</div>
            <div>${description}</div>
          `;
        break;
    }
  }

  /**
   * Gets a string describing the health state of a mob, as a proportion of its
   * current HP to its max HP.
   *
   * @param {number} currentHP - The current HP of the mob.
   * @param {number} maxHP - The maximum HP of the mob.
   * @return {string} An HTML string describing the health state of the mob.
   */
  private getMobHealthMessage(currentHP: number, maxHP: number): string {
    const hpPercentage = (currentHP / maxHP) * 100;
    if (hpPercentage <= 25) {
      return `<span class="red-hp">almost dead</span>`;
    } else if (hpPercentage <= 50) {
      return `<span class="orange-hp">severely injured</span>`;
    } else if (hpPercentage <= 75) {
      return `<span class="yellow-hp">slightly wounded</span>`;
    } else {
      return `<span>unharmed</span>`;
    }
  }

  /**
   * Triggers a fade-out animation on the entity card and removes it from the DOM
   * once the animation is completed.
   *
   * This method adds the 'fade-out' class to the entity card element, initiating
   * a CSS animation. It listens for the 'animationend' event to remove the
   * element from the DOM, ensuring the animation completes before removal.
   */

  public fadeOutAndRemove(): void {
    const entityCard = this.shadowRoot?.querySelector('.entity-card');
    if (!entityCard) return;

    entityCard.classList.add('fade-out');

    entityCard.addEventListener('animationend', () => this.remove(), {
      once: true,
    });
  }
}