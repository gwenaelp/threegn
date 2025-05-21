import { Vector3 } from "three";
import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class CombineXYZ extends NodeComputation {
  x: Value;
  y: Value;
  z: Value;
  constructor(sidx: number, [x, y, z]: [Value, Value, Value]) {
    super(sidx);

    this.x = x;
    this.y = y;
    this.z = z;
  }
  compute() {
    return new Vector3(
      this.x.compute(),
      this.y.compute(),
      this.z.compute()
    );
  }
}

export const combineXYZ = (...args: ConstructorParameters<typeof CombineXYZ>) => new CombineXYZ(...args);
