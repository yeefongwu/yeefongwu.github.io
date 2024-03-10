// @ts-ignored

import * as THREE from "https://unpkg.com/three@0.138.3/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(500,500);
document.getElementById("div1").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";


let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 5, 20);


let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AmbientLight('white', 0.5));
let pointLight = new THREE.PointLight('white', 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

let groundGeometry = new THREE.BoxGeometry(18, 1, 18);
let groundMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
let ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.5; 
scene.add(ground);

let bodyGeometry = new THREE.SphereGeometry(4, 32, 32);
let bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); 
let body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = 4;
scene.add(body);

let headGeometry = new THREE.SphereGeometry(2, 32, 32);
let headMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff }); 
let head = new THREE.Mesh(headGeometry, headMaterial);
head.position.y = 9;
scene.add(head);

let eyeGeometry = new THREE.SphereGeometry(0.2, 32, 32);
let eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
let eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye1.position.set(-0.8, 9.5, 1.8);
let eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
eye2.position.set(0.8, 9.5, 1.8);
scene.add(eye1);
scene.add(eye2);

let noseGeometry = new THREE.ConeGeometry(0.2, 1, 32);
let noseMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
let nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(0, 9, 2);
nose.rotation.x = Math.PI / 2;
scene.add(nose);

let mouthGeometry = new THREE.TorusGeometry(1, 0.1, 2, 100, Math.PI); 
let mouthMaterial = new THREE.MeshPhongMaterial({ color: "black" });
let mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(0, 9, 1.7);
mouth.rotation.x = Math.PI;
scene.add(mouth);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
