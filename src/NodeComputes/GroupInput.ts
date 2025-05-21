import type { BufferGeometry } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

export class GroupInput extends NodeComputation {
  geometry: Value<BufferGeometry>;
  constructor(sidx: number, geometry: Value<BufferGeometry>) {
    super(sidx);

    this.geometry = geometry;
  }
  compute() {
    return this.geometry;
  }
}

export const groupInput = (...args: ConstructorParameters<typeof GroupInput>) => new GroupInput(...args);

