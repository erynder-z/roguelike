import { CommandBase } from './CommandBase';
import { Command } from './Types/Command';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { LogMessage } from '../Messages/LogMessage';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command for interacting with doors in the game.
 */
export class DoorCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameState,
    public direction: WorldPoint = new WorldPoint(),
  ) {
    super(me, game);
  }

  /**
   * Sets the direction for the command.
   * @param {WorldPoint} direction - The direction to set.
   * @returns {Command} The command object.
   */
  public setDirection(direction: WorldPoint): Command {
    this.direction = direction;
    return this;
  }

  /**
   * Executes the door command.
   * @returns {boolean} True if the command is executed successfully, false otherwise.
   */
  public execute(): boolean {
    const position = this.me.pos;
    const door = position.plus(this.direction);
    const map = <Map>this.game.currentMap();
    const cell = map.cell(door);

    const defaultMsg = new LogMessage(
      'There is no door there.',
      EventCategory.unable,
    );

    switch (cell.env) {
      case Glyph.Door_Closed:
        cell.env = Glyph.Door_Open;
        break;
      case Glyph.Door_Open:
        cell.env = Glyph.Door_Closed;
        break;

      default:
        this.game.flash(defaultMsg);
        return false;
    }
    this.message(cell.env);
    return true;
  }

  /**
   * Displays a message about the door action.
   * @param {Glyph} env - The environment of the door.
   */
  private message(env: Glyph): void {
    const { game } = this;

    const open = env === Glyph.Door_Open;
    const action = open ? 'opens' : 'closes';
    const who = this.me.name;

    const msg = new LogMessage(
      `${who} ${action} the door.`,
      EventCategory.door,
    );

    game.message(msg);
  }
}
