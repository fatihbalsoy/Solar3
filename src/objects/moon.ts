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

class Moon extends Planet {
    static radius: number = 1737.44778
    static distance: number = 384472.282
    static orbitalPeriod: number = 27.321661

    constructor() {
        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader()
        const res = '2k'
        const texture = textureLoader.load('/textures/moon/' + res + '_moon.jpeg')
        texture.wrapS = THREE.RepeatWrapping
        texture.offset.x = (270 / 180) / (2 * Math.PI)

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Moon", Moon.radius, Moon.distance, Moon.orbitalPeriod, [material], geometry);

        // const earthAxisVector = new THREE.Vector3(0, 0, 1)
        // const earthAxisRadians = 23 * Math.PI / 180
        // this.mesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }
}

export default Moon;