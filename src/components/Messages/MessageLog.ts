import { LogMessage, MessageCategory } from './LogMessage';

/**
 * Represents a message log for storing and managing messages.
 */
export class MessageLog {
  queue: LogMessage[] = [];
  archive: LogMessage[] = [];
  currentEvent: MessageCategory = MessageCategory.none;

  /**
   * Adds a message to the log.
   * @param {LogMessage} msg - The message to add.
   * @param {boolean} isFlashMsg - True if the message is a flash message, otherwise false.
   * @returns {void}
   */
  message(msg: LogMessage, isFlashMsg: boolean): void {
    /*    this.queue.push(s); */
    if (!isFlashMsg) this.archive.push(msg);
    if (isFlashMsg) this.queue.push(msg);
  }
  /**
   * Removes the oldest message from the queue.
   * @returns {void}
   */
  dequeue(): void {
    this.queue.shift();
  }

  /**
   * Retrieves the oldest message from the queue.
   * @returns {LogMessage} - The oldest message in the queue, or '-' if the queue is empty.
   */
  top(): LogMessage {
    return this.empty()
      ? new LogMessage('', MessageCategory.none)
      : this.queue[0];
  }

  /**
   * Clears all messages from the queue.
   * @returns {void}
   */
  clearQueue(): void {
    this.queue = [];
  }

  /**
   * Checks if there are queued messages.
   * @returns {boolean} - True if there are queued messages, otherwise false.
   */
  hasQueuedMessages(): boolean {
    return this.len() > 1;
  }

  /**
   * Returns the number of messages in the queue.
   * @returns {number} - The number of messages in the queue.
   */
  len(): number {
    return this.queue.length;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} - True if the queue is empty, otherwise false.
   */
  empty(): boolean {
    return !this.queue.length;
  }
  /**
   * Sets the current event.
   * @param {LogMessage} msg - The message be set as the current event.
   * @returns {void}
   */
  addCurrentEvent(evt: MessageCategory): void {
    this.currentEvent = evt;
  }

  /**
   * Removes the current event by setting it to a new LogMessage with an empty message and unknown category.
   *
   * @return {void} This function does not return a value.
   */
  removeCurrentEvent(): void {
    this.currentEvent = MessageCategory.none;
  }
}
