import { Command } from '../../Commands/Types/Command';
import { StackScreen } from '../../Terminal/Types/StackScreen';

export type CommandOrScreen = {
  cmd: Command;
  screen: StackScreen;
};
