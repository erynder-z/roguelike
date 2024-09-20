import { FlashDecoratorDataEntry } from '../FlashDecoratorTypes';
import { MessageLog } from '../../Messages/MessageLog';

/**
 * Utility class to add styling to flash messages.
 */
export class FlashDecorator {
  /**
   * Adds a span element to the given fragment with a message indicating
   * how many messages are in the message log's queue.
   *
   * @param {DocumentFragment} fragment - The fragment to add the span to.
   * @param {MessageLog} log - The message log to check for queued messages.
   *
   * @return {void}
   */
  public addMoreSpanToFragment(
    fragment: DocumentFragment,
    log: MessageLog,
  ): void {
    const numberOfQueueMessages: number = log.len() - 1;
    const s =
      numberOfQueueMessages >= 2
        ? `(+${numberOfQueueMessages} more messages)`
        : `(+${numberOfQueueMessages} more message)`;
    const moreSpan = document.createElement('span');
    moreSpan.textContent = s;
    moreSpan.classList.add('more-span');
    fragment.appendChild(moreSpan);
  }

  /**
   * Replaces occurrences of names in the given fragment with colored spans.
   * The spans are given a class name based on the type of name and the name itself.
   *
   * @param {DocumentFragment} fragment - The fragment to modify.
   * @param {FlashDecoratorDataEntry[]} data - The array of objects containing the names to replace.
   * @param {string} type - The type of name (e.g. 'mob', 'item', 'env').
   *
   * @return {void}
   */
  public colorizeNames(
    fragment: DocumentFragment,
    data: FlashDecoratorDataEntry[],
    type: 'mob' | 'corpse' | 'item' | 'env',
  ): void {
    // Create a regex that matches any occurrence of the names in the given array
    // with word boundaries.
    const names = data.map(entry => entry.name);
    const regex = new RegExp(`\\b(${names.join('|')})\\b`, 'i');

    // Iterate over all the child nodes of the given fragment.
    fragment.childNodes.forEach(child => {
      // If the child is a text node, replace the text with a new fragment
      // that contains the same text but with the names replaced with colored spans.
      if (child instanceof Text) {
        const text = child.textContent;
        const frag = document.createDocumentFragment();
        let lastIndex = 0;

        let found = false;

        // Iterate over all matches of the regex in the text.
        text?.replace(regex, (match, name, index) => {
          // If we have already found a match, skip this iteration.
          if (found) return match;

          // Add the text from the last match to the current index to the fragment.
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex, index)),
          );

          // Create a new span element with the class name based on the name and type.
          const span = document.createElement('span');
          span.textContent = match;
          span.classList.add(`${this.sanitizeClassName(name)}-${type}-span`);
          frag.appendChild(span);

          found = true;

          // Update the index to the position after the current match.
          lastIndex = index + match.length;
          return match;
        });

        // Add the text from the last index to the end of the text to the fragment.
        if (text?.slice(lastIndex)) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // Replace the child node in the fragment with the new fragment.
        fragment.replaceChild(frag, child);
      }
    });
  }

  /**
   * Creates a style block in the given ShadowRoot and adds style rules
   * for each entry in the given data array.
   *
   * Each rule is of the form `.id-type-span { color: fgCol; font-weight: bold; }`
   * and is inserted at the end of the stylesheet.
   *
   * @param {ShadowRoot} shadowRoot - The ShadowRoot to create the style block in.
   * @param {FlashDecoratorDataEntry[]} data - The array of objects containing the ids and fgCols to use.
   * @param {string} type - The type of name (e.g. 'mob', 'item', 'env').
   *
   * @return {void}
   */
  public createStyles(
    shadowRoot: ShadowRoot,
    data: FlashDecoratorDataEntry[],
    type: string,
  ): void {
    const style = document.createElement('style');
    shadowRoot.appendChild(style);

    data.forEach(entry => {
      const className = `${this.sanitizeClassName(entry.name)}-${type}-span`;
      const cssRule = `.${className} { color: ${entry.fgCol}; font-weight: bold; }`;

      style.sheet?.insertRule(cssRule, style.sheet.cssRules.length);
    });
  }

  /**
   * Sanitizes a string for use as a class name.
   * - Converts to lower case
   * - Replaces one or more spaces with a single underscore
   * - Replaces any non-alphanumeric characters with an underscore
   * @param {string} name - The string to sanitize.
   * @returns {string} The sanitized string.
   */
  private sanitizeClassName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9-]/g, '_');
  };
}
