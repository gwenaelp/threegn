import { BufferAttribute, BufferGeometry, EllipseCurve, Vector2, Vector3 } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

export class CurveCircle extends NodeComputation {
  resolution: Value;
  radius: Value;
  constructor(sidx: number, [resolution, radius]: [Value, Value]) {
    super(sidx);

    this.resolution = resolution;
    this.radius = radius;
  }
  asCurve() {
    const curve = new EllipseCurve(
      0,
      0,
      this.radius.compute(),
      this.radius.compute(),
      0,
      2 * Math.PI,
      false,
      0
    );
    const getPoint = curve.getPoint.bind(curve);
    curve.getPoint = (t, target = new Vector2()) =>
      getPoint(t, new Vector3(target.x, target.y, 0));
    return curve;
  }
  compute() {
    const points = this.asCurve()
      .getPoints(this.resolution.compute())
      .flatMap((a) => a.toArray());
    const geometry = new BufferGeometry();
    const vertices = new Float32Array(points);
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    return geometry;
  }
}

export const curveCircle = (...args: ConstructorParameters<typeof CurveCircle>) => new CurveCircle(...args);
