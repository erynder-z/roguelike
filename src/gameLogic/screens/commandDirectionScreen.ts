import { BaseScreen } from './baseScreen';
import { Command } from '../../types/gameLogic/commands/command';
import { DrawableTerminal } from '../../terminal/types/drawableTerminal';
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
    game: GameState,
    make: ScreenMaker,
  ) {
    super(game, make);
  }

  /**
   * Draws a message asking for input.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  public drawScreen(term: DrawableTerminal) {
    super.drawScreen(term);
    term.drawText(0, 0, 'Which direction?', 'yellow', 'black');

    const table = [
      ['↖', ' ', '↑', ' ', '↗'],
      [' ', '7', '8', '9', ' '],
      ['←', '4', ' ', '6', '→'],
      [' ', '1', '2', '3', ' '],
      ['↙', ' ', '↓', ' ', '↘'],
    ];

    const startX = 0;
    const startY = 2;
    const cellWidth = 1;
    const cellHeight = 1;

    table.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const x = cellIndex * cellWidth + startX;
        const y = rowIndex * cellHeight + startY;
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
    switch (event.key) {
      case '4':
        direction.x = -1;
        break;

      case '6':
        direction.x = 1;
        break;

      case '8':
        direction.y = -1;
        break;

      case '2':
        direction.y = 1;
        break;

      case '7':
        direction.x = -1;
        direction.y = -1;
        break;

      case '9':
        direction.x = 1;
        direction.y = -1;
        break;

      case '1':
        direction.x = -1;
        direction.y = 1;
        break;

      case '3':
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
