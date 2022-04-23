/*
 *   planet.ts
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Material, Mesh, Object3D, SphereGeometry } from "three"
import THREE = require("three")
import GUIMovableObject from "../gui/movable_3d_object"
import Earth from "./earth"
import * as dat from 'dat.gui'

class Planet extends GUIMovableObject {
    // Name of planetary object
    name: String
    // Distance to parent in KM
    distance: number
    // Radius in KM
    radius: number
    // Orbital period in Earth days
    orbitalPeriod: number
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

    constructor(name: String, radius: number, distance: number, orbitalPeriod: number, material: Material[], geometry: SphereGeometry) {
        super()
        this.name = name
        this.radius = radius
        this.distance = distance
        this.material = material

        const radiusScale = radius / Earth.radius
        this.geometry = geometry
        this.geometry.scale(radiusScale, radiusScale, radiusScale)

        this.mesh = new THREE.Mesh()
        this.realMesh = new THREE.Mesh(geometry, material)
        this.mesh.add(this.realMesh)

        if (name != "Sun") {
            this.realMesh.receiveShadow = true
            this.realMesh.castShadow = true
        }
        this.orbitalPeriod = orbitalPeriod
    }

    addGUI(gui: dat.GUI): dat.GUI {
        return this._addGUI(gui, this.name, this.mesh)
    }

    /**
     * Places the planet in an orbiting position around its parent.
     * @param parent - parent object to orbit around
     * @param time - the time elapsed since start / current time in seconds
     */
    orbit(parent: Object3D, time: number) {
        // TODO: Not real-time
        let seconds = (1 / this.orbitalPeriod) //* 0.001
        this.mesh.position.z = parent.position.z + Math.sin(-time * seconds) * (this.distance / 10000)
        this.mesh.position.x = parent.position.x + Math.cos(-time * seconds) * (this.distance / 10000)
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
}
export default Planet;