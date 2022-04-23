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

class Mars extends Planet {
    static radius: number = 3389.4394
    static distance: number = 211628736
    static orbitalPeriod: number = 686.980

    constructor() {
        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader()
        const res = '2k'
        const texture = textureLoader.load('/textures/mars/' + res + '_mars.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Mars", Mars.radius, Mars.distance, Mars.orbitalPeriod, [material], geometry);
    }
}

export default Mars;