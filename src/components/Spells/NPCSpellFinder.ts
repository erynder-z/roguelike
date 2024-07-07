import { BulletCommand } from '../Commands/BulletCommand';
import { BuffCommand } from '../Commands/BuffCommand';
import { CleanseAllCommand } from '../Commands/CleanseAllCommand';
import { HealCommand } from '../Commands/HealCommand';
import { MultiplyCommand } from '../Commands/MultiplyCommand';
import { SummonCommand } from '../Commands/SummonCommand';
import { TeleportCommand } from '../Commands/TeleportCommand';
import { Buff } from '../Buffs/BuffEnum';
import { Command } from '../Commands/Types/Command';
import { Cost } from '../Commands/Types/Cost';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { Spell } from './Spell';

/**
 * Helper-class that provides methods for returning a spells to be used by npc-mobs.
 */
export class NPCSpellFinder {
  constructor(
    public game: GameState,
    public stack: Stack,
    public make: ScreenMaker,
    public player: Mob = game.player,
  ) {}

  /**
   * Finds and returns a Command or StackScreen based on the provided spell and optional cost.
   *
   * @param {Mob} me - The Mob object representing the player.
   * @param {Spell} spell - The spell to be executed.
   * @param {Cost} [cost] - The optional cost of the spell.
   * @return {Command | StackScreen | null} The found Command or StackScreen, or null if the spell is not recognized.
   */
  public find(
    me: Mob,
    spell: Spell,
    cost?: Cost,
  ): Command | StackScreen | null {
    const g = this.game;
    const level = 1;
    const screen: StackScreen | null = null;
    let cmd: Command;
    const b = this.buff.bind(this);

    switch (spell) {
      case Spell.Heal:
        cmd = new HealCommand(level, me, g);
        break;
      case Spell.Charm:
        cmd = b(Buff.Charm, me);
        break;
      case Spell.Slow:
        cmd = b(Buff.Slow, me);
        break;
      case Spell.Afraid:
        cmd = b(Buff.Afraid, me);
        break;
      case Spell.Bullet:
        cmd = this.aim(new BulletCommand(me, g, this.stack, this.make));
        break;
      case Spell.Poison:
        cmd = b(Buff.Poison, me);
        break;
      case Spell.Confuse:
        cmd = b(Buff.Confuse, me);
        break;
      case Spell.Silence:
        cmd = b(Buff.Silence, me);
        break;
      case Spell.Cleanse:
        cmd = new CleanseAllCommand(me, g);
        break;
      case Spell.Stun:
        cmd = b(Buff.Stun, me);
        break;
      case Spell.Burn:
        cmd = b(Buff.Burn, me);
        break;
      case Spell.Blind:
        cmd = b(Buff.Blind, me);
        break;
      case Spell.Multiply:
        cmd = new MultiplyCommand(me, g);
        break;
      case Spell.Freeze:
        cmd = b(Buff.Freeze, me);
        break;
      case Spell.Root:
        cmd = b(Buff.Root, me);
        break;
      case Spell.Shock:
        cmd = b(Buff.Shock, me);
        break;
      case Spell.Teleport:
        cmd = new TeleportCommand(6, me, g);
        break;
      case Spell.Paralyze:
        cmd = b(Buff.Paralyze, me);
        break;
      case Spell.Sleep:
        cmd = b(Buff.Sleep, me);
        break;
      case Spell.Petrify:
        cmd = b(Buff.Petrify, me);
        break;
      case Spell.Summon:
        cmd = new SummonCommand(me, g);
        break;
      case Spell.Bleed:
        cmd = b(Buff.Bleed, me);
        break;
      case Spell.Levitate:
        cmd = b(Buff.Levitate, me);
        break;
      case Spell.Disarm:
        cmd = b(Buff.Disarm, me);
        break;
      default:
        return null;
    }
    cmd.setCost(cost);

    return screen ? screen : cmd;
  }

  /**
   * Sets the direction of the command based on the player's position and returns the updated command.
   *
   * @param {BulletCommand} cmd - The command to be updated.
   * @return {Command} The updated command with the direction set.
   */
  private aim(cmd: BulletCommand): Command {
    const dir = cmd.me.pos.directionTo(this.player.pos);
    return cmd.setDirection(dir);
  }

  /**
   * Creates a new BuffCommand with the given buff and mob, and returns it as a Command.
   *
   * @param {Buff} buff - The buff to be added to the mob.
   * @param {Mob} me - The mob to receive the buff.
   * @return {Command} A new BuffCommand with the given buff and mob.
   */
  private buff(buff: Buff, me: Mob): Command {
    return new BuffCommand(buff, this.player, this.game, me);
  }
}
