import { GlyphMap } from '../../gameLogic/glyphs/glyphMap';
import { LookScreenEntity } from '../../types/ui/lookScreenEntity';

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
          border-radius: 10px;
          animation: fade-in 0.1s;
          z-index: 999;
        }

        .entity-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: bold;
        }

        .entity-glyph {
          margin: 0;
          font-size: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.5rem;
          height: 2.5rem;
          padding: 0.75rem;
          background-color: var(--whiteTransparent);
        }

        .entity-description {
          margin: 0;
          font-size: 1rem;
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
      <div class="entity-card">
        <div class="entity-title"></div>
        <div class=entity-glyph></div>
        <div class="entity-description"></div>
      </div>
    `;

    shadowRoot?.appendChild(templateElement.content.cloneNode(true));
  }

  public fillCardDetails(entity: LookScreenEntity): void {
    const entityTitle = this.shadowRoot?.querySelector(
      '.entity-title',
    ) as HTMLElement;
    const entityGlyph = this.shadowRoot?.querySelector(
      '.entity-glyph',
    ) as HTMLElement;
    const entityDescription = this.shadowRoot?.querySelector(
      '.entity-description',
    ) as HTMLElement;

    if (!entityTitle || !entityDescription || !entityGlyph) return;

    const glyphInfo = GlyphMap.getGlyphInfo(entity.glyph);

    entityTitle.textContent = entity.name;
    entityGlyph.textContent = glyphInfo.char;
    entityGlyph.style.color = glyphInfo.fgCol;

    entityDescription.textContent = entity.description;
  }

  public fadeOutAndRemove(): void {
    const entityCard = this.shadowRoot?.querySelector('.entity-card');
    if (!entityCard) return;

    entityCard.classList.add('fade-out');

    entityCard.addEventListener('animationend', () => this.remove(), {
      once: true,
    });
  }
}
