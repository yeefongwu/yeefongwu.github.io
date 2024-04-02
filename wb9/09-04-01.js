/*jshint esversion: 6 */
// @ts-ignored

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



class Skybox {
    constructor() {
        this.geometry = new T.SphereGeometry(10000, 100, 100);
        this.loader = new T.TextureLoader();
        this.texture = this.loader.load("Textures/autumn.png");
        this.material = new T.MeshBasicMaterial({ map: this.texture, side: T.BackSide });
        this.mesh = new T.Mesh(this.geometry, this.material);
        return this.mesh;
    }
}

class MySphere {
    constructor(type) {
        this.texture = new T.TextureLoader().load("Textures/bump.png");
        this.geom = new T.SphereGeometry(5);
        if(type === "bump") {
            this.material = new T.MeshStandardMaterial({color: "white", bumpMap: this.texture});
            this.material.bumpScale = 10;
        } else {
            this.material = new T.MeshStandardMaterial({normalMap: this.texture});
        }

        this.mesh = new T.Mesh(this.geom, this.material);

        return this.mesh; 
    }
}

scene.add(new Skybox());
scene.add(new MySphere("bump"));

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
