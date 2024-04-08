/*
 *   sun.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Planet from "./planet";
import * as dat from 'dat.gui'
import AppScene from "../scene";
import { Quality } from "../settings";

class Sun extends Planet {
    // Light
    light: THREE.PointLight

    constructor() {
        const id = "sun"

        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id))
        const lowTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low))

        //? -- MATERIAL -- ?//
        const sunMaterial = new THREE.MeshStandardMaterial()
        sunMaterial.emissive = new THREE.Color(0xffffff)
        sunMaterial.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id, [sunMaterial], geometry, lowTexture);

        const light = new THREE.PointLight(0xffffff, 1.35) // prev intesity: 3
        light.position.set(0, 0, 0)
        // light.distance = 0
        light.castShadow = true
        // light.shadow.radius = 1
        light.shadow.camera.visible = true
        light.shadow.camera.near = 0.00000001
        light.shadow.camera.far = 10000000000
        light.shadow.mapSize.width = 512;
        light.shadow.mapSize.height = 512;
        // light.scale.set(sizeScale * 2, sizeScale * 2, sizeScale * 2)

        this.light = light
        this.mesh.add(this.light)
    }
}

export default Sun;