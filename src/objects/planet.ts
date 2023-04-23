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
import * as dat from 'dat.gui'
import * as objectsJson from '../data/objects.json';
import { AstronomyClass } from "../services/astronomy";
import { Astronomy } from "../services/astronomy_static";

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

    // Distance Scale
    distanceScale: number = 10000

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
        const radiusScale = this.radius / Planet.getJSONValue('meanRadius', 'earth')
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

    setPosition() {
        let astroDate = new Date()
        let day = Astronomy.s.DayValue(astroDate);
        let helioCoords = this.astro.EclipticCartesianCoordinates(day)
        let AUtoKM = 1.496e+8
        this.mesh.position.z = -helioCoords.x * AUtoKM / this.distanceScale
        this.mesh.position.x = -helioCoords.y * AUtoKM / this.distanceScale
        this.mesh.position.y = helioCoords.z * AUtoKM / this.distanceScale
    }

    // /**
    //  * Places the planet in an orbiting position around its parent according to its orbital period.
    //  * @param parent - parent object to orbit around
    //  * @param time - the time elapsed since start / current time in seconds
    //  */
    // orbit(parent: Object3D, time: number) {
    //     // TODO: Not real-time
    //     let yearInSeconds = 365 * 24 * 60 * 60
    //     let today = Date.now()
    //     let fullPeriod = 2 * Math.PI
    //     let orbitPercent = (today / yearInSeconds) / this.orbitalPeriod
    //     let mult = 1 //0.000001
    //     let finalSpeed = fullPeriod * -orbitPercent / mult
    //     this.mesh.position.z = parent.position.z + Math.sin(finalSpeed) * (this.distance / this.distanceScale)
    //     this.mesh.position.x = parent.position.x + Math.cos(finalSpeed) * (this.distance / this.distanceScale)
    //     // this.mesh.position.y = parent.position.y + Math.sin(this.orbitalInclination) * Math.sin(finalSpeed) * (this.distance / this.distanceScale)
    // }

    displayOrbit(parent: Object3D) {
        // const curve = new THREE.EllipseCurve(
        //     // ax, aY
        //     parent.position.x, parent.position.y,
        //     // xRadius, yRadius
        //     this.distance / this.distanceScale, this.distance / this.distanceScale,
        //     // aStartAngle, aEndAngle
        //     0, 2 * Math.PI,
        //     // aClockwise
        //     false,
        //     // aRotation
        //     0
        // );
        // const points = curve.getPoints(5000);
        // const ellGeometry = new THREE.BufferGeometry().setFromPoints(points);
        // const ellMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
        // const ellipse = new THREE.Line(ellGeometry, ellMaterial);
        // ellipse.rotateX(Math.PI / 2)
        // ellipse.rotateY(this.orbitalInclination * Math.PI / 180)
        // parent.add(ellipse)
    }

    getRadius(): number {
        return this.radius
    }

    getDistance(): number {
        return this.distance
    }

    getDistanceScale(): number {
        return this.distanceScale
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