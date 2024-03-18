import { MobAI } from '../../Mobs/Interfaces/MobAI';
import { Build1 } from './Builder1';

/**
 * Represents an extended version of Build1 interface with additional method to make MobAI.
 */
export interface Build2 extends Build1 {
  makeAI(): MobAI | null;
}
