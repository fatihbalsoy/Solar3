/*
 *   moon.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */


import * as THREE from "three";
import Planet from "../planet";
import { Quality, Settings } from "../../settings";
import AppScene from "../../scene";
import SceneSurfaceCamera from "../../scene/surface_camera";

class Moon extends Planet {
    constructor() {
        const id = "moon"

        //? -- TEXTURES -- ?//
        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id))
        const lowTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low))
        texture.wrapS = THREE.RepeatWrapping
        texture.offset.x = (270 / 180) / (2 * Math.PI)
        lowTexture.wrapS = texture.wrapS
        lowTexture.offset.x = texture.offset.x

        const normalRes = Settings.quality <= Quality.medium ? 'jpeg' : 'png'
        const normalTexture = textureLoader.load('assets/images/textures/moon/2k_moon_normal.' + normalRes)
        normalTexture.wrapS = THREE.RepeatWrapping
        normalTexture.offset.x = (270 / 180) / (2 * Math.PI)

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial({
            normalMap: normalTexture,
            map: texture,
        })

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super(id, [material], geometry, lowTexture);

        // const earthAxisVector = new THREE.Vector3(0, 0, 1)
        // const earthAxisRadians = 23 * Math.PI / 180
        // this.mesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }

    updateLabel(camera: THREE.Camera): void {
        let dist = this.getPosition().distanceTo(camera.position) / Settings.distanceScale
        if (dist < 4605000) {
            this.labelText.element.textContent = 'Moon'
        } else if (!(AppScene.camera instanceof SceneSurfaceCamera)) {
            this.labelText.element.textContent = ''
        }
        this.updateLabelRemoveTarget(camera)
        this.labelText.element.style.color = 'white'
    }
}

export default Moon;