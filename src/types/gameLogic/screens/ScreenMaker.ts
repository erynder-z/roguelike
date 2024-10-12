import { GameState } from '../../gameBuilder/gameState';
import { StackScreen } from '../../terminal/stackScreen';

export type ScreenMaker = {
  newGame(): StackScreen;
  titleScreen(): void;
  gameOver(): StackScreen;
  more(game: GameState | null): StackScreen;
};
