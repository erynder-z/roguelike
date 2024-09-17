import colors from '../../styles/colors.json';

export const initializeColors = () => {
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
};
