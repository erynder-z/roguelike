import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { ScreenMaker } from './Types/ScreenMaker';

/**
 * Represents a game over screen implementation that is part of a terminal-based application stack.
 */
export class GameOverScreen implements StackScreen {
  public name = 'gameover';
  constructor(public make: ScreenMaker) {}

  /**
   * Draws the game over screen if it hasn't already been drawn.
   *
   * @return {void} This function does not return anything.
   */
  public drawScreen(): void {
    const container = document.getElementById(
      'canvas-container',
    ) as HTMLDivElement;
    if (container.querySelector('#gameover-screen')) return;

    const gameOverScreen = this.createGameOverScreen();
    container.appendChild(gameOverScreen);
  }

  /**
   * Creates a game over screen element using a DocumentFragment.
   *
   * @return {HTMLDivElement} The created game over screen element.
   */
  private createGameOverScreen(): HTMLDivElement {
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'gameover-screen';
    gameOverScreen.classList.add('gameover-screen', 'fade-in');

    const fragment = document.createDocumentFragment();
    const heading = this.createHeading();
    const messageList = this.createPostMortem();
    const info = this.createInfo();

    fragment.appendChild(heading);
    fragment.appendChild(messageList);
    fragment.appendChild(info);
    gameOverScreen.appendChild(fragment);

    return gameOverScreen;
  }

  /**
   * Creates a new HTML heading element.
   *
   * @return {HTMLHeadingElement} The newly created heading element.
   */
  private createHeading(): HTMLHeadingElement {
    const heading = document.createElement('h1');
    heading.textContent = 'Game Over';
    return heading;
  }

  /**
   * Creates a HTMLDivElement for the post-mortem content.
   *
   * @return {HTMLDivElement} The HTMLDivElement containing the post-mortem content.
   */
  private createPostMortem(): HTMLDivElement {
    const postMortem = document.createElement('div');
    /*   const content = PostMorgemGenerator.generate(); */

    const content = document.createElement('p');
    content.classList.add('post-mortem-text');
    content.textContent =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

    postMortem.appendChild(content);
    return postMortem;
  }

  /**
   * Creates an HTMLDivElement element.
   *
   * @return {HTMLDivElement} The created HTMLDivElement element.
   */
  private createInfo(): HTMLDivElement {
    const info = document.createElement('div');
    info.classList.add('gameover-info');
    info.textContent = 'Press escape to return to title screen.';
    return info;
  }

  /**
   * Removes the game over screen from the document.
   *
   * @return {void} This function does not return anything.
   */
  private removeGameOverScreen(): void {
    const gameOverScreen = document.getElementById('gameover-screen');
    if (gameOverScreen) {
      gameOverScreen.remove();
    }
  }

  /**
   * Determines if the screen should be updated based on time.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns `true` if the screen should be updated, `false` otherwise.
   */
  public onTime(): boolean {
    return false;
  }

  /**
   * Handles a key down event, checking if the escape key is pressed and performing actions accordingly.
   *
   * @param {KeyboardEvent} event - The keyboard event to handle.
   * @param {Stack} stack - The current stack of screens.
   * @return {void}
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    if (event.key === 'Escape') {
      this.removeGameOverScreen();
      stack.pop();
      this.make.titleScreen();
    }
  }
}
