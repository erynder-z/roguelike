import { Map } from '../MapModel/Interfaces/Map';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';
import { ScreenStack } from '../Terminal/ScreenStack';
import { DrawMap } from '../MapModel/DrawMap';
import { WorldPoint } from '../MapModel/WorldPoint';

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
  drawScreen(term: DrawableTerminal): void {
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
