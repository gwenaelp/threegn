import { Vector3 } from "three";
import { Value } from "../nodes";

export class InputVector {
  x: Value;
  y: Value;
  z: Value;

  constructor([x, y, z]: [number, number, number]) {
    this.x = new Value(x);
    this.y = new Value(y);
    this.z = new Value(z);
  }
  compute() {
    return new Vector3(
      this.x.compute(),
      this.y.compute(),
      this.z.compute()
    );
  }
}

export const inputVector = (v: [x: number, y: number, z: number]) => new InputVector(v);
