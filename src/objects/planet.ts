/*
 *   planet.ts
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Material, Mesh, Object3D, SphereGeometry, Vector3 } from "three"
import * as THREE from "three"
import * as dat from 'dat.gui'
import * as objectsJson from '../data/objects.json';
import { HelioVector, Body, Vector, Rotation_EQJ_ECL } from 'astronomy-engine';
import { Settings } from "../settings";
import { convertRotationMatrix4 } from "../utils/utils";
import { CSS2DObject } from "../modules/CSS2DRenderer";
import { Orbit } from '../utils/orbit_points';

class Planet {
    // ID
    id: string
    // Name of planetary object
    name: string
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
    // Orbital inclination in degrees
    orbitalInclination: number
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
    /**
     * Label objects
     */
    labelCircle: CSS2DObject
    labelText: CSS2DObject

    constructor(id: string, material: Material[], geometry: SphereGeometry) {
        const obj = objectsJson[id.toLowerCase()]
        this.id = id.toLowerCase()
        this.name = obj.name
        this.mass = obj.mass.massValue * Math.pow(10, obj.mass.massExponent)
        this.radius = obj.meanRadius
        this.distance = obj.semimajorAxis
        this.orbitalPeriod = obj.sideralOrbit
        this.rotationalPeriod = obj.sideralRotation / 24
        this.axialTilt = obj.axialTilt
        this.orbitalInclination = obj.inclination
        this.material = material

        // GEOMETRY //
        const radiusScale = this.radius * Settings.sizeScale
        this.geometry = geometry
        var enlarge = 1;
        this.geometry.scale(radiusScale * enlarge, radiusScale * enlarge, radiusScale * enlarge)

        this.mesh = new THREE.Mesh()
        this.realMesh = new THREE.Mesh(geometry, material)
        this.mesh.add(this.realMesh)

        if (this.name != "Sun") {
            this.realMesh.receiveShadow = true
            this.realMesh.castShadow = true
        }

        // ROTATE MESH //
        // const axisVector = new THREE.Vector3(0, 0, 1)
        // const axisRadians = this.axialTilt * Math.PI / 180
        // this.realMesh.setRotationFromAxisAngle(axisVector, axisRadians)
        // this.realMesh.setRotationFromMatrix(convertRotationMatrix4(Rotation_EQJ_ECL()))

        // LABEL //
        const circle = document.createElement('div')
        circle.style.backgroundColor = 'white'
        circle.style.borderRadius = '10000px'
        circle.style.width = '5px'
        circle.style.height = '5px'
        this.labelCircle = new CSS2DObject(circle)

        const p = document.createElement('p')
        p.textContent = this.name
        p.style.color = 'white'
        p.style.position = 'absolute'
        p.style.bottom = '0'

        const div = document.createElement('div')
        div.style.height = '50px'
        div.style.position = 'relative'
        div.appendChild(p)
        this.labelText = new CSS2DObject(div)
    }

    /**
     * Animates the planet by applying rotation and translation.
     * @param time - the time elapsed since start in seconds
     * @param parent - parent object to orbit around
     */
    animate(time: number) {
        if (this.name !== "Moon") {
            this.rotate(time)
        }

        let date = new Date()
        let coordinates = this.getPositionForDate(date)

        this.mesh.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelText.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelCircle.position.set(coordinates.x, coordinates.y, coordinates.z)
    }

    /**
     * Rotates the planet according to its rotational period.
     * @param time - the time elapsed since start in seconds
     */
    rotate(time: number) {
        this.realMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 / 10000)
    }

    /**
     * Traces out the planet's orbit
     */
    displayOrbit(data: Orbit, scene: THREE.Scene) {
        const curve = new THREE.CatmullRomCurve3()
        curve.points = data.points

        const points = curve.getPoints(500)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
        const line = new THREE.Line(geometry, material)
        line.renderOrder = -1

        scene.add(line);
    }

    displayLabel(scene: THREE.Scene) {
        scene.add(this.labelCircle)
        scene.add(this.labelText)
    }

    updateLabel(camera: THREE.Camera): void {
        let inner = ["mercury", "venus", "earth", "mars", "ceres"]
        let outer = ["jupiter", "saturn", "uranus", "neptune", "pluto"]

        let dist = new Vector3(0, 0, 0).distanceTo(camera.position) / Settings.distanceScale
        this.labelText.element.textContent = this.name

        let removeInner = inner.includes(this.name.toLowerCase()) && dist > 2000000000
        let removeOuter = outer.includes(this.name.toLowerCase()) && dist > 20000000000

        if (removeInner || removeOuter) {
            this.labelText.element.textContent = ''
        }

        this.labelText.element.style.color = 'white'
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

    getPositionForDate(date: Date): Vector {
        let pos = this.getPositionForDateNotScaled(date)
        return new Vector(
            pos.x * Settings.AUtoKM * Settings.distanceScale,
            pos.y * Settings.AUtoKM * Settings.distanceScale,
            pos.z * Settings.AUtoKM * Settings.distanceScale,
            pos.t
        )
    }

    getPositionForDateNotScaled(date: Date): Vector {
        let helioCoords = HelioVector(Body[this.name], date)
        // z,x,y
        return new Vector(
            -helioCoords.y, // x
            helioCoords.z,  // y
            -helioCoords.x, // z
            helioCoords.t
        )
    }

    static getJSONValue(key: String, planetId: String) {
        return objectsJson[planetId.toLowerCase()][key]
    }
}
export default Planet;