import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Scene
const scene = new THREE.Scene();

// Create sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#00ff83',
  roughness: 0.5,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Lights
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 125;
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
});

// Animation loop
const loop = () => {
  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(loop);
};

loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse animation color
let mouseDown = false;
let rgb = [12, 23, 55];

window.addEventListener('mousedown', () => (mouseDown = true));
window.addEventListener('mouseup', () => (mouseDown = false));

window.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ];

    // Animate color
    const newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
    gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
  }
});