import { Command } from '../../commands/types/command';
import { StackScreen } from '../../../terminal/types/stackScreen';

export type CommandOrScreen = {
  cmd: Command;
  screen: StackScreen;
};
