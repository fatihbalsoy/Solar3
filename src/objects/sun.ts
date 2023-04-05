/*
 *   sun.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { PointLight } from "three";
import THREE = require("three");
import Planet from "./planet";
import * as dat from 'dat.gui'

class Sun extends Planet {
    // Light
    light: PointLight

    constructor() {
        //? -- MATERIAL -- ?//
        const sunMaterial = new THREE.MeshStandardMaterial()
        sunMaterial.emissive = new THREE.Color(0xffffff)

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Sun", [sunMaterial], geometry);

        const light = new THREE.PointLight(0xffffff, 1.35) // prev intesity: 3
        light.position.set(0, 0, 0)
        light.castShadow = true
        light.shadow.camera.visible = true
        light.shadow.camera.near = 0.00001
        light.shadow.camera.far = 10000000000

        this.light = light
        this.mesh.add(this.light)
    }

    addGUI(gui: dat.GUI): dat.GUI {
        let sunFolder = this._addGUI(gui, this.name, this.mesh)

        const lightFolder = sunFolder.addFolder('Light')
        lightFolder.add(this.light, 'intensity', 0, 10, 0.01)
    }
}

export default Sun;