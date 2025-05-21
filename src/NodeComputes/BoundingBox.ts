import { BoxGeometry, type BufferGeometry } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

export class BoundingBox extends NodeComputation {
  geometry: Value<BufferGeometry>;
  constructor(sidx: number, [geometry]: [Value<BufferGeometry>]) {
    super(sidx);

    this.geometry = geometry;
  }
  compute() {
    const geometry = this.geometry.compute();
    if (!geometry) {
      return;
    }
    geometry.computeBoundingBox();
    const geometryBbox = geometry.boundingBox;
    if(!geometryBbox) throw 'geometryBbox undefined';
    const { max, min } = geometryBbox;

    const x = max.x - min.x;
    const y = max.y - min.y;
    const z = max.z - min.z;
    const bbox = new BoxGeometry(x, y, z, 1, 1, 1);
    bbox.translate(min.x + x / 2, min.y + y / 2, min.z + z / 2);
    if (this.sidx) {
      return [bbox, min, max][this.sidx];
    }
  }
}

export const boundingBox = (...args: ConstructorParameters<typeof BoundingBox>) => new BoundingBox(...args);
