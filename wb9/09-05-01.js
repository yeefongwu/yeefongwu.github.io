// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas, groundplane:false });


let loader = new T.CubeTextureLoader();
loader.setPath( 'Textures/' );

let textureCube = loader.load( [
	'px.png', 'nx.png',
	'py.png', 'ny.png',
	'pz.png', 'nz.png'
] );

let material = new T.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
world.scene.background = textureCube;

class MyCube extends GrObject{
    constructor(material){
        let geom = new T.BoxGeometry(5,5,5);
        let mesh = new T.Mesh(geom,material);
        super("Cube",mesh);
    }
}
let cube = new MyCube(material);
world.add(cube);

world.go();

