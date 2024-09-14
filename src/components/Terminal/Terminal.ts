import { DrawableTerminal } from './Types/DrawableTerminal';
import { ManipulateColors } from '../Utilities/ManipulateColors';
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
   * This function is used by the drawText() function to draw each character of the text string.
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
    // The coordinates for drawing the character are calculated by adding 0.5 to the x and y coordinates.
    // This is done to center the character in the square.
    const px = (x + 0.5) * this.horizontalSide,
      py = (y + 0.5) * this.verticalSide;

    // The context is saved and then restored to isolate the drawing of the character.
    // This is done to prevent the drawing of the character from affecting the drawing of other characters.
    this.ctx.save();
    {
      // The background color is set and a rectangle is drawn at the specified coordinates.
      // The rectangle is the same size as the character.
      this.ctx.fillStyle = background;
      this.ctx.fillRect(fx, fy, this.horizontalSide, this.verticalSide);

      // A clipping path is set up to prevent the character from drawing outside of the rectangle.
      this.ctx.beginPath();
      this.ctx.rect(fx, fy, this.horizontalSide, this.verticalSide);
      this.ctx.clip();

      // The character is drawn with the specified foreground color.
      this.ctx.fillStyle = foreground;
      this.ctx.fillText(char, px, py);
    }
    this.ctx.restore();
  }

  /**
   * Draws an overlay on the specified cell with the given color and opacity.
   * The overlay is drawn as a rectangle with the specified color and opacity.
   * The overlay has a border drawn around it with the specified border color and thickness.
   * The border is drawn as a series of lines on the corners of the overlay.
   * The size of the border corners is specified by the cornerSize parameter.
   * @param x - The x-coordinate of the cell to draw the overlay on.
   * @param y - The y-coordinate of the cell to draw the overlay on.
   * @param color - The color of the overlay.
   * @param opacityFactor - The opacity factor of the overlay.
   * @param borderColor - The color of the border.
   * @param borderThickness - The thickness of the border.
   * @param cornerSize - The size of the border corners.
   */
  public drawOverlayCursor(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    borderColor: string,
    borderThickness: number,
    cornerSize: number,
  ) {
    const fx = x * this.horizontalSide;
    const fy = y * this.verticalSide;

    const rgbaColor = ManipulateColors.hexToRgba(color, opacityFactor);

    this.ctx.save();
    {
      // Draw the colored overlay with opacity
      this.ctx.fillStyle = rgbaColor;
      this.ctx.fillRect(fx, fy, this.horizontalSide, this.verticalSide);

      // Set the color for the border corners
      this.ctx.strokeStyle = borderColor;
      this.ctx.lineWidth = borderThickness;

      // Draw the top-left corner
      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(fx + cornerSize, fy); // Horizontal line
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(fx, fy + cornerSize); // Vertical line
      this.ctx.stroke();

      // Draw the top-right corner
      this.ctx.beginPath();
      this.ctx.moveTo(fx + this.horizontalSide, fy);
      this.ctx.lineTo(fx + this.horizontalSide - cornerSize, fy); // Horizontal line
      this.ctx.moveTo(fx + this.horizontalSide, fy);
      this.ctx.lineTo(fx + this.horizontalSide, fy + cornerSize); // Vertical line
      this.ctx.stroke();

      // Draw the bottom-left corner
      this.ctx.beginPath();
      this.ctx.moveTo(fx, fy + this.verticalSide);
      this.ctx.lineTo(fx + cornerSize, fy + this.verticalSide); // Horizontal line
      this.ctx.moveTo(fx, fy + this.verticalSide);
      this.ctx.lineTo(fx, fy + this.verticalSide - cornerSize); // Vertical line
      this.ctx.stroke();

      // Draw the bottom-right corner
      this.ctx.beginPath();
      this.ctx.moveTo(fx + this.horizontalSide, fy + this.verticalSide);
      this.ctx.lineTo(
        fx + this.horizontalSide - cornerSize,
        fy + this.verticalSide,
      ); // Horizontal line
      this.ctx.moveTo(fx + this.horizontalSide, fy + this.verticalSide);
      this.ctx.lineTo(
        fx + this.horizontalSide,
        fy + this.verticalSide - cornerSize,
      ); // Vertical line
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}
