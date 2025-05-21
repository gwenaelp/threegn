import { Euler, Matrix4, Quaternion, type BufferGeometry, type Vector3 } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function vec3ToQuaternion(v: Vector3) {
  const scaled = v.multiplyScalar(DEG2RAD);
  return new Quaternion().setFromEuler(
    new Euler(scaled.x, scaled.y, scaled.z, 'XYZ')
  );
}

export class Transform extends NodeComputation {
  geometry: Value<BufferGeometry>;
  translation: Value<Vector3>;
  rotation: Value<Vector3>;
  scale: Value<Vector3>;
  constructor(sidx: number, [geometry, translation, rotation, scale]: [Value<BufferGeometry>, Value<Vector3>, Value<Vector3>, Value<Vector3>]) {
    super(sidx);

    this.geometry = geometry;
    this.translation = translation;
    this.rotation = rotation;
    this.scale = scale;
  }
  compute() {
    const geometry = this.geometry.compute();
    if (!geometry) {
      return;
    }
    const m4 = new Matrix4().compose(
      this.translation.compute(),
      vec3ToQuaternion(this.rotation.compute()),
      this.scale.compute()
    );
    return geometry.applyMatrix4(m4);
  }
}

export const transform = (...args: ConstructorParameters<typeof Transform>) => new Transform(...args);
