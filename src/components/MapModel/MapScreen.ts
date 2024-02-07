import { Map } from '../../interfaces/Map/Map';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
import { Stack } from '../../interfaces/Terminal/Stack';
import { StackScreen } from '../../interfaces/Terminal/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { DrawMap } from './DrawMap';
import { WorldPoint } from './WorldPoint';

/**
 * Represents a screen displaying a map within a terminal.
 */
export class MapScreen implements StackScreen {
  name = 'Map';

  /**
   * Creates an instance of MapScreen.
   * @param {Map} map - The map to display on the screen.
   */
  constructor(public map: Map) {}

  /**
   * Handles key down events for the map screen.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack associated with the screen.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {}

  /**
   * Draws the map on a drawable terminal.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  drawTerminal(term: DrawableTerminal): void {
    DrawMap.drawMap(term, this.map, new WorldPoint());
  }

  /**
   * Runs the map screen with the specified map.
   * @param {Map} map - The map to display.
   */
  static runMapScreen(map: Map) {
    ScreenStack.run_StackScreen(new MapScreen(map));
  }
}
