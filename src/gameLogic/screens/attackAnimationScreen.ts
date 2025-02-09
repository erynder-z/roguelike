import { BaseScreen } from './baseScreen';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { MapCell } from '../../maps/mapModel/mapCell';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

export class AttackAnimationScreen extends BaseScreen {
  public name = 'attack-animation-screen';
  constructor(
    public game: GameState,
    public make: ScreenMaker,
    public cell: MapCell,
    public pos: WorldPoint,
  ) {
    super(game, make);
  }

  /**
   * Handles key down events.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack of screens.
   * @returns {boolean} True if the event was handled successfully, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    return false;
  }

/**
 * Draws the attack animation screen on the provided drawable terminal.
 *
 * This method configures the player's color and calculates the target
 * position for the attack animation based on the player's current position
 * and a neutral terminal position. It then draws a slash attack overlay
 * at the calculated target position with a specified color, opacity, and
 * thickness.
 *
 * @param {DrawableTerminal} term - The terminal to draw the attack animation on.
 * @return {void} No return value.
 */

  public drawScreen(term: DrawableTerminal): void {
    const gameConfig = gameConfigManager.getConfig();
    const playerColor = gameConfig.player.color;
    const color = playerColor;
    const opacityFactor = 0.6;
    const thickness = 1;

    const terminalNeutralPos = new WorldPoint(32, 16);
    const relativePlayerPos = terminalNeutralPos;
    const playerPos = this.game.player.pos;
    const targetPos = this.pos;

    const offsetX = relativePlayerPos.x - playerPos.x;
    const offsetY = relativePlayerPos.y - playerPos.y;

    const targetX = targetPos.x + offsetX;
    const targetY = targetPos.y + offsetY;

    term.drawSlashAttackOverlay(
      targetX,
      targetY,
      color,
      opacityFactor,
      thickness,
    );
  }

  /**
   * Called when the screen is updated due to time.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns true if the screen should be popped from the stack, false otherwise.
   */
  public onTime(stack: Stack): boolean {
    stack.pop();
    return true;
  }
}
