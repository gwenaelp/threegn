import * as THREE from 'three';
import { NodeComputation } from './NodeComputation';
import type { Value } from '../nodes';

export class MeshPrimitiveCylinder extends NodeComputation {
  vertices: Value;
  sideSegments: Value;
  fillSegments: Value;
  radius: Value;
  depth: Value;
  constructor(sidx: number, [vertices, sideSegments, fillSegments, radius, depth]: [Value, Value, Value, Value, Value]) {
    super(sidx);

    this.vertices = vertices;
    this.sideSegments = sideSegments;
    this.fillSegments = fillSegments;
    this.radius = radius;
    this.depth = depth;
    // TODO: threejs cylinder is diff here
  }
  compute() {
    return new THREE.CylinderGeometry(
      this.radius.compute(),
      this.radius.compute(),
      this.depth.compute(),
      this.vertices.compute(),
      this.sideSegments.compute()
    );
  }
}

export const meshPrimitiveCylinder = (...args: ConstructorParameters<typeof MeshPrimitiveCylinder>) => new MeshPrimitiveCylinder(...args);
