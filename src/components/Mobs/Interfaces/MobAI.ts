import { GameIF } from '../../Builder/Interfaces/GameIF';
import { Mob } from '../Mob';
import { ScreenMaker } from '../../Screens/Interfaces/ScreenMaker';
import { Stack } from '../../Terminal/Interfaces/Stack';

export interface MobAI {
  turn(
    me: Mob,
    enemy: Mob,
    game: GameIF,
    stack: Stack,
    make: ScreenMaker,
  ): boolean;
}
