import { BufferAttribute, type BufferGeometry } from "three";
import type { Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class GroupOutput extends NodeComputation {
  geometry: Value<BufferGeometry>;

  constructor(sidx: number, [geometry]: [Value<BufferGeometry>]) {
    super(sidx);

    this.geometry = geometry;
  }
  compute() {
    const geometry = this.geometry.compute();
    if (geometry) {
      if (geometry.getAttribute("scale") === undefined) {
        const scale = new Float32Array(
          geometry.getAttribute("position").count * 3
        ).fill(1);
        geometry.setAttribute("scale", new BufferAttribute(scale, 3));
      }
    }
    return geometry;
  }
}

export const groupOutput = (...args: ConstructorParameters<typeof GroupOutput>) => new GroupOutput(...args);
