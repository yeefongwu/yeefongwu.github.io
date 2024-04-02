/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane: false, lookfrom: new T.Vector3(0, 0, -100), far: 20000 });

class Skybox extends GrObject {
    constructor() {
        let geometry = new T.SphereGeometry(10000, 100, 100);
        let loader = new T.TextureLoader();
        //https://polyhaven.com/a/autumn_field
        let texture = loader.load("Textures/autumn.png");
        let material = new T.MeshPhongMaterial({ map: texture, side: T.BackSide, flatShading: true });
        let mesh = new T.Mesh(geometry, material);
        super("Skybox", mesh);
    }
}

class MySphere extends GrObject{
    constructor(type){

        let texture = new T.TextureLoader().load("Textures/bump.png");
        let geom = new T.SphereGeometry(5);
        let material;
        if(type=="bump"){
             material = new T.MeshStandardMaterial({color:"white",bumpMap:texture});
             material.bumpScale = 10;
        }else{
             material = new T.MeshStandardMaterial({normalMap:texture});
        }
        let mesh = new T.Mesh(geom,material);
        super("Sphere",mesh);
    }
}

world.add(new Skybox());

world.add(new MySphere("bump"));

world.go();
