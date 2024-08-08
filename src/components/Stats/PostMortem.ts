import { GameState } from '../Builder/Types/GameState';

/**
 * Creates a post mortem element with the game stats.
 */
export class PostMortem {
  constructor(public game: GameState) {}

  /**
   * Generates a post-mortem element for the player's stats.
   *
   * @return {HTMLElement} The generated post-mortem element.
   */
  public generatePostMortemElement(): HTMLElement {
    const {
      turnCounter,
      damageDealtCounter,
      damageReceivedCounter,
      mobKillCounter,
    } = this.game.stats;
    const { level } = this.game.dungeon;

    const container = this.createElement('div', 'post-mortem', [
      this.createListItem('You survived until turn ', turnCounter),
      this.createListItem('You reached Dungeon Level ', level),
      this.createElement('h2', '', 'During your adventure:'),
      this.createElement('ul', '', [
        this.createDetailedListItem(
          'You dealt a total of ',
          damageDealtCounter,
          ' damage to enemies.',
        ),
        this.createDetailedListItem(
          'You received ',
          damageReceivedCounter,
          ' damage from various sources.',
        ),
        this.createDetailedListItem(
          'You managed to defeat ',
          mobKillCounter,
          ' enemies.',
        ),
      ]),
      this.createElement(
        'p',
        '',
        'Reflect on your journey and prepare for your next adventure!',
      ),
    ]);

    return container;
  }

  /**
   * Creates an HTML element with the specified tag, class name, and content.
   *
   * @param {string} tag - The tag name of the element to create.
   * @param {string} [className=''] - The class name to add to the element. Default is an empty string.
   * @param {string | HTMLElement[]} [content=''] - The content to add to the element. Can be a string or an array of HTMLElements. Default is an empty string.
   * @return {HTMLElement} The created HTML element.
   */
  private createElement(
    tag: string,
    className: string = '',
    content: string | HTMLElement[] = '',
  ): HTMLElement {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      content.forEach(child => element.appendChild(child));
    }
    return element;
  }

  /**
   * Creates a new list item element with the given text and value.
   *
   * @param {string} text - The text to be displayed in the list item.
   * @param {number} value - The value to be displayed in the list item.
   * @return {HTMLLIElement} The newly created list item element.
   */
  private createListItem(text: string, value: number): HTMLLIElement {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(text));
    item.appendChild(this.createSpanElement(value.toString()));
    return item as HTMLLIElement;
  }

  /**
   * Creates a new list item element with the given text, value, and detail.
   *
   * @param {string} text - The text to be displayed in the list item.
   * @param {number} value - The value to be displayed in the list item.
   * @param {string} detail - The detail to be displayed in the list item.
   * @return {HTMLLIElement} The newly created list item element.
   */
  private createDetailedListItem(
    text: string,
    value: number,
    detail: string,
  ): HTMLLIElement {
    const item = document.createElement('li');
    item.appendChild(document.createTextNode(text));
    item.appendChild(this.createSpanElement(value.toString()));
    item.appendChild(document.createTextNode(detail));
    return item as HTMLLIElement;
  }

  /**
   * Creates a span element with the specified content.
   *
   * @param {string} content - The text content of the span element.
   * @return {HTMLElement} The newly created span element.
   */
  private createSpanElement(content: string): HTMLElement {
    const span = document.createElement('span');
    span.textContent = content;
    return span;
  }
}
