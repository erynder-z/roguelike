import { GameIF } from '../Builder/Interfaces/GameIF';
import { CommandBase } from '../Commands/CommandBase';
import { Command } from '../Commands/Interfaces/Command';
import { Cost } from '../Commands/Interfaces/Cost';
import { Spell } from '../Spells/Spell';
import { SpellFinder } from '../Spells/SpellFinder';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { StackScreen } from '../Terminal/Interfaces/StackScreen';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';

/**
 * Represents a screen for choosing spells.
 */
export class SpellScreen extends BaseScreen {
  name: string = 'spell-screen';
  constructor(
    public game: GameIF,
    public make: ScreenMaker,
  ) {
    super(game, make);
  }
  /**
   * Converts a position to a corresponding character.
   *
   * @param {number} pos - The position to convert.
   * @return {string} The corresponding character.
   */
  positionToCharacter(pos: number): string {
    return String.fromCharCode(97 + pos);
  }

  /**
   * Converts a character to its corresponding position in the alphabet.
   *
   * @param {string} c - The character to convert.
   * @return {number} The position of the character in the alphabet.
   */
  characterToPosition(c: string): number {
    const pos = c.charCodeAt(0) - 'a'.charCodeAt(0);
    return pos;
  }

  /**
   * Draws the spell screen on the provided drawable terminal.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @return {void} No return value.
   */
  drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
    term.drawText(0, 1, 'Which spell?', 'yellow', 'black');

    const top = 1;
    let y = top;
    let x = 0;

    for (let i = 0; i < Spell.None; ++i) {
      const c = this.positionToCharacter(i);
      const L = Spell[i];
      term.drawText(x, 1 + y++, `${c}: ${L}`, 'yellow', 'black');
      if (y > 12) {
        y = top;
        x += 14;
      }
    }
  }

  /**
   * Handles the key down event.
   *
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack object.
   * @return {boolean} True if the event was handled successfully, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    this.game.log.clearQueue();
    stack.pop();
    const pos = this.characterToPosition(event.key);
    this.itemMenu(pos, stack);
    return true;
  }

  /**
   * Handles the item menu selection.
   *
   * @param {number} pos - The position of the selected item.
   * @param {Stack} stack - The stack object.
   * @return {void} This function does not return anything.
   */
  itemMenu(pos: number, stack: Stack): void {
    const s: Spell = pos;
    const label = Spell[s];

    if (!label) return;

    this.doSpell(s, stack);
  }

  /**
   * Executes a spell by finding the corresponding command or screen and pushing it onto the stack.
   *
   * @param {Spell} s - The spell to be executed.
   * @param {Stack} stack - The stack object.
   * @return {void} This function does not return anything.
   */
  doSpell(s: Spell, stack: Stack): void {
    const finder = new SpellFinder(this.game, stack, this.make);
    const cost: Cost | undefined = undefined;
    const spell: Command | StackScreen | null = finder.find(s, cost);

    if (spell == null) return;
    if (spell instanceof CommandBase) {
      if (spell.turn()) this.npcTurns(stack);
    } else {
      stack.push(<StackScreen>spell);
    }
  }
}
