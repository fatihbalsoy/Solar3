/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */


import THREE = require("three");
import Earth from "./earth";
import Planet from "./planet";

class Uranus extends Planet {
    static radius: number = 25362
    static distance: number = 3006393609
    static orbitalPeriod: number = 30688.5

    constructor() {
        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader()
        const res = '2k'
        const texture = textureLoader.load('/textures/uranus/' + res + '_uranus.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //* RING MATERIAL *//
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0xffffff),
            side: THREE.DoubleSide,
            transparent: true
        })

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)

        //* RING GEOMETRY + MESH *//
        const eScale = Earth.radius
        const ringGeometry = new THREE.RingBufferGeometry(51149 / eScale, (51149 + 90) / eScale, 96, 1)
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = 15 * Math.PI / 180

        super("Uranus", Uranus.radius, Uranus.distance, Uranus.orbitalPeriod, [material], geometry);
        this.realMesh.add(ringMesh)
        // this.realMesh.rotation.z = 23 * Math.PI / 180
    }
}

export default Uranus;