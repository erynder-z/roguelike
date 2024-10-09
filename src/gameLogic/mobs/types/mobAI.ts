import { GameState } from '../../../gameBuilder/types/gameState';
import { Mob } from '../mob';
import { ScreenMaker } from '../../screens/types/ScreenMaker';
import { Stack } from '../../../terminal/types/stack';

export type MobAI = {
  turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean;
};
