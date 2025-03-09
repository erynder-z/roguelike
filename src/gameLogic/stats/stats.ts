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
  public damageDealModifier = 1.0;
  public damageReceiveModifier = 1.0;

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

  /**
   * Adjusts the damage deal modifier by the given amount.
   *
   * @param {number} amount - The amount to adjust the modifier by.
   * @return {void} This function does not return a value.
   */
  public adjustDamageDealModifier(amount: number): void {
    this.damageDealModifier += amount;
  }

  /**
   * Resets the damage deal modifier to 1.0, removing any temporary
   * damage increase or decrease.
   *
   * @return {void} This function does not return a value.
   */
  public resetDamageDealModifier(): void {
    this.damageDealModifier = 1.0;
  }

  /**
   * Adjusts the damage received modifier by the given amount.
   *
   * @param {number} amount - The amount to adjust the modifier by.
   * @return {void} This function does not return a value.
   */
  public adjustDamageReceiveModifier(amount: number): void {
    this.damageReceiveModifier += amount;
  }

  /**
   * Resets the damage received modifier to 1.0, removing any temporary
   * damage increase or decrease.
   *
   * @return {void} This function does not return a value.
   */
  public resetDamageReceiveModifier(): void {
    this.damageReceiveModifier = 1.0;
  }
}
