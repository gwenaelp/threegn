import * as THREE from 'three';
import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class MeshPrimitiveUVSphere extends NodeComputation {
  segments: Value;
  rings: Value;
  radius: Value;
  constructor(sidx: number, [segments, rings, radius]: [Value, Value, Value]) {
    super(sidx);

    this.segments = segments;
    this.rings = rings;
    this.radius = radius;
  }
  compute() {
    return new THREE.SphereGeometry(
      this.radius.compute(),
      this.segments.compute(),
      this.rings.compute()
    );
  }
}

export const meshPrimitiveUVSphere = (...args: ConstructorParameters<typeof MeshPrimitiveUVSphere>) => new MeshPrimitiveUVSphere(...args);
