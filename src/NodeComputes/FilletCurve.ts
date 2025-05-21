import { BufferGeometry, Vector3, type TypedArray } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

function positionToVerts(array: TypedArray) {
  const verts = [];
  for (let idx = 0; idx < array.length; idx += 3) {
    verts.push(new Vector3(array[idx], array[idx + 1], array[idx + 2]));
  }
  return verts;
}

function vertsToSegments(verts: Vector3[]) {
  const segments = [];
  segments.push([verts[verts.length - 1], verts[0]]);
  for (let idx = 0; idx < verts.length - 1; idx++) {
    segments.push([verts[idx], verts[idx + 1]]);
  }
  return segments;
}
/*
function axisAngleNormalizedToMat3(axis: number, angle: number) {
  const mat3 = new THREE.Matrix3();
  const acos = Math.cos(angle);

  mat3.set(axis, axis, axis, axis, axis, axis, axis, axis, axis);
}
*/
/*
function rotateAroundAxis(v: string, center: THREE.Vector3, axis: any, angle: number) {
  const result = v.sub(center);
  const mat3 = axisAngleNormalizedToMat3(axis, angle);
  return result.add(center);
}
*/
export class FilletCurve extends NodeComputation {
  curve: Value<BufferGeometry>;
  count: Value;
  radius: Value;
  limit: Value;
  constructor(sidx: any, [curve, count, radius, limit]: [Value<BufferGeometry>, Value, Value, Value]) {
    super(sidx);

    this.curve = curve;
    this.count = count;
    this.radius = radius;
    this.limit = limit;
  }
  compute() {
    const geometry = this.curve.compute();
    if (!geometry) {
      return;
    }
    const radius = this.radius.compute();
    const verts = positionToVerts(geometry.attributes.position.array);
    const segments = vertsToSegments(verts);
    const directions = segments.map(([a, b]) => b.sub(a).normalize());
    const angles = directions.map((dir, idx) => Math.PI - dir.negate().angleTo(directions[idx + 1] || directions[0]));
    // verts.map((v, idx) => {
    //   const dir = directions[idx];
    //   const angle = angles[idx];
    //   const d = radius * Math.tan(angle / 2);
    //   const prevDir =
    //     directions[idx === 0 ? verts.length - 1 : idx - 1].negate();
    //   const nextDir = directions[idx];
    //   const aStart = v.add(prevDir.multiplyScalar(d));
    //   const aEnd = v.add(nextDir.multiplyScalar(d));

    //   const axis = prevDir.cross(nextDir).normalize().negate();
    //   const centerDir = nextDir.add(prevDir).multiplyScalar(0.5).normalize();
    //   const distToCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(d, 2));
    //   const center = v.add(centerDir.multiplyScalar(distToCenter));
    //   const segmentAngle = angle / (middle + 1);
    // });
    return geometry;
  }
}

export const filletCurve = (...args: ConstructorParameters<typeof FilletCurve>) => new FilletCurve(...args);
