import { TubeGeometry, type Curve, type Vector3 } from "three";
import { NodeComputation } from "./NodeComputation";
import type { Value } from "../nodes";

export class CurveToMesh extends NodeComputation {
  curve: { asCurve: () => Curve<Vector3>; resolution: Value };
  profile: { radius: Value; resolution: Value };
  constructor(sidx: number, [curve, profile]: [{ asCurve: () => Curve<Vector3>; resolution: Value }, { radius: Value; resolution: Value }]) {
    super(sidx);

    this.curve = curve;
    this.profile = profile;
  }
  compute() {
    return new TubeGeometry(
      this.curve.asCurve(),
      this.curve.resolution.compute(),
      this.profile.radius.compute(),
      this.profile.resolution.compute(),
      true
    );
  }
}

export const curveToMesh = (...args: ConstructorParameters<typeof CurveToMesh>) => new CurveToMesh(...args);
