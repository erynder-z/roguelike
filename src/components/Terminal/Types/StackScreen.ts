import { DrawableTerminal } from './DrawableTerminal';
import { Stack } from './Stack';

export type StackScreen = {
  name: string;
  drawScreen(term: DrawableTerminal): void;
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void;
  onTime(stack: Stack): boolean;
};
