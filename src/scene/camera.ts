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
import SceneSurfaceCamera from "./surface_camera"

class SceneCamera extends THREE.PerspectiveCamera {
    isAnimating: boolean = false

    update() { }

    // TODO: This is only a proof of concept
    switchCamera(camera: SceneCamera) {
        const cameraCopy = this.clone()

        if (this["planet"]) {
            this["planet"].realMesh.remove(this)
            AppScene.scene.add(this)
        }

        let thisCoords = this["planet"] ? this.position.clone().add(this["planet"].getPosition()) : this.position
        let nextCoords = camera["planet"] ? camera.position.clone().add(camera["planet"].getPosition()) : camera.position
        let currentCoords = { x: thisCoords.x, y: thisCoords.y, z: thisCoords.z }

        let nextUp = camera.up
        let currentUp = { x: this.up.x, y: this.up.y, z: this.up.z }

        const duration = 2000

        new TWEEN.Tween(currentUp)
            .to(nextUp)
            .duration(duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
                this.isAnimating = true
            })
            .onUpdate(() => {
                this.up.set(currentUp.x, currentUp.y, currentUp.z)
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start()

        new TWEEN.Tween(currentCoords)
            .to(nextCoords)
            .duration(duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
                this.isAnimating = true
            })
            .onUpdate(() => {
                this.position.set(currentCoords.x, currentCoords.y, currentCoords.z)
            })
            .onComplete(() => {
                this.isAnimating = false
                AppScene.camera = camera
                this.position.set(cameraCopy.position.x, cameraCopy.position.y, cameraCopy.position.z)
                this.up.set(cameraCopy.up.x, cameraCopy.up.y, cameraCopy.up.z)

                if (this["planet"]) {
                    AppScene.scene.remove(this)
                    this["planet"].realMesh.add(this)
                }
            })
            .start()
    }

    animateLookAt(object: Planet | Star, duration: number) {
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