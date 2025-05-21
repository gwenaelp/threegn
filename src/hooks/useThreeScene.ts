import { OrbitControls } from "three-stdlib";
import * as THREE from 'three';

export default () => {
  const spreadsheet = document.getElementById("spreadsheet");
  function getViewDimensions() {
    if (!spreadsheet) throw 'spreadsheet not found';

    return [window.innerWidth - spreadsheet.clientWidth, window.innerHeight / 2];
  }

  const [WIDTH, HEIGHT] = getViewDimensions();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x17ffc7);
  scene.fog = new THREE.FogExp2(0x17ffc7, 0.05);
  const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setPixelRatio(window.devicePixelRatio);
  const viewport = document.getElementById("viewport");
  if (!viewport) throw 'viewport not found';
  viewport.prepend(renderer.domElement);

  const grid1 = new THREE.GridHelper(10, 10, 0x888888);
  grid1.material.color.setHex(0x888888);
  grid1.material.vertexColors = false;
  scene.add(grid1);

  function handleWindowResize() {
    const [WIDTH, HEIGHT] = getViewDimensions();

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    renderer.setSize(WIDTH, HEIGHT);
  }

  window.addEventListener("resize", handleWindowResize);

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(-1.9857967338205065, 3.2464625416408888, 3.2430066755513103);
  camera.rotation.set(-0.7859306978231819,-0.40841952778064367,-0.3784206537585123);
  controls.update();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
  return { camera, controls, scene, renderer, handleWindowResize };
}