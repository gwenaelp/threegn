import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class MapRange extends NodeComputation {
  value: Value;
  fmin: Value;
  fmax: Value;
  tmin: Value;
  tmax: Value;
  constructor(sidx: number, [fmin, fmax, tmin, tmax, value]: [Value, Value, Value, Value, Value, Value]) {
    super(sidx);

    this.fmin = fmin;
    this.fmax = fmax;
    this.tmin = tmin;
    this.tmax = tmax;
    this.value = value;
  }
  compute() {
    const factor =
      (this.value.compute() - this.fmin.compute()) /
      (this.fmax.compute() - this.fmin.compute());
    return (
      this.tmin.compute() + factor * (this.tmax.compute() - this.tmin.compute())
    );
  }
}

export const mapRange = (...args: ConstructorParameters<typeof MapRange>) => new MapRange(...args);
