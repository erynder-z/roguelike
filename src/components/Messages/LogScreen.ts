import { GameIF } from '../Builder/Interfaces/Game';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from '../Screens/BaseScreen';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  name: string = 'LogScreen';
  messageLog: string[];

  /**
   * Creates an instance of LogScreen.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} make - The screen maker.
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
    this.messageLog = game.log.archive;
  }

  /**
   * Draws the log screen on the terminal.
   * @param {DrawableTerminal} term - The drawable terminal.
   * @returns {void}
   */
  drawScreen(term: DrawableTerminal): void {
    const existingLogScreen = document.getElementById('log-screen');
    if (existingLogScreen) {
      return;
    }

    const logScreen = document.createElement('div');
    logScreen.id = 'log-screen';
    logScreen.classList.add('log-screen');

    const h1Element = document.createElement('h1');
    h1Element.innerText = 'Log: (Showing last 100 messages. Press q to close.)';
    logScreen.appendChild(h1Element);

    const olElement = document.createElement('ul');
    logScreen.appendChild(olElement);

    const last100Messages = this.messageLog.slice(-100);
    last100Messages.forEach(msg => {
      const listItem = document.createElement('li');
      listItem.textContent = msg;
      olElement.appendChild(listItem);
    });

    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer?.appendChild(logScreen);
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    if (event.key === 'q') {
      const logScreen = document.getElementById('log-screen');
      if (logScreen) {
        logScreen.remove();
        stack.pop();
        return true;
      }
    }
    return false;
  }
}
