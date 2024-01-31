import { ResizingTerminal } from './components/Terminal/ResizingTerminal';
import { TestTerminal } from './components/Terminal/TestTerminal';
import './style.css';

const term = ResizingTerminal.createStockResizingTerminal();
function handleResize() {
  term.handleResize();
  TestTerminal.drawPatternTest(term, '-');
}
window.addEventListener('resize', handleResize);
handleResize();
