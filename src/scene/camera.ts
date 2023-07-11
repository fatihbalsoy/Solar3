/*
 *   camera.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 7/10/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three"
import * as TWEEN from '@tweenjs/tween.js'
import Planet from "../objects/planet"
import Star from "../objects/star"
import Settings from "../settings"
import AppScene from "../scene"
import SceneSpaceCamera from "./space_camera"

class SceneCamera extends THREE.PerspectiveCamera {
    isAnimating: boolean = false

    update() { }

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
                this.lookAtOnUpdate(cameraLookCoords)
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start()
    }

    lookAtOnUpdate(coords: { x: number, y: number, z: number }) { }

    animateFlyTo(planet: Planet, duration: number) { }
}
export default SceneCamera