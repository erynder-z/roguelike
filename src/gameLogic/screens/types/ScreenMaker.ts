import { GameState } from '../../../gameBuilder/types/gameState';
import { StackScreen } from '../../../terminal/types/stackScreen';

export type ScreenMaker = {
  newGame(): StackScreen;
  titleScreen(): void;
  gameOver(): StackScreen;
  more(game: GameState | null): StackScreen;
};
