import { Command } from '../commands/command';
import { StackScreen } from '../../terminal/stackScreen';

export type CommandOrScreen = {
  cmd: Command;
  screen: StackScreen;
};
