import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to dig through rocks or walls.
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
  execute(): boolean {
    const game = this.g;
    const player = game.player;
    const map = <MapIF>game.currentMap();
    const np = player.pos.plus(this.dir);
    const cell = map.cell(np);
    const e = cell.env;

    if (e != Glyph.Wall && e != Glyph.Rock) {
      game.flash('Cannot dig there.');
      return false;
    }

    const rand = this.g.rand;
    const digSuccess = rand.isOneIn(10);

    if (digSuccess) {
      cell.env = Glyph.Floor;
      game.message('You broke through the rock!');
    } else {
      game.flash('Digging...');
    }
    return true;
  }
}
