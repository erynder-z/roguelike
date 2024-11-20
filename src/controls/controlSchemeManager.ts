import controls from './control_schemes.json';

export type ControlSchemeName = keyof typeof controls;

/**
 * Provides the current control scheme to be used in the game. Available control schemes are defined in the `control_schemes.json` file.
 */
export class ControlSchemeManager {
  private activeScheme: Record<string, string[]>;

  constructor(currentSchemeName: ControlSchemeName = 'default') {
    if (!(currentSchemeName in controls)) {
      throw new Error(`Control scheme "${currentSchemeName}" not found.`);
    }

    this.activeScheme = controls[currentSchemeName];
  }

  /**
   * Gets the current active control scheme.
   */
  public getActiveScheme(): Record<string, string[]> {
    return this.activeScheme;
  }
}
