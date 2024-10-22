export class LayoutManager {
  private container: HTMLElement | null =
    document.getElementById('main-container');

  constructor() {}

  /**
   * Sets the message display layout within the container.
   *
   * Depending on the value of the messageDisplay parameter, the method adjusts
   * the grid template columns and areas of the container to position the messages
   * either on the left or the right side of the canvas.
   *
   * @param {('left' | 'right')} messageDisplay - The desired position of the message display.
   * @return {void}
   */
  setMessageDisplayLayout(messageDisplay: 'left' | 'right'): void {
    if (!this.container) return;

    const gridTemplateColumns =
      messageDisplay === 'left' ? '15% 85%' : '85% 15%';

    const gridTemplateAreas =
      messageDisplay === 'left'
        ? `
          'stats stats'
          'messages canvas'
          'bottom bottom'
        `
        : `
          'stats stats'
          'canvas messages'
          'bottom bottom'
        `;

    this.container.style.gridTemplateColumns = gridTemplateColumns;
    this.container.style.gridTemplateAreas = gridTemplateAreas;
  }

  /**
   * Resets the message display layout to the default left side.
   *
   * @return {void}
   */
  resetMessageDisplayLayout(): void {
    this.setMessageDisplayLayout('left');
  }
}
