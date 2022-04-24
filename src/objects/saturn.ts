/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Vector3 } from "three";
import THREE = require("three");
import Earth from "./earth";
import Planet from "./planet";

class Saturn extends Planet {

    constructor() {
        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader()
        const res = '2k'
        const texture = textureLoader.load('/textures/saturn/' + res + '_saturn.jpeg')
        const ringTexture = textureLoader.load('/textures/saturn/' + res + '_saturn_ring_alpha.png')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial({
            map: texture
        })

        //* RING MATERIAL *//
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0xffffff),
            side: THREE.DoubleSide,
            map: ringTexture,
            transparent: true
        })

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)

        //* RING GEOMETRY + MESH *//
        const eScale = Planet.getJSONValue('meanRadius', 'earth')
        const ringGeometry = new THREE.RingBufferGeometry(66900 / eScale, 180000 / eScale, 96, 1)

        var ringPos = ringGeometry.attributes.position;
        var ringV3 = new THREE.Vector3();
        for (let i = 0; i < ringPos.count; i++) {
            ringV3.fromBufferAttribute(ringPos, i);
            // console.log(ringV3.length())
            // 10.999999
            // 28.55555
            ringGeometry.attributes.uv.setXY(i, ringV3.length() < 28 ? 0 : 1, 1);
        }

        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = 90 * Math.PI / 180
        ringMesh.castShadow = true
        ringMesh.receiveShadow = true

        super("Saturn", [material], geometry);
        this.realMesh.add(ringMesh)
        this.realMesh.rotation.z = 23 * Math.PI / 180
        this.realMesh.receiveShadow = true
        this.realMesh.castShadow = true
    }
}

export default Saturn;