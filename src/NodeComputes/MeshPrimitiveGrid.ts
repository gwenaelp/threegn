import { PlaneGeometry } from "three";
import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class MeshPrimitiveGrid extends NodeComputation {
  sx: Value;
  sy: Value;
  vx: Value;
  vy: Value;

  constructor(sidx: number, [sx, sy, vx, vy]: [Value, Value, Value, Value]) {
    super(sidx);

    this.sx = sx;
    this.sy = sy;
    this.vx = vx;
    this.vy = vy;
  }
  compute() {
    return new PlaneGeometry(
      this.sx.compute(),
      this.sy.compute(),
      this.vx.compute(),
      this.vy.compute()
    );
  }
}

export const meshPrimitiveGrid = (...args: ConstructorParameters<typeof MeshPrimitiveGrid>) => new MeshPrimitiveGrid(...args);
