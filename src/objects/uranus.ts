/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */


import * as THREE from "three";
import Earth from "./earth";
import Planet from "./planet";
import { sizeScale } from "../settings";

class Uranus extends Planet {

    constructor() {
        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const res = '2k'
        const texture = textureLoader.load('assets/images/textures/uranus/' + res + '_uranus.jpeg')

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
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)

        //* RING GEOMETRY + MESH *//
        const ringGeometry = new THREE.RingGeometry(51149, (51149 + 90), 96, 1)
        ringGeometry.scale(1 / sizeScale, 1 / sizeScale, 1 / sizeScale)
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = 15 * Math.PI / 180

        super("Uranus", [material], geometry);
        this.mesh.add(ringMesh)
        // this.realMesh.rotation.z = 23 * Math.PI / 180
    }
}

export default Uranus;