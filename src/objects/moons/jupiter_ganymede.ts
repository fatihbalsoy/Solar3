/*
 *   jupiter_ganymede.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/1/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three"
import JupiterMoon from "./jupiter_moon"
import AppScene from "../../scene"

class Ganymede extends JupiterMoon {
    constructor() {
        const id = "ganymede"

        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        const texture = textureLoader.load('assets/images/textures/ganymede/1k_ganymede.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id);
        this.initialize_MaterialGeometry([material], geometry, texture)
    }
}
export default Ganymede