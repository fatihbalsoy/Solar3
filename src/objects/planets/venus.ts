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

class Venus extends Planet {

    constructor() {
        const id = "venus"

        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id, null, ["atmosphere"]))
        const lowResTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low, ["atmosphere"]))

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id, [material], geometry, lowResTexture);
    }

    /**
     * Get a path to a planet's texture for the given quality
     * @param id the planet's identifier
     * @param quality the resolution of the texture
     * @returns a path to the texture
     */
    getTexturePath(quality?: Quality, extension: string = "jpeg"): string {
        return Planet.getTexturePath(this.id, quality, ["atmosphere"], extension)
    }
}

export default Venus;