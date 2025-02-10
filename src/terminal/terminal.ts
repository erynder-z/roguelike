import { DrawableTerminal } from '../types/terminal/drawableTerminal';
import { ManipulateColors } from '../utilities/colors/manipulateColors';
import { TerminalPoint } from './terminalPoint';

const SLASH_DIRECTIONS = [
  'diagonalTLBR',
  'diagonalTRBL',
  'horizontal',
  'vertical',
];
const MIN_FACTOR = 0.75;
const MAX_FACTOR = 1.15;
const FACTOR_RANGE = MAX_FACTOR - MIN_FACTOR;

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
   * Initializes and configures the canvas rendering context.
   * Sets canvas dimensions, styles, and translation to ensure proper
   * text alignment and rendering. Adjusts font size based on the scaling factor.
   *
   * @return {CanvasRenderingContext2D} The initialized and configured rendering context.
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
   * Creates a stock terminal object with the default canvas and context.
   *
   * @return {Terminal} The created terminal object.
   */
  public static createStockTerminal(): Terminal {
    const defaultCanvas = <HTMLCanvasElement>document.getElementById('canvas1');
    const defaultCtx = <CanvasRenderingContext2D>defaultCanvas.getContext('2d');
    return new Terminal(TerminalPoint.TerminalDimensions, defaultCtx);
  }

  /**
   * Draws a string of text on the terminal at the given coordinates.
   * @param {number} x The x-coordinate of the starting position.
   * @param {number} y The y-coordinate of the starting position.
   * @param {string} text The string of text to draw.
   * @param {string} foreground The foreground color.
   * @param {string} background The background color.
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
   * Draws a single character on the terminal at the specified coordinates.
   *
   * This method calculates the pixel position for the character within the grid cell
   * and centers it. It sets the background color for the cell and clips the drawing area
   * to ensure the character does not overflow outside its designated cell.
   *
   * @param {number} x - The x-coordinate of the cell position.
   * @param {number} y - The y-coordinate of the cell position.
   * @param {string} char - The character to draw.
   * @param {string} foreground - The color of the character.
   * @param {string} background - The color of the cell's background.
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
   * Draws an overlay cursor on the terminal at the specified coordinates
   * with a colored box and a border with a specific color and thickness.
   *
   * @param {number} x The x-coordinate of the cell position.
   * @param {number} y The y-coordinate of the cell position.
   * @param {string} color The color of the overlay.
   * @param {number} opacityFactor The opacity factor for the overlay.
   * @param {string} borderColor The color of the border.
   * @param {number} borderThickness The thickness of the border.
   * @param {number} cornerSize The size of the corners of the border.
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

  /**
   * Draws a slash attack effect on the terminal at the specified coordinates.
   *
   * The slash attack effect is a randomly chosen diagonal, horizontal or vertical line.
   * The line is colored with the specified color and has the specified opacity factor and thickness.
   *
   * @param {number} x The x-coordinate of the cell position.
   * @param {number} y The y-coordinate of the cell position.
   * @param {string} color The color of the line.
   * @param {number} opacityFactor The opacity factor for the line.
   * @param {number} thickness The thickness of the line.
   */

  public drawSlashAttackOverlay(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    thickness: number,
  ) {
    // Cache frequently used values locally.
    const { horizontalSide, verticalSide, ctx } = this;
    const fx = x * horizontalSide;
    const fy = y * verticalSide;

    // Use a precomputed constant array and bitwise floor.
    const direction =
      SLASH_DIRECTIONS[(Math.random() * SLASH_DIRECTIONS.length) | 0];

    // Set stroke style and width.
    ctx.strokeStyle = ManipulateColors.hexToRgba(color, opacityFactor);
    ctx.lineWidth = thickness;
    ctx.beginPath();

    // Depending on the direction, compute endpoints.
    switch (direction) {
      case 'diagonalTLBR': {
        const startFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const endFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        ctx.moveTo(
          fx + horizontalSide * startFactor,
          fy + verticalSide * startFactor,
        );
        ctx.lineTo(
          fx + horizontalSide * (1 - endFactor),
          fy + verticalSide * (1 - endFactor),
        );
        break;
      }
      case 'diagonalTRBL': {
        const startFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const endFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        ctx.moveTo(
          fx + horizontalSide * (1 - startFactor),
          fy + verticalSide * startFactor,
        );
        ctx.lineTo(
          fx + horizontalSide * endFactor,
          fy + verticalSide * (1 - endFactor),
        );
        break;
      }
      case 'horizontal': {
        const startXFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const endXFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const tiltYStart = (Math.random() - 0.5) * verticalSide;
        const tiltYEnd = (Math.random() - 0.5) * verticalSide;
        ctx.moveTo(
          fx + horizontalSide * startXFactor,
          fy + verticalSide * 0.5 + tiltYStart,
        );
        ctx.lineTo(
          fx + horizontalSide * (1 - endXFactor),
          fy + verticalSide * 0.5 + tiltYEnd,
        );
        break;
      }
      case 'vertical': {
        const startYFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const endYFactor = MIN_FACTOR + Math.random() * FACTOR_RANGE;
        const tiltXStart = (Math.random() - 0.5) * horizontalSide;
        const tiltXEnd = (Math.random() - 0.5) * horizontalSide;
        ctx.moveTo(
          fx + horizontalSide * 0.5 + tiltXStart,
          fy + verticalSide * startYFactor,
        );
        ctx.lineTo(
          fx + horizontalSide * 0.5 + tiltXEnd,
          fy + verticalSide * (1 - endYFactor),
        );
        break;
      }
    }

    // Render the line.
    ctx.stroke();
  }

  /**
   * Draws a burst attack effect on the terminal at the specified coordinates.
   *
   * The burst attack effect is a series of lines that are evenly spaced and
   * radiate from the center of the cell. The lines are colored with the specified
   * color and have the specified opacity factor and thickness.
   *
   * @param {number} x The x-coordinate of the cell position.
   * @param {number} y The y-coordinate of the cell position.
   * @param {string} color The color of the lines.
   * @param {number} opacityFactor The opacity factor for the lines.
   * @param {number} thickness The thickness of the lines.
   */
  public drawBurstAttackOverlay(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    thickness: number,
  ) {
    const fx = x * this.horizontalSide + this.horizontalSide * 0.5;
    const fy = y * this.verticalSide + this.verticalSide * 0.5;

    this.ctx.strokeStyle = ManipulateColors.hexToRgba(color, opacityFactor);
    this.ctx.lineWidth = thickness;

    this.ctx.beginPath();
    for (let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      const x2 = fx + Math.cos(rad) * this.horizontalSide * 0.4;
      const y2 = fy + Math.sin(rad) * this.verticalSide * 0.4;
      this.ctx.moveTo(fx, fy);
      this.ctx.lineTo(x2, y2);
    }
    this.ctx.stroke();
  }
}
