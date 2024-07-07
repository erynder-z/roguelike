import { TerminalPoint } from '../TerminalPoint';

export type DrawableTerminal = {
  dimensions: TerminalPoint;
  drawText(
    x: number,
    y: number,
    char: string,
    fgCol: string,
    bgCol: string,
  ): void;
  drawAt(x: number, y: number, str: string, fgCol: string, bgCol: string): void;
};
