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

class SceneCamera extends THREE.PerspectiveCamera {
    flyTo(planet: Planet, duration: number) {
        let planetCoords = planet.position
        let camera = AppScene.camera
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
            .onUpdate(() => {
                camera.position.set(cameraCoords.x, cameraCoords.y, cameraCoords.z)
            })
            .start()
    }
}
export default SceneCamera