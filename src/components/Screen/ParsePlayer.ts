import { GameIF } from '../../interfaces/Builder/Game';
import { Command } from '../../interfaces/Commands/Command';
import { Map } from '../../interfaces/Map/Map';
import { ScreenMaker } from '../../interfaces/Screen/ScreenMaker';
import { Stack } from '../../interfaces/Terminal/Stack';
import { MoveBumpCommand } from '../Commands/MoveBumpCommand';
import { MoveCommand } from '../Commands/MoveCommand';
import { WaitCommand } from '../Commands/WaitCommand';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';

/**
 * Class responsible for parsing player input and converting it into game commands.
 */
export class ParsePlayer {
  public player: Mob;
  public map: Map;
  /**
   * Constructor for initializing game and screen maker.
   *
   * @param {GameIF} game - the game interface
   * @param {ScreenMaker} make - the screen maker
   */
  constructor(
    public game: GameIF,
    public make: ScreenMaker,
  ) {
    this.player = <Mob>game.player;
    this.map = <Map>game.currentMap();
  }

  /**
   * Converts the keyboard event to the corresponding code, taking into account specific cases for arrow and numpad keys.
   *
   * @param {KeyboardEvent} event - the keyboard event to convert
   * @return {string} the corresponding key code
   */
  static keyPressToCode(event: KeyboardEvent): string {
    let keyCode: string = event.key;
    switch (event.code) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Numpad1':
      case 'Numpad2':
      case 'Numpad3':
      case 'Numpad4':
      case 'Numpad5':
      case 'Numpad6':
      case 'Numpad7':
      case 'Numpad8':
      case 'Numpad9':
        keyCode = event.code;
        break;
    }
    return keyCode;
  }
  /**
   * Parses the given key code as a turn and executes the corresponding command.
   *
   * @param {string} char - the character representing the key code
   * @param {Stack} stack - the stack to manipulate
   * @param {KeyboardEvent | null} event - the keyboard event associated with the key press, or null
   * @return {boolean} true if the command was successfully executed, false otherwise
   */
  parseKeyCodeAsTurn(
    char: string,
    stack: Stack,
    event: KeyboardEvent | null,
  ): boolean {
    const cmd = this.parseKeyCommand(char, stack, event);
    return cmd ? cmd.execute() : false;
  }

  /**
   * Parses the key command and returns the corresponding command, or null if no command is found.
   *
   * @param {string} char - the character representing the key command
   * @param {Stack} stack - the stack object
   * @param {KeyboardEvent | null} event - the keyboard event, or null if not available
   * @return {Command | null} the corresponding command, or null if no command is found
   */
  parseKeyCommand(
    char: string,
    stack: Stack,
    event: KeyboardEvent | null,
  ): Command | null {
    const dir = new WorldPoint();
    switch (char) {
      case 'ArrowLeft':
      case 'Numpad4':
        dir.x = -1;
        break;
      case 'ArrowRight':
      case 'Numpad6':
        dir.x = 1;
        break;
      case 'ArrowUp':
      case 'Numpad8':
        dir.y = -1;
        break;
      case 'ArrowDown':
      case 'Numpad2':
        dir.y = 1;
        break;
      case 'Numpad7':
        dir.y = -1;
        dir.x = -1;
        break;
      case 'Numpad9':
        dir.y = -1;
        dir.x = 1;
        break;
      case 'Numpad1':
        dir.y = 1;
        dir.x = -1;
        break;
      case 'Numpad3':
        dir.y = 1;
        dir.x = 1;
        break;
      case '.':
      case 'Numpad5':
        return this.waitCmd();
    }
    if (!dir.isEmpty()) return this.moveBumpCmd(dir);
    return null;
  }

  /**
   * Creates a new MoveCommand with the given direction, player, and game.
   *
   * @param {WorldPoint} dir - the direction to move
   * @return {Command} the newly created MoveCommand
   */
  moveCmd(dir: WorldPoint): Command {
    return new MoveCommand(dir, this.player, this.game);
  }

  /**
   * Executes the wait command.
   *
   * @return {Command} the wait command
   */
  waitCmd(): Command {
    return new WaitCommand(this.player, this.game);
  }

  /**
   * Creates a new MoveBumpCommand with the given direction, player, and game.
   *
   * @param {WorldPoint} dir - the direction to move
   * @return {Command} the newly created MoveBumpCommand
   */
  moveBumpCmd(dir: WorldPoint): Command {
    return new MoveBumpCommand(dir, this.player, this.game);
  }
}
