export enum EnvEffect {
  Poison,
  Confusion,
  Heal,
  Blind,
  AttackUp,
}

/**
 * Returns a random environment effect. This will be one of the values
 * on the EnvEffect enum, excluding the numeric values.
 *
 * @return {EnvEffect} a random environment effect
 */
export const randomEnvEffect = (): EnvEffect => {
  const effects = Object.keys(EnvEffect)
    .filter(key => isNaN(Number(key)))
    .map(key => EnvEffect[key as keyof typeof EnvEffect]);

  return effects[Math.floor(Math.random() * effects.length)];
};
