import { Vector3 } from "three";
import type { Value } from "../nodes";

export class Vector {
  x: Value<number>;
  y: Value<number>;
  z: Value<number>;
  constructor(x: Value<number>, y: Value<number>, z: Value<number>) {
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

export const vector = (x: Value<number>, y: Value<number>, z: Value<number>) => new Vector(x, y, z);
