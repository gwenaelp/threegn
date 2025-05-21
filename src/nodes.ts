import * as THREE from "three";
import { MeshPrimitiveCube, meshPrimitiveCube } from './NodeComputes/MeshPrimitiveCube';
import { MeshPrimitiveUVSphere, meshPrimitiveUVSphere } from './NodeComputes/MeshPrimitiveUVSphere';
import { MeshPrimitiveCylinder, meshPrimitiveCylinder } from './NodeComputes/MeshPrimitiveCylinder';
import { CombineXYZ, combineXYZ } from './NodeComputes/CombineXYZ';
import { MeshPrimitiveGrid, meshPrimitiveGrid } from './NodeComputes/MeshPrimitiveGrid';
import { SeparateXYZ, separateXYZ } from './NodeComputes/SeparateXYZ';
import { Vector, vector } from './NodeComputes/Vector';
import { CurveToMesh, curveToMesh } from './NodeComputes/CurveToMesh';
import { CurveCircle, curveCircle } from './NodeComputes/CurveCircle';
import { JoinGeometry, joinGeometry } from './NodeComputes/JoinGeometry';
import { BoundingBox, boundingBox } from './NodeComputes/BoundingBox';
import { Points, points } from './NodeComputes/Points';
import { InstanceOnPoints, instanceOnPoints } from './NodeComputes/InstanceOnPoints';
import { GroupOutput, groupOutput } from './NodeComputes/GroupOutput';
import { MapRange, mapRange } from './NodeComputes/MapRange';
import { Viewer, viewer } from './NodeComputes/Viewer';
import { Transform, transform } from './NodeComputes/Transform';
import { GroupInput, groupInput } from './NodeComputes/GroupInput';
import { InputVector, inputVector } from './NodeComputes/InputVector';
import { FilletCurve, filletCurve } from './NodeComputes/FilletCurve';

import { NodeComputation } from "./NodeComputes/NodeComputation";
import { _evaluateNode } from "./evaluator";
import type { GraphNode } from "./types/GraphNode";
import type { GraphSocket } from "./types/GraphSocket";
import type { GraphInput } from "./types/GraphInput";

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export { MeshPrimitiveCube, meshPrimitiveCube };
export { MeshPrimitiveUVSphere, meshPrimitiveUVSphere };
export { MeshPrimitiveCylinder, meshPrimitiveCylinder };
export { CombineXYZ, combineXYZ };
export { SeparateXYZ, separateXYZ };
export { MeshPrimitiveGrid, meshPrimitiveGrid };
export { Vector, vector };
export { CurveToMesh, curveToMesh };
export { CurveCircle, curveCircle };
export { JoinGeometry, joinGeometry };
export { BoundingBox, boundingBox };
export { Points, points };
export { InstanceOnPoints, instanceOnPoints };
export { GroupOutput, groupOutput };
export { MapRange, mapRange };
export { Viewer, viewer };
export { Transform, transform };
export { GroupInput, groupInput };
export { InputVector, inputVector };
export { FilletCurve, filletCurve };

export class Index {
  value: any;
  compute() {
    return this.value;
  }
}

export const index = () => new Index();

export let _index = index();

// Inputs
export class Value<T = number> {
  value: T;
  constructor(value: T) {
    this.value = value;
  }
  compute() {
    return this.value;
  }
}

export const value = (v: number) => new Value(v);

export class BooleanValue {
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
  compute() {
    return this.value;
  }
}

export const boolean = (v: boolean) => new BooleanValue(v);


// Math

type MathComputeFunction =
  ((a: number) => number) |
  ((a: number, b:number) => number) |
  ((a: number, b:number, c:number) => number) |
  ((a: THREE.Vector3, b:THREE.Vector3) => THREE.Vector3)
function createMathOperation(compute: MathComputeFunction) {
  return (sidx: number, inputs: Value[]) => ({
    compute: () => compute(...inputs.map((inp) => inp.compute())),
  });
}

export const power = createMathOperation((base: number, exponent: number) =>
  Math.pow(base, exponent)
);

export const subtract = createMathOperation((a: number, b: number) => a - b);
export const add = createMathOperation((a: number, b: number) => a + b);
export const cos = createMathOperation((a: number) => Math.cos(a));
export const abs = createMathOperation((a: number) => Math.abs(a));
export const exp = createMathOperation((a: number) => Math.exp(a));
export const min = createMathOperation((a: number, b: number) => Math.min(a, b));
export const max = createMathOperation((a: number, b: number) => Math.max(a, b));
export const sqrt = createMathOperation((a: number) => Math.sqrt(a));
export const inverseSqrt = createMathOperation((a: number) => 1 / Math.sqrt(a));
export const toRad = createMathOperation((a: number) => a * DEG2RAD);
export const modulo = createMathOperation((a: number, b: number) => a % b);
export const floor = createMathOperation((a: number) => Math.floor(a));
export const divide = createMathOperation((a: number, b: number) => a / b);
export const multiplyAdd = createMathOperation((a: number, b: number, c: number) => a * b + c);
export const multiply = createMathOperation((a: number, b: number) => a * b);
export const logarithm = createMathOperation((v: number, base: number) => Math.log(v) / Math.log(base));

export const vecAdd = createMathOperation((a: THREE.Vector3, b: THREE.Vector3) => a.add(b));
export const vecSubtract = createMathOperation((a: THREE.Vector3, b: THREE.Vector3) => a.sub(b));
export const vecDivide = createMathOperation((a: THREE.Vector3, b: THREE.Vector3) => a.divide(b));


class CurvePrimitiveQuadrilaterl extends NodeComputation {
  width: Value;
  height: Value;
  constructor(sidx: number, [width, height]: [Value, Value]) {
    super(sidx);

    this.width = width;
    this.height = height;
  }
  compute() {
    const geometry = new THREE.BufferGeometry();
    const w = this.width.compute();
    const h = this.height.compute();
    const vertices = new Float32Array([w / 2, 0, h / 2, -w / 2, 0, h / 2, -w / 2, 0, -h / 2, w / 2, 0, -h / 2]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 1, 2, 3, 0]), 1));
    (geometry as any).__type = "curve";
    return geometry;
  }
}

export const curvePrimitiveQuadrilaterl = (...args: ConstructorParameters<typeof CurvePrimitiveQuadrilaterl>) => new CurvePrimitiveQuadrilaterl(...args);


function _readValue(input: GraphInput) {
  return input.links.map(({ node, socket }) => [
    node,
    node.outputs.findIndex((out: { identifier: GraphSocket; }) => out.identifier === socket),
  ]);
}

// takes `_node` and `idx` of an input socket to read a value from
// returns a tuple with `sidx` of a linked socket and linked node
function readValue(_node: GraphNode, idx: number) {
  const input = _node.inputs[idx];
  if (input.is_multi_input) {
    return _readValue(input);
  } else if (input.links[0]) {
    return _readValue(input)[0];
  } else if (input.type === "VECTOR") {
    return [
      {
        type: "INPUT_VECTOR",
        outputs: [{ value: new THREE.Vector3(...input.value) }],
      },
      0,
    ];
  } else {
    return [
      {
        type: { BOOLEAN: "BOOLEAN" }[input.type] || "VALUE",
        outputs: [{ value: input.value }],
      },
      0,
    ];
  }
}

function applyNode(f: any, inputs: number[]) {
  return (node: GraphNode, sidx) =>
    f(sidx, inputs.map((idx: number) => _evaluateNode(readValue(node, idx))));
}

export const nodeTypeToFn: Record<string, (node: GraphNode, sidx?: any) => any> = {
  INDEX: (_node) => {
    return _index;
  },
  // FIXME: not implemented yet
  SET_MATERIAL: (node) => _evaluateNode(readValue(node, 0)),

  GROUP_INPUT: (node, sidx) => groupInput(sidx, node.outputs[0].value),

  // manual inputs reading directly from outputs
  VALUE: (node) => value(node.outputs[0].value),
  BOOLEAN: (node) => boolean(node.outputs[0].value),
  INPUT_VECTOR: (node) => inputVector(node.outputs[0].value),

  GROUP_OUTPUT: applyNode(groupOutput, [0]),
  VIEWER: applyNode(viewer, [0]),
  TRANSFORM: applyNode(transform, [0, 1, 2, 3]),
  INSTANCE_ON_POINTS: applyNode(instanceOnPoints, [0, 2, 5, 6]),
  POINTS: applyNode(points, [0, 1, 2]),

  VECT_MATH: (node) => _evaluateNode([{ ...node, type: `VECT_MATH/${node.operation}` }, 0]),
  "VECT_MATH/ADD": applyNode(vecAdd, [0, 1]),
  "VECT_MATH/SUBTRACT": applyNode(vecSubtract, [0, 1]),
  "VECT_MATH/DIVIDE": applyNode(vecDivide, [0, 1]),

  MATH: (node) => _evaluateNode([{ ...node, type: `MATH/${node.operation}` }, 0]),
  "MATH/MULTIPLY": applyNode(multiply, [0, 1]),
  "MATH/MULTIPLY_ADD": applyNode(multiplyAdd, [0, 1, 2]),
  "MATH/DIVIDE": applyNode(divide, [0, 1]),
  "MATH/ADD": applyNode(add, [0, 1]),
  "MATH/SUBTRACT": applyNode(subtract, [0, 1]),
  "MATH/MODULO": applyNode(modulo, [0, 1]),
  "MATH/POWER": applyNode(power, [0, 1]),
  "MATH/LOGARITHM": applyNode(logarithm, [0, 1]),
  "MATH/MINIMUM": applyNode(min, [0, 1]),
  "MATH/MAXIMUM": applyNode(max, [0, 1]),
  "MATH/ABSOLUTE": applyNode(abs, [0]),
  "MATH/EXPONENT": applyNode(exp, [0]),
  "MATH/SQRT": applyNode(sqrt, [0]),
  "MATH/INVERSE_SQRT": applyNode(inverseSqrt, [0]),
  "MATH/FLOOR": applyNode(floor, [0]),
  "MATH/COSINE": applyNode(cos, [0]),
  "MATH/RADIANS": applyNode(toRad, [0]),

  COMBXYZ: applyNode(combineXYZ, [0, 1, 2]),
  SEPXYZ: applyNode(separateXYZ, [0]),
  CURVE_TO_MESH: applyNode(curveToMesh, [0, 1]),
  FILLET_CURVE: applyNode(filletCurve, [0, 1, 2, 3]),
  CURVE_PRIMITIVE_CIRCLE: applyNode(curveCircle, [0, 4]),
  CURVE_PRIMITIVE_QUADRILATERAL: applyNode(curvePrimitiveQuadrilaterl, [0, 1]),
  BOUNDING_BOX: applyNode(boundingBox, [0]),
  MESH_PRIMITIVE_CUBE: applyNode(meshPrimitiveCube, [0, 1, 2, 3]),
  MESH_PRIMITIVE_CYLINDER: applyNode(meshPrimitiveCylinder, [0, 1, 2, 3, 4]),
  MESH_PRIMITIVE_UV_SPHERE: applyNode(meshPrimitiveUVSphere, [0, 1, 2]),
  MESH_PRIMITIVE_GRID: applyNode(meshPrimitiveGrid, [0, 1, 2, 3]),
  MAP_RANGE: applyNode(mapRange, [1, 2, 3, 4, 0]),

  // nodes with multiple inputs per socket
  JOIN_GEOMETRY: (node: GraphNode) => joinGeometry(readValue(node, 0).map((n) => _evaluateNode(n))),
};