import { Act } from './Act';
import { Buff } from '../Buffs/BuffEnum';
import { BuffCommand } from './BuffCommand';
import { CommandBase } from './CommandBase';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { ItemObject } from '../ItemObjects/ItemObject';
import { LogMessage } from '../Messages/LogMessage';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { StairCommand } from './StairCommand';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a move command that moves a mob in the game.
 */
export class MoveCommand extends CommandBase {
  constructor(
    public dir: WorldPoint,
    public me: Mob,
    public game: GameState,
    public act: Act = Act.Move,
  ) {
    super(me, game);
  }
  /**
   * Executes the move command for the mob.
   *
   * @returns {boolean} Whether the move was successful or not.
   */
  public execute(): boolean {
    const newPosition = this.dir.plus(this.me.pos);
    const map = <Map>this.game.currentMap();

    if (this.isMoveLegal(map, newPosition)) {
      this.moveAndHandleExtras(map, newPosition);
      this.applyCellEffects(map, newPosition);
    }

    if (this.me.isPlayer) {
      this.game.addCurrentEvent(EventCategory.moving);
    }

    return !map.isBlocked(newPosition);
  }

  /**
   * Checks if a move is legal based on the provided map and position.
   *
   * @param {Map} map - The map object representing the game world.
   * @param {WorldPoint} position - The position to check if it is legal to move to.
   * @return {boolean} Returns true if the move is legal, false otherwise.
   */
  private isMoveLegal(map: Map, position: WorldPoint): boolean {
    return !map.isBlocked(position);
  }

  /**
   * Applies cell effects based on the given map and position.
   *
   * @param {Map} map - The game map to apply cell effects on.
   * @param {WorldPoint} position - The position on the map to apply effects to.
   */
  private applyCellEffects(map: Map, position: WorldPoint): void {
    if (map.cell(position).isCausingSlow()) {
      new BuffCommand(Buff.Slow, this.me, this.game, this.me, 2).execute();
    }
    if (map.cell(position).isCausingBurn()) {
      new BuffCommand(Buff.Lava, this.me, this.game, this.me).execute();
    }
    if (map.cell(position).isCausingBleed()) {
      new BuffCommand(Buff.Bleed, this.me, this.game, this.me, 5).execute();
    }
    if (map.cell(position).isCausingPoison()) {
      new BuffCommand(Buff.Poison, this.me, this.game, this.me, 5).execute();
    }
  }

  /**
   * Moves the mob to the specified position and handles any additional actions if the mob is a player.
   *
   * @param {Map} map - The game map representing the game world.
   * @param {WorldPoint} position - The position to move the mob to.
   * @return {void} This function does not return a value.
   */
  private moveAndHandleExtras(map: Map, position: WorldPoint): void {
    this.moveMobAndResetCounter(map, position);
    if (this.me.isPlayer) {
      this.dealWithStairs(map, position);
      this.flashIfItem();
    }
  }

  /**
   * Moves the mob to the specified position and resets the counter for the number of turns since the last move.
   *
   * @param {Map} map - The game map representing the game world.
   * @param {WorldPoint} position - The position to move the mob to.
   * @return {void} This function does not return a value.
   */
  private moveMobAndResetCounter(map: Map, position: WorldPoint): void {
    this.me.sinceMove = 0;
    map.moveMob(this.me, position);
  }

  /**
   * Deals with stairs in the map.
   *
   * @param {Map} map - The game map representing the game world.
   * @param {WorldPoint} position - The position to check for stairs.
   * @return {void} This function does not return a value.
   */
  private dealWithStairs(map: Map, position: WorldPoint): void {
    const cell = map.cell(position);
    let direction: number | null = null;

    if (cell.env === Glyph.StairsDown) {
      direction = 1;
    } else if (cell.env === Glyph.StairsUp) {
      direction = -1;
    }

    if (direction !== null) {
      new StairCommand(direction, this.game).raw();
    }
  }

  /**
   * Checks if there is an item at the player's current position and flashes a message if there is.
   *
   * @return {void} This function does not return anything.
   */
  private flashIfItem(): void {
    const map: Map = <Map>this.game.currentMap();
    const playerPosition: WorldPoint = this.game.player.pos;
    const item: ItemObject | undefined = map.cell(playerPosition).obj;

    if (item) {
      const message = new LogMessage(
        `${item.description()} is lying here`,
        EventCategory.layingObject,
      );
      this.game.message(message);
    }
  }
}
