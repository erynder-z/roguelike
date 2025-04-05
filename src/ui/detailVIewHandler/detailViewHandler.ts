import { Corpse } from '../../gameLogic/mobs/corpse';
import { EntityInfoCard } from '../entityInfoDisplay/entityInfoCard';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { ItemObject } from '../../gameLogic/itemObjects/itemObject';
import { DetailViewEntity } from '../../types/ui/detailViewEntity';
import { MapCell } from '../../maps/mapModel/mapCell';
import { Mob } from '../../gameLogic/mobs/mob';

export class DetailViewHandler {
  /**
   * Transforms a given entity into a DetailViewEntity representation.
   *
   * @param {Mob | Corpse | ItemObject | MapCell['environment']} entity - The entity to be transformed.
   * @return {Omit<DetailViewEntity, 'uniqueKey'>} The transformed DetailViewEntity object without the unique key.
   *
   * The function identifies the type of entity provided and extracts its relevant properties
   * to create a DetailViewEntity. It handles Mobs, Corpses, ItemObjects, and MapCell environments,
   * assigning appropriate type, glyph, name, description, and other properties specific to the entity type.
   * If the entity type is unrecognized, it defaults to an unknown entity representation.
   */
  public transformIntoDetailViewEntity(
    entity: Mob | Corpse | ItemObject | MapCell['environment'],
  ): Omit<DetailViewEntity, 'uniqueKey'> {
    const baseEntity: Omit<DetailViewEntity, 'uniqueKey'> = {
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
   * Checks if the entity info card is currently open in the DOM.
   *
   * @return {boolean} True if the entity info card is present, false otherwise.
   */
  public isEntityCardOpen(): boolean {
    const entityCardElement = document.getElementById(
      'entity-info-card',
    ) as EntityInfoCard;
    return entityCardElement !== null;
  }

  /**
   * Closes the currently open entity info card by removing it from the DOM.
   *
   * If there is no entity info card currently open, this function does nothing.
   */
  public closeOpenEntityCard(): void {
    const entityCardElement = document.getElementById(
      'entity-info-card',
    ) as EntityInfoCard;
    if (entityCardElement) entityCardElement.fadeOutAndRemove();
  }
}
