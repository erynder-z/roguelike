import { BaseScreen } from './baseScreen';
import { Buff } from '../buffs/buffEnum';
import { CanSee } from '../../utilities/canSee';
import { Corpse } from '../mobs/corpse';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { DrawUI } from '../../renderer/drawUI';
import { EntityInfoCard } from '../../ui/entityInfoDisplay/entityInfoCard';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { GameState } from '../../types/gameBuilder/gameState';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../glyphs/glyph';
import { ItemObject } from '../itemObjects/itemObject';
import { LookScreenEntity } from '../../types/ui/lookScreenEntity';
import { MapCell } from '../../maps/mapModel/mapCell';
import { Mob } from '../mobs/mob';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

/**
 * Represents a screen for looking at the player's surroundings.
 */
export class LookScreen extends BaseScreen {
  public name = 'look-screen';
  private keyBindings: Map<string, LookScreenEntity> = new Map();
  private isEntityCardOpen = false;

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
   * @param {GameMapType} map - The map object containing the point.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameState} game - The game object containing the player and game stats.
   * @return {boolean} Returns true if the point is visible, false otherwise.
   */
  private isPointVisible(
    pos: WorldPoint,
    map: GameMapType,
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
   * Generates a message describing the contents of a cell if it is visible.
   *
   * @param {MapCell} cell - The cell to generate the message for.
   * @return {string} The generated message.
   */
  private generateMessageVisibleCell(cell: MapCell): string {
    const entities: { uniqueKey: string; entity: LookScreenEntity }[] = [];
    const { mob, corpse, obj, environment } = cell;

    const isDownstairs = this.game
      .currentMap()
      ?.downStairPos?.isEqual(this.lookPos);
    const isUpstairs = this.game
      .currentMap()
      ?.upStairPos?.isEqual(this.lookPos);

    const usedLetters = new Set<string>();

    const getUniqueLetter = (name: string): string => {
      for (const char of name.toLowerCase()) {
        if (!usedLetters.has(char)) {
          usedLetters.add(char);
          return char;
        }
      }
      return '*';
    };

    const addEntity = (name: string, entity: LookScreenEntity) => {
      const letter = getUniqueLetter(name).toLowerCase();
      entities.push({ uniqueKey: letter, entity });
      this.keyBindings.set(letter, entity);
    };

    if (mob) addEntity(mob.name, this.transformIntoLookScreenEntity(mob));
    if (corpse)
      addEntity(corpse.name, this.transformIntoLookScreenEntity(corpse));
    if (obj) addEntity(obj.name(), this.transformIntoLookScreenEntity(obj));

    const environmentKey = getUniqueLetter(environment.name).toLowerCase();
    const environmentDesc = `${environment.name.toLowerCase()} (${environmentKey})`;
    this.keyBindings.set(
      environmentKey,
      this.transformIntoLookScreenEntity(environment),
    );

    let message = 'You see: ';

    if (entities.length > 0) {
      const entityDescriptions = entities
        .map(
          e =>
            `${e.entity.name === this.game.player.name ? '' : 'a '} ${e.entity.name} (${e.uniqueKey})`,
        )
        .join(' and ')
        .concat(` on ${environmentDesc}.`);
      message += this.capitalizeFirstLetter(entityDescriptions);
    } else {
      message += this.capitalizeFirstLetter(`${environmentDesc}.`);
    }

    if (isDownstairs) message = 'You see: A way leading downwards.';
    if (isUpstairs) message = 'You see: A way leading upwards.';

    return message;
  }

  /**
   * Transforms a given entity into a LookScreenEntity representation.
   *
   * @param {Mob | Corpse | ItemObject | MapCell['environment']} entity - The entity to be transformed.
   * @return {Omit<LookScreenEntity, 'uniqueKey'>} The transformed LookScreenEntity object without the unique key.
   *
   * The function identifies the type of entity provided and extracts its relevant properties
   * to create a LookScreenEntity. It handles Mobs, Corpses, ItemObjects, and MapCell environments,
   * assigning appropriate type, glyph, name, description, and other properties specific to the entity type.
   * If the entity type is unrecognized, it defaults to an unknown entity representation.
   */

  private transformIntoLookScreenEntity(
    entity: Mob | Corpse | ItemObject | MapCell['environment'],
  ): Omit<LookScreenEntity, 'uniqueKey'> {
    const baseEntity: Omit<LookScreenEntity, 'uniqueKey'> = {
      type: 'unknown',
      glyph: Glyph.Unknown,
      name: 'Unknown entity',
      description: 'Unknown entity',
    };

    if (entity instanceof Corpse) {
      return {
        ...baseEntity,
        type: 'corpse',
        glyph: entity.glyph,
        name: entity.name,
        description: entity.description,
      };
    } else if (entity instanceof Mob) {
      return {
        ...baseEntity,
        type: 'mob',
        glyph: entity.glyph,
        name: entity.name,
        description: entity.description,
        level: entity.level,
        hp: entity.hp,
        maxHp: entity.maxhp,
      };
    } else if (entity instanceof ItemObject) {
      return {
        ...baseEntity,
        type: 'item',
        glyph: entity.glyph,
        name: entity.name(),
        description: entity.description(),
        level: entity.level,
        charges: entity.charges,
        spell: entity.spell,
      };
    } else if (
      'name' in entity &&
      'description' in entity &&
      'effects' in entity
    ) {
      return {
        ...baseEntity,
        type: 'env',
        glyph: entity.glyph,
        name: entity.name,
        description: entity.description,
        envEffects: entity.effects,
      };
    }

    return baseEntity;
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

  private showEntityDetail(entity: LookScreenEntity): void {
    const canvasContainer = document.getElementById('canvas-container');
    const entityCard = document.createElement(
      'entity-info-card',
    ) as EntityInfoCard;

    if (canvasContainer) canvasContainer.appendChild(entityCard);
    entityCard.id = 'entity-info-card';
    entityCard.fillCardDetails(entity);

    this.isEntityCardOpen = true;
  }

  /**
   * Handles key down events for navigating the look screen and interacting with entities.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by user input.
   * @param {Stack} stack - The stack of screens, used to manage screen transitions.
   * @return {void} No return value.
   * @description
   * This function processes keyboard events to navigate the cursor on the look screen,
   * display entity details, or exit the look screen. It also checks for open entity
   * cards and removes them if necessary. The function utilizes key bindings to identify
   * entities and control schemes for cursor movement.
   */

  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    if (this.isEntityCardOpen) {
      const entityCard = document.getElementById(
        'entity-info-card',
      ) as EntityInfoCard;
      if (entityCard) {
        entityCard.fadeOutAndRemove();
        this.isEntityCardOpen = false;
      }
    }
    const moveCursor = (dx: number, dy: number) => {
      this.cursorPos.x += dx;
      this.cursorPos.y += dy;
      this.lookPos.x += dx;
      this.lookPos.y += dy;
    };

    const char = this.controlSchemeManager.keyPressToCode(event);

    if (this.keyBindings.has(char)) {
      const entity = this.keyBindings.get(char)!;
      this.showEntityDetail(entity);
      return;
    }

    this.keyBindings.clear();

    switch (char) {
      case this.activeControlScheme.move_left.toString():
        moveCursor(-1, 0);
        break;
      case this.activeControlScheme.move_right.toString():
        moveCursor(1, 0);
        break;
      case this.activeControlScheme.move_up.toString():
        moveCursor(0, -1);
        break;
      case this.activeControlScheme.move_down.toString():
        moveCursor(0, 1);
        break;
      case this.activeControlScheme.move_up_left.toString():
        moveCursor(-1, -1);
        break;
      case this.activeControlScheme.move_up_right.toString():
        moveCursor(1, -1);
        break;
      case this.activeControlScheme.move_down_left.toString():
        moveCursor(-1, 1);
        break;
      case this.activeControlScheme.move_down_right.toString():
        moveCursor(1, 1);
        break;
      case this.activeControlScheme.menu.toString():
        DrawUI.clearFlash(this.game);
        stack.pop();

        break;
    }
  }
}
