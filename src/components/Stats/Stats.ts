/**
 * Manage player related stats
 */
export class Stats {
  public defaultVisRange = 50;
  public currentVisRange = 50;
  public turnCounter = 1;
  public mobKillCounter = 0;
  public damageDealtCounter = 0;
  public damageReceivedCounter = 0;
  public currentTurnReceivedDmg = 0;

  /**
   * Adjusts the default visibility range by the specified amount.
   *
   * @param {number} amount - The amount by which to adjust the default visibility range.
   * @return {void} This function does not return a value.
   */
  public adjustDefaultVisRange(amount: number): void {
    this.defaultVisRange = amount;
  }

  /**
   * Adjusts the current visibility range by the given amount.
   *
   * @param {number} amount - The amount by which to adjust the current visibility range.
   * @return {void} This function does not return anything.
   */
  public adjustCurrentVisRange(amount: number): void {
    this.currentVisRange = amount;
  }

  /**
   * Adjusts the current turn received damage by the given amount.
   *
   * @param {number} dmg - The amount to adjust the current turn received damage by.
   * @return {void} This function does not return a value.
   */
  public adjustCurrentTurnReceivedDmg(dmg: number): void {
    this.currentTurnReceivedDmg += dmg;
  }

  /**
   * Resets the current turn received damage to zero.
   *
   * @return {void} This function does not return a value.
   */
  public resetCurrentTurnReceivedDmg(): void {
    this.currentTurnReceivedDmg = 0;
  }

  /**
   * Increments the turn counter by 1.
   *
   * @return {void} This function does not return a value.
   */
  public incrementTurnCounter(): void {
    this.turnCounter++;
  }

  /**
   * Increments the mob kill counter by 1.
   *
   * @return {void} This function does not return a value.
   */
  public incrementMobKillCounter(): void {
    this.mobKillCounter++;
  }

  /**
   * Increments the damage dealt counter by the specified amount.
   *
   * @param {number} dmg - The amount to increment the damage dealt counter by.
   * @return {void} This function does not return a value.
   */
  public incrementDamageDealtCounter(dmg: number): void {
    this.damageDealtCounter += dmg;
  }

  /**
   * Increments the damage received counter by the given amount.
   *
   * @param {number} dmg - The amount to increment the damage received counter by.
   * @return {void} This function does not return a value.
   */
  public incrementDamageReceivedCounter(dmg: number): void {
    this.damageReceivedCounter += dmg;
  }
}
