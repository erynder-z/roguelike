import { gameConfigManager } from '../gameConfigManager/gameConfigManager';

/**
 * Represents a point in a terminal grid with x and y coordinates.
 */
export class TerminalPoint {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  private static gameConfig = gameConfigManager.getConfig();
  public static TerminalDimensions = new TerminalPoint(
    this.gameConfig.terminal.dimensions.width,
    this.gameConfig.terminal.dimensions.height,
  );
  public static MapDimensions = new TerminalPoint(96, 48);
}
