import { Buff } from '../gameLogic/buffs/buffEnum';
import messagesData from '../gameLogic/messages/messagesData/messagesData.json';

export class GrammarHandler {
  public static BuffToAdjective(buff: Buff): string | null {
    const buffData = messagesData.Buffs.find(b => b.buff === Buff[buff]);
    if (buffData) return buffData.adjective;
    return null;
  }
}
