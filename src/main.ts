/* import { ResizingTerminal } from './components/Terminal/ResizingTerminal';
import { TestTerminal } from './components/Terminal/TestTerminal';


const term = ResizingTerminal.createStockResizingTerminal();
function handleResize() {
  term.handleResize();
  TestTerminal.drawPatternTest(term, '-');
}
window.addEventListener('resize', handleResize);
handleResize(); */

import { EventManager } from './components/Terminal/EventManager';
import { TestRawScreen } from './test_Implementations/TestRawScreen';
import './style.css';

EventManager.runWithRawScreen(new TestRawScreen());
