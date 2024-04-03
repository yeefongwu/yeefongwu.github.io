/*jshint esversion: 6 */
// @ts-check

import * as T from "https://unpkg.com/three@0.138.3/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(500,500);
document.getElementById("div1").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";
let scene = new T.Scene();
let camera = new T.PerspectiveCamera(75, 1, 0.1, 300); 
camera.position.set(0, 5, 20);
let controls = new OrbitControls(camera, renderer.domElement);
let ambientLight = new T.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

let directionalLight = new T.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1); 
scene.add(directionalLight);



function polygonBuffer(vertexList = [], flip = false, uvList = [0, 0, 0, 1, 1, 1, 1, 0]) {
  // Set the vertices
  /** @type {T.Geometry} */ const geometry = new T.BufferGeometry();
  let vertices = [];
  let faces = [];
  if (flip) {
      faces = [0, 3, 2, 2, 1, 0];
  } else {
      faces = [0, 1, 2, 2, 3, 0];
  }
  for (let i = 0; i < faces.length; i++) {
      vertices.push(vertexList[3 * faces[i]], vertexList[3 * faces[i] + 1], vertexList[3 * faces[i] + 2]);
  }
  geometry.setAttribute('position', new T.BufferAttribute(new Float32Array(vertices), 3));

  // Set the uvs
  let faceVertexUvs = new Float32Array( [
  // The first triangle
      uvList[0], uvList[1],
      uvList[2], uvList[3],
      uvList[4], uvList[5]
  ,
  // The second triangle
      uvList[4], uvList[5],
      uvList[6], uvList[7],
      uvList[0], uvList[1]
  ]);
  // Compute the normals

  geometry.setAttribute('uv', new T.BufferAttribute(faceVertexUvs, 2));
  geometry.computeVertexNormals();

  return geometry;
}

class ShinySculpture {
  constructor(scene,renderer, radius = 1) {
    this.group = new T.Group();

    this.scene = scene;
    this.renderer = renderer;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128, { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter } );
    this.cubecam = new T.CubeCamera(radius * 1.1, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereGeometry(radius, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial(
      {
        color: "white",
        roughness: 0.2,
        metalness: .8,
        // @ts-ignore   // envMap has the wrong type
        envMap: this.cubecam.renderTarget.texture
      });
    this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    this.group.add(this.cubecam);
    this.group.add(this.sculpture);

    this.group.translateY(2);
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.renderer, this.scene);
  }

  setPos(x,y,z){
    this.group.position.set(x,y,z);
  }

  addToScene() {
    this.scene.add(this.group);
  }

}


class Screen {
  constructor(scene, renderer, size=3) {
    this.group = new T.Group();

    this.scene = scene;
    this.renderer = renderer;
    this.renderTarget = new T.WebGLRenderTarget(128, 128, { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter });
    this.cam = new T.PerspectiveCamera(90, 1, 0.2, 50);
    this.cam.layers.set(0);
    this.cam.up.set(0, 1, 0);
    this.cam.translateX(15).translateY(4).lookAt(-1, 0, 0);

    this.screenGeom = polygonBuffer([0, 0, size/2, 0, size, size/2, 0, size, -size/2, 0, 0, -size/2]);
    this.screenMaterial = new T.MeshBasicMaterial({
      map:  this.renderTarget.texture,
      side: T.DoubleSide
    });
    this.screen = new T.Mesh(this.screenGeom, this.screenMaterial);
    this.screen.layers.set(1);
    camera.layers.enable(1);

    this.group.add(this.cam);
    this.group.add(this.screen);
  }

  stepWorld(delta, timeOfDay) {
    let tmp = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.clear();
    this.renderer.render(this.scene, this.cam);
    this.renderer.setRenderTarget(tmp);
  }

  setPos(x,y,z){
    this.group.position.set(x,y,z);
  }

  addToScene() {
    this.scene.add(this.group);
  }

}


class Screen2  {
  constructor(scene,renderer, size = 3, followObject) {
    this.group = new T.Group();

    this.scene = scene;
    this.renderer = renderer;
    this.followObject = followObject; // The GrObject to follow

    this.renderTarget = new T.WebGLRenderTarget(512, 512, {
      generateMipmaps: true,
      minFilter: T.LinearMipmapLinearFilter
    });
    this.cam = new T.PerspectiveCamera(90, 1, 0.2, 50);
    this.cam.layers.set(0);
    this.cam.up.set(0, 1, 0);

    this.screenGeom = polygonBuffer([0, 0, size/2, 0, size, size/2, 0, size, -size/2, 0, 0, -size/2]);
    this.screenMaterial = new T.MeshBasicMaterial({
      map: this.renderTarget.texture,
      side: T.DoubleSide
    });
    this.screen = new T.Mesh(this.screenGeom, this.screenMaterial);
    this.screen.layers.set(1);
    this.group.add(this.screen);
    this.group.add(this.cam);
  }

  updateCameraPosition() {
      let offset = new T.Vector3(0, 2, -5);
      this.cam.position.copy(this.followObject.group.position).add(offset);
      this.cam.lookAt(this.followObject.group.position);
  
  }

  stepWorld(delta, timeOfDay) {
    this.updateCameraPosition();

    let originalRenderTarget = this.renderer.getRenderTarget();
    this.renderer.setRenderTarget(this.renderTarget);
    this.renderer.render(this.scene, this.cam);
    this.renderer.setRenderTarget(originalRenderTarget);
  }

  setPos(x,y,z){
    this.group.position.set(x,y,z);
  }

  addToScene() {
    this.scene.add(this.group);
  }
}





let loader = new T.CubeTextureLoader();
loader.setPath( 'Textures/' );

let cubeTexture = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );

scene.background = cubeTexture;

function MyCylinder({ x, y, z, radius, height, color = 'gray' }) {
  const geometry = new T.CylinderGeometry(radius, radius, height, 32);
  const material = new T.MeshBasicMaterial({ color });
  const cylinder = new T.Mesh(geometry, material);
  cylinder.position.set(x, y, z);
  return cylinder;
}

scene.add(MyCylinder({ x: -4, z: -4, y: 2.5, radius: 0.4, height: 5, color: "red" }));
scene.add(MyCylinder({ x: -4, z: 4, y: 2.5, radius: 0.4, height: 5, color: "purple" }));
scene.add(MyCylinder({ x: 4, z: 4, y: 2.5, radius: 0.4, height: 5, color: "yellow" }));
scene.add(MyCylinder({ x: -4, z: 0, y: 2.5, radius: 0.4, height: 5, color: "orange" }));
scene.add(MyCylinder({ x: 4, z: 0, y: 2.5, radius: 0.4, height: 5, color: "blue" }));
scene.add(MyCylinder({ x: 4, z: -4, y: 2.5, radius: 0.4, height: 5 })); // Default color applied

let s1 = new Screen(scene,renderer, 5);
s1.addToScene();
s1.setPos(-3, 3, 0);


let s2 = new ShinySculpture(scene,renderer, 0.5);
s2.addToScene();
s2.setPos(2, .5, 0);
let s2t = 0;

let screen2 = new Screen2(scene,renderer,5,s2);
screen2.setPos(3,3,0);
screen2.addToScene();

s2.oldStepWorld = s2.stepWorld;
s2.stepWorld = function (delta) {
  s2t += delta;
  s2.setPos(3 * Math.cos(s2t / 1000), .5, 3 * Math.sin(s2t / 1000));
  s2.oldStepWorld(delta);
}



let geometry = new T.BoxGeometry(); // Default size is 1x1x1
let material = new T.MeshBasicMaterial({ color: "blue" });
let cube = new T.Mesh(geometry, material);
cube.position.set(0, 0.5, 2); // Set initial position
let cb2t = 0;
scene.add(cube);


const planeGeometry = new T.PlaneGeometry(10, 10); 
const planeMaterial = new T.MeshBasicMaterial({ color: "green" }); 
const groundPlane = new T.Mesh(planeGeometry, planeMaterial);
groundPlane.rotation.x = -Math.PI / 2;
scene.add(groundPlane);
let lastTime = Date.now();


function animate() {
  requestAnimationFrame(animate);
  const currentTime = Date.now();
  const delta = currentTime - lastTime;
  lastTime = currentTime;
  cb2t += delta;
  cube.position.x = 3 * Math.sin(cb2t / 500);
  s2.stepWorld(delta);
  s1.stepWorld(delta);
  screen2.stepWorld(delta);
  renderer.render(scene, camera);
}

animate();
