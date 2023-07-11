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
import AppLocation from "../models/location"
import SceneCamera from "./camera"

// TODO: The planet's height and width segments must be extremely large to display the horizon as flat as possible
class SceneSurfaceCamera extends SceneCamera {
    isAnimating: boolean = false
    lastGeolocation: AppLocation
    planet: Planet

    init(planet: Planet) {
        this.planet = planet
        this.planet.realMesh.add(this)

        const geometry = new THREE.SphereGeometry(10 * Settings.sizeScale, 8, 8)
        const material = new THREE.MeshToonMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        this.add(mesh)

        Settings.dev_addAxesHelper(this, 10)
    }

    switchTo(planet: Planet) {
        this.planet.realMesh.remove(this)
        AppScene.scene.remove(this)
        this.planet = planet
        this.planet.realMesh.add(this)
        Settings.cameraLocation = planet
        this.update(true)
    }

    update(force: boolean = false) {
        // TODO: Setting back to current location doesn't set the camera's location to current location
        if (Settings.geolocation && (force || !Settings.geolocation.equals(this.lastGeolocation))) {
            this.lastGeolocation = Settings.geolocation

            // Latitude and Longitude in radians
            const lat = Settings.geolocation.latitude * Math.PI / 180
            const lon = Settings.geolocation.longitude * Math.PI / 180

            // Altitude (converted from meters to km to game scale)
            const altitude = (Settings.geolocation.altitude / 1000) * Settings.sizeScale

            // Convert geographic coordinates to cartesian coordinates
            // (Precomputed)
            const x = Math.cos(lat) * Math.cos(lon)
            const y = Math.cos(lat) * Math.sin(lon)
            const z = Math.sin(lat)

            // Coordinates in relation to texture and scene (universe)
            const rX = +x // -y
            const rY = +z
            const rZ = -y // -x

            // Set coordinates as vector3, normalize, and set altitude
            const vector = new THREE.Vector3(rX, rY, rZ)
            vector.normalize()
            vector.multiplyScalar(this.planet.radius * Settings.sizeScale + altitude)

            const equaRatio = this.planet.equatorialRadius == 0 ? 1 : this.planet.equatorialRadius / this.planet.radius
            const polarRatio = this.planet.polarRadius == 0 ? 1 : this.planet.polarRadius / this.planet.radius
            vector.multiply(new THREE.Vector3(equaRatio, polarRatio, equaRatio))

            // Set camera's location in relation to Earth
            this.position.set(vector.x, vector.y, vector.z)

            // TODO: Up direction is not perpendicular (or normal) to planet's surface even though the axes helpers say otherwise
            // Set camera's up direction
            this.up.set(vector.x, vector.y, vector.z)
        } else if (!Settings.geolocation) {
            this.position.set(0, this.planet.polarRadius * Settings.sizeScale + AppScene.surfaceCameraProps.altitude, 0)
        }

        if (!this.isAnimating) {
            this.lookAt(Settings.lookAt.position)
        }

        this.updateProjectionMatrix()
    }

    lookAtOnUpdate(coords: { x: number, y: number, z: number }) {
        this.lookAt(new THREE.Vector3(coords.x, coords.y, coords.z))
    }

    animateFlyTo(planet: Planet, duration: number): void {
        const newCamera = new SceneSurfaceCamera(this.fov, this.aspect, this.near, this.far)
        newCamera.init(planet)
        newCamera.update(true)
        let newCameraCoords = planet.position.clone().add(newCamera.position)
        let newCameraUp = newCamera.up

        let camera = this
        let cameraCoordsVec = this.planet.position.clone().add(camera.position)
        let cameraCoords = { x: cameraCoordsVec.x, y: cameraCoordsVec.y, z: cameraCoordsVec.z }
        let cameraUp = { x: camera.up.x, y: camera.up.y, z: camera.up.z }

        this.planet.realMesh.remove(this)
        AppScene.scene.add(this)
        this.position.set(cameraCoords.x, cameraCoords.y, cameraCoords.z)

        new TWEEN.Tween(cameraCoords)
            .to(newCameraCoords)
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

        new TWEEN.Tween(cameraUp)
            .to(newCameraUp)
            .duration(duration)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onStart(() => {
                this.isAnimating = true
            })
            .onUpdate(() => {
                camera.up.set(cameraUp.x, cameraUp.y, cameraUp.z)
            })
            .onComplete(() => {
                this.isAnimating = false
                this.animateLookAt(this.planet, 2000)
                this.switchTo(planet)
            })
            .start()
    }

}
export default SceneSurfaceCamera