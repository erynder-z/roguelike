import { DrawableTerminal } from './Types/DrawableTerminal';
import { TerminalPoint } from './TerminalPoint';

/**
 * Represents a terminal for drawing text on a canvas.
 */
export class Terminal implements DrawableTerminal {
  constructor(
    public dimensions: TerminalPoint,
    public ctx: CanvasRenderingContext2D,
    public horizontalSide: number = 1,
    public verticalSide: number = 1,
    public sideLength: number = 40,
    public scalingFactor: number = 0.8,
  ) {
    this.ctx = this.initializeContext();
  }

  /**
   * Initializes the 2D rendering context of the canvas and sets initial styles.
   * @returns The initialized 2D rendering context.
   */
  public initializeContext(): CanvasRenderingContext2D {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas1');

    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = this.dimensions.x * this.sideLength;
    canvas.height = this.dimensions.y * this.sideLength;

    // Set horizontal and vertical side lengths
    this.horizontalSide = this.sideLength;
    this.verticalSide = this.sideLength;

    // Calculate the squeeze factor for font size
    const squeeze: number = this.sideLength * this.scalingFactor;

    // Set styles
    ctx.fillStyle = '#111a24';
    ctx.strokeStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${squeeze}px "DejaVu Sans Mono", monospace`;

    // Translate the context to center it inside the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Adjust the starting point for drawing
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    return ctx;
  }

  /**
   * Creates a stock terminal instance with predefined dimensions.
   * @returns A Terminal instance with stock dimensions.
   */
  public static createStockTerminal(): Terminal {
    const defaultCanvas = <HTMLCanvasElement>document.getElementById('canvas1');
    const defaultCtx = <CanvasRenderingContext2D>defaultCanvas.getContext('2d');
    return new Terminal(TerminalPoint.TerminalDimensions, defaultCtx);
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
  public drawText(
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
  public drawAt(
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
