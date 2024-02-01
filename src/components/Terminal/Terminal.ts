import { TerminalPoint } from './TerminalPoint'; // Renamed TPoint to Point for brevity
import { TerminalInterface } from '../../interfaces/Terminal/TerminalInterface';

/**
 * Represents a terminal for drawing text on a canvas.
 */
export class Terminal implements TerminalInterface {
  /**
   * The 2D rendering context of the canvas.
   */
  ctx: CanvasRenderingContext2D;

  /**
   * The horizontal size of each cell in the terminal grid.
   */
  horizontalSide: number = 1;

  /**
   * The vertical size of each cell in the terminal grid.
   */
  verticalSide: number = 1;

  /**
   * The length of each side of a cell in the terminal grid (in pixels).
   */
  sideLength: number = 40;

  /**
   * The scaling factor for adjusting the font size within each cell.
   */
  scalingFactor: number = 0.8;

  /**
   * Creates a new instance of the Terminal class.
   * @param dimensions - The dimensions of the terminal grid.
   */
  constructor(public dimensions: TerminalPoint) {
    this.ctx = this.initializeContext();
  }

  /**
   * Initializes the 2D rendering context of the canvas and sets initial styles.
   * @returns The initialized 2D rendering context.
   */
  initializeContext(): CanvasRenderingContext2D {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    this.horizontalSide = this.sideLength * 1.0;
    this.verticalSide = this.sideLength * 1.0;

    const squeeze: number = this.sideLength * this.scalingFactor;
    ctx.fillStyle = '#110';
    ctx.strokeStyle = 'red';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${squeeze}px sans-serif`;
    return ctx;
  }

  /**
   * Creates a stock terminal instance with predefined dimensions.
   * @returns A Terminal instance with stock dimensions.
   */
  public static createStockTerminal(): Terminal {
    return new Terminal(TerminalPoint.createStockDimensions());
  }

  /**
   * Draws a string of text at the specified coordinates with the given foreground and background colors.
   * The text will wrap to the next line if it reaches the right edge of the terminal.
   * @param x - The starting x-coordinate for drawing the text.
   * @param y - The starting y-coordinate for drawing the text.
   * @param text - The text to be drawn.
   * @param foreground - The foreground color of the text.
   * @param background - The background color of the text.
   */
  drawText(
    x: number,
    y: number,
    text: string,
    foreground: string,
    background: string,
  ) {
    for (let i = 0; i < text.length; ++i) {
      this.drawAt(x, y, text.charAt(i), foreground, background);
      ++x;
      if (x >= this.dimensions.x) {
        x = 0;
        ++y;
        if (y >= this.dimensions.y) {
          y = 0;
        }
      }
    }
  }

  /**
   * Draws a single character at the specified coordinates with the given foreground and background colors.
   * @param x - The x-coordinate of the character.
   * @param y - The y-coordinate of the character.
   * @param char - The character to be drawn.
   * @param foreground - The foreground color of the character.
   * @param background - The background color of the character.
   */
  drawAt(
    x: number,
    y: number,
    char: string,
    foreground: string,
    background: string,
  ) {
    const fx = x * this.horizontalSide,
      fy = y * this.verticalSide;
    const px = (x + 0.5) * this.horizontalSide,
      py = (y + 0.5) * this.verticalSide;

    this.ctx.save();
    {
      this.ctx.fillStyle = background;
      this.ctx.fillRect(fx, fy, this.horizontalSide, this.verticalSide);

      this.ctx.beginPath();
      this.ctx.rect(fx, fy, this.horizontalSide, this.verticalSide);
      this.ctx.clip();

      this.ctx.fillStyle = foreground;
      this.ctx.fillText(char, px, py);
    }
    this.ctx.restore();
  }
}
