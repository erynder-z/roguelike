export class LayoutManager {
  private mainContainer: HTMLElement | null;
  private bottomContainer: HTMLElement | null;
  private imageContainer: HTMLElement | null;

  constructor() {
    this.mainContainer = document.getElementById('main-container');
    this.bottomContainer = document.getElementById('bottom-container');
    this.imageContainer = document.getElementById('image-container');
  }

  /**
   * Sets the message display layout within the container.
   *
   * @param {('left' | 'right')} position - The desired position of the message display.
   */
  setMessageDisplayLayout(position: 'left' | 'right'): void {
    if (!this.mainContainer) return;

    const layout = this.getMessageDisplayLayout(position);
    this.mainContainer.style.gridTemplateColumns = layout.columns;
    this.mainContainer.style.gridTemplateAreas = layout.areas;
  }

  /**
   * Sets the image display layout within the bottom container.
   *
   * @param {('left' | 'right')} position - The desired position of the image display.
   */
  setImageDisplayLayout(position: 'left' | 'right'): void {
    if (!this.bottomContainer || !this.imageContainer) return;

    const layout = this.getImageDisplayLayout(position);
    this.bottomContainer.style.gridTemplateColumns = layout.columns;
    this.bottomContainer.style.gridTemplateAreas = layout.areas;
    this.imageContainer.style.justifyContent = layout.justifyContent;
  }

  /**
   * Resets both message and image display layouts to the default (left side).
   */
  resetLayouts(): void {
    this.setMessageDisplayLayout('left');
    this.setImageDisplayLayout('left');
  }

  /**
   * Returns the grid layout configuration for the message panel.
   *
   * @param {('left' | 'right')} position - The message panel position.
   * @return {{ columns: string, areas: string }}
   */
  private getMessageDisplayLayout(position: 'left' | 'right'): {
    columns: string;
    areas: string;
  } {
    if (position === 'left') {
      return {
        columns: '15% 85%',
        areas: `
          'stats stats'
          'messages canvas'
          'bottom bottom'
        `,
      };
    } else {
      return {
        columns: '85% 15%',
        areas: `
          'stats stats'
          'canvas messages'
          'bottom bottom'
        `,
      };
    }
  }

  /**
   * Returns the grid layout configuration for the image panel.
   *
   * @param {('left' | 'right')} position - The image panel position.
   * @return {{ columns: string, areas: string, justifyContent: string }}
   */
  private getImageDisplayLayout(position: 'left' | 'right'): {
    columns: string;
    areas: string;
    justifyContent: string;
  } {
    if (position === 'left') {
      return {
        columns: '15% 25% 60%',
        areas: `'image buffs equipment'`,
        justifyContent: 'flex-start',
      };
    } else {
      return {
        columns: '25% 60% 15%',
        areas: `'buffs equipment image'`,
        justifyContent: 'flex-end',
      };
    }
  }
}
