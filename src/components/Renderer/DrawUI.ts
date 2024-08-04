import { BuffsDisplay } from '../UI/BuffsDisplay';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { EnvironmentChecker } from '../Environment/EnvironmentChecker';
import { EquipmentDisplay } from '../UI/EquipmentDisplay';
import { FlashDisplay } from '../UI/FlashDisplay';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { ImageHandler } from '../ImageHandler/ImageHandler';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { MapCell } from '../MapModel/MapCell';
import { Map } from '../MapModel/Types/Map';
import { MapRenderer } from './MapRenderer';
import { MessagesDisplay } from '../UI/MessagesDisplay';
import { StatsDisplay } from '../UI/StatsDisplay';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Handles drawing/updating the game map and UI elements.
 */
export class DrawUI {
  static outside: MapCell = new MapCell(Glyph.Unknown);
  /**
   * Draws a map on a drawable terminal. The whole map is visible.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {Map} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   */
  private static drawMap0(term: DrawableTerminal, map: Map, vp: WorldPoint) {
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
   * Draws a map with considerations for player position and lighting conditions.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {Map} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameState} game - The game object.
   */
  private static drawMap(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    game: GameState,
  ) {
    MapRenderer.drawMap_RayCast(term, map, vp, playerPos, game);
  }

  /**
   * Draw the map with the player centered.
   *
   * @param {DrawableTerminal} term - the terminal to draw on
   * @param {Map} map - the map to draw
   * @param {WorldPoint} player_pos - the position of the player
   * @param {GameState} game - the game interface
   */
  public static drawMapWithPlayerCentered(
    term: DrawableTerminal,
    map: Map,
    playerPos: WorldPoint,
    game: GameState,
  ) {
    if (!playerPos) playerPos = new WorldPoint();

    const viewport: WorldPoint = new WorldPoint(
      -Math.floor(term.dimensions.x * 0.5) + playerPos.x,
      -Math.floor(term.dimensions.y * 0.5) + playerPos.y,
    );
    this.drawMap(term, map, viewport, playerPos, game);
  }

  /**
   * Renders the player stats on the terminal.
   *
   * @param {GameState} game - the game instance to retrieve player stats from
   * @return {void}
   */
  public static renderStats(game: GameState): void {
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

    const display = `${hpDisplayText} ${nEADisplayText} ${nACDisplayText} ${nAPDisplayText} ${lvlDisplayText}`;

    const statsDisplay = document.querySelector(
      'stats-display',
    ) as StatsDisplay;
    if (statsDisplay) statsDisplay.setStats(display);

    this.renderBuffs(game);
  }

  /**
   * Renders the active buffs of the player on the terminal.
   *
   * @param {GameState} game - the game instance containing the player's buffs
   * @return {void}
   */
  private static renderBuffs(game: GameState): void {
    const playerBuffs = game.player.buffs;
    const buffMap = playerBuffs._map;

    const buffsDisplay = document.querySelector(
      'buffs-display',
    ) as BuffsDisplay;
    if (buffsDisplay) buffsDisplay.setBuffs(buffMap);
  }

  /**
   * Renders the equipment on the terminal based on the provided game state.
   *
   * @param {GameState} game - the game instance containing the equipment state
   * @return {void}
   */
  public static renderEquipment(game: GameState): void {
    const equipment = game.equipment;
    const equipmentDisplay = document.querySelector(
      'equipment-display',
    ) as EquipmentDisplay;
    if (equipmentDisplay) equipmentDisplay.setEquipment(equipment);
  }

  /**
   * Renders the log messages on the terminal.
   *
   * @param {GameState} game - the game instance to retrieve player stats from
   * @return {void}
   */
  public static renderMessage(game: GameState): void {
    const { log } = game;

    const messageLog = log.archive.slice(-25);

    const messagesDisplay = document.querySelector(
      'messages-display',
    ) as MessagesDisplay;
    if (messagesDisplay) messagesDisplay.setMessages(messageLog);
  }

  /**
   * Renders action images based on the current event category in the game.
   *
   * @param {GameState} game - The game state containing information about the current game.
   * @return {void} No return value.
   */
  public static renderActionImage(game: GameState): void {
    const imageHandler = ImageHandler.getInstance();

    const currentEventCategory = game.log.currentEvent;

    switch (currentEventCategory) {
      case EventCategory.lvlChange:
        imageHandler.handleLevelImageDisplay(game);
        break;
      case EventCategory.attack:
        imageHandler.handleAttackImageDisplay(game);
        break;
      case EventCategory.mobDamage:
        imageHandler.handleAttackImageDisplay(game);
        break;
      case EventCategory.playerDamage:
        imageHandler.handleHurtImageDisplay(game);
        break;
      case EventCategory.mobDeath:
        imageHandler.handleSmileImageDisplay(game);
        break;
      case EventCategory.moving:
        imageHandler.handleMovingImageDisplay(game);
        break;
      case EventCategory.rangedAttack:
        imageHandler.handlePistolImageDisplay(game);
        break;
      case EventCategory.wait:
        imageHandler.handleNeutralImageDisplay(game);
        break;
      case EventCategory.playerDeath:
        imageHandler.handleDeathImageDisplay(game);
        break;
      default:
        break;
    }
  }

  /**
   * Renders a flash message on the screen.
   *
   * @param {GameState} game - The game instance to retrieve the flash message from.
   * @return {void} This function does not return anything.
   */
  public static renderFlash(game: GameState): void {
    const { log } = game;

    if (!log) return;

    const topMessage = log.top();
    const s = topMessage ? topMessage.message : '';

    const flashDisplay = document.querySelector(
      'flash-display',
    ) as FlashDisplay;
    const msg = new LogMessage(s, EventCategory.none);
    if (flashDisplay) flashDisplay.setFlash(msg, log);
  }

  /**
   * Clears the flash message on the screen.
   *
   * @param {GameState} game - The game instance to clear the flash message from.
   * @return {void} This function does not return anything.
   */
  public static clearFlash(game: GameState): void {
    const flashDisplay = document.querySelector(
      'flash-display',
    ) as FlashDisplay;
    if (flashDisplay) flashDisplay.clearFlash(game);
  }

  /**
   * Loops over each cell in the entire map and applies a given function.
   *
   * @param {Map} map - The game map
   * @param {Function} callback - The function to apply to each cell
   */
  private static forEachCellInMap(
    map: Map,
    callback: (w: WorldPoint, map: Map) => void,
  ) {
    const mapDimensions = map.dimensions;
    const w = new WorldPoint();

    for (w.y = 0; w.y < mapDimensions.y; ++w.y) {
      for (w.x = 0; w.x < mapDimensions.x; ++w.x) {
        callback(w, map);
      }
    }
  }

  /**
   * Apply environment area effects to each cell in the map based on the given game state.
   *
   * @param {Map} map - The game map to apply effects to
   * @return {void} This function does not return anything.
   */
  public static addEnvironmentAreaEffectsToCells(map: Map): void {
    this.forEachCellInMap(map, (w, map) => {
      const cell = map.cell(w);
      EnvironmentChecker.addCellEffects(cell, w, map);
    });
  }
}
