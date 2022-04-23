/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */


import THREE = require("three");
import Planet from "./planet";

class Jupiter extends Planet {
    static radius: number = 69911
    static distance: number = 744128479
    static orbitalPeriod: number = 4332.59

    constructor() {
        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader()
        const res = '2k'
        const texture = textureLoader.load('/textures/jupiter/' + res + '_jupiter.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Jupiter", Jupiter.radius, Jupiter.distance, Jupiter.orbitalPeriod, [material], geometry);
    }
}

export default Jupiter;