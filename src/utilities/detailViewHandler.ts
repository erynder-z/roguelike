import { Corpse } from '../gameLogic/mobs/corpse';
import { Glyph } from '../gameLogic/glyphs/glyph';
import { ItemObject } from '../gameLogic/itemObjects/itemObject';
import { LookScreenEntity } from '../types/ui/lookScreenEntity';
import { MapCell } from '../maps/mapModel/mapCell';
import { Mob } from '../gameLogic/mobs/mob';

export class DetailViewHandler {
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

  public transformIntoLookScreenEntity(
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
}
