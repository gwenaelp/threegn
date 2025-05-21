import { Euler, InstancedBufferAttribute, InstancedBufferGeometry, Quaternion } from "three";
import { _index, Value } from "../nodes";
import { NodeComputation } from "./NodeComputation";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function xyzToQuaternion(x: number, y: number, z: number) {
  const values = [x, y, z].map((v) =>
    v instanceof Value ? v.compute() * DEG2RAD : v.compute()
  );
  return new Quaternion().setFromEuler(new Euler(values[0], values[1], values[2], "XYZ"));
}

export class InstanceOnPoints extends NodeComputation {
  points;
  instance;
  rotation: { x: number; y: number; z: number };
  scale: { x: Value; y: Value; z: Value };
  constructor(sidx: number, [points, instance, rotation, scale]: [Value<any>, Value<any>, { x: number; y: number; z: number }, { x: Value; y: Value; z: Value }]) {
    super(sidx);

    this.points = points;
    this.instance = instance;
    this.rotation = rotation;
    this.scale = scale;
  }
  compute() {
    const instance = this.instance.compute();

    if (!instance) {
      return;
    }

    const geometry = new InstancedBufferGeometry();
    geometry.setAttribute('position', instance.getAttribute('position'));
    geometry.setIndex(instance.index);

    const position = this.points.compute().getAttribute('position');

    // position
    geometry.setAttribute('translation', new InstancedBufferAttribute(position.array, 3, true));

    // rotation & scale
    const pointCount = position.count;
    const rotation = [];
    const scale = [];

    for (let idx = 0; idx < pointCount; idx++) {
      _index.value = idx;

      const rx = this.rotation.x;
      const ry = this.rotation.y;
      const rz = this.rotation.z;

      const sx = this.scale.x.compute();
      const sy = this.scale.y.compute();
      const sz = this.scale.z.compute();

      rotation.push(...xyzToQuaternion(rx, ry, rz));
      scale.push(sx, sy, sz);
    }

    geometry.setAttribute('rotation', new InstancedBufferAttribute(new Float32Array(rotation), 4, true));
    geometry.setAttribute('scale', new InstancedBufferAttribute(new Float32Array(scale), 3, true));

    return geometry;
  }
}

export const instanceOnPoints = (...args: ConstructorParameters<typeof InstanceOnPoints>) => new InstanceOnPoints(...args);
