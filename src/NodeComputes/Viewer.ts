import type { BufferGeometry } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

export class Viewer extends NodeComputation {
  geometry: Value<BufferGeometry>;
  constructor(sidx: number, [geometry]: [Value<BufferGeometry>]) {
    super(sidx);
    this.geometry = geometry;
  }
  compute() {
    return this.geometry.compute();
  }
}

export const viewer = (...args: ConstructorParameters<typeof Viewer>) => new Viewer(...args);
