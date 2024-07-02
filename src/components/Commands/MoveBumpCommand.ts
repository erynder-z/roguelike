import { GameIF } from '../Builder/Interfaces/GameIF';
import { GameMap } from '../MapModel/GameMap';
import { MapCell } from '../MapModel/MapCell';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { MagnetismHandler } from '../Utilities/MagnetismHandler';
import { Able } from './Interfaces/Able';
import { CommandBase } from './CommandBase';
import { HitCommand } from './HitCommand';
import { MoveCommand } from './MoveCommand';

/**
 * Represents a command to conditionally call a MoveCommand or a HitCommand.
 */
export class MoveBumpCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Determines if a mob is able to perform a certain action.
   *
   * @param {Mob} m - The mob performing the action.
   * @param {GameIF} g - The game interface.
   * @param {Act} act - The action being performed.
   * @returns {Able} An object indicating if the mob is able to perform the action and if it uses a turn.
   */
  public able(m: Mob, g: GameIF, act: Act): Able {
    return { isAble: true, usesTurn: false };
  }

  /**
   * Executes the function and returns a boolean value.
   *
   * @return {boolean} the result of the function execution
   */
  public execute(): boolean {
    const g = this.game;
    const m = this.me;

    this.checkForConfusion(g, this.dir);

    const newPosition = MagnetismHandler.calculateNewPosition(m.pos, this.dir);
    const map = <GameMap>g.currentMap();

    if (!this.isPositionLegal(map, newPosition)) return false;

    const cell = map.cell(newPosition);
    const magnetizedPos = MagnetismHandler.getMagnetizedPosition(
      map,
      m.pos,
      newPosition,
      g.rand,
    );

    if (magnetizedPos) {
      return new MoveCommand(magnetizedPos, m, g).turn();
    }

    return this.executeMoveOrHit(cell, m, g);
  }

  /**
   * Checks if the mob is confused.
   *
   * @param {GameIF} game - The game interface for handling randomness.
   * @param {WorldPoint} direction - The direction to update.
   * @return {void} This function does not return anything.
   */
  private checkForConfusion(game: GameIF, direction: WorldPoint): void {
    this.confused(game, direction);
  }

  /**
   * Checks if the given position is legal on the map.
   *
   * @param {GameMap} map - The game map to check against.
   * @param {WorldPoint} position - The position to check for legality.
   * @return {boolean} True if the position is legal, false otherwise.
   */
  private isPositionLegal(map: GameMap, position: WorldPoint): boolean {
    return map.isLegalPoint(position);
  }

  /**
   * Executes a move or hit action based on the cell being occupied by a mob or not.
   *
   * @param {MapCell} cell - The cell to check for mob presence.
   * @param {Mob} mob - The mob performing the action.
   * @param {GameIF} game - The game interface.
   * @return {boolean} Returns the result of the move or hit action.
   */
  private executeMoveOrHit(cell: MapCell, mob: Mob, game: GameIF): boolean {
    return cell.mob
      ? new HitCommand(mob, cell.mob, game).turn()
      : new MoveCommand(this.dir, mob, game).turn();
  }
}
