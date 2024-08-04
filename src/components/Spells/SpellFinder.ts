import { Buff } from '../Buffs/BuffEnum';
import { BuffCommand } from '../Commands/BuffCommand';
import { BulletCommand } from '../Commands/BulletCommand';
import { CleanseAllCommand } from '../Commands/CleanseAllCommand';
import { Command } from '../Commands/Types/Command';
import { CommandDirectionScreen } from '../Screens/CommandDirectionScreen';
import { CommandOrScreen } from '../Screens/Types/CommandOrScreen';
import { Cost } from '../Commands/Types/Cost';
import { GameState } from '../Builder/Types/GameState';
import { HealCommand } from '../Commands/HealCommand';
import { Mob } from '../Mobs/Mob';
import { MultiplyCommand } from '../Commands/MultiplyCommand';
import { PayloadCommand } from '../Commands/PayloadCommand';
import { SummonCommand } from '../Commands/SummonCommand';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { Spell } from './Spell';
import { Stack } from '../Terminal/Types/Stack';
import { StackScreen } from '../Terminal/Types/StackScreen';
import { TeleportCommand } from '../Commands/TeleportCommand';

/**
 * Helper-class that provides methods for returning a Command or a StackScreen for a spell.
 */
export class SpellFinder {
  constructor(
    public game: GameState,
    public stack: Stack,
    public make: ScreenMaker,
  ) {}
  /**
   * Finds and returns a Command or StackScreen based on the provided spell and optional cost.
   *
   * @param {Spell} spell - The spell to be executed.
   * @param {Cost} [cost] - The optional cost of the spell.
   * @return {Command | StackScreen | null} The found Command or StackScreen, or null if the spell is not recognized.
   */
  public find(spell: Spell, cost?: Cost): Command | StackScreen | null {
    const { game } = this;

    const me = game.player;
    const level = 1;

    let screen: StackScreen | null = null;
    let cmd: Command;

    const b = this.buff.bind(this);
    switch (spell) {
      case Spell.Heal:
        cmd = new HealCommand(level, me, game);
        break;
      case Spell.Charm:
        ({ screen, cmd } = b(Buff.Charm, me));
        break;
      case Spell.Slow:
        ({ screen, cmd } = b(Buff.Slow, me));
        break;
      case Spell.Afraid:
        ({ screen, cmd } = b(Buff.Afraid, me));
        break;
      case Spell.Bullet:
        screen = this.dir(
          (cmd = new BulletCommand(game.player, game, this.stack, this.make)),
        );
        break;
      case Spell.Poison:
        ({ screen, cmd } = b(Buff.Poison, me));
        break;
      case Spell.Confuse:
        ({ screen, cmd } = b(Buff.Confuse, me));
        break;
      case Spell.Silence:
        ({ screen, cmd } = b(Buff.Silence, me));
        break;
      case Spell.Cleanse:
        cmd = new CleanseAllCommand(me, game);
        break;
      case Spell.Stun:
        ({ screen, cmd } = b(Buff.Stun, me));
        break;
      case Spell.Burn:
        ({ screen, cmd } = b(Buff.Burn, me));
        break;
      case Spell.Blind:
        ({ screen, cmd } = b(Buff.Blind, me));
        break;
      case Spell.Multiply:
        cmd = new MultiplyCommand(me, game);
        break;
      case Spell.Freeze:
        ({ screen, cmd } = b(Buff.Freeze, me));
        break;
      case Spell.Root:
        ({ screen, cmd } = b(Buff.Root, me));
        break;
      case Spell.Shock:
        ({ screen, cmd } = b(Buff.Shock, me));
        break;
      case Spell.Teleport:
        cmd = new TeleportCommand(6, me, game);
        break;
      case Spell.Paralyze:
        ({ screen, cmd } = b(Buff.Paralyze, me));
        break;
      case Spell.Sleep:
        ({ screen, cmd } = b(Buff.Sleep, me));
        break;
      case Spell.Petrify:
        ({ screen, cmd } = b(Buff.Petrify, me));
        break;
      case Spell.Summon:
        cmd = new SummonCommand(me, game);
        break;
      case Spell.Bleed:
        ({ screen, cmd } = b(Buff.Bleed, me));
        break;
      case Spell.Levitate:
        ({ screen, cmd } = b(Buff.Levitate, me));
        break;
      case Spell.Disarm:
        ({ screen, cmd } = b(Buff.Disarm, me));
        break;
      default:
        return null;
    }
    cmd.setCost(cost);
    return screen ? screen : cmd;
  }

  /**
   * Creates a new buff command and returns a CommandOrScreen object containing the command and screen.
   *
   * @param {Buff} buff - The type of buff to add.
   * @param {Mob} me - The mob to add the buff to.
   * @return {CommandOrScreen} An object containing the command and screen.
   */
  private buff(buff: Buff, me: Mob): CommandOrScreen {
    const buffCmd = new BuffCommand(buff, me, this.game, me);
    const { screen, cmd } = this.payload(buffCmd, me);
    return { cmd: cmd, screen: screen };
  }

  /**
   * Creates a new payload command and returns a CommandOrScreen object containing the command and screen.
   *
   * @param {Command} inner - The inner command to be wrapped by the payload command.
   * @param {Mob} me - The mob that will execute the command.
   * @return {CommandOrScreen} An object containing the command and screen.
   */
  private payload(inner: Command, me: Mob): CommandOrScreen {
    const cmd: Command = new PayloadCommand(
      me,
      this.game,
      this.stack,
      this.make,
      inner,
    );
    const dirScreen: StackScreen = this.dir(cmd);
    return { cmd: cmd, screen: dirScreen };
  }

  /**
   * Creates a new CommandDirectionScreen with the given command and returns it as a StackScreen.
   *
   * @param {Command} cmd - The command to be executed.
   * @return {StackScreen} The newly created CommandDirectionScreen.
   */
  private dir(cmd: Command): StackScreen {
    return new CommandDirectionScreen(cmd, this.game, this.make);
  }
}
