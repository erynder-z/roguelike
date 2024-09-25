import { BaseScreen } from './BaseScreen';
import { Buff } from '../Buffs/BuffEnum';
import { CanSee } from '../Utilities/CanSee';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { DrawUI } from '../Renderer/DrawUI';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Map } from '../MapModel/Types/Map';
import { MapCell } from '../MapModel/MapCell';
import { ScreenMaker } from './Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a screen for looking at the player's surroundings.
 */
export class LookScreen extends BaseScreen {
  public name = 'look-screen';

  private readonly neutralPos = new WorldPoint(32, 16);
  private readonly playerPos = new WorldPoint(
    this.game.player.pos.x,
    this.game.player.pos.y,
  );
  private cursorPos: WorldPoint;
  private lookPos: WorldPoint;

  constructor(game: GameState, make: ScreenMaker) {
    super(game, make);
    this.cursorPos = this.neutralPos;
    this.lookPos = this.playerPos;
  }

  /**
   * Draws the look screen on the provided drawable terminal.
   *
   * The look screen displays the cell information at the position of the player
   * and draws an overlay cursor at the position of the cursor.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @return {void} No return value.
   */
  public drawScreen(term: DrawableTerminal): void {
    const cursorBgCol = '#F0F8FF';
    const opacityFactor = 0.3;
    const cursorEdgeCol = '#F0F8FF';
    const borderThickness = 5;
    const cornerSize = 1;

    super.drawScreen(term);
    term.drawOverlayCursor(
      this.cursorPos.x,
      this.cursorPos.y,
      cursorBgCol,
      opacityFactor,
      cursorEdgeCol,
      borderThickness,
      cornerSize,
    );

    const s = this.getCellInfo(this.lookPos.x, this.lookPos.y);
    if (s) this.displayInfo(s);
  }

  /**
   * Determines if a point is visible on the map based on player position, game stats, and visibility buffs.
   *
   * @param {WorldPoint} pos - The position of the point to check for visibility.
   * @param {Map} map - The map object containing the point.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameState} game - The game object containing the player and game stats.
   * @return {boolean} Returns true if the point is visible, false otherwise.
   */
  private isPointVisible(
    pos: WorldPoint,
    map: Map,
    playerPos: WorldPoint,
    game: GameState,
  ): boolean {
    const { buffs } = game.player;
    const isBlind = buffs && buffs.is(Buff.Blind);
    const farDist = CanSee.getFarDist(playerPos, map, game);

    return (
      !isBlind &&
      CanSee.isDistanceSmallerThan(pos, playerPos, farDist) &&
      CanSee.checkPointLOS_RayCast(playerPos, pos, map)
    );
  }

  /**
   * Retrieves information about a cell at the specified coordinates.
   *
   * @param {number} x - The x-coordinate of the cell.
   * @param {number} y - The y-coordinate of the cell.
   * @return {string | null} The information about the cell. Returns 'Not visible!' if the cell is not visible.
   */
  private getCellInfo(x: number, y: number): string | null {
    const point = new WorldPoint(x, y);
    const map = this.game.currentMap()!;
    const playerPosition = this.game.player.pos;
    const cell = map.cell(point);
    const isVisible = this.isPointVisible(
      point,
      map,
      playerPosition,
      this.game,
    );

    if (isVisible) {
      return this.generateMessageVisibleCell(cell);
    } else {
      return this.generateMessageNotVisibleCell();
    }
  }

  /**
   * Retrieves information about a cell that is visible.
   *
   * @param {MapCell} cell - The cell to retrieve the information for.
   * @return {string} The information about the cell.
   */
  private generateMessageVisibleCell(cell: MapCell): string {
    const entities = [];
    const { mob, corpse, obj, environment } = cell;
    const isPlayer = mob?.isPlayer;
    const isDownStairsCell = this.game
      .currentMap()
      ?.downStairPos?.isEqual(this.lookPos);
    const isUpStairsCell = this.game
      .currentMap()
      ?.upStairPos?.isEqual(this.lookPos);

    if (isPlayer) entities.push(this.game.player.name);

    if (mob && !isPlayer) entities.push(`a ${mob.name.toLowerCase()}`);

    if (corpse) entities.push(`a ${corpse.name.toLowerCase()}`);

    if (obj) entities.push(`a ${obj.name().toLowerCase()}`);

    let message = 'You see: ';

    if (entities.length > 0) {
      entities[0] = this.capitalizeFirstLetter(entities[0]);

      message += `${entities.join(' and ')} on ${environment.name.toLowerCase()}.`;
    } else {
      message += `${environment.name}. ${environment.description}`;
    }

    if (isDownStairsCell) message += ' A way leading downwards.';

    if (isUpStairsCell) message += ' A way leading upwards.';

    return this.capitalizeFirstLetter(message);
  }

  /**
   * Retrieves information about a cell that is not visible.
   *
   * @return {string} The information about the cell.
   */
  private generateMessageNotVisibleCell(): string {
    return 'Not visible from where you are!';
  }

  /**
   * Capitalizes the first letter of a string.
   *
   * @param {string} str - The string to capitalize.
   * @return {string} The capitalized string.
   */
  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Displays the provided information on the screen.
   *
   * @param {string} s - The information to display.
   * @return {void} No return value.
   */
  private displayInfo(s: string): void {
    DrawUI.clearFlash(this.game);

    const msg = new LogMessage(s, EventCategory.look);
    this.game.flash(msg);

    DrawUI.renderFlash(this.game);
  }

  /**
   * Handles key down events and moves the cursor and look position accordingly.
   *
   * @param {KeyboardEvent} event - The keyboard event that triggered the function.
   * @param {Stack} stack - The stack of screens.
   * @return {void} This function does not return anything.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    const moveCursor = (dx: number, dy: number) => {
      this.cursorPos.x += dx;
      this.cursorPos.y += dy;
      this.lookPos.x += dx;
      this.lookPos.y += dy;
    };
    switch (event.code) {
      case 'ArrowLeft':
      case 'Numpad4':
        moveCursor(-1, 0);
        break;
      case 'ArrowRight':
      case 'Numpad6':
        moveCursor(1, 0);
        break;
      case 'ArrowUp':
      case 'Numpad8':
        moveCursor(0, -1);
        break;
      case 'ArrowDown':
      case 'Numpad2':
        moveCursor(0, 1);
        break;
      case 'Numpad7':
        moveCursor(-1, -1);
        break;
      case 'Numpad9':
        moveCursor(1, -1);
        break;
      case 'Numpad1':
        moveCursor(-1, 1);
        break;
      case 'Numpad3':
        moveCursor(1, 1);
        break;
      case 'KeyL':
        DrawUI.clearFlash(this.game);
        stack.pop();

        break;
    }
  }
}
