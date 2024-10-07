import colors from '../components/Colors/colors.json';

export class ColorLoader {
  /**
   * Initializes the colors used in the game by setting them as CSS root variables.
   *
   * @returns {Promise<void>} A promise that resolves when the colors have been set.
   */
  public static initializeColors(): Promise<void> {
    return new Promise(resolve => {
      const root = document.documentElement;

      root.style.setProperty(
        '--backgroundDefault',
        colors.root['--backgroundDefault'],
      );
      root.style.setProperty(
        '--backgroundDefaultTransparent',
        colors.root['--backgroundDefaultTransparent'],
      );
      root.style.setProperty('--accent', colors.root['--accent']);
      root.style.setProperty('--white', colors.root['--white']);
      root.style.setProperty(
        '--whiteTransparent',
        colors.root['--whiteTransparent'],
      );
      root.style.setProperty('--yellow', colors.root['--yellow']);
      root.style.setProperty(
        '--postMortemAccent',
        colors.root['--postMortemAccent'],
      );

      resolve();
    });
  }
}
