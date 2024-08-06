import { GameState } from '../../Builder/Types/GameState';
import { StackScreen } from '../../Terminal/Types/StackScreen';

export type ScreenMaker = {
  newGame(): StackScreen;
  titleScreen(): void;
  gameOver(): StackScreen;
  more(game: GameState | null): StackScreen;
};
