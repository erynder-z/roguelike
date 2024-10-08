import { buildParameters } from '../../buildParameters/buildParameters';
import { GameState } from '../Builder/Types/GameState';
import { PostMortem } from '../Stats/PostMortem';
import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { ScreenMaker } from './Types/ScreenMaker';

/**
 * Represents a game over screen implementation that is part of a terminal-based application stack.
 */
export class GameOverScreen implements StackScreen {
  public name = 'gameover';
  constructor(
    public game: GameState,
    public make: ScreenMaker,
  ) {}

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

    const innerContainer = document.createElement('div');
    innerContainer.classList.add('post-mortem-container');

    const name = this.createNameElement();
    const heading = this.createHeadingElement();
    const messageList = this.createPostMortem();
    const info = this.createInfo();

    innerContainer.appendChild(name);
    innerContainer.appendChild(heading);
    innerContainer.appendChild(messageList);
    innerContainer.appendChild(info);

    fragment.appendChild(innerContainer);
    gameOverScreen.appendChild(fragment);

    return gameOverScreen;
  }

  /**
   * Creates a new HTMLDivElement for the player's name at the top of the game over screen.
   *
   * @return {HTMLDivElement} The created HTMLDivElement containing the player's name.
   */
  private createNameElement(): HTMLDivElement {
    const nameElement = document.createElement('h1');
    nameElement.textContent = `${this.game.player.name} ✝`;
    nameElement.style.color = buildParameters.player.color;
    return nameElement;
  }

  /**
   * Creates a new HTML heading element.
   *
   * @return {HTMLHeadingElement} The newly created heading element.
   */
  private createHeadingElement(): HTMLHeadingElement {
    const heading = document.createElement('h2');
    heading.textContent = 'Your journey has ended...';
    return heading;
  }

  /**
   * Creates a HTMLDivElement for the post-mortem content.
   *
   * @return {HTMLDivElement} The HTMLDivElement containing the post-mortem content.
   */
  private createPostMortem(): HTMLDivElement {
    const postMortem = document.createElement('div');
    const content = new PostMortem(this.game).generatePostMortemElement();

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

    const beforeText = document.createTextNode('Press ');
    const escapeSpan = document.createElement('span');
    escapeSpan.textContent = 'escape';
    const afterText = document.createTextNode(' to return to title screen.');

    info.appendChild(beforeText);
    info.appendChild(escapeSpan);
    info.appendChild(afterText);

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
