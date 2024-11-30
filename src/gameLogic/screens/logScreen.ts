import { BaseScreen } from './baseScreen';
import { BuffColors } from '../../ui/buffs/buffColors';
import { GameState } from '../../types/gameBuilder/gameState';
import { LogMessage } from '../messages/logMessage';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';

/**
 * Represents a screen for displaying the log messages.
 */
export class LogScreen extends BaseScreen {
  public name: string = 'log-screen';
  private colorizer: BuffColors;

  constructor(
    public game: GameState,
    public make: ScreenMaker,
    private messageLog: LogMessage[] = game.log.archive,
  ) {
    super(game, make);

    this.colorizer = new BuffColors();
  }

  /**
   * Renders the log screen on the terminal.
   */
  public drawScreen(): void {
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
    heading.textContent = `Log: (Press ${this.activeControlScheme.menu} to close.)`;
    return heading;
  }

  /**
   * Creates an HTML unordered list element containing all the messages in the message log.
   * The most recent message is added first, so they appear in reverse chronological order.
   *
   * @return {HTMLUListElement} The created message list element.
   */
  private createMessageList(): HTMLUListElement {
    const messageList = document.createElement('ul');
    const fragment = document.createDocumentFragment();

    for (let i = this.messageLog.length - 1; i >= 0; i--) {
      const m = this.messageLog[i];
      const listItem = document.createElement('li');
      listItem.textContent = m.message;
      this.colorizer.colorBuffs(listItem);
      fragment.appendChild(listItem);
    }

    messageList.appendChild(fragment);
    return messageList;
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    if (event.key === this.activeControlScheme.menu.toString()) {
      this.fadeOutLogScreen();
      stack.pop();
      return true;
    }

    return false;
  }
}
