import { GameIF } from '../Builder/Interfaces/Game';
import { Command } from './Interfaces/Command';
import { Map } from '../MapModel/Interfaces/Map';
import { Glyph } from '../Glyphs/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a command for interacting with doors in the game.
 */
export class DoorCommand extends CommandBase {
  direction: WorldPoint = new WorldPoint();

  /**
   * Creates an instance of DoorCommand.
   * @param {Mob} me - The mob performing the command.
   * @param {GameIF} game - The game interface.
   */
  constructor(
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Sets the direction for the command.
   * @param {WorldPoint} direction - The direction to set.
   * @returns {Command} The command object.
   */
  setDirection(direction: WorldPoint): Command {
    this.direction = direction;
    return this;
  }

  /**
   * Executes the door command.
   * @returns {boolean} True if the command is executed successfully, false otherwise.
   */
  execute(): boolean {
    const p = this.me.pos;
    const door = p.plus(this.direction);
    const map = <Map>this.game.currentMap();
    const cell = map.cell(door);
    switch (cell.env) {
      case Glyph.Door_Closed:
        cell.env = Glyph.Door_Open;
        break;
      case Glyph.Door_Open:
        cell.env = Glyph.Door_Closed;
        break;

      default:
        this.game.flash("There's no door there.");
        return false;
    }
    this.message(cell.env);
    return true;
  }

  /**
   * Displays a message about the door action.
   * @param {Glyph} env - The environment of the door.
   */
  message(env: Glyph): void {
    const open = env === Glyph.Door_Open;
    const action = open ? 'opens' : 'closes';
    const who = this.me.name;

    this.game.message(`${who} ${action} the door.`);
  }
}
