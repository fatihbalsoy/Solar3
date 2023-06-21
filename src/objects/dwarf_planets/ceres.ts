/*
 *   ceres.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/24/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Planet from "../planet";
import { Quality, Settings } from "../../settings";

class Ceres extends Planet {

    constructor() {
        const id = "ceres"

        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id))
        const lowTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low))

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id)
        this.initialize_MaterialGeometry([material], geometry, lowTexture)
    }
}

export default Ceres;