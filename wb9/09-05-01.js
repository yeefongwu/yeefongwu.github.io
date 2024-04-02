// @ts-check

import * as T from "https://unpkg.com/three@0.138.3/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js";

let renderer = new T.WebGLRenderer({preserveDrawingBuffer:true});
renderer.setSize(500,500);
document.getElementById("div1").appendChild(renderer.domElement);
renderer.domElement.id = "canvas";
let scene = new T.Scene();
let camera = new T.PerspectiveCamera(75, 1, 0.1, 300000); 
camera.position.set(0, 5, 20);
let controls = new OrbitControls(camera, renderer.domElement);
let ambientLight = new T.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

let directionalLight = new T.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1); 
scene.add(directionalLight);



let loader = new T.CubeTextureLoader();
loader.setPath( 'Textures/' );

let textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );

let material = new T.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
scene.background = textureCube;

class MyCube{
    constructor(material){
         this.geom = new T.BoxGeometry(5,5,5);
        this.mesh = new T.Mesh(this.geom,material);
        return this.mesh;
    }
}
let cube = new MyCube(material);
scene.add(cube);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

