import 'animate.css';
import { Builder } from './components/Builder/Builder';
import { ScreenMaker_Fixed } from './components/Screens/ScreenMaker';
import './cssReset.css';
import './style.css';

ScreenMaker_Fixed.InitialGameSetup(new Builder());

/* import { Builder } from './components/Builder/Builder';
import { ScreenMaker_Dynamic } from './components/Screens/ScreenMaker_Dynamic';

ScreenMaker_Dynamic.runBuilt_InitialGameSetup(new Builder()); */
