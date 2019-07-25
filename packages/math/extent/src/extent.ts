/**
 * @module @id-sdk/extent
 * @description 📦 Module containing the Extent class (bounding boxes)
 */

import { geoMetersToLat, geoMetersToLon } from '@id-sdk/geo';

type Vec2 = [number, number];

interface BBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * @class
 * @description 📦 An Extent class for representing bounding boxes
 */
export class Extent {
  /** Minimum corner coordinate for the extent
   * @type {Vec2}
   * @public
   */
  public min: Vec2 = [Infinity, Infinity];

  /** Maximum corner coordinate for the extent
   * @type {Vec2}
   * @public
   */
  public max: Vec2 = [-Infinity, -Infinity];

  /** Constructs a new Extent
   * @param {Extent|Vec2} otherOrMin
   * @param {Vec2} [max]
   * @returns {Extent} new Extent
   */
  constructor(otherOrMin?: Extent | Vec2, max?: Vec2) {
    let min;
    if (otherOrMin instanceof Extent) {
      min = otherOrMin.min;
      max = otherOrMin.max;
    } else {
      min = otherOrMin;
    }

    if (min && min.length === 2) {
      this.min[0] = min[0];
      this.min[1] = min[1];
      if (!max) max = min;
    }
    if (max && max.length === 2) {
      this.max[0] = max[0];
      this.max[1] = max[1];
    }
  }

  /** Test whether extent equals another extent
   * @param {any} other
   * @returns {boolean} True if equal, false if unequal
   */
  equals(other: any): boolean {
    if (!(other instanceof Extent)) other = new Extent(other);
    return (
      this.min[0] === other.min[0] &&
      this.min[1] === other.min[1] &&
      this.max[0] === other.max[0] &&
      this.max[1] === other.max[1]
    );
  }

  /** Extend the bounds of an extent
   * @param {any} other
   * @returns {Extent} True if equal, false if unequal
   */
  extend(other: any): Extent {
    if (!(other instanceof Extent)) other = new Extent(other);
    return new Extent(
      [Math.min(other.min[0], this.min[0]), Math.min(other.min[1], this.min[1])],
      [Math.max(other.max[0], this.max[0]), Math.max(other.max[1], this.max[1])]
    );
  }

  /** Returns the area of an extent
   * @returns {number} area
   */
  area(): number {
    return Math.abs((this.max[0] - this.min[0]) * (this.max[1] - this.min[1]));
  }

  /** Returns the center point of an extent
   * @returns {Vec2} Center point of the extent
   */
  center(): Vec2 {
    return [(this.min[0] + this.max[0]) / 2, (this.min[1] + this.max[1]) / 2];
  }

  /** Returns an array rectangle as `[minX, minY, maxX, maxY]`
   * @returns {number[]} rectangle
   */
  rectangle(): number[] {
    return [this.min[0], this.min[1], this.max[0], this.max[1]];
  }

  /** Returns an Object with `minX`, `minY`, `maxX`, `maxY` properties.
   * @returns {Object} Object
   */
  bbox(): BBox {
    return { minX: this.min[0], minY: this.min[1], maxX: this.max[0], maxY: this.max[1] };
  }

  /** Returns an polygon representing the extent wound clockwise.
   * @returns {Vec2[]} Polygon array
   */
  polygon(): Vec2[] {
    return [
      [this.min[0], this.min[1]],
      [this.min[0], this.max[1]],
      [this.max[0], this.max[1]],
      [this.max[0], this.min[1]],
      [this.min[0], this.min[1]]
    ];
  }

  /** Test whether this extent contains another extent
   * @param {any} other
   * @returns {boolean} True if this extent contains other, false if not
   */
  contains(other: any): boolean {
    if (!(other instanceof Extent)) other = new Extent(other);
    return (
      other.min[0] >= this.min[0] &&
      other.min[1] >= this.min[1] &&
      other.max[0] <= this.max[0] &&
      other.max[1] <= this.max[1]
    );
  }

  /** Test whether this extent intersects another extent
   * @param {any} other
   * @returns {boolean} True if this extent intersects other, false if not
   */
  intersects(other: any): boolean {
    if (!(other instanceof Extent)) other = new Extent(other);
    return (
      other.min[0] <= this.max[0] &&
      other.min[1] <= this.max[1] &&
      other.max[0] >= this.min[0] &&
      other.max[1] >= this.min[1]
    );
  }

  /** Returns a new Extent representing the intersection of this and other extents
   * @param {any} other
   * @returns {Extent} Intersection of this and other extents
   */
  intersection(other: any): Extent {
    if (!this.intersects(other)) return new Extent();
    return new Extent(
      [Math.max(other.min[0], this.min[0]), Math.max(other.min[1], this.min[1])],
      [Math.min(other.max[0], this.max[0]), Math.min(other.max[1], this.max[1])]
    );
  }

  /** Returns the percentage of other extent contained within this extent, by area
   * @param {any} other
   * @returns {number} percentage of other extent contained within this extent
   */
  percentContainedIn(other: any): number {
    if (!(other instanceof Extent)) other = new Extent(other);
    const a1 = this.intersection(other).area();
    const a2 = this.area();

    if (a1 === Infinity || a2 === Infinity || a1 === 0 || a2 === 0) {
      return 0;
    } else {
      return a1 / a2;
    }
  }

  /** Returns a new extent representing the current extent padded by given meters
   * (this extent is assumed to be defined in geographic coordinates)
   * @param {number} meters
   * @returns {Extent} new Extent for current extent padded by given meters
   */
  padByMeters(meters: number): Extent {
    const dLat = geoMetersToLat(meters);
    const dLon = geoMetersToLon(meters, this.center()[1]);
    return new Extent(
      [this.min[0] - dLon, this.min[1] - dLat],
      [this.max[0] + dLon, this.max[1] + dLat]
    );
  }

  /** Returns a string representation of this extent's rectangle formatted as `"minX,minY,maxX,maxY"`
   * @returns {string} rectangle
   */
  toParam(): string {
    return this.rectangle().join(',');
  }
}