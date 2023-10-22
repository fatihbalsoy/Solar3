/*
 *   surface_camera.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 7/9/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three"
import * as TWEEN from '@tweenjs/tween.js'
import Planet from "../objects/planet"
import AppScene from "../scene"
import Settings from "../settings"
import AppLocation from "../models/location"
import SceneCamera from "./camera"
import LandscapeZurich from "../objects/landscapes/zurich"

// TODO: The planet's height and width segments must be extremely large to display the horizon as flat as possible
class SceneSurfaceCamera extends SceneCamera {
    isAnimating: boolean = false
    planet: Planet
    landscape: LandscapeZurich
    lockedOntoPlanet: boolean = false

    init(planet: Planet) {
        this.planet = planet
        this.planet.realMesh.add(this)

        this.landscape = new LandscapeZurich()
        this.planet.realMesh.add(this.landscape)

        this.update()
        this.lookAtNorth()

    }

    switchTo(planet: Planet) {
        this.planet.realMesh.remove(this)
        AppScene.scene.remove(this)
        this.planet = planet
        this.planet.realMesh.add(this)
        Settings.cameraLocation = planet
        this.update()
    }

    update() {
        // TODO: Setting back to current location doesn't set the camera's location to current location

        // Latitude and Longitude in radians
        var lat = (Settings.geolocation ? Settings.geolocation.latitude : 0)
            + AppScene.developerConfigs.latOffset
        var lon = (Settings.geolocation ? Settings.geolocation.longitude : 0)
            + AppScene.developerConfigs.lonOffset

        // TODO: Work on edge case: lat 0 & lon 0
        if (lat == 0) lat = 0.0001
        if (lon == 0) lon = 0.0001

        // Convert coordinates from degrees to radians
        const phi = THREE.MathUtils.degToRad(90 - lat)
        const theta = -THREE.MathUtils.degToRad(lon)

        // Equatorial and polar radius in game scale
        const equatRad = this.planet.equatorialRadius * Settings.sizeScale
        const polarRad = this.planet.polarRadius * Settings.sizeScale

        // Altitude (converted from meters to km to game scale)
        const altitude = ((Settings.geolocation ? Settings.geolocation.altitude : 0 / 1000)
            + AppScene.developerConfigs.altOffset) * Settings.sizeScale

        // Convert geographic coordinates to cartesian coordinates
        const x = equatRad * Math.sin(phi) * Math.cos(theta)
        const y = polarRad * Math.cos(phi)
        const z = equatRad * Math.sin(phi) * Math.sin(theta)

        // Set coordinates as vector3 and scale
        const vector = new THREE.Vector3(x, y, z)

        // Calculate normal vector to tangent plane for the point on the spheroid
        // Spheroid equation: (x/q)^2 + (y/q)^2 + (z/p)^2 = 1
        // Spheroid gradient: [2x/(q^2), 2y/(q^2), 2z/(p^2)]
        const nX = 2 * x / equatRad ** 2
        const nY = 2 * y / polarRad ** 2
        const nZ = 2 * z / equatRad ** 2
        const norm = new THREE.Vector3(nX, nY, nZ)

        // Set camera's altitude
        const normHeight = new THREE.Vector3().copy(norm).normalize().multiplyScalar(altitude)
        vector.add(normHeight)

        // Set camera's location in relation to Earth
        this.position.set(vector.x, vector.y, vector.z)
        this.landscape.position.set(vector.x, vector.y, vector.z)

        // Set camera's up direction
        const worldRotation = this.planet.realMesh.rotation
        norm.applyEuler(worldRotation)
        this.up.set(norm.x, norm.y, norm.z)
        this.landscape.up.set(norm.x, norm.y, norm.z)

        if (!this.isAnimating && Settings.lookAt != this.planet && this.lockedOntoPlanet) {
            this.lookAt(Settings.lookAt.position)
        }

        this.landscape.visible = AppScene.landscapeVisible

        this.updateProjectionMatrix()
    }

    lookAtNorth() {
        // Latitude and Longitude in radians
        var lat = (Settings.geolocation ? Settings.geolocation.latitude : 0)
            + AppScene.developerConfigs.latOffset

        // Equatorial and polar radius in game scale
        const equatRad = this.planet.equatorialRadius * Settings.sizeScale
        const polarRad = this.planet.polarRadius * Settings.sizeScale

        // Calculate the horizon towards the north (0 degrees azimuth)
        var horizon = new THREE.Vector3(
            lat == 0 ? Math.cos(lat * Math.PI / 180) * equatRad : 0,
            lat == 0 ? 1
                // y-intercept of tangent at current latitude
                : polarRad / Math.sin(lat * Math.PI / 180),
            0
        )
        horizon.add(this.planet.mesh.position)

        this.lookAt(horizon)
        this.landscape.lookAt(horizon)
    }

    lookAtOnUpdate(coords: { x: number, y: number, z: number }) {
        this.lookAt(new THREE.Vector3(coords.x, coords.y, coords.z))
        this.lockedOntoPlanet = true
    }

    // TODO: Lazy Implementation / Proof of concept
    // Maybe from surface to space camera?
    animateFlyTo(planet: Planet, duration: number): void {
        const newCamera = new SceneSurfaceCamera(this.fov, this.aspect, this.near, this.far)
        newCamera.init(planet)
        newCamera.update()
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