import { buildParameters } from '../../buildParameters/buildParameters';
import corpseData from '../Mobs/MobData/corpses.json';
import envData from '../Environment/EnvironmentData/environment.json';
import { FlashDecorator } from './FlashDecorator';
import { GameState } from '../Builder/Types/GameState';
import { LogMessage } from '../Messages/LogMessage';
import { MessageLog } from '../Messages/MessageLog';
import itemData from '../ItemObjects/ItemData/items.json';
import mobData from '../Mobs/MobData/mobs.json';

export class FlashDisplay extends HTMLElement {
  private decorator: FlashDecorator;
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    this.decorator = new FlashDecorator(shadowRoot);

    const templateElement = document.createElement('template');
    templateElement.innerHTML = `
      <style>
        * {
          margin: var(--margin);
          padding: var(--padding);
          box-sizing: var(--box-sizing);
        }

        * {
          scrollbar-width: var(--scrollbar-width);
          scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
        }

        ::selection {
          color: var(--selection-color);
          background-color: var(--selection-background);
        }

        :host {
          position: absolute;
          left: 0;
          bottom: 0;
        }

        .flash-display {
          padding: 1rem 1.5rem;
          color: var(--white);
          font-size: 1.25rem;
        }

        .more-span {
          font-weight: bold;
        }
      </style>
      <div class="flash-display"></div>
    `;

    shadowRoot.appendChild(templateElement.content.cloneNode(true));
  }

  /**
   * Sets the flash message display.
   * @param {LogMessage} msg - The message to set.
   * @param {MessageLog} log - The message log to check for queued messages.
   * @returns {void}
   */
  public setFlash(msg: LogMessage, log: MessageLog): void {
    const flashDisplay = <HTMLElement>(
      this.shadowRoot?.querySelector('.flash-display')
    );

    if (flashDisplay) {
      flashDisplay.innerHTML = '';
      const fragment = document.createDocumentFragment();

      const textNode = document.createTextNode(msg.message);
      fragment.appendChild(textNode);

      this.decorateFlashDisplay(fragment, log);
      flashDisplay.appendChild(fragment);
    }
  }

  /**
   * Decorates the given DocumentFragment with colored names and a message
   * indicating if there are more messages queued.
   *
   * @param {DocumentFragment} fragment - The fragment to modify.
   * @param {MessageLog} log - The message log to check for queued messages.
   * @return {void}
   */
  private decorateFlashDisplay(
    fragment: DocumentFragment,
    log: MessageLog,
  ): void {
    this.decorator.createStyles(itemData.items, 'item');
    this.decorator.createStyles(corpseData.corpses, 'corpse');
    this.decorator.createStyles(mobData.mobs, 'mob');
    this.decorator.createStyles(envData.environment, 'env');
    this.decorator.createStyles(buildParameters.player.color);

    this.decorator.colorize(fragment, itemData.items, 'item');
    this.decorator.colorize(fragment, corpseData.corpses, 'corpse');
    this.decorator.colorize(fragment, mobData.mobs, 'mob');
    this.decorator.colorize(fragment, envData.environment, 'env');
    this.decorator.colorize(fragment, buildParameters.player.name);

    if (log.hasQueuedMessages())
      // More than 1 message in queue
      this.decorator.addMoreSpanToFragment(fragment, log);
  }

  /**
   * Clears the flash message display.
   * @param {GameState} game - The game state.
   * @returns {void}
   */
  public clearFlash(game: GameState): void {
    game.log.clearQueue();

    const flashDisplay = this.shadowRoot?.querySelector('.flash-display');
    if (flashDisplay) flashDisplay.textContent = '';
  }
}
