import { BaseScreen } from './baseScreen';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { gameConfigManager } from '../../gameConfigManager/gameConfigManager';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

export class AttackAnimationScreen extends BaseScreen {
  public name = 'player-attack-animation-screen';
  constructor(
    public game: GameState,
    public make: ScreenMaker,
    public pos: WorldPoint,
    public isAttackByPlayer: boolean,
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

  public drawScreen(term: DrawableTerminal): void {
    if (this.isAttackByPlayer) {
      this.playerAttackAnimation(term);
    } else {
      this.mobAttackAnimation(term);
    }
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

  /**
   * Draws the player attack animation on the terminal.
   *
   * The attack animation is a series of lines that are evenly spaced and
   * radiate from the center of the cell the player is in. The lines are colored
   * with the player's color and have the specified opacity factor and thickness.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  private playerAttackAnimation(term: DrawableTerminal) {
    const gameConfig = gameConfigManager.getConfig();
    const playerColor = gameConfig.player.color;
    const color = playerColor;
    const opacityFactor = 0.9;
    const thickness = 1;

    const terminalNeutralPos = new WorldPoint(32, 16);
    const relativePlayerPos = terminalNeutralPos;
    const playerPos = this.game.player.pos;
    const targetPos = this.pos;

    const offsetX = relativePlayerPos.x - playerPos.x;
    const offsetY = relativePlayerPos.y - playerPos.y;

    const targetX = targetPos.x + offsetX;
    const targetY = targetPos.y + offsetY;

    term.drawLongerSlashAttackOverlay(
      targetX,
      targetY,
      color,
      opacityFactor,
      thickness,
    );
  }

  /**
   * Draws the mob attack animation on the terminal.
   *
   * The attack animation is a single line that is drawn at the center of the
   * screen. The line is colored with a bright red color and has the specified
   * opacity factor and thickness.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  private mobAttackAnimation(term: DrawableTerminal) {
    const opacityFactor = 0.9;
    const thickness = 2;
    const color = '#a7001b';

    const terminalNeutralPos = new WorldPoint(32, 16);
    const relativePlayerPos = terminalNeutralPos;

    term.drawShorterSlashAttackOverlay(
      relativePlayerPos.x,
      relativePlayerPos.y,
      color,
      opacityFactor,
      thickness,
    );
  }
}
