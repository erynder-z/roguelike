import { StackScreen } from './StackScreen';

/**
 * Represents an interface for a stack of screens in the game.
 */
export interface Stack {
  /**
   * Removes the top screen from the stack.
   */
  pop(): void;

  /**
   * Pushes a new screen onto the stack.
   *
   * @param {StackScreen} screen - The screen to be pushed onto the stack.
   */
  push(screen: StackScreen): void;

  /**
   * Retrieves the current top screen from the stack.
   *
   * @returns {StackScreen} The current top screen.
   */
  getCurrentScreen(): StackScreen;
}
