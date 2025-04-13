import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { WorldPoint } from '../mapModel/worldPoint';

/**
 * Utility class for map-related operations.
 */
export class MapUtils {
  /**
   * Finds the nearest cell from a starting point that has the specified environment glyph.
   * Uses Breadth-First Search (BFS) to guarantee finding the closest match.
   *
   * @param startPoint - The WorldPoint from where the search begins.
   * @param map - The game map object containing cells and dimensions.
   * @param targetGlyph - The Glyph enum value to search for in the cell's environment property.
   * @returns The WorldPoint coordinates of the nearest cell with the matching environment glyph,
   * or null if no such cell is found within the map boundaries.
   */
  public static findNearestCellWithGlyph(
    startPoint: WorldPoint,
    map: GameMapType,
    targetGlyph: Glyph,
  ): WorldPoint | null {
    const queue: WorldPoint[] = [];
    const visited = new Set<string>();

    const isOutOfBounds = (p: WorldPoint): boolean => {
      return startPoint.isPositionOutOfBounds(p, map);
    };

    // Check if start point is valid and add to queue
    if (!isOutOfBounds(startPoint)) {
      const startKey = `${startPoint.x},${startPoint.y}`;
      queue.push(startPoint);
      visited.add(startKey);
    } else {
      console.error('findNearestCellWithGlyph: Start point is out of bounds.');
      return null;
    }
    // Use index tracking for efficient queue dequeue simulation
    let head = 0;
    while (head < queue.length) {
      // Dequeue efficiently without using shift() which can be slow on large arrays
      const currentPoint = queue[head++];

      // Check the current cell
      const cell = map.cell(currentPoint); // Assuming map.cell(point) exists

      // Check if the current cell's environment glyph matches the target
      if (cell && cell.environment.glyph === targetGlyph) {
        return currentPoint;
      }

      // Explore neighbors
      for (const neighborPoint of currentPoint.getNeighbors(1)) {
        const neighborKey = `${neighborPoint.x},${neighborPoint.y}`;

        // Check if the neighbor is within bounds and not visited
        if (!isOutOfBounds(neighborPoint) && !visited.has(neighborKey)) {
          visited.add(neighborKey);
          queue.push(neighborPoint);
        }
      }
    }

    // If the queue is exhausted and no match was found
    return null;
  }
}
