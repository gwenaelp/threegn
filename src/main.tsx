import ReactDOM from "react-dom/client";
import * as THREE from "three";
import * as editor from "./editor/editor";
import * as evaluator from "./evaluator";
import * as sprdsht from "./spreadsheet/Spreadsheet.tsx";
import { WhatsNewModal } from "./WhatsNewModal.tsx";
import type { GraphNode } from "./types/GraphNode.ts";
import useThreeScene from "./hooks/useThreeScene.ts";
import { vs, fs } from './shaders';

const spreadsheet = document.getElementById("spreadsheet");
if (!spreadsheet) throw 'spreadsheet not found';

const { camera, controls, scene, renderer, handleWindowResize } = useThreeScene();

(window as any)._APP = { camera, scene, renderer, controls };

const material = new THREE.RawShaderMaterial({
  vertexShader: vs,
  fragmentShader: fs,
});

function init({ defaultNodes }: { defaultNodes: any}) {
  let meshObject: THREE.Mesh | THREE.Line | null;

  function displayMesh({ nodes }: { nodes: GraphNode[]}) {
    let { geometry, viewer } = evaluator.buildNodes(nodes);
    console.log('build mesh ', nodes, geometry);
    if (geometry) {
      geometry.computeVertexNormals();

      if (meshObject) {
        meshObject.geometry.dispose();
        meshObject.geometry = geometry;
      } else {
        if (geometry.__type === "curve") {
          const material = new THREE.LineBasicMaterial({ color: 0xff7ff9 });
          meshObject = new THREE.Line(geometry, material);
        } else {
          meshObject = new THREE.Mesh(geometry, material);
          meshObject.material.uniforms.meshColor = {
            value: [1, 0.5, 1],
          };
        }
        scene.add(meshObject);
      }
    } else if (meshObject) {
      meshObject.geometry.dispose();
      scene.remove(meshObject);
      meshObject = null;
    }

    if(!spreadsheet) throw 'spreadsheet element not found';

    sprdsht.render({
      geometry: viewer,
      domNode: spreadsheet,
      onResize: handleWindowResize,
    });
  }

  function onNodesChange(nodes: any) {
    try {
      displayMesh({ nodes });
    } catch (err) {
      console.error(err);
    }
  }

  editor.render({ onNodesChange, defaultNodes });
  
  sprdsht.render({ domNode: spreadsheet, onResize: handleWindowResize });
}

Promise.all([
  fetch("/defaults/nodes.json").then((r) => r.json()),
  fetch("/whats-new/latest.md").then((r) => r.text()),
  fetch("/defaults/default_project.json").then((r) => r.json()),
  fetch("/demo1.json").then((r) => r.json()),
])
  .then(([nodes, text, default_project, demo]) => {
    (window as any).default_project = demo;
    if (!localStorage.getItem("welcome-message")) {
      const modalsElement = document.getElementById("modals");
      if(!modalsElement) throw 'no modals element found';
      const root = ReactDOM.createRoot(modalsElement);
      root.render(<WhatsNewModal text={text} onClose={() => root.unmount()} />);
      localStorage.setItem("welcome-message", 'true');
    }

    const defaultNodes: GraphNode[] = nodes.reduce((ret: { [x: string]: any; }, node: { type: string | number; }) => {
      ret[node.type] = node;
      return ret;
    }, {});
    init({ defaultNodes });
  })
  .catch(console.error);

const version = document.createElement("div");
version.id = "version";
//FIXME
version.textContent = `v0`;
document.getElementById("view")?.append(version);

console.log(
  `%c👋 ThreeGN, build 0`,
  "color: rgb(160, 100, 255); font-size: 16px; font-weight: 500; text-shadow: 1px 1px rgb(23 255 199);"
);
