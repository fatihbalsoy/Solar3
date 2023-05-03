/*
 *   jupiter_io.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/1/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import JupiterMoon from "./jupiter_moon";
import { Quality, Settings } from "../../settings";
import { EnumDictionary } from "../../utils/utils";

class Io extends JupiterMoon {
    constructor() {
        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const texture = textureLoader.load('assets/images/textures/io/io_'
            + Settings.res2_4_8k[Settings.quality] + '.jpeg')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial()
        material.map = texture

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        super("Io", [material], geometry);
    }
}
export default Io