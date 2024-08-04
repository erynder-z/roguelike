import { CommandBase } from './CommandBase';
import { EnvironmentChecker } from '../Environment/EnvironmentChecker';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { LogMessage } from '../Messages/LogMessage';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command to dig through rocks.
 */
export class DigCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }

  /**
   * Executes the dig command. Digging has a 10% chance of success.
   *
   * @return {boolean} Returns true if the dig command was executed successfully, otherwise false.
   */
  public execute(): boolean {
    const { game } = this;
    const { player, rand } = game;

    const map = <Map>game.currentMap();
    const newPosition = player.pos.plus(this.dir);
    const cell = map.cell(newPosition);
    const env = cell.env;
    const isDiggable = GlyphMap.getGlyphInfo(env).isDiggable;

    if (!isDiggable) {
      const msg = new LogMessage('Cannot dig there!', EventCategory.unable);
      game.flash(msg);
      return false;
    }

    const digCellEnv = cell.env;
    const digSuccess = rand.isOneIn(10);

    if (digSuccess) {
      cell.env = Glyph.Floor;
      EnvironmentChecker.clearCellEffectInArea(newPosition, map, digCellEnv);

      const msg = new LogMessage(
        `You dig through the ${GlyphMap.getGlyphInfo(digCellEnv).name}!`,
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
