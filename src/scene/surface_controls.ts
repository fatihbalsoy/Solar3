/*
 *   surface_controls.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 13 Oct 2023
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";

class SurfaceControls {

    constructor(camera: THREE.Camera, domElement: HTMLElement, up: THREE.Vector3) {
        // camera.up.set(up.x, up.y, up.z)

        // const south = up.cross(new THREE.Vector3(0, 0, 1))
        // camera.lookAt(south)
    }

}

export default SurfaceControls