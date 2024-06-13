import { DrawableTerminal } from './Interfaces/DrawableTerminal';
import { InteractiveScreen } from './Interfaces/InteractiveScreen';
import { Stack } from './Interfaces/Stack';
import { StackScreen } from './Interfaces/StackScreen';
import { EventManager } from '../Events/EventManager';

/**
 * Represents a stack of interactive screens in the game.
 * Each screen in the stack is capable of drawing on the terminal and handling keyboard events.
 */
export class ScreenStack implements Stack, InteractiveScreen {
  name: string = 'stack';
  currentScreen: StackScreen[] = [];
  /**
   * Remove and return the last element from the currentScreen array, as well as remove the screen from the DOM.
   */
  pop() {
    this.removeScreen();
    return this.currentScreen.pop();
  }
  /**
   * Push a new screen onto the stack.
   *
   * @param {StackScreen} screen - the screen to push onto the stack
   */
  push(screen: StackScreen) {
    this.currentScreen.push(screen);
  }
  /**
   * Get the current screen.
   *
   * @return {StackScreen} the current screen
   */
  getCurrentScreen(): StackScreen {
    return this.currentScreen[this.currentScreen.length - 1];
  }

  /**
   * Draws the current screen on the terminal, if there is one.
   *
   * @param {DrawableTerminal} term - the screen to be drawn
   */
  drawScreen(term: DrawableTerminal) {
    const currentScreen = this.getCurrentScreen();
    if (currentScreen) {
      currentScreen.drawScreen(term);
    }
  }

  removeScreen() {
    const currentScreenElement = document.getElementById(
      this.getCurrentScreen().name,
    );
    if (currentScreenElement) {
      currentScreenElement.classList.add('animate__fadeOut');
      currentScreenElement.addEventListener(
        'animationend',
        () => currentScreenElement.remove(),
        { once: true },
      );
    }
  }

  /**
   * Handle key down event.
   *
   * @param {KeyboardEvent} event - The keyboard event to handle
   */
  handleKeyDownEvent(event: KeyboardEvent) {
    const currentScreen = this.getCurrentScreen();
    if (currentScreen) {
      currentScreen.handleKeyDownEvent(event, this);
    }
  }

  /**
   * A method that determines if the screen should be updated based on time.
   *
   * @return {boolean} Returns `true` if the screen should be updated, `false` otherwise.
   */
  onTime(): boolean {
    let change = false;
    const s = this.getCurrentScreen();
    if (s) change = s.onTime(this);
    return change;
  }

  /**
   * Runs the StackScreen by pushing it onto the ScreenStack and running it with the EventManager.
   *
   * @param {StackScreen} sScreen - the StackScreen to be run
   * @return {void}
   */
  static run_StackScreen(sScreen: StackScreen): void {
    const stack = new ScreenStack();
    stack.push(sScreen);
    EventManager.runWithInteractiveScreen(stack);
  }
}
