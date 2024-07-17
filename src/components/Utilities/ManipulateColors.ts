export class ManipulateColors {
  /**
   * Darkens a hex color by a given factor.
   *
   * @param {string} hexColor - The hex color to darken.
   * @param {number} factor - The factor by which to darken the color.
   * @return {string} The darkened hex color.
   */
  public static darkenColor(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.floor(r * (1 - factor));
    g = Math.floor(g * (1 - factor));
    b = Math.floor(b * (1 - factor));

    const darkenedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return darkenedColor;
  }

  /**
   * Tints the given hex color with pink based on the provided factor.
   *
   * @param {string} hexColor - The hex color to tint.
   * @param {number} factor - The factor by which to tint the color.
   * @return {string} The tinted hex color.
   */
  public static tintWithPink(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.floor(g * (1 - factor));
    b = Math.min(255, Math.floor(b + (255 - b) * factor));

    const tintedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return tintedColor;
  }

  /**
   * Tints the given hex color with red based on the provided factor.
   *
   * @param {string} hexColor - The hex color to tint.
   * @param {number} factor - The factor by which to tint the color.
   * @return {string} The tinted hex color.
   */
  public static tintWithRed(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.floor(g * (1 - factor));
    b = Math.floor(b * (1 - factor));

    const tintedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return tintedColor;
  }

  /**
   * Tints the given hex color with green based on the provided factor.
   *
   * @param {string} hexColor - The hex color to tint.
   * @param {number} factor - The factor by which to tint the color.
   * @return {string} The tinted hex color.
   */
  public static tintWithGreen(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.floor(r * (1 - factor));
    g = Math.min(255, Math.floor(g + (255 - g) * factor));
    b = Math.floor(b * (1 - factor));

    const tintedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return tintedColor;
}

    /**
     * Tints the given hex color with yellow based on the provided factor.
     *
     * @param {string} hexColor - The hex color to tint. It should start with a '#' character.
     * @param {number} factor - The factor by which to tint the color. A value of 0 will return the original color, a value of 1 will return the most yellow color possible.
     * @return {string} The tinted hex color.
     */
public static tintWithYellow(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.min(255, Math.floor(r + (255 - r) * factor));
    g = Math.min(255, Math.floor(g + (255 - g) * factor));
    b = Math.floor(b * (1 - factor));

    const tintedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return tintedColor;
}


}
