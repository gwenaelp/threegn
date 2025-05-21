import type { Vector3 } from "three";
import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class SeparateXYZ extends NodeComputation {
  vector: Value<Vector3>;
  constructor(sidx: number, [vector]: [Value<Vector3>]) {
    super(sidx);

    this.vector = vector;
  }
  compute() {
    const vec = this.vector.compute().toArray();
    if(this.sidx) {
      return vec[this.sidx];
    }
  }
}

export const separateXYZ = (...args: ConstructorParameters<typeof SeparateXYZ>) => new SeparateXYZ(...args);
