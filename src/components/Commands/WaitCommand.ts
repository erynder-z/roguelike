import { CommandBase } from './CommandBase';

/**
 * Represents a wait command that extends the functionality of the base command.
 */
export class WaitCommand extends CommandBase {
  /**
   * Executes the wait command.
   * @returns {boolean} Always returns true.
   */
  execute(): boolean {
    console.log('wait');
    return true;
  }
}
