/*
 *   surface_camera.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 7/9/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

/*
 *   camera.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/4/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three"
import * as TWEEN from '@tweenjs/tween.js'
import Planet from "../objects/planet"
import AppScene from "../scene"
import Settings from "../settings"
import Star from "../objects/star"
import Planets from "../objects/planets"

class SceneSurfaceCamera extends THREE.PerspectiveCamera {
    isAnimating: boolean = false

    update() {
        if (!this.isAnimating) {
            this.lookAt(Settings.lookAt.position)
        }
        this.updateProjectionMatrix()
    }

    // TODO: Literal copy of SceneCamera.animateLookAt()
    animateLookAt(object: Planet | Star, duration: number) {
        let camera = this
        let nextPlanetCoords = object.position
        let currentPlanetCoords = Settings.lookAt.position
        let cameraLookCoords = { x: currentPlanetCoords.x, y: currentPlanetCoords.y, z: currentPlanetCoords.z }

        new TWEEN.Tween(cameraLookCoords)
            .to(nextPlanetCoords)
            .duration(duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
                this.isAnimating = true
                Settings.lookAt = object
            })
            .onUpdate(() => {
                this.lookAt(new THREE.Vector3(cameraLookCoords.x, cameraLookCoords.y, cameraLookCoords.z))
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start()
    }

}
export default SceneSurfaceCamera