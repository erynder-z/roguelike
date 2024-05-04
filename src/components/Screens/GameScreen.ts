import { GameIF } from '../Builder/Interfaces/GameIF';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ParsePlayer } from '../Events/ParsePlayer';

/**
 * Represents a game screen that extends the functionality of the base screen.
 */
export class GameScreen extends BaseScreen {
  name: string = 'GameScreen';

  /**
   * Constructor for creating a new instance of the class.
   *
   * @param {GameIF} game - the game interface
   * @param {ScreenMaker} make - the screen maker
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
  }

  /**
   * Handle key down event.
   *
   * @param {KeyboardEvent} event - the keyboard event
   * @param {Stack} stack - the stack
   * @return {void}
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    this.playerKeyTurn(stack, ParsePlayer.keyPressToCode(event), event);
  }

  /**
   * A function that handles the player's turn in the game.
   *
   * @param {Stack} stack - the game stack
   * @param {string} char - the character input by the player
   * @param {KeyboardEvent | null} event - the keyboard event or null
   * @return {void}
   */
  playerKeyTurn(stack: Stack, char: string, event: KeyboardEvent | null): void {
    if (this.game.log) this.game.log.clearQueue();
    if (this.playerTurn(stack, char, event)) this.npcTurns(stack);
  }

  /**
   * A function that handles the player's turn.
   *
   * @param {Stack} stack - the stack object
   * @param {string} char - the character input
   * @param {KeyboardEvent | null} event - the keyboard event or null
   * @return {boolean} the result of parsing the key code as a turn
   */
  playerTurn(stack: Stack, char: string, event: KeyboardEvent | null): boolean {
    const parser = new ParsePlayer(this.game, this.make);
    return parser.parseKeyCodeAsTurn(char, stack, event);
  }
}
