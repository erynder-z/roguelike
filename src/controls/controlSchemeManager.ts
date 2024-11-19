import controls from './control_schemes.json';

type ControlSchemeName = 'default' | 'alternate';

export class ControlSchemeManager {
  private activeSchemeName: ControlSchemeName;
  private activeScheme: Record<string, string[]>;

  constructor(initialSchemeName: ControlSchemeName = 'default') {
    if (!controls[initialSchemeName]) {
      throw new Error(`Control scheme "${initialSchemeName}" not found.`);
    }
    this.activeSchemeName = initialSchemeName;
    this.activeScheme = controls[initialSchemeName];
  }

  /**
   * Gets the current active control scheme.
   */
  public getActiveScheme(): Record<string, string[]> {
    return this.activeScheme;
  }

  /**
   * Updates the active control scheme.
   *
   * @param {ControlSchemeName} schemeName - The name of the new control scheme to set.
   */
  public setControlScheme(schemeName: ControlSchemeName): void {
    if (!controls[schemeName]) {
      throw new Error(`Control scheme "${schemeName}" not found.`);
    }
    this.activeSchemeName = schemeName;
    this.activeScheme = controls[schemeName];
  }

  /**
   * Gets the name of the active control scheme.
   */
  public getActiveSchemeName(): ControlSchemeName {
    return this.activeSchemeName;
  }
}
