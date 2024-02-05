/* import { ResizingTerminal } from './components/Terminal/ResizingTerminal';
import { TestTerminal } from './components/Terminal/TestTerminal';


const term = ResizingTerminal.createStockResizingTerminal();
function handleResize() {
  term.handleResize();
  TestTerminal.drawPatternTest(term, '-');
}
window.addEventListener('resize', handleResize);
handleResize(); */

/* import { EventManager } from './components/Terminal/EventManager';
import { TestRawScreen } from './test_Implementations/TestRawScreen';
import './style.css';

EventManager.runWithInteractiveScreen(new TestRawScreen()); */

/* import { ScreenStack } from './components/Terminal/ScreenStack';
import './style.css';
import { TestStackScreen } from './test_Implementations/TestStackScreen';

ScreenStack.run_StackScreen(new TestStackScreen()); */

import { ScreenMaker_Fixed } from './components/Screen/ScreenMaker_Fixed';
import './style.css';

ScreenMaker_Fixed.run_GameOverFirstWithStockScreens();
