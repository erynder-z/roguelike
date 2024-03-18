import { GameIF } from '../Builder/Interfaces/Game';
import { Map } from '../MapModel/Interfaces/Map';
import { Glyph } from '../Glyphs/Glyph';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { StairCommand } from './StairCommand';

/**
 * Represents a move command that extends the functionality of the base command.
 */
export class MoveCommand extends CommandBase {
  /**
   * Constructor for initializing the class with the given parameters.
   *
   * @param {WorldPoint} dir - the world point
   * @param {Mob} me - the mob
   * @param {GameIF} game - the game interface
   */
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Executes the move command without checking for obstacles.
   * @returns {boolean} Always returns true.
   */
  execute0(): boolean {
    const map = <Map>this.game.currentMap();
    const np = this.dir.plus(this.me.pos);
    map.moveMob(this.me, np);
    return true;
  }

  /**
   * Executes the move command, checking for obstacles.
   * @returns {boolean} True if the move is legal and executed successfully, otherwise false.
   */
  execute(): boolean {
    const map = <Map>this.game.currentMap();
    const np = this.dir.plus(this.me.pos);
    const legal = !map.isBlocked(np);
    if (legal) {
      map.moveMob(this.me, np);
      if (this.me.isPlayer) {
        this.dealWithStairs(map, np);
      }
    }
    return legal;
  }

  /**
   * Deals with stairs after the move, if the player has encountered stairs.
   * @param {Map} map - The map object.
   * @param {WorldPoint} np - The new position after the move.
   * @returns {void}
   */
  dealWithStairs(map: Map, np: WorldPoint): void {
    let dir: number;

    switch (map.cell(np).env) {
      case Glyph.StairsDown:
        dir = 1;
        break;
      case Glyph.StairsUp:
        dir = -1;
        break;
      default:
        return;
    }
    new StairCommand(dir, this.game).raw();
  }
}
