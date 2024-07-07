import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from './HealthAdjust';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a command to heal a mob.
 */
export class HealCommand extends CommandBase {
  constructor(
    private readonly healAmount: number,
    private readonly mob: Mob,
    private readonly gameInstance: GameState,
  ) {
    super(mob, gameInstance);
  }

  /**
   * Executes the heal command, healing the mob by a random amount between 50% and 75% of the specified heal amount.
   *
   * @return {boolean} Returns true if the heal command was executed successfully.
   */
  public execute(): boolean {
    const randomGenerator = this.gameInstance.rand;
    const minHeal = Math.ceil(this.healAmount * 0.5);
    const maxHeal = Math.floor(this.healAmount * 0.5);
    const healPoints = randomGenerator.randomInteger(minHeal, maxHeal);

    HealthAdjust.heal(this.mob, healPoints);

    const message = new LogMessage(
      `${this.mob.name} heals for ${healPoints} hp`,
      EventCategory.heal,
    );
    this.gameInstance.message(message);

    return true;
  }
}
