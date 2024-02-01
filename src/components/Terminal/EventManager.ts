import { RawScreenInterface } from './RawScreenInterface';
import { ResizingTerminal } from './ResizingTerminal';

/**
 * Manages events such as keyboard input and window resizing for a terminal application.
 *
 */
export class EventManager {
  /**
   * Creates an instance of EventManager.
   *
   * @param {ResizingTerminal} term - The resizing terminal to be managed.
   * @param {RawScreenInterface} screen - The raw screen interface to be associated with the manager.
   */
  constructor(
    public term: ResizingTerminal,
    public screen: RawScreenInterface,
  ) {
    // Attach event listeners to relevant elements
    const bodyElement = document.getElementById('body1');
    bodyElement?.addEventListener('keydown', this.handleKeyDown.bind(this));

    window.addEventListener('resize', this.handleResize.bind(this));
  }

  /**
   * Handles the window resize event by adjusting the resizing terminal and updating the raw screen.
   *
   */
  handleResize(): void {
    this.term.handleResize();
    this.screen.drawTerminal(this.term);
  }

  /**
   * Handles the keyboard input event by updating the raw screen based on the input.
   *
   * @param {KeyboardEvent} event - The keyboard event to be handled.
   */
  handleKeyDown(event: KeyboardEvent): void {
    this.screen.handleKeyDownEvent(event);
    this.screen.drawTerminal(this.term);
  }

  /**
   * Creates and runs an EventManager instance with a provided raw screen interface.
   *
   * @static
   * @param {RawScreenInterface} rawScreen - The raw screen interface to be associated with the manager.
   * @returns The created EventManager instance.
   */
  static runWithRawScreen(rawScreen: RawScreenInterface): EventManager {
    return new EventManager(
      ResizingTerminal.createStockResizingTerminal(),
      rawScreen,
    );
  }
}
