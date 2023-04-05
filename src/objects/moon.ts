/*
 *   moon.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */


import THREE = require("three");
import Planet from "./planet";
import { Quality, quality } from "../settings";

class Moon extends Planet {
    constructor() {
        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const res = quality == Quality.high ? '8k' : '2k'
        const texture = textureLoader.load('assets/images/textures/moon/' + res + '_moon.jpeg')
        texture.wrapS = THREE.RepeatWrapping
        texture.offset.x = (270 / 180) / (2 * Math.PI)

        const normalTexture = textureLoader.load('assets/images/textures/moon/normal.png')
        normalTexture.wrapS = THREE.RepeatWrapping
        normalTexture.offset.x = (270 / 180) / (2 * Math.PI)

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial({
            normalMap: normalTexture,
            map: texture,
        })

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Moon", [material], geometry);

        // const earthAxisVector = new THREE.Vector3(0, 0, 1)
        // const earthAxisRadians = 23 * Math.PI / 180
        // this.mesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }
}

export default Moon;