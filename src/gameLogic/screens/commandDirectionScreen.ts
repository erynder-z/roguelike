import { BaseScreen } from './baseScreen';
import { Command } from '../../types/gameLogic/commands/command';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

/**
 * Represents a screen for selecting a direction for a command.
 */
export class CommandDirectionScreen extends BaseScreen {
  public name = 'command-direction-screen';
  constructor(
    public command: Command,
    public game: GameState,
    public make: ScreenMaker,
  ) {
    super(game, make);
  }

  /**
   * Converts a numpad key string to its corresponding numeric character.
   * @param {string} key - The key string to convert.
   * @return {string} The numeric character if the key is a numpad key, otherwise the original key.
   */
  private convertNumpadKey(key: string): string {
    if (key.startsWith('Numpad')) {
      const num = key.replace('Numpad', '');
      return !isNaN(Number(num)) ? num : key;
    }
    return key;
  }
  /**
   * Draws a message asking for input.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  public drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);

    term.drawText(0, 0, 'Which direction?', 'yellow', 'black');

    const table = this.getDirectionTable();
    this.drawTable(term, table, 0, 2);
  }

  /**
   * Creates the direction control table.
   */
  private getDirectionTable(): string[][] {
    const convert = (key: string) => this.convertNumpadKey(key.toString());

    return [
      ['↖', ' ', '↑', ' ', '↗'],
      [
        ' ',
        convert(this.activeControlScheme.move_up_left.toString()),
        convert(this.activeControlScheme.move_up.toString()),
        convert(this.activeControlScheme.move_up_right.toString()),
        ' ',
      ],
      [
        '←',
        convert(this.activeControlScheme.move_left.toString()),
        ' ',
        convert(this.activeControlScheme.move_right.toString()),
        '→',
      ],
      [
        ' ',
        convert(this.activeControlScheme.move_down_left.toString()),
        convert(this.activeControlScheme.move_down.toString()),
        convert(this.activeControlScheme.move_down_right.toString()),
        ' ',
      ],
      ['↙', ' ', '↓', ' ', '↘'],
    ];
  }

  /**
   * Draws a table on the terminal.
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @param {string[][]} table - The table to draw.
   * @param {number} startX - Starting X coordinate.
   * @param {number} startY - Starting Y coordinate.
   */
  private drawTable(
    term: DrawableTerminal,
    table: string[][],
    startX: number,
    startY: number,
  ): void {
    table.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const x = startX + cellIndex;
        const y = startY + rowIndex;
        term.drawText(x, y, cell, 'white', '#025');
      });
    });
  }

  /**
   * Handles key down event for selecting direction.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack of screens.
   * @returns {boolean} True if the event is handled, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    stack.pop();
    const direction = new WorldPoint();

    const char = this.controlSchemeManager.keyPressToCode(event);
    switch (char) {
      case this.activeControlScheme.move_left.toString():
        direction.x = -1;
        break;

      case this.activeControlScheme.move_right.toString():
        direction.x = 1;
        break;

      case this.activeControlScheme.move_up.toString():
        direction.y = -1;
        break;

      case this.activeControlScheme.move_down.toString():
        direction.y = 1;
        break;

      case this.activeControlScheme.move_up_left.toString():
        direction.x = -1;
        direction.y = -1;
        break;

      case this.activeControlScheme.move_up_right.toString():
        direction.x = 1;
        direction.y = -1;
        break;

      case this.activeControlScheme.move_down_left.toString():
        direction.x = -1;
        direction.y = 1;
        break;

      case this.activeControlScheme.move_down_right.toString():
        direction.x = 1;
        direction.y = 1;
        break;

      default:
        break;
    }
    if (!direction.isEmpty()) this.actInDirection(direction);
    return true;
  }

  /**
   * Executes the command in the selected direction.
   * @param {WorldPoint} direction - The selected direction.
   */
  private actInDirection(direction: WorldPoint) {
    return this.command.setDirection(direction).turn();
  }
}
