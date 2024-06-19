import { GameIF } from '../Builder/Interfaces/GameIF';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { LogMessage } from '../Messages/LogMessage';
import { BuffColors } from '../UI/BuffColors';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  private colorizer: BuffColors;
  constructor(
    game: GameIF,
    make: ScreenMaker,
    public name: string = 'log-screen',
    public messageLog: LogMessage[] = [],
  ) {
    super(game, make);
    this.messageLog = game.log.archive;
    this.colorizer = new BuffColors();
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
   * Creates a log screen element using a DocumentFragment.
   *
   * @return {HTMLDivElement} The created log screen element.
   */
  private createLogScreen(): HTMLDivElement {
    const logScreen = document.createElement('div');
    logScreen.id = 'log-screen';
    logScreen.classList.add('log-screen', 'fade-in');

    const fragment = document.createDocumentFragment();
    const heading = this.createHeading();
    const messageList = this.createMessageList();

    fragment.appendChild(heading);
    fragment.appendChild(messageList);
    logScreen.appendChild(fragment);

    return logScreen;
  }

  private fadeOutLogScreen(): void {
    const logScreenElement = document.getElementById('log-screen');
    if (logScreenElement) logScreenElement.classList.add('fade-out');
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
    const fragment = document.createDocumentFragment();

    this.messageLog.slice(-100).forEach(m => {
      const listItem = document.createElement('li');
      listItem.textContent = m.message;
      this.colorizer.colorBuffs(listItem);
      fragment.appendChild(listItem);
    });

    messageList.appendChild(fragment);
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
      this.fadeOutLogScreen();
      stack.pop();
      return true;
    }

    return false;
  }
}
