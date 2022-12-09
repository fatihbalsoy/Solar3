/*
 *   planet.ts
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Material, Mesh, Object3D, SphereGeometry, Vector3 } from "three"
import THREE = require("three")
import GUIMovableObject from "../gui/movable_3d_object"
import Earth from "./earth"
import * as dat from 'dat.gui'
import * as objectsJson from '../data/objects.json';

class Planet extends GUIMovableObject {
    // ID
    id: String
    // Name of planetary object
    name: String
    // Distance to parent in KM
    distance: number
    // Radius in KM
    radius: number
    // Orbital period in Earth days
    orbitalPeriod: number
    // Rotational period in Earth days
    rotationalPeriod: number
    // Axial tilt in degrees
    axialTilt: number
    // Mass in KG
    mass: number
    // Material
    material: Material[]
    // Geometry
    geometry: SphereGeometry
    /** 
     * Origin Mesh (Used for adding objects onto it)
     */
    mesh: Mesh
    /** 
     * Real Mesh (With textures, materials, and geometry)
     */
    realMesh: Mesh

    constructor(id: String, material: Material[], geometry: SphereGeometry) {

        super()
        const obj = objectsJson[id.toLowerCase()]
        this.id = id.toLowerCase()
        this.name = obj.name
        this.mass = obj.mass.massValue * Math.pow(10, obj.mass.massExponent)
        this.radius = obj.meanRadius
        this.distance = obj.semimajorAxis
        this.orbitalPeriod = obj.sideralOrbit
        this.rotationalPeriod = obj.sideralRotation / 24
        this.axialTilt = obj.axialTilt
        this.material = material

        const radiusScale = this.radius / Planet.getJSONValue('meanRadius', 'earth')
        this.geometry = geometry
        var enlarge = 1;
        // if (this.id != "moon") {
        //     enlarge = 1000;
        // }
        this.geometry.scale(radiusScale * enlarge, radiusScale * enlarge, radiusScale * enlarge)

        this.mesh = new THREE.Mesh()
        this.realMesh = new THREE.Mesh(geometry, material)
        this.mesh.add(this.realMesh)

        if (this.name != "Sun") {
            this.realMesh.receiveShadow = true
            this.realMesh.castShadow = true
        }

        const axisVector = new THREE.Vector3(0, 0, 1)
        const axisRadians = this.axialTilt * Math.PI / 180
        this.realMesh.setRotationFromAxisAngle(axisVector, axisRadians)
    }

    addGUI(gui: dat.GUI): dat.GUI {
        return this._addGUI(gui, this.name, this.mesh)
    }

    /**
     * Animates the planet by applying rotation and translation.
     * @param time - the time elapsed since start in seconds
     * @param parent - parent object to orbit around
     */
    animate(time: number, parent: Object3D) {
        this.rotate(time)
        this.orbit(parent, time)
    }

    /**
     * Rotates the planet according to its rotational period.
     * @param time - the time elapsed since start in seconds
     */
    rotate(time: number) {
        // let dayInSeconds = 24 * 60 * 60
        // let fullPeriod = 2 * Math.PI
        // let rotationPercent = time / this.rotationalPeriod * dayInSeconds
        // let mult = 10000000
        // let finalSpeed = fullPeriod * rotationPercent / mult
        this.realMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 / 10000)
        // this.realMesh.setRotationFromAxisAngle(new THREE.Vector3(0, 20, 0), finalSpeed)
        // this.realMesh.rotation.y = finalSpeed
    }

    /**
     * Places the planet in an orbiting position around its parent according to its orbital period.
     * @param parent - parent object to orbit around
     * @param time - the time elapsed since start / current time in seconds
     */
    orbit(parent: Object3D, time: number) {
        // TODO: Not real-time
        let yearInSeconds = 365 * 24 * 60 * 60
        let today = Date.now()
        let fullPeriod = 2 * Math.PI
        let orbitPercent = (today / yearInSeconds) / this.orbitalPeriod
        let mult = 1 //0.000001
        let finalSpeed = fullPeriod * -orbitPercent / mult
        this.mesh.position.z = parent.position.z + Math.sin(finalSpeed) * (this.distance / 10000)
        this.mesh.position.x = parent.position.x + Math.cos(finalSpeed) * (this.distance / 10000)
    }

    getRadius(): number {
        return this.radius
    }

    getDistance(): number {
        return this.distance
    }

    getMesh(): Mesh {
        return this.mesh
    }

    getPosition(): Vector3 {
        return this.mesh.position
    }

    getPositionAsString(): String {
        return this.mesh.position.x.toFixed(0) + "," + this.mesh.position.y.toFixed(0) + "," + this.mesh.position.z.toFixed(0)
    }

    static getJSONValue(key: String, planetId: String) {
        return objectsJson[planetId.toLowerCase()][key]
    }
}
export default Planet;