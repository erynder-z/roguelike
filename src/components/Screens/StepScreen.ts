import { BaseScreen } from './BaseScreen';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { GameState } from '../Builder/Types/GameState';
import { ScreenMaker } from './Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { Step } from '../Stepper/Types/Step';

/**
 * Represents a screen that displays a timed step that damages a mob at its current position.
 */
export class StepScreen extends BaseScreen {
  public name = 'step-screen';
  constructor(
    game: GameState,
    make: ScreenMaker,
    public step: Step | null,
  ) {
    super(game, make);
  }

  /**
   * Handles the key down event.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack.
   * @return {boolean} True if the event was handled successfully, false otherwise.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    return false;
  }

  /**
   * Draws the screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which to draw the screen.
   * @return {void} No return value.
   */
  public drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
  }

  /**
   * Executes the onTime function.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns true if the step is not null and the step is executed successfully, otherwise false.
   * @throws {string} Throws an error if the step is null.
   */
  public onTime(stack: Stack): boolean {
    if (this.step == null) throw 'step is null';
    this.step = this.step.executeStep();
    if (this.step) return true;

    this.pop_and_runNPCLoop(stack);

    return true;
  }
}
