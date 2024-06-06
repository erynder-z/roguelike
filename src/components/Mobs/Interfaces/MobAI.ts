import { Mob } from '../Mob';
import { GameIF } from '../../Builder/Interfaces/GameIF';
import { Stack } from '../../Terminal/Interfaces/Stack';
import { ScreenMaker } from '../../Screens/Interfaces/ScreenMaker';

export interface MobAI {
  turn(
    me: Mob,
    enemy: Mob,
    game: GameIF,
    stack: Stack,
    make: ScreenMaker,
  ): boolean;
}
