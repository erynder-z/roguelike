import { GameIF } from '../Builder/Interfaces/GameIF';
import { BulletCommand } from '../Commands/BulletCommand';
import { HealCommand } from '../Commands/HealCommand';
import { Command } from '../Commands/Interfaces/Command';
import { TeleportCommand } from '../Commands/TeleportCommand';
import { Glyph } from '../Glyphs/Glyph';
import { ItemObject } from '../ItemObjects/ItemObject';
import { MultipleUseItemCost } from '../ItemObjects/MultipleUseItemCost';
import { Slot } from '../ItemObjects/Slot';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { CommandDirectionScreen } from '../Screens/CommandDirectionScreen';
import { ScreenMaker } from '../Screens/Interfaces/ScreenMaker';
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
   * Checks if the given ItemObject is usable.
   *
   * @param {ItemObject} obj - The ItemObject to check.
   * @return {boolean} Returns true if the ItemObject is usable, false otherwise.
   */
  isUsable(obj: ItemObject): boolean {
    const canUse = obj.slot == Slot.NotWorn;
    const msg = new LogMessage(
      `${obj.description()} is not usable!`,
      EventCategory.unable,
    );
    if (!canUse) this.game.flash(msg);
    return canUse;
  }

  /**
   * Finds and returns a Command or StackScreen based on the provided ItemObject.
   *
   * @return {Command | StackScreen | null} The found Command or StackScreen, or null if the ItemObject is not usable.
   */
  find(): Command | StackScreen | null {
    const obj: ItemObject = this.obj;

    if (!this.isUsable(obj)) return null;

    const g = this.game;
    const me = g.player;
    let s: StackScreen | null = null;
    let cmd: Command | null = null;

    switch (obj.glyph) {
      case Glyph.Potion:
        cmd = new HealCommand(obj.level + 4, me, g);
        break;
      case Glyph.TeleportRune:
        cmd = new TeleportCommand(6, me, g);
        break;
      case Glyph.Pistol:
        cmd = new BulletCommand(g.player, g, this.stack, this.make);
        s = new CommandDirectionScreen(cmd, g, this.make);
        break;
      default:
        return null;
    }
    cmd.setCost(new MultipleUseItemCost(g, this.obj, this.index));
    return s ? s : cmd;
  }
}
