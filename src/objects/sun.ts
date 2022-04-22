/*
 *   sun.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Mesh } from "three";
import THREE = require("three");
import Planet from "./planet";

class Sun extends Planet {
    static radius: number = 696347.055
    static distance: number = 0

    constructor() {
        //? -- MATERIAL -- ?//
        const sunMaterial = new THREE.MeshStandardMaterial()
        sunMaterial.emissive = new THREE.Color(0xffff00)

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Sun", Sun.radius, Sun.distance, 0, [sunMaterial], geometry);
    }
}

export default Sun;