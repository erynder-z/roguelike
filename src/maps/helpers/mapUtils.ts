import { EnvironmentChecker } from '../../gameLogic/environment/environmentChecker';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { IrregularShapeAreaGenerator } from './irregularShapeAreaGenerator';
import { RandomGenerator } from '../../randomGenerator/randomGenerator';
import { WeightedFeatureConfig } from '../../types/gameLogic/maps/helpers/weightedFeatures';
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

  /**
   * Selects a weighted feature from a list of features based on their weights.
   *
   * @param {WeightedFeatureConfig[]} features - An array of features with associated weights.
   * @param {RandomGenerator} rand - The random generator used to pick a feature based on weight.
   * @return {WeightedFeatureConfig | null} The selected feature or null if the total weight is zero or less.
   */
  public static selectWeightedFeature(
    features: WeightedFeatureConfig[],
    rand: RandomGenerator,
  ): WeightedFeatureConfig | null {
    const totalWeight = features.reduce((sum, f) => sum + f.weight, 0);
    if (totalWeight <= 0) {
      return null;
    }

    let randomWeight = rand.randomIntegerClosedRange(1, totalWeight);

    for (const feature of features) {
      randomWeight -= feature.weight;
      if (randomWeight <= 0) {
        return feature;
      }
    }

    // If the loop completes and no feature was selected, return null
    return null;
  }

  /**
   * Modifies terrain in a map by replacing certain glyphs with another glyph,
   * attempting to create irregularly shaped patches of the new glyph.
   *
   * @param {GameMapType} m - The map to modify.
   * @param {RandomGenerator} rand - The random generator used to generate patch sizes, positions, and shapes.
   * @param {WorldPoint} dim - The dimensions of the map.
   * @param {number} attempts - The number of patches to attempt to generate.
   * @param {number} minPatchSize - The minimum size of a generated patch.
   * @param {number} maxPatchSize - The maximum size of a generated patch.
   * @param {number} iterations - The number of iterations to run for each patch.
   * @param {Glyph | Glyph[]} targetGlyphs - The glyphs to replace with the result glyph.
   * @param {Glyph} resultGlyph - The glyph to replace the target glyphs with.
   */
  public static applyTerrainModifier(
    m: GameMapType,
    rand: RandomGenerator,
    dim: WorldPoint,
    attempts: number,
    minPatchSize: number,
    maxPatchSize: number,
    iterations: number,
    targetGlyphs: Glyph | Glyph[],
    resultGlyph: Glyph,
  ): void {
    const targets = Array.isArray(targetGlyphs) ? targetGlyphs : [targetGlyphs];
    if (targets.length === 0) return;

    for (let i = 0; i < attempts; i++) {
      const patchSize = rand.randomIntegerClosedRange(
        minPatchSize,
        maxPatchSize,
      );
      const patchArea = IrregularShapeAreaGenerator.generateIrregularShapeArea(
        dim,
        rand,
        patchSize,
        iterations,
      );

      for (const p of patchArea) {
        if (m.isLegalPoint(p)) {
          const currentGlyph = m.cell(p).env;

          if (targets.includes(currentGlyph)) {
            m.cell(p).env = resultGlyph;
            EnvironmentChecker.addStaticCellEffects(m.cell(p));
          }
        }
      }
    }
  }
}
