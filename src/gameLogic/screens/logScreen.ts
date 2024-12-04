import { BaseScreen } from './baseScreen';
import { GameState } from '../../types/gameBuilder/gameState';
import { LogMessage } from '../messages/logMessage';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { LogScreenDisplay } from '../../ui/logScreenDisplay/logScreenDisplay';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  public name: string = 'log-screen';
  private display: LogScreenDisplay | null = null;

  constructor(
    public game: GameState,
    public make: ScreenMaker,
    private messageLog: LogMessage[] = game.log.archive,
  ) {
    super(game, make);
  }

  /**
   * Renders the log screen via a custom component.
   */
  public drawScreen(): void {
    const container = document.getElementById(
      'canvas-container',
    ) as HTMLDivElement;
    if (!this.display) {
      this.display = document.createElement(
        'log-screen-display',
      ) as LogScreenDisplay;
      container.appendChild(this.display);
    }
    this.display.log = this.messageLog;
    this.display.menuKeyText = this.activeControlScheme.menu.toString();
  }

  /**
   * Handles key down events and fades out the screen if the menu key is pressed.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {boolean} True if the event is handled, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    if (event.key === this.activeControlScheme.menu.toString()) {
      this.fadeOutAndRemove(stack);
      return true;
    }
    return false;
  }

  /**
   * Fades out the log screen display and removes it from the DOM. Then it pops the current screen from the stack.
   * @param {Stack} stack - The stack of screens.
   * @returns {Promise<void>} A promise that resolves when the fade out animation ends.
   */
  private async fadeOutAndRemove(stack: Stack): Promise<void> {
    if (this.display) {
      await this.display.fadeOut();

      this.display.remove();

      stack.pop();
    }
  }
}
