/*
 *   mars_deimos.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/20/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import { OBJLoader } from "../../modules/OBJLoader";
import AppScene from "../../scene";
import Planets from "../planets";
import MarsMoon from "./mars_moon";

class Deimos extends MarsMoon {

    constructor() {
        const id = "deimos"
        super(id);

        //? -- MODEL -- ?//
        const loader = new OBJLoader(AppScene.loadingManager);
        loader.load(
            // resource URL
            'assets/models/deimos.obj',
            // called when resource is loaded
            function (object: THREE.Group) {
                var mesh = object.children[0] as THREE.Mesh
                mesh.geometry.scale(-1, 1, 1)
                mesh.geometry.scale(0.001, 0.001, 0.001)
                Planets.mars.mesh.add(object);
            },
            // called when loading is in progresses
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened', error);
            }
        );
    }
}

export default Deimos;