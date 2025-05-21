import { mergeBufferGeometries } from "three-stdlib";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";
import type { BufferGeometry } from "three";

export class JoinGeometry extends NodeComputation {
  geometries: Value<BufferGeometry>[];
  constructor(geometries: Value<BufferGeometry>[]) {
    super(undefined);

    this.geometries = geometries;
  }
  compute() {
    if (this.geometries.length > 0) {
      return mergeBufferGeometries(
        this.geometries.map((g) => g.compute()),
        false
      );
    }
  }
}

export const joinGeometry = (...args: ConstructorParameters<typeof JoinGeometry>) => new JoinGeometry(...args);
