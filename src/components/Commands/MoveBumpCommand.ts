import { Able } from './Types/Able';
import { Act } from './Act';
import { CommandBase } from './CommandBase';
import { GameState } from '../Builder/Types/GameState';
import { GameMap } from '../MapModel/GameMap';
import { HitCommand } from './HitCommand';
import { MapCell } from '../MapModel/MapCell';
import { MagnetismHandler } from '../Utilities/MagnetismHandler';
import { Mob } from '../Mobs/Mob';
import { MoveCommand } from './MoveCommand';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command to conditionally call a MoveCommand or a HitCommand.
 */
export class MoveBumpCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }

  /**
   * Determines if a mob is able to perform a certain action.
   *
   * @param {Mob} mob - The mob performing the action.
   * @param {GameState} game - The game object.
   * @param {Act} act - The action being performed.
   * @returns {Able} An object indicating if the mob is able to perform the action and if it uses a turn.
   */
  public able(mob: Mob, game: GameState, act: Act): Able {
    return { isAble: true, usesTurn: false };
  }

  /**
   * Executes the function and returns a boolean value.
   *
   * @return {boolean} the result of the function execution
   */
  public execute(): boolean {
    const { game, me, dir } = this;

    const currentPosition = me.pos;
    const newPosition = currentPosition.plus(dir);
    const map = <GameMap>game.currentMap();

    this.checkForConfusion(game, this.dir);

    if (!this.isPositionLegal(map, newPosition)) return false;

    const cell = map.cell(newPosition);
    const canGetStuckInWall = false; // Determines whether a magnet can pull an entity towards a wall and using a turn. Mobs should set this to false.
    const magnetizedPos = MagnetismHandler.getMagnetizedPosition(
      map,
      currentPosition,
      newPosition,
      game.rand,
      canGetStuckInWall,
    );

    if (magnetizedPos) {
      return new MoveCommand(magnetizedPos, me, game).turn();
    }

    this.executeMoveOrHit(cell, me, game);

    return true;
  }

  /**
   * Checks if the mob is confused.
   *
   * @param {GameState} game - The game object for handling randomness.
   * @param {WorldPoint} direction - The direction to update.
   * @return {void} This function does not return anything.
   */
  private checkForConfusion(game: GameState, direction: WorldPoint): void {
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
   * @param {GameState} game - The game object.
   * @return {boolean} Returns the result of the move or hit action.
   */
  private executeMoveOrHit(cell: MapCell, mob: Mob, game: GameState): boolean {
    return cell.mob
      ? new HitCommand(mob, cell.mob, game).turn()
      : new MoveCommand(this.dir, mob, game).turn();
  }
}
