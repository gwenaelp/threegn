import { expect, test } from 'vitest';
import * as evaluator from "../src/evaluator";
import getPositionAttributeValue from './utils/getPositionAttributeValue';

test('simple cube', () => {
  let { geometry } = evaluator.buildNodes([{"name":"Cube","label":"","default_label":"Cube","type":"MESH_PRIMITIVE_CUBE","inputs":[{"name":"Size","identifier":"Size","type":"VECTOR","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":[1,1,1]},{"name":"Vertices X","identifier":"Vertices X","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2},{"name":"Vertices Y","identifier":"Vertices Y","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2},{"name":"Vertices Z","identifier":"Vertices Z","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2}],"outputs":[{"name":"Mesh","identifier":"Mesh","type":"GEOMETRY","links":[{"node":"Group Output","socket":"Output_1"}],"display_shape":"CIRCLE"}],"color":[0.6079999804496765,0.6079999804496765,0.6079999804496765],"location":[546.25,-248.251953125],"dimensions":[280,402],"id":"1"},{"name":"Group Output","label":"","default_label":"Group Output","type":"GROUP_OUTPUT","inputs":[{"name":"Geometry","identifier":"Output_1","type":"GEOMETRY","links":[{"node":"Cube","socket":"Mesh"}],"display_shape":"CIRCLE","is_multi_input":false},{"name":"","identifier":"__extend__","type":"CUSTOM","links":[],"display_shape":"CIRCLE","is_multi_input":false}],"outputs":[],"color":[0.6079999804496765,0.6079999804496765,0.6079999804496765],"location":[716.25,-248.251953125],"dimensions":[280,144],"id":"2"}]);

  expect(JSON.stringify(getPositionAttributeValue(geometry))).toBe(JSON.stringify([
    [0.5,0.5,0.5,0.5],
    [0.5,0.5,-0.5,0.5],
    [0.5,-0.5,0.5,0.5],
    [0.5,-0.5,-0.5,-0.5],
    [-0.5,0.5,-0.5,-0.5],
    [-0.5,0.5,0.5,-0.5],
    [-0.5,-0.5,-0.5,-0.5],
    [-0.5,-0.5,0.5,-0.5],
    [-0.5,0.5,-0.5,0.5],
    [0.5,0.5,-0.5,-0.5],
    [-0.5,0.5,0.5,0.5],
    [0.5,0.5,0.5,-0.5],
    [-0.5,-0.5,0.5,0.5],
    [0.5,-0.5,0.5,-0.5],
    [-0.5,-0.5,-0.5,0.5],
    [0.5,-0.5,-0.5,-0.5],
    [-0.5,0.5,0.5,0.5],
    [0.5,0.5,0.5,-0.5],
    [-0.5,-0.5,0.5,0.5],
    [0.5,-0.5,0.5,0.5],
    [0.5,0.5,-0.5,-0.5],
    [-0.5,0.5,-0.5,0.5],
    [0.5,-0.5,-0.5,-0.5],
    [-0.5,-0.5,-0.5,null]
  ]));
});

test('scale 2', () => {
  let { geometry } = evaluator.buildNodes([{"name":"Cube","label":"","default_label":"Cube","type":"MESH_PRIMITIVE_CUBE","inputs":[{"name":"Size","identifier":"Size","type":"VECTOR","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":[2,2,2]},{"name":"Vertices X","identifier":"Vertices X","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2},{"name":"Vertices Y","identifier":"Vertices Y","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2},{"name":"Vertices Z","identifier":"Vertices Z","type":"INT","links":[],"display_shape":"CIRCLE","is_multi_input":false,"value":2}],"outputs":[{"name":"Mesh","identifier":"Mesh","type":"GEOMETRY","links":[{"node":"Group Output","socket":"Output_1"}],"display_shape":"CIRCLE"}],"color":[0.6079999804496765,0.6079999804496765,0.6079999804496765],"location":[546.25,-248.251953125],"dimensions":[280,402],"id":"1"},{"name":"Group Output","label":"","default_label":"Group Output","type":"GROUP_OUTPUT","inputs":[{"name":"Geometry","identifier":"Output_1","type":"GEOMETRY","links":[{"node":"Cube","socket":"Mesh"}],"display_shape":"CIRCLE","is_multi_input":false},{"name":"","identifier":"__extend__","type":"CUSTOM","links":[],"display_shape":"CIRCLE","is_multi_input":false}],"outputs":[],"color":[0.6079999804496765,0.6079999804496765,0.6079999804496765],"location":[716.25,-248.251953125],"dimensions":[280,144],"id":"2"}]);

  expect(JSON.stringify(getPositionAttributeValue(geometry))).toBe(JSON.stringify([
    [1,1,1,1],
    [1,1,-1,1],
    [1,-1,1,1],
    [1,-1,-1,-1],
    [-1,1,-1,-1],
    [-1,1,1,-1],
    [-1,-1,-1,-1],
    [-1,-1,1,-1],
    [-1,1,-1,1],
    [1,1,-1,-1],
    [-1,1,1,1],
    [1,1,1,-1],
    [-1,-1,1,1],
    [1,-1,1,-1],
    [-1,-1,-1,1],
    [1,-1,-1,-1],
    [-1,1,1,1],
    [1,1,1,-1],
    [-1,-1,1,1],
    [1,-1,1,1],
    [1,1,-1,-1],
    [-1,1,-1,1],
    [1,-1,-1,-1],
    [-1,-1,-1,null]
  ]));
});
