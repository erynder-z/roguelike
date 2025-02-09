import { TerminalPoint } from '../../terminal/terminalPoint';

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

  drawOverlayCursor(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    borderColor: string,
    borderThickness: number,
    cornerSize: number,
  ): void;

  drawSlashAttackOverlay(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    thickness: number,
  ): void;

  drawBurstAttackOverlay(
    x: number,
    y: number,
    color: string,
    opacityFactor: number,
    thickness: number,
  ): void;
};
