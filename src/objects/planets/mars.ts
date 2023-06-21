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
import AppScene from "../../scene";

class Mars extends Planet {

    constructor() {
        const id = "mars"

        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id))
        const lowTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low))
        // TODO: The resolution of this normal map is too low.
        const normalTexture = textureLoader.load('assets/images/textures/mars/1k_mars_normal.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture
        // material.normalMap = normalTexture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id);
        this.initialize_MaterialGeometry([material], geometry, lowTexture)
    }
}

export default Mars;