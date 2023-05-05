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

class Moon extends Planet {
    constructor() {
        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const texture = textureLoader.load('assets/images/textures/moon/'
            + Settings.res2_8k[Settings.quality] + '_moon.jpeg')
        texture.wrapS = THREE.RepeatWrapping
        texture.offset.x = (270 / 180) / (2 * Math.PI)

        const normalRes = Settings.quality <= Quality.medium ? 'jpeg' : 'png'
        const normalTexture = textureLoader.load('assets/images/textures/moon/2k_normal.' + normalRes)
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
        super("Moon", [material], geometry);

        // const earthAxisVector = new THREE.Vector3(0, 0, 1)
        // const earthAxisRadians = 23 * Math.PI / 180
        // this.mesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }

    updateLabel(camera: THREE.Camera): void {
        let dist = this.getPosition().distanceTo(camera.position) / Settings.distanceScale
        if (dist < 4605000) {
            this.labelText.element.textContent = 'Moon'
        } else {
            this.labelText.element.textContent = ''
        }
        this.labelText.element.style.color = 'white'
    }
}

export default Moon;