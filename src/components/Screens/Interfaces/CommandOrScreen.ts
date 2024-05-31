import { Command } from '../../Commands/Interfaces/Command';
import { StackScreen } from '../../Terminal/Interfaces/StackScreen';

export interface CommandOrScreen {
  cmd: Command;
  screen: StackScreen;
}
