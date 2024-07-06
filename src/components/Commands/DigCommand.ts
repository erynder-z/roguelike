import { CommandBase } from './CommandBase';
import { EventCategory } from '../Messages/LogMessage';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { LogMessage } from '../Messages/LogMessage';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { Mob } from '../Mobs/Mob';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command to dig through rocks.
 */
export class DigCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public g: GameIF,
  ) {
    super(me, g);
  }

  /**
   * Executes the dig command. Digging has a 10% chance of success.
   *
   * @return {boolean} Returns true if the dig command was executed successfully, otherwise false.
   */
  public execute(): boolean {
    const game = this.g;
    const player = game.player;
    const map = <MapIF>game.currentMap();
    const np = player.pos.plus(this.dir);
    const cell = map.cell(np);
    const e = cell.env;
    const isDiggable = GlyphMap.getGlyphInfo(e).isDiggable;

    if (!isDiggable) {
      const msg = new LogMessage('Cannot dig there!', EventCategory.unable);
      game.flash(msg);
      return false;
    }

    const rand = this.g.rand;
    const digSuccess = rand.isOneIn(10);

    if (digSuccess) {
      cell.env = Glyph.Floor;
      const msg = new LogMessage(
        'You broke through the rock!',
        EventCategory.dig,
      );
      game.message(msg);
    } else {
      const msg = new LogMessage('Digging...', EventCategory.dig);
      game.flash(msg);
    }
    return true;
  }
}
