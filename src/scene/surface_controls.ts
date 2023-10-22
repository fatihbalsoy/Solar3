/*
 *   surface_controls.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 13 Oct 2023
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import SceneSurfaceCamera from "./surface_camera";
import Settings from "../settings";
import AppScene from "../scene";

class SurfaceControls {
    camera: SceneSurfaceCamera
    private defaultZoom: number = 0
    private azimuth: number = 0
    private altitude: number = 0

    isDragging: boolean = false
    private mousePosition = {
        x: 0,
        y: 0
    }
    private lastMousePosition = {
        x: 0,
        y: 0
    }
    private lastTime = 0

    private domElement: HTMLElement

    constructor(camera: SceneSurfaceCamera, domElement: HTMLElement) {
        this.domElement = domElement
        this.camera = camera
        this.defaultZoom = this.camera.zoom

        this.mouseDown = this.mouseDown.bind(this)
        this.mouseUp = this.mouseUp.bind(this)
        this.mouseMove = this.mouseMove.bind(this)
        this.mouseScroll = this.mouseScroll.bind(this)

        this.domElement.addEventListener('mousedown', this.mouseDown)
        this.domElement.addEventListener('mouseup', this.mouseUp)
        this.domElement.addEventListener('mousemove', this.mouseMove)
        this.domElement.addEventListener('wheel', this.mouseScroll)
    }

    // TODO: this is a lazy/concept implementation of the controls
    update() {
        const currentTime = performance.now()
        const deltaTime = currentTime - this.lastTime

        if (this.isDragging && !this.camera.lockedOntoPlanet) {
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
            // const theta = -THREE.MathUtils.degToRad(lon)

            // Get mouse velocity
            // TODO: Implement inertia for a smooth camera motion
            const velocity2D_X = (this.lastMousePosition.x - this.mousePosition.x) / deltaTime
            const velocity2D_Y = (this.lastMousePosition.y - this.mousePosition.y) / deltaTime
            const zoomFactor = this.defaultZoom / this.camera.zoom
            const sensitivity = 3 * zoomFactor
            this.azimuth += velocity2D_X * sensitivity
            this.altitude += velocity2D_Y * sensitivity
            this.altitude = Math.max(-90, Math.min(90, this.altitude))

            // Set 0 altitude, 0 azimuth at northern horizon
            // and offset altitude and azimuth using mouse velocity
            this.camera.lookAtNorth()
            this.camera.rotateOnAxis(new THREE.Vector3(0, -1, 0), (phi > Math.PI / 2 ? Math.PI : 0) + this.azimuth * Math.PI / 180)
            this.camera.rotateOnAxis(new THREE.Vector3(-1, 0, 0), this.altitude * Math.PI / 180)
        } else if (this.camera.lockedOntoPlanet) {
            // TODO: fix jagged velocity when planet lock is removed
            // TODO: azimuth and altitude still need to be updated to fix this problem
            // console.log("azimuth", -this.camera.rotation.y * 180 / Math.PI)
            // console.log("altitude", -this.camera.rotation.x * 180 / Math.PI)
        }

        this.lastMousePosition = {
            x: this.mousePosition.x,
            y: this.mousePosition.y
        }

        this.lastTime = currentTime
    }

    destroy() {
        this.domElement.removeEventListener('mousedown', this.mouseDown)
        this.domElement.removeEventListener('mouseup', this.mouseUp)
        this.domElement.removeEventListener('mousemove', this.mouseMove)
        this.domElement.removeEventListener('wheel', this.mouseScroll)
    }

    private mouseDown(event: MouseEvent) {
        this.isDragging = true
    }

    private mouseUp(event: MouseEvent) {
        this.isDragging = false
    }

    private mouseMove(event: MouseEvent) {
        this.mousePosition = {
            x: event.clientX,
            y: event.clientY
        }

        if (this.isDragging)
            this.camera.lockedOntoPlanet = false
    }

    private mouseScroll(event: WheelEvent) {
        const delta = Math.sign(event.deltaY);

        if (delta > 0) {
            this.camera.zoom /= 1.1;
        } else {
            this.camera.zoom *= 1.1;
        }

        this.camera.zoom = Math.max(1, Math.min(10000, this.camera.zoom));
    }

}

export default SurfaceControls