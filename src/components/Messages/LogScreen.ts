import { GameIF } from '../Builder/Interfaces/GameIF';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from '../Screens/BaseScreen';
import { LogMessage } from './LogMessage';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  name: string = 'log-screen';
  messageLog: LogMessage[];

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
   * Renders the log screen on the terminal.
   */
  drawScreen(): void {
    const container = document.getElementById(
      'canvas-container',
    ) as HTMLDivElement;
    if (container.querySelector('#log-screen')) return;

    const logScreen = this.createLogScreen();
    container.appendChild(logScreen);
  }

  /**
   * Creates a log screen element.
   *
   * @return {HTMLDivElement} The created log screen element.
   */
  private createLogScreen(): HTMLDivElement {
    const logScreen = document.createElement('div');
    logScreen.id = 'log-screen';
    logScreen.classList.add('log-screen', 'fade-in');

    const heading = this.createHeading();
    logScreen.appendChild(heading);

    const messageList = this.createMessageList();
    logScreen.appendChild(messageList);

    return logScreen;
  }

  private fadeOutLoqScreen(): void {
    const inventoryScreenElement = document.getElementById('log-screen');
    if (inventoryScreenElement)
      inventoryScreenElement.classList.add('fade-out');
  }

  /**
   * Creates a new HTML heading element with the text content 'Log: (Showing last 100 messages. Press q to close.)'.
   *
   * @return {HTMLHeadingElement} The newly created heading element.
   */
  private createHeading(): HTMLHeadingElement {
    const heading = document.createElement('h1');
    heading.textContent = 'Log: (Showing last 100 messages. Press q to close.)';
    return heading;
  }

  /**
   * Creates an HTML unordered list element containing the last 100 messages from the message log.
   *
   * @return {HTMLUListElement} The created message list element.
   */
  private createMessageList(): HTMLUListElement {
    const messageList = document.createElement('ul');
    this.messageLog.slice(-100).forEach(m => {
      const listItem = document.createElement('li');
      listItem.textContent = m.message;
      messageList.appendChild(listItem);
    });
    return messageList;
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    if (event.key === 'q') {
      this.fadeOutLoqScreen();
      stack.pop();
      return true;
    }

    return false;
  }
}
