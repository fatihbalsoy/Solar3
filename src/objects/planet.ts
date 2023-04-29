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
import GUIMovableObject from "../gui/movable_3d_object"
import * as dat from 'dat.gui'
import * as objectsJson from '../data/objects.json';
import { Astronomy } from "../services/astronomy_static";
import { distanceScale, sizeScale } from "../settings";
import { CartesianCoordinates } from "../services/astronomy";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";

class Planet extends GUIMovableObject {
    // ID
    id: string
    // Astronomy Instance Body (javascript any type)
    astro: any
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
    private labelCircle: CSS2DObject
    private labelText: CSS2DObject

    constructor(id: string, material: Material[], geometry: SphereGeometry) {

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
        this.orbitalInclination = obj.inclination
        this.material = material

        let bodies = {
            "sun": Astronomy.s.Body[0],
            "mercury": Astronomy.s.Body[1],
            "venus": Astronomy.s.Body[2],
            "earth": Astronomy.s.Body[3],
            "moon": Astronomy.s.Body[4],
            "mars": Astronomy.s.Body[5],
            "ceres": Astronomy.s.Body[6],
            "pallas": Astronomy.s.Body[7],
            "juno": Astronomy.s.Body[8],
            "vesta": Astronomy.s.Body[9],
            "ida": Astronomy.s.Body[10],
            "gaspra": Astronomy.s.Body[11],
            "comet_9p": Astronomy.s.Body[12],
            "comet_19p": Astronomy.s.Body[13],
            "comet_67p": Astronomy.s.Body[14],
            "comet_81p": Astronomy.s.Body[15],
            "jupiter": Astronomy.s.Body[16],
            "saturn": Astronomy.s.Body[17],
            //this.SaturnJPL,       // not much better than existing Saturn... not ready for publish
            "uranus": Astronomy.s.Body[18],
            "neptune": Astronomy.s.Body[19],
            "pluto": Astronomy.s.Body[20]
        };
        this.astro = bodies[this.id]

        // GEOMETRY //
        const radiusScale = this.radius / sizeScale
        this.geometry = geometry
        var enlarge = 1;
        // if (this.id != "moon" && this.id != "sun") {
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

        // ROTATE MESH //
        const axisVector = new THREE.Vector3(0, 0, 1)
        const axisRadians = this.axialTilt * Math.PI / 180
        this.realMesh.setRotationFromAxisAngle(axisVector, axisRadians)

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

    addGUI(gui: dat.GUI): dat.GUI {
        return this._addGUI(gui, this.name, this.mesh)
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
        this.mesh.position.x = coordinates.x
        this.mesh.position.y = coordinates.y
        this.mesh.position.z = coordinates.z

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
    displayOrbit(parent: Object3D, scene: THREE.Scene) {
        // return;
        const curve = new THREE.CatmullRomCurve3()
        console.log(this.name)
        for (let i = 0; i < 366 * (this.orbitalPeriod / 365); i++) {
            let currDate = new Date()
            let currYear = new Date(currDate.getFullYear(), 0)
            let date = new Date(currYear.setDate(i))
            let pos = this.getPositionForDate(date)

            curve.points[i] = new Vector3(pos.x, pos.y, pos.z)
        }
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

    getRadius(): number {
        return this.radius
    }

    getDistance(): number {
        return this.distance
    }

    getDistanceScale(): number {
        return distanceScale
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

    getPositionForDate(date: Date): CartesianCoordinates {
        let day = Astronomy.s.DayValue(date);
        let helioCoords = this.astro.EclipticCartesianCoordinates(day)
        let AUtoKM = 1.496e+8
        // z,x,y
        return new CartesianCoordinates(
            -helioCoords.y * AUtoKM / distanceScale, // x
            helioCoords.z * AUtoKM / distanceScale,   // y
            - helioCoords.x * AUtoKM / distanceScale, // z
        )
    }

    static getJSONValue(key: String, planetId: String) {
        return objectsJson[planetId.toLowerCase()][key]
    }
}
export default Planet;