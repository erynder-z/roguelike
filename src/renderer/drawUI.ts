import { BuffsDisplay } from '../ui/buffs/buffsDisplay';
import { DrawableTerminal } from '../types/terminal/drawableTerminal';
import { EnvironmentChecker } from '../gameLogic/environment/environmentChecker';
import { EquipmentDisplay } from '../ui/equipment/equipmentDisplay';
import { EventCategory, LogMessage } from '../gameLogic/messages/logMessage';
import { FlashDisplay } from '../ui/flashDisplay/flashDisplay';
import { gameConfigManager } from '../gameConfigManager/gameConfigManager';
import { GameMapType } from '../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../types/gameBuilder/gameState';
import { Glyph } from '../gameLogic/glyphs/glyph';
import { GlyphInfo } from '../gameLogic/glyphs/glyphInfo';
import { GlyphMap } from '../gameLogic/glyphs/glyphMap';
import { ImageHandler } from '../utilities/imageHandler/imageHandler';
import { MapCell } from '../maps/mapModel/mapCell';
import { MapRenderer } from './mapRenderer';
import { MessagesDisplay } from '../ui/messages/messagesDisplay';
import { StatsDisplay } from '../ui/stats/statsDisplay';
import { TerminalPoint } from '../terminal/terminalPoint';
import { WorldPoint } from '../maps/mapModel/worldPoint';

/**
 * Handles drawing/updating the game map and UI elements.
 */
export class DrawUI {
  static outside: MapCell = new MapCell(Glyph.Unknown);
  /**
   * Draws a map on a drawable terminal. The whole map is visible.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {GameMapType} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   */
  private static drawMapFullyVisible(
    term: DrawableTerminal,
    map: GameMapType,
    vp: WorldPoint,
  ) {
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
   * @param {GameMapType} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameState} game - The game object.
   */
  private static drawMap(
    term: DrawableTerminal,
    map: GameMapType,
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
   * @param {GameMapType} map - the map to draw
   * @param {WorldPoint} player_pos - the position of the player
   * @param {GameState} game - the game interface
   */
  public static drawMapWithPlayerCentered(
    term: DrawableTerminal,
    map: GameMapType,
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
    const nEA = game.equipment?.armorClass_reduce()?.toFixed(2);
    const nAC = game.equipment?.armorClass();
    const nAP = game.equipment?.weaponDamage();

    const statsDisplay = document.querySelector(
      'stats-display',
    ) as StatsDisplay;
    if (statsDisplay) statsDisplay.setStats(hp, maxhp, lvl, nEA, nAC, nAP);

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
    const gameConfig = gameConfigManager.getConfig();
    const { log } = game;

    const messageCount = gameConfig.message_count;

    const messageLog = log.archive.slice(-messageCount);

    const messagesDisplay = document.querySelector(
      'messages-display',
    ) as MessagesDisplay;
    if (messagesDisplay) messagesDisplay.setMessages(messageLog);
  }

  /**
   * Handles displaying an image based on the current event in the game log.
   * @param {GameState} game - The game state containing the current event.
   * @return {void} This function does not return anything.
   */
  public static renderActionImage(game: GameState): void {
    const gameConfig = gameConfigManager.getConfig();
    const shouldShowImages = gameConfig.show_images;

    if (!shouldShowImages) return;

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
   * @param {GameMapType} map - The game map
   * @param {Function} callback - The function to apply to each cell
   */
  private static forEachCellInMap(
    map: GameMapType,
    callback: (w: WorldPoint, map: GameMapType) => void,
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
   * @param {GameMapType} map - The game map to apply effects to
   * @return {void} This function does not return anything.
   */
  public static addEnvironmentAreaEffectsToCells(map: GameMapType): void {
    this.forEachCellInMap(map, (w, map) => {
      const cell = map.cell(w);
      EnvironmentChecker.addCellEffects(cell, w, map);
    });
  }

  /**
   * Debug draw the map on the terminal with the player's position centered. GameMapType is completely visible.
   *
   * @param {DrawableTerminal} term - the terminal to draw on
   * @param {GameMapType} map - the map to draw
   * @param {WorldPoint} playerPos - the position of the player
   */
  public static debugDrawMap(
    term: DrawableTerminal,
    map: GameMapType,
    playerPos: WorldPoint,
  ) {
    if (!playerPos) playerPos = new WorldPoint();

    const viewport: WorldPoint = new WorldPoint(
      -Math.floor(term.dimensions.x * 0.5) + playerPos.x,
      -Math.floor(term.dimensions.y * 0.5) + playerPos.y,
    );
    this.drawMapFullyVisible(term, map, viewport);
  }
}
