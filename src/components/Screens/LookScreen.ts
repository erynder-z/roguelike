import { BaseScreen } from './BaseScreen';
import { Buff } from '../Buffs/BuffEnum';
import { CanSee } from '../Utilities/CanSee';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { DrawUI } from '../Renderer/DrawUI';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { Map } from '../MapModel/Types/Map';
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
   * Draws the screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @return {void} No return value.
   */
  public drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
    term.drawAt(
      this.cursorPos.x,
      this.cursorPos.y,
      '●',
      'fuchsia',
      '#00000000',
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
    const { stats } = game;
    const isBlind = buffs && buffs.is(Buff.Blind);
    const isFar =
      pos.squaredDistanceTo(playerPos) > stats.currentVisRange && !isBlind;

    return (
      !isFar && !isBlind && CanSee.checkPointLOS_RayCast(playerPos, pos, map)
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
    const pos = new WorldPoint(x, y);
    const map = this.game.currentMap()!;
    const playerPos = this.game.player.pos;

    const isVisible = this.isPointVisible(pos, map, playerPos, this.game);

    if (isVisible) {
      const cell = map.cell(pos);
      console.log(cell);
      const mob = cell?.mob;
      const item = cell?.obj;
      const env = cell?.env ? Glyph[cell.env] : '';

      return mob
        ? `A lvl ${mob.level} ${mob.name}.`
        : item
          ? `A ${item.description()}.`
          : env;
    } else {
      return 'Not visible!';
    }
  }

  /**
   * Displays the provided information on the screen.
   *
   * @param {string} s - The information to display.
   * @param {DrawableTerminal} term - The terminal to draw on.
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
