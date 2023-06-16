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

class SceneCamera extends THREE.PerspectiveCamera {
    isAnimating: boolean = false

    private resetSpeeds() {
        AppScene.controls.zoomSpeed = 1
        AppScene.controls.rotateSpeed = 1
    }

    update() {
        let camera = this
        let object = Settings.lookAt
        if (object instanceof Planet) {
            AppScene.controls.minDistance = object.getRadius()
            // TODO: Use the fov distance calculated in SceneCamera.flyTo()?
            let start = 1 * object.radius / Planets.earth.radius
            let radius = object.getRadius()
            let distance = camera.position.distanceTo(object.position) - radius
            if (distance < start) {
                const speedFactor = distance / start
                AppScene.controls.zoomSpeed = speedFactor
                AppScene.controls.rotateSpeed = speedFactor
            } else {
                this.resetSpeeds()
            }
        } else {
            this.resetSpeeds()
        }
    }

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
                AppScene.controls.target = new THREE.Vector3(cameraLookCoords.x, cameraLookCoords.y, cameraLookCoords.z)
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start()
    }

    flyTo(planet: Planet, duration: number) {
        let planetCoords = planet.position
        let camera = this
        let cameraCoords = { x: camera.position.x, y: camera.position.y, z: camera.position.z }

        var fovScale = .5
        if (planet.id == "saturn") {
            fovScale = .3
        }
        let fovRadians = camera.fov * Math.PI / 180
        let distance = Math.sqrt(Math.pow(planet.getRadius() / Math.tan(fovRadians * fovScale / 2), 2) + Math.pow(planet.getRadius(), 2))
        let p2cVector = new THREE.Vector3(planetCoords.x - camera.position.x, planetCoords.y - camera.position.y, planetCoords.z - camera.position.z)

        let newCoordsLength = p2cVector.length() - distance
        let newCoordsVector = p2cVector.multiplyScalar(newCoordsLength / p2cVector.length())
        let newCoords = new THREE.Vector3(camera.position.x + newCoordsVector.x, camera.position.y + newCoordsVector.y, camera.position.z + newCoordsVector.z)

        new TWEEN.Tween(cameraCoords)
            .to(newCoords)
            .duration(duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
                this.isAnimating = true
            })
            .onUpdate(() => {
                camera.position.set(cameraCoords.x, cameraCoords.y, cameraCoords.z)
            })
            .onComplete(() => {
                this.isAnimating = false
            })
            .start()
    }
}
export default SceneCamera