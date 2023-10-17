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

// TODO: The planet's height and width segments must be extremely large to display the horizon as flat as possible
class SceneSurfaceCamera extends SceneCamera {
    isAnimating: boolean = false
    lastGeolocation: AppLocation
    planet: Planet

    init(planet: Planet) {
        this.planet = planet
        this.planet.realMesh.add(this)

        const geometry = new THREE.SphereGeometry(100 * Settings.sizeScale, 8, 8)
        const material = new THREE.MeshToonMaterial()
        const mesh = new THREE.Mesh(geometry, material)
        this.add(mesh)

        if (Settings.isDev) {
            const cameraHelper = new THREE.CameraHelper(this)
            AppScene.scene.add(cameraHelper)

            Settings.dev_addAxesHelper(this.planet.realMesh, 100)
        }
    }

    switchTo(planet: Planet) {
        this.planet.realMesh.remove(this)
        AppScene.scene.remove(this)
        this.planet = planet
        this.planet.realMesh.add(this)
        Settings.cameraLocation = planet
        this.update(true)
    }

    dev_addMesh(x: number, y: number, z: number) {
        let geo = new THREE.SphereGeometry(10 * Settings.sizeScale, 8, 8)
        var color = new THREE.Color();
        color.setHSL(Math.random(), 1, 0.5);
        let mat = new THREE.MeshToonMaterial({
            color: color
        })
        let mesh = new THREE.Mesh(geo, mat)
        mesh.position.set(x, y, z)
        this.planet.realMesh.add(mesh)

        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const points = [];
        const point = new THREE.Vector3(this.position.x, this.position.y, this.position.z)
        points.push(point);
        points.push(new THREE.Vector3().copy(point).multiplyScalar(10000));
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.planet.realMesh.add(line);
    }

    update(force: boolean = false) {
        // Latitude and Longitude in radians
        const lat = Settings.geolocation.latitude + AppScene.geolocationConfig.latOffset
        const lon = Settings.geolocation.longitude + AppScene.geolocationConfig.lonOffset

        // Convert coordinates from degrees to radians
        const phi = THREE.MathUtils.degToRad(90 - lat)
        const theta = -THREE.MathUtils.degToRad(lon)

        // TODO: Setting back to current location doesn't set the camera's location to current location
        if (Settings.geolocation && (force || !Settings.geolocation.equals(this.lastGeolocation))) {
            this.lastGeolocation = Settings.geolocation

            // Altitude (converted from meters to km to game scale)
            const altitude = ((Settings.geolocation.altitude / 1000)
                + AppScene.geolocationConfig.altOffset) * Settings.sizeScale

            // Convert geographic coordinates to cartesian coordinates
            const x = this.planet.equatorialRadius * Math.sin(phi) * Math.cos(theta)
            const y = this.planet.polarRadius * Math.cos(phi)
            const z = this.planet.equatorialRadius * Math.sin(phi) * Math.sin(theta)

            // Set coordinates as vector3 and scale
            const vector = new THREE.Vector3(x, y, z)
            vector.multiplyScalar(Settings.sizeScale)

            // Calculate normal vector to tangent plane for the point on the spheroid
            // Spheroid equation: (x/q)^2 + (y/q)^2 + (z/p)^2 = 1
            // Spheroid gradient: [2x/(q^2), 2y/(q^2), 2z/(p^2)]
            const nX = 2 * x / this.planet.equatorialRadius ** 2
            const nY = 2 * y / this.planet.polarRadius ** 2
            const nZ = 2 * z / this.planet.equatorialRadius ** 2
            const norm = new THREE.Vector3(nX, nY, nZ)

            // Set camera's altitude
            const normHeight = new THREE.Vector3().copy(norm).normalize().multiplyScalar(altitude)
            vector.add(normHeight)

            // Set camera's location in relation to Earth
            this.position.set(vector.x, vector.y, vector.z)

            // Set camera's up direction
            this.up.set(nX, nY, nZ)

            if (Settings.isDev) {
                // this.dev_addMesh(nX, nY, nZ)
                // this.dev_addMesh(0, 0, 0)
            }
        } else if (!Settings.geolocation) {
            this.position.set((this.planet.equatorialRadius + AppScene.geolocationConfig.altOffset) * Settings.sizeScale, 0, 0)
        }

        if (!this.isAnimating) {
            // this.lookAt(Settings.lookAt.position)
        }

        // Calculate the horizon towards the north (0 degrees azimuth)
        var horizon = new THREE.Vector3(
            lat == 0 ? Math.cos(lat * Math.PI / 180) * this.planet.equatorialRadius : 0,
            lat == 0 ? 1
                // y-intercept of tangent at current latitude
                : this.planet.polarRadius / Math.sin(lat * Math.PI / 180),
            0
        )

        // Set 0 altitude, 0 azimuth at northern horizon
        // and offset altitude and azimuth to user values
        this.lookAt(horizon)
        this.rotateOnAxis(new THREE.Vector3(0, -1, 0), (phi > Math.PI / 2 ? Math.PI : 0) + AppScene.surfaceCameraProps.azimuth * Math.PI / 180)
        this.rotateOnAxis(new THREE.Vector3(1, 0, 0), AppScene.surfaceCameraProps.altitude * Math.PI / 180)

        this.updateProjectionMatrix()
    }

    lookAtOnUpdate(coords: { x: number, y: number, z: number }) {
        // this.lookAt(new THREE.Vector3(coords.x, coords.y, coords.z))
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