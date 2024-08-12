import { Corpse } from '../Mobs/Corpse';
import { EnvEffect } from './Types/EnvEffect';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a cell on the game map.
 */
export class MapCell {
  constructor(public env: Glyph) {}

  public mob: Mob | undefined;
  public lit: boolean | undefined = false;
  public obj: ItemObject | undefined;
  public sprite: Glyph | undefined;
  public envDesc: string | undefined;
  public envEffects: EnvEffect[] = [];
  public corpse: Corpse | undefined;

  /**
   * Adds an environment effect to the current map cell if it does not already exist.
   *
   * @param {EnvEffect} effect - The environment effect to add.
   */
  public addEnvEffect(effect: EnvEffect) {
    if (this.envEffects.includes(effect)) return;

    this.envEffects.push(effect);
  }

  /**
   * Removes an environment effect from the current map cell.
   *
   * @param {EnvEffect} effect - The environment effect to remove.
   */
  public removeEnvEffect(effect: EnvEffect) {
    this.envEffects = this.envEffects.filter(e => e !== effect);
  }

  /**
   * Clears all environment effects from the current map cell.
   */
  public clearAllEnvEffects() {
    this.envEffects = [];
  }

  /**
   * Dynamically retrieves the glyph information based on the current environment.
   *
   * @return {GlyphInfo} the glyph information
   */
  private get glyphInfo(): GlyphInfo {
    return GlyphMap.getGlyphInfo(this.env);
  }

  /**
   * Return the glyph of the mob if it exists, otherwise return the environment glyph.
   *
   * @return {Glyph} the glyph of the mob if it exists, otherwise the environment glyph
   */
  public glyph(): Glyph {
    return this.mob ? this.mob.glyph : this.env;
  }

  /**
   * Returns only the environment Glyph.
   *
   * @return {Glyph} the Glyph environment
   */
  public glyphEnvOnly(): Glyph {
    return this.env;
  }

  /**
   * Returns object Glyph, if it exists and the environment Glyph otherwise.
   *
   * @return {Glyph} the Glyph object
   */
  public glyphObjOrEnv(): Glyph {
    return this.obj ? this.obj.glyph : this.env;
  }

  /**
   * Returns the sprite glyph if it exists, otherwise returns the glyph of the object if it exists,
   * otherwise returns the environment glyph.
   *
   * @return {Glyph} The sprite glyph, object glyph, or environment glyph.
   */
  public glyphSpriteOrObjOrEnv(): Glyph {
    if (this.sprite) return this.sprite;

    return this.obj ? this.obj.glyph : this.env;
  }

  /**
   * Returns the sprite glyph if it exists, otherwise returns the glyph of the object if it exists,
   * otherwise returns the corpse glyph if it exists, otherwise returns the environment glyph.
   *
   * @return {Glyph} The sprite glyph, object glyph, corpse glyph, or environment glyph.
   */
  public glyphSpriteOrObjOrCorpseOrEnv(): Glyph {
    if (this.sprite) return this.sprite;

    if (this.obj) return this.obj.glyph;

    return this.corpse ? this.corpse.glyph : this.env;
  }

  /**
   * Checks if the current cell has an object on it
   *
   * @return {boolean} Returns true if the object property is truthy, false otherwise.
   */
  public hasObject(): boolean {
    return !!this.obj;
  }

  /**
   * Check if the cell is blocked.
   *
   * @return {boolean} true if the cell is blocked, false otherwise
   */
  public isBlocked(): boolean {
    const isBlockingEnv = this.glyphInfo.isBlockingMovement || false;
    return !!this.mob || isBlockingEnv;
  }

  /**
   * Checks if the current cell is blocking projectiles.
   *
   * @return {boolean} Returns true if the cell is blocking projectiles, false otherwise.
   */
  public isBlockingProjectiles(): boolean {
    const isBlockingEnv = this.glyphInfo.isBlockingProjectiles || false;
    return !!this.mob || isBlockingEnv;
  }

  /**
   * Check if the environment of a cell is opaque.
   *
   * @return {boolean} true if the environment is opaque, false otherwise
   */
  public isOpaque(): boolean {
    return this.glyphInfo.isOpaque || false;
  }

  /**
   * Check if the cell is slowing due to the environment.
   *
   * @return {boolean} true if the cell is slowing, false otherwise
   */
  public isCausingSlow(): boolean {
    return this.glyphInfo.isCausingSlow || false;
  }

  /**
   * Check if the cell causes burn due to the environment.
   *
   * @return {boolean} true if the cell is causing burn, false otherwise
   */
  public isCausingBurn(): boolean {
    return this.glyphInfo.isCausingBurn || false;
  }

  /**
   * Check if the cell is magnetic.
   *
   * @return {boolean} true if the cell is magnetic, false otherwise
   */
  public isMagnetic(): boolean {
    return this.glyphInfo.isMagnetic || false;
  }

  /**
   * Check if the cell is causing bleed due to the environment.
   *
   * @return {boolean} true if the cell is causing bleed, false otherwise
   */
  public isCausingBleed(): boolean {
    return this.glyphInfo.isCausingBleed || false;
  }

  /**
   * Check if the cell is glowing.
   *
   * @return {boolean} true if the cell is glowing, false otherwise
   */
  public isGlowing(): boolean {
    return this.glyphInfo.isGlowing || false;
  }

  /**
   * Check if the cell is causing poison due to the environment.
   *
   * @return {boolean} true if the cell is causing poison, false otherwise
   */
  public isCausingPoison(): boolean {
    return (
      this.glyphInfo.isCausingPoison ||
      this.envEffects.includes(EnvEffect.Poison) ||
      false
    );
  }

  /**
   * Determines if the current cell is causing confusion.
   *
   * @return {boolean} True if the cell is causing confusion, false otherwise.
   */
  public isCausingConfusion(): boolean {
    return (
      this.glyphInfo.isCausingConfusion ||
      this.envEffects.includes(EnvEffect.Confusion) ||
      false
    );
  }

  /**
   * Checks if the current cell is a hidden trap.
   *
   * @return {boolean} True if the cell is a hidden trap, false otherwise.
   */
  public isHiddenTrap(): boolean {
    return this.env === Glyph.HiddenTrap;
  }

  /**
   * Checks if the current cell is a chasm.
   *
   * @return {boolean} True if the cell is a chasm, false otherwise.
   */
  public isChasm(): boolean {
    return this.env === Glyph.ChasmEdge || this.env === Glyph.ChasmCenter;
  }

  /**
   * Determines if the current cell is water.
   *
   * @return {boolean} True if the cell is water, false otherwise.
   */
  public isWater(): boolean {
    return this.env === Glyph.ShallowWater || this.env === Glyph.DeepWater;
  }
}
