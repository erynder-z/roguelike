import { Buff } from '../Buffs/BuffEnum';
import * as buffGrammarData from './GrammarData.json';

export class GrammarHandler {
  static BuffToAdjective(buff: Buff): string | null {
    const buffData = buffGrammarData.Buffs.find(b => b.buff === Buff[buff]);
    if (buffData) return buffData.adjective;
    return null;
  }
}
