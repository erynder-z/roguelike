import { BaseScreen } from './baseScreen';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

export class AttackAnimationScreen extends BaseScreen {
  public name = 'attack-animation-screen';

  constructor(
    public game: GameState,
    public make: ScreenMaker,
    public pos: WorldPoint,
    public isAttackByPlayer: boolean,
    public isDig: boolean,
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
   * Draws the attack animation on the terminal.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @return {void} No return value.
   */
  public drawScreen(term: DrawableTerminal): void {
    if (this.isDig) {
      this.drawAttackAnimation(term, 'burst');
      return;
    }

    const attackType = this.isAttackByPlayer ? 'longerSlash' : 'shorterSlash';
    this.drawAttackAnimation(term, attackType);
  }

  /**
   * Removes the attack animation screen from the stack.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} True if the screen was popped successfully, otherwise false.
   */
  public onTime(stack: Stack): boolean {
    stack.pop();
    return true;
  }

/**
 * Draws an attack animation of a specified type on the terminal.
 *
 * Determines the color, opacity, and thickness of the attack based on its type
 * and utilizes the corresponding draw method to render the attack overlay.
 *
 * @param {DrawableTerminal} term - The terminal to draw the animation on.
 * @param {'longerSlash' | 'shorterSlash' | 'burst'} type - The type of attack to draw.
 */

  private drawAttackAnimation(
    term: DrawableTerminal,
    type: 'longerSlash' | 'shorterSlash' | 'burst',
  ) {
    const gameConfig = gameConfigManager.getConfig();
    const color = type === 'shorterSlash' ? '#a7001b' : gameConfig.player.color;
    const opacityFactor = 0.9;
    const thickness = type === 'shorterSlash' ? 2 : 1;

    const targetPos = this.getTargetPosition();
    const drawMethod =
      type === 'longerSlash'
        ? term.drawLongerSlashAttackOverlay
        : type === 'shorterSlash'
          ? term.drawShorterSlashAttackOverlay
          : term.drawBurstAttackOverlay;

    drawMethod.call(
      term,
      targetPos.x,
      targetPos.y,
      color,
      opacityFactor,
      thickness,
    );
  }

  /**
   * Calculates the position of the target mob on the terminal based on its world position,
   * taking into account the player's position.
   *
   * @return {WorldPoint} The position of the target mob on the terminal.
   */
  private getTargetPosition(): WorldPoint {
    const terminalCenter = new WorldPoint(32, 16);
    const playerPos = this.game.player.pos;

    return new WorldPoint(
      this.pos.x + (terminalCenter.x - playerPos.x),
      this.pos.y + (terminalCenter.y - playerPos.y),
    );
  }
}
