import { StackScreen } from './StackScreen';

export type Stack = {
  pop(): void;
  push(screen: StackScreen): void;
  getCurrentScreen(): StackScreen;
};
