import { GameIF } from '../Builder/Interfaces/GameIF';
import { StepIF } from '../Stepper/Interfaces/StepIF';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';

/**
 * Represents a screen that displays a timed step that damages a mob at its current position.
 */
export class StepScreen extends BaseScreen {
  name: string = 'step-screen';
  constructor(
    game: GameIF,
    make: ScreenMaker,
    public step: StepIF | null,
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
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    return false;
  }

  /**
   * Draws the screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal on which to draw the screen.
   * @return {void} No return value.
   */
  drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
  }


  /**
   * Executes the onTime function.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns true if the step is not null and the step is executed successfully, otherwise false.
   * @throws {string} Throws an error if the step is null.
   */
  onTime(stack: Stack): boolean {
    if (this.step == null) throw 'step is null';
    this.step = this.step.executeStep();
    if (this.step) return true;

    this.pop_and_runNPCLoop(stack);

    return true;
  }
}