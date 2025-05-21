import { BufferAttribute, BufferGeometry } from "three";
import { _index, Value, Vector } from "../nodes";
import { NodeComputation } from "./NodeComputation";

export class Points extends NodeComputation {
  count: Value;
  position: Vector;
  radius: Value;
  constructor(sidx: number, [count, position, radius]: [Value, Vector, Value]) {
    super(sidx);

    this.count = count;
    this.position = position;
    this.radius = radius;
    this.position = position || new Vector(new Value(0), new Value(0), new Value(0));
  }
  compute() {
    const points = [];

    for (let idx = 0; idx < this.count.compute(); idx++) {
      _index.value = idx;
      points.push(...this.position.compute());
    }

    const geometry = new BufferGeometry();
    const vertices = new Float32Array(points);
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));

    return geometry;
  }
}

export const points = (...args: ConstructorParameters<typeof Points>) => new Points(...args);
