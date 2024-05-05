import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from './Interfaces/MapIF';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { CanSee } from '../Utilities/CanSee';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { MapCell } from './MapCell';
import { WorldPoint } from './WorldPoint';
import { Buff } from '../Buffs/BuffEnum';
import { BuffIF } from '../Buffs/Interfaces/BuffIF';
import { Slot } from '../ItemObjects/Slot';

/**
 * Represents a utility class for drawing a map on a drawable terminal.
 */
export class DrawMap {
  /**
   * Draws a map on a drawable terminal. The whole map is visible.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {MapIF} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   */
  static drawMap0(term: DrawableTerminal, map: MapIF, vp: WorldPoint) {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;

    // Loop through each row and column of the terminal
    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      // Loop through each column of the terminal
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        // Get the cell from the map corresponding to the world point
        const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
        // Get the glyph info for the cell's glyph
        const i: GlyphInfo = GlyphMap.getGlyphInfo(cell.glyph());
        // Draw the glyph on the terminal
        term.drawAt(t.x, t.y, i.char, i.fgCol, i.bgCol);
      }
    }
  }
  /**
   * Represents the map cell used for points outside the map boundaries.
   * @type {MapCell}
   */
  static outside: MapCell = new MapCell(Glyph.Unknown);

  /**
   * Draws a map with considerations for player position and lighting conditions.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {MapIF} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameIF} g - The game interface.
   */
  static drawMap1(
    term: DrawableTerminal,
    map: MapIF,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    // Colors
    const unlitColor: string = '#001';
    const unlitColorSolidBg: string = '#222';
    const farLitColor: string = '#778899';

    // Constants
    const farDist: number = 50;
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);

    // Loop through each row and column of the terminal
    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      // Loop through each column of the terminal
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        // Get the cell from the map corresponding to the world point
        const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
        const distance: number = w.squaredDistanceTo(playerPos);
        const far: boolean = distance > farDist && !blind;

        // Check if the cell contains a visible entity
        const isEntityVisible: boolean =
          !!cell.mob &&
          !far &&
          (!blind || cell.mob.isPlayer) &&
          CanSee.canSee(cell.mob.pos, playerPos, map, true);

        // Determine the glyph based on visibility
        const glyph: Glyph = isEntityVisible
          ? cell.mob!.glyph
          : cell.glyphObjOrEnv();
        const glyphInfo = GlyphMap.getGlyphInfo(glyph);

        // Determine foreground and background colors
        let fg: string;
        let bg: string;

        if (far) {
          bg =
            glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
          fg = cell.lit
            ? cell.env === Glyph.Unknown
              ? glyphInfo.bgCol // use the background color to prevent the whole outside map from popping in when coming near it
              : farLitColor
            : unlitColor;
        } else {
          if (!blind) {
            if (!cell.lit && !blind) cell.lit = true;
            // Check if the cell is visible to the player using raycasting LOS
            const isVisible: boolean = this.raycastLOS(playerPos, w, map);
            bg = isVisible
              ? glyphInfo.bgCol
              : glyphInfo.hasSolidBg && cell.lit
                ? unlitColorSolidBg
                : unlitColor;
            fg = isVisible
              ? glyphInfo.fgCol
              : cell.lit || cell.mob?.isPlayer
                ? cell.env === Glyph.Unknown
                  ? glyphInfo.bgCol
                  : farLitColor
                : unlitColor;
          } else {
            bg =
              glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
            fg =
              cell.lit || cell.mob?.isPlayer
                ? cell.env === Glyph.Unknown
                  ? glyphInfo.bgCol
                  : farLitColor
                : unlitColor;
          }
        }

        term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
      }
    }
  }

  /**
   * Performs raycasting to determine line of sight between two points on the map.
   * @param {WorldPoint} start - The starting point of the LOS check.
   * @param {WorldPoint} end - The ending point of the LOS check.
   * @param {MapIF} map - The map object.
   * @returns {boolean} - True if there is line of sight, otherwise false.
   */
  static raycastLOS(start: WorldPoint, end: WorldPoint, map: MapIF): boolean {
    // Get the differences in coordinates between the start and end points
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    // Determine the direction of movement for the ray (1 or -1)
    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;

    // Error accumulator for adjusting the y coordinate when moving in the x direction
    let err = dx - dy;

    // Current position of the ray
    let x = start.x;
    let y = start.y;

    // Perform raycasting
    while (x !== end.x || y !== end.y) {
      // Check if the current position is inside the map bounds
      if (!map.isLegalPoint(new WorldPoint(x, y))) {
        return false; // Hit map boundary, LOS blocked
      }

      // Check if the current cell blocks LOS
      const cell = map.cell(new WorldPoint(x, y));
      if (cell.isOpaque()) {
        return false; // Cell blocks LOS
      }

      // Adjust the position of the ray based on the error accumulator
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    // No obstacles encountered, LOS is clear
    return true;
  }

  /**
   * Draw the player on the map.
   *
   * @param {DrawableTerminal} term - the terminal to draw on
   * @param {MapIF} map - the map to draw
   * @param {WorldPoint} player_pos - the position of the player
   * @param {GameIF} g - the game interface
   */
  static drawMapPlayer(
    term: DrawableTerminal,
    map: MapIF,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    if (!playerPos) playerPos = new WorldPoint();

    const viewport: WorldPoint = new WorldPoint(
      -Math.floor(term.dimensions.x * 0.5) + playerPos.x,
      -Math.floor(term.dimensions.y * 0.5) + playerPos.y,
    );
    this.drawMap1(term, map, viewport, playerPos, g);
    /* this.drawMap0(term, map, viewport); */
  }

  /**
   * Renders the player stats on the terminal.
   *
   * @param {DrawableTerminal} term - the terminal to render the stats on
   * @param {GameIF} game - the game instance to retrieve player stats from
   * @return {void}
   */
  static renderStats(term: DrawableTerminal, game: GameIF): void {
    const player = game.player;
    const hp = player.hp;
    const maxhp = player.maxhp;
    const lvl = game.dungeon.level;
    const nEA = game.equipment?.armorClass_reduce().toFixed(2);
    const nAC = game.equipment?.armorClass();
    const nAP = game.equipment?.weaponDamage();

    const hpDisplayText = `HP: ${hp}/${maxhp}`;
    const lvlDisplayText = `LVL: ${lvl}`;
    const nEADisplayText = `nEA: ${nEA}`;
    const nACDisplayText = `nAC: ${nAC}`;
    const nAPDisplayText = `nAP: ${nAP}`;

    const statsDisplay = `${hpDisplayText} ${nEADisplayText} ${nACDisplayText} ${nAPDisplayText} ${lvlDisplayText}`;

    const stats = document.getElementById('stats-display');
    if (stats) stats.innerText = statsDisplay;

    this.renderBuffs(term, game);
  }

  static remain(b: BuffIF): number {
    return b.time;
  }

  /**
   * Renders the active buffs of the player on the terminal.
   *
   * @param {DrawableTerminal} terminal - the terminal to render the buffs on
   * @param {GameIF} game - the game instance containing the player's buffs
   * @return {void}
   */
  static renderBuffs(terminal: DrawableTerminal, game: GameIF): void {
    const playerBuffs = game.player.buffs;
    const buffMap = playerBuffs._map;

    const buffList = document.createElement('ul');

    buffMap.forEach((buff, key) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${Buff[key]}: ${this.remain(buff)}`;
      buffList.appendChild(listItem);
    });

    const buffsContainer = document.getElementById('buffs-display');
    while (buffsContainer?.firstChild) {
      buffsContainer.removeChild(buffsContainer.firstChild);
    }

    buffsContainer?.appendChild(buffList);
  }

  /**
   * Renders the equipment on the terminal based on the provided game state.
   *
   * @param {DrawableTerminal} term - the terminal to render the equipment on
   * @param {GameIF} game - the game instance containing the equipment state
   * @return {void}
   */
  static renderEquipment(term: DrawableTerminal, game: GameIF): void {
    const equipment = game.equipment;

    for (let slot = Slot.MainHand; slot < Slot.Last; slot++) {
      const slotElement = document.getElementById(Slot[slot]);
      const itemDescription = equipment?.get(slot)?.description() ?? '';

      if (slotElement) {
        slotElement.textContent = itemDescription ? itemDescription : 'empty';
      }
    }
  }

  /**
   * Renders the log messages on the terminal.
   *
   * @param {DrawableTerminal} term - the terminal to render the stats on
   * @param {GameIF} game - the game instance to retrieve player stats from
   * @return {void}
   */
  static renderMessage(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

    const messageLog = log.archive.slice(-30);

    const ulElement = document.createElement('ul');

    messageLog.forEach(message => {
      const liElement = document.createElement('li');
      liElement.textContent = message;
      ulElement.appendChild(liElement);
    });

    const messagesContainer = document.getElementById('messages-display');
    while (messagesContainer?.firstChild) {
      messagesContainer.removeChild(messagesContainer.firstChild);
    }

    messagesContainer?.appendChild(ulElement);
  }

  static renderFlash(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

    if (!log) return;

    let s = log.top();
    s = this.extend(s, term);

    const x = term.dimensions.x - s.length;
    const y = term.dimensions.y - 1;
    term.drawText(x, y, s, 'yellow', '#00000000');
  }

  /**
   * Use an empty string as the mask.
   * @type {string}
   */
  static mask: string = '';

  /**
   * Extends the given string to fit the terminal width.
   * @param {string} s - The string to extend.
   * @param {DrawableTerminal} term - The terminal.
   * @returns {string} - The extended string.
   */
  static extend(s: string, term: DrawableTerminal): string {
    const dimensions = term.dimensions;

    if (!this.mask) this.mask = ' '.repeat(dimensions.x);

    return s + this.mask.substring(0, dimensions.x - s.length);
  }
}
