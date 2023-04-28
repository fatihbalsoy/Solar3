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
// import { AstronomyClass, CartesianCoordinates } from "../services/astronomy";
// import { Astronomy } from "../services/astronomy_static";
import { HelioVector, Body, Vector } from "../services/astronomy";
import { distanceScale, sizeScale } from "../settings";

class Planet extends GUIMovableObject {
    // ID
    id: string
    // Astronomy Instance Body (javascript any type)
    astroBody: Body
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
            "sun": Body.Sun,
            "mercury": Body.Mercury,
            "venus": Body.Venus,
            "earth": Body.Earth,
            "moon": Body.Moon,
            "mars": Body.Mars,
            "jupiter": Body.Jupiter,
            "saturn": Body.Saturn,
            "uranus": Body.Uranus,
            "neptune": Body.Neptune,
            "pluto": Body.Pluto
        };
        this.astroBody = bodies[this.id]

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

        // STAR SPRITE //
        // const map = new THREE.TextureLoader().load('assets/images/textures/star16x16.png');
        // const starMaterial = new THREE.SpriteMaterial({ map: map });
        // const sprite = new THREE.Sprite(starMaterial);
        // sprite.lookAt(new THREE.Vector3(0, 0, 0))
        // sprite.scale.set(this.distance / this.distanceScale / 10, this.distance / this.distanceScale / 10, 1)
        // this.mesh.add(sprite);
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
        if (this.name !== "Moon") {
            this.rotate(time)
        }
        this.setPosition()
        // this.orbit(parent, time)
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
     * Places the planet in its current real-time position
     */
    setPosition() {
        let astroDate = new Date()
        let coordinates = this.getPositionForDate(astroDate)
        this.mesh.position.x = coordinates.x
        this.mesh.position.y = coordinates.y
        this.mesh.position.z = coordinates.z
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

    getPositionForDate(date: Date): Vector {
        let helioCoords = HelioVector(this.astroBody, date)
        let AUtoKM = 1.496e+8
        // z,x,y
        return new Vector(
            -helioCoords.y * AUtoKM / distanceScale, // x
            helioCoords.z * AUtoKM / distanceScale,   // y
            - helioCoords.x * AUtoKM / distanceScale, // z
            helioCoords.t
        )
    }

    static getJSONValue(key: String, planetId: String) {
        return objectsJson[planetId.toLowerCase()][key]
    }

    // https://stackoverflow.com/questions/42812861/three-js-pivot-point/42866733#42866733
    // obj - your object (THREE.Object3D or derived)
    // point - the point of rotation (THREE.Vector3)
    // axis - the axis of rotation (normalized THREE.Vector3)
    // theta - radian value of rotation
    // pointIsWorld - boolean indicating the point is in world coordinates (default = false)
    private rotateAboutPoint(obj: THREE.Object3D, point: THREE.Vector3, axis: THREE.Vector3, theta: number, pointIsWorld: boolean) {
        pointIsWorld = (pointIsWorld === undefined) ? false : pointIsWorld;

        if (pointIsWorld) {
            obj.parent.localToWorld(obj.position); // compensate for world coordinate
        }

        obj.position.sub(point); // remove the offset
        obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
        obj.position.add(point); // re-add the offset

        if (pointIsWorld) {
            obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
        }

        obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    }
}
export default Planet;