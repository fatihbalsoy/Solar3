/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Planet from "../planet";
import { Quality, Settings } from "../../settings";

class Mercury extends Planet {
    constructor() {
        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const texture = textureLoader.load('assets/images/textures/mercury/'
            + Settings.res2_8k[Settings.quality] + '_mercury.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Mercury", [material], geometry);
    }
}

export default Mercury;