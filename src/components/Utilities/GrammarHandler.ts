import { Buff } from '../Buffs/BuffEnum';
import * as messagesData from '../Messages/MessagesData/MessagesData.json';

export class GrammarHandler {
  public static BuffToAdjective(buff: Buff): string | null {
    const buffData = messagesData.Buffs.find(b => b.buff === Buff[buff]);
    if (buffData) return buffData.adjective;
    return null;
  }
}
