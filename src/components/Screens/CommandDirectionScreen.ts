import { GameIF } from '../Builder/Interfaces/GameIF';
import { Command } from '../Commands/Interfaces/Command';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { WorldPoint } from '../MapModel/WorldPoint';
import { BaseScreen } from './BaseScreen';

/**
 * Represents a screen for selecting a direction for a command.
 */
export class CommandDirectionScreen extends BaseScreen {
  name = 'CommandDirectionScreen';

  /**
   * Creates an instance of CommandDirectionScreen.
   * @param {Command} command - The command to be executed with the selected direction.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} make - The screen maker.
   */
  constructor(
    public command: Command,
    game: GameIF,
    make: ScreenMaker,
  ) {
    super(game, make);
  }

  /**
   * Draws a message asking for input.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  drawScreen(term: DrawableTerminal) {
    term.drawText(0, 0, 'Which direction?', 'yellow', 'black');
    const R = [
      '4 left',
      '6 right',
      '8 up',
      '2 down',
      '7 up and left',
      '9 up and right',
      '1 down and left',
      '3 down and right',
    ];

    for (let i = 0; i < R.length; ++i) {
      term.drawText(0, i + 1, R[i], 'white', 'black');
    }
  }

  /**
   * Handles key down event for selecting direction.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack of screens.
   * @returns {boolean} True if the event is handled, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
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
  actInDirection(direction: WorldPoint) {
    return this.command.setDirection(direction).turn();
  }
}
