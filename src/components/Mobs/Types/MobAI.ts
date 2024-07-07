import { GameState } from '../../Builder/Types/GameState';
import { Mob } from '../Mob';
import { ScreenMaker } from '../../Screens/Types/ScreenMaker';
import { Stack } from '../../Terminal/Types/Stack';

export type MobAI = {
  turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean;
};
