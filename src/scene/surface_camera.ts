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

// TODO: The planet's height and width segments must be extremely large to display the horizon as flat as possible
class SceneSurfaceCamera extends THREE.PerspectiveCamera {
    isAnimating: boolean = false
    lastGeolocation: AppLocation
    planet: Planet

    init(planet: Planet) {
        this.planet = planet
        this.planet.realMesh.add(this)

        Settings.dev_addAmbientLight()

        const geometry = new THREE.SphereGeometry(10 * Settings.sizeScale, 8, 8)
        const material = new THREE.MeshToonMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        this.add(mesh)

        Settings.dev_addAxesHelper(this, 10)
    }

    switchTo(planet: Planet) {
        this.planet.realMesh.remove(this)
        this.planet = planet
        this.planet.realMesh.add(this)
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

    // TODO: Literal copy of SceneCamera.animateLookAt()
    // TODO: Animate flyTo as well
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