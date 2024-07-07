import { Terminal } from './Terminal';
import { TerminalPoint } from './TerminalPoint';

/**
 * Extends the functionality of the Terminal class to support resizing and dynamic canvas adjustments.
 */
export class ResizingTerminal extends Terminal {
  /**
   * Reinitializes the 2D rendering context of the canvas.
   */
  public reinitializeContext() {
    this.ctx = this.initializeContext();
  }

  /**
   * Adjusts the canvas size and terminal dimensions based on the provided width and height in pixels.
   * @param widthPixels - The new width of the canvas in pixels.
   * @param heightPixels - The new height of the canvas in pixels.
   */
  public resizeCanvasAndTerminal(widthPixels: number, heightPixels: number) {
    const terminalWidthCells = Math.floor(widthPixels / this.dimensions.x);
    const terminalHeightCells = Math.floor(heightPixels / this.dimensions.y);
    const sideCandidate =
      terminalWidthCells > terminalHeightCells
        ? terminalHeightCells
        : terminalWidthCells;
    this.sideLength = sideCandidate;
    this.reinitializeContext();
  }

  /**
   * Handles the window resize event by updating the canvas size and triggering a terminal resize.
   */
  public handleResize() {
    const canvas = <HTMLCanvasElement>document.getElementById('canvas1');
    const canvasContainer = <HTMLDivElement>(
      document.getElementById('canvas-container')
    );

    const containerWidth = canvasContainer.offsetWidth;
    const containerHeight = canvasContainer.offsetHeight;

    canvas.width = containerWidth;
    canvas.height = containerHeight;

    this.resizeCanvasAndTerminal(containerWidth, containerHeight);
  }

  /**
   * Creates a stock resizing terminal instance with predefined dimensions.
   * @returns A ResizingTerminal instance with stock dimensions.
   */
  public static createStockResizingTerminal(): ResizingTerminal {
    const defaultCanvas = <HTMLCanvasElement>document.getElementById('canvas1');
    const defaultCtx = <CanvasRenderingContext2D>defaultCanvas.getContext('2d');
    return new ResizingTerminal(TerminalPoint.TerminalDimensions, defaultCtx);
  }
}
