import * as THREE from 'three';
import { type Value } from "../nodes";
import { NodeComputation } from './NodeComputation';

export class MeshPrimitiveCube extends NodeComputation {
  size: Value<[number, number, number]>;
  vx: Value;
  vy: Value;
  vz: Value;
  constructor(sidx: number, [size, vx, vy, vz]: [Value<[number, number, number]>, Value, Value, Value]) {
    super(sidx);

    this.size = size;
    this.vx = vx;
    this.vy = vy;
    this.vz = vz;
  }
  compute() {
    const [sx, sy, sz] = this.size.compute();
    return new THREE.BoxGeometry(sx, sy, sz, this.vx.compute() - 1, this.vy.compute() - 1, this.vz.compute() - 1);
  }
}

export const meshPrimitiveCube = (...args: ConstructorParameters<typeof MeshPrimitiveCube>) => new MeshPrimitiveCube(...args);
