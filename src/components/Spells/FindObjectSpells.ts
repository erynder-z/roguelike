import { Command } from '../Commands/Interfaces/Command';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { ItemObject } from '../ItemObjects/ItemObject';
import { MultipleUseItemCost } from '../ItemObjects/MultipleUseItemCost';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
import { Spell } from './Spell';
import { SpellFinder } from './SpellFinder';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';

/**
 * Helper-class that provides methods for returning a Command or a StackScreen for a item.
 */
export class FindObjectSpell {
  constructor(
    public obj: ItemObject,
    public index: number,
    public game: GameIF,
    public stack: Stack,
    public make: ScreenMaker,
  ) {}

  /**
   * Checks if an ItemObject is usable. Objects that have no spell associated are not usable.
   *
   * @param {ItemObject} obj - The ItemObject to check.
   * @param {GameIF} game - The GameIF instance.
   * @return {boolean} True if the ItemObject is usable, false otherwise.
   */
  private isUsable(obj: ItemObject, game: GameIF): boolean {
    const canUse = obj.spell != Spell.None;

    if (!canUse) {
      const msg = new LogMessage(
        `${obj.description()} is not usable!`,
        EventCategory.unable,
      );
      game.flash(msg);
    }
    return canUse;
  }

  /**
   * Finds a Command, StackScreen, or null based on the given ItemObject and GameIF.
   *
   * @return {Command | StackScreen | null} The found Command, StackScreen, or null if the ItemObject is not usable.
   */
  public find(): Command | StackScreen | null {
    const g = this.game;
    const obj: ItemObject = this.obj;

    if (!this.isUsable(obj, g)) return null;

    const finder = new SpellFinder(g, this.stack, this.make);
    const cost = new MultipleUseItemCost(g, obj, this.index);

    return finder.find(obj.spell, cost);
  }
}
