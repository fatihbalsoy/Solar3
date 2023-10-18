/*
 *   zurich.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 9/9/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import AppScene from "../../scene";
import Settings from "../../settings";

// TODO: Make the following attribution visible in-app
// Google Earth. Landsat/Copernicus. Data SIO, NOAA.
class LandscapeZurich extends THREE.Mesh {
    constructor() {
        super()

        let cubegeo = new THREE.BoxGeometry(10 * Settings.sizeScale, 10 * Settings.sizeScale, 10 * Settings.sizeScale, 1, 1, 1)
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        textureLoader.setPath('assets/images/textures/zurich/')

        const cubeMaterials = []
        const zurichTextures = ['px', 'nx', 'py', 'ny', 'pz', 'nz']
        for (let i = 0; i < zurichTextures.length; i++) {
            const texture = zurichTextures[i];

            cubeMaterials.push(
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: textureLoader.load(texture + '.png'),
                    transparent: true,
                    side: THREE.BackSide,
                    depthTest: false
                })
            )
        }

        let cubemesh = new THREE.Mesh(cubegeo, cubeMaterials)
        cubemesh.renderOrder = 1000
        return cubemesh
    }
}
export default LandscapeZurich