/**
 * Represents a message log for storing and managing messages.
 */
export class MessageLog {
  queue: string[] = [];
  archive: string[] = [];

  /**
   * Adds a message to the log.
   * @param {string} s - The message to add.
   * @returns {void}
   */
  message(s: string, isFlashMsg: boolean): void {
    console.log(isFlashMsg);
    this.queue.push(s);
    if (!isFlashMsg) this.archive.push(s);
    console.log(s);
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
   * @returns {string} - The oldest message in the queue, or '-' if the queue is empty.
   */
  top(): string {
    return this.empty() ? '-' : this.queue[0];
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
}
