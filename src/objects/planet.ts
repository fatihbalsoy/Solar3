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
import * as objectsJson from '../data/objects.json';
import { HelioVector, Body, Vector, Rotation_EQJ_ECL, Equator, Observer, EquatorialCoordinates, HorizontalCoordinates, Horizon, ConstellationInfo, Constellation, Rotation_EQD_ECL } from 'astronomy-engine';
import { Quality, Settings, resFields } from "../settings";
import { CSS2DObject } from "../modules/CSS2DRenderer";
import { Orbit } from '../utils/orbit_points';
import Planets from "./planets";
import { ComponentEnum, angleBetweenZeroVectorForComponent, convertRotationMatrix3, convertRotationMatrix4 } from "../utils/utils";

class Planet {
    // ID
    id: string
    // Name of planetary object
    name: string
    // The body type
    type: string
    // Distance to parent in KM
    distance: number
    // Position of the planet in xyz coordinates
    position: Vector3 = new Vector3(0, 0, 0)
    // Radius in KM
    radius: number
    // Polar radius in km
    polarRadius: number
    // Equatorial radius in km
    equatorialRadius: number
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
     * Level of detail
     */
    lod: THREE.LOD
    /**
     * Label objects
     */
    labelCircle: CSS2DObject
    labelText: CSS2DObject

    constructor(id: string, material: Material[], geometry: SphereGeometry, lowResTexture: THREE.Texture, children: Object3D[] = []) {
        const obj = objectsJson[id.toLowerCase()]
        this.id = id.toLowerCase()
        this.name = obj.name
        this.type = obj.type
        this.mass = obj.mass.massValue * Math.pow(10, obj.mass.massExponent)
        this.radius = obj.meanRadius
        this.polarRadius = obj.polarRadius
        this.equatorialRadius = obj.equaRadius
        this.distance = obj.semimajorAxis
        this.orbitalPeriod = obj.sideralOrbit
        this.rotationalPeriod = obj.sideralRotation / 24
        this.axialTilt = obj.axialTilt
        this.orbitalInclination = obj.inclination
        this.material = material

        const radiusScale = this.radius * Settings.sizeScale
        const equatorialRadius = this.equatorialRadius == 0 ? radiusScale : this.equatorialRadius * Settings.sizeScale
        const polarRadius = this.polarRadius == 0 ? radiusScale : this.polarRadius * Settings.sizeScale

        // LEVEL OF DETAIL //
        this.lod = new THREE.LOD()

        // const lowPolyGeometry = new SphereGeometry(radiusScale, 16, 16)
        // const lowResMaterial = new THREE.MeshBasicMaterial({ map: lowResTexture })
        // const lowResMesh = new THREE.Mesh(lowPolyGeometry, lowResMaterial)
        // this.lod.addLevel(lowResMesh, 314 * this.radius * Settings.distanceScale) // 3.14mil * Settings.distanceScale

        const lowPoly0Geometry = new SphereGeometry(radiusScale, 16, 16)
        const lowRes0Mesh = new THREE.Mesh(lowPoly0Geometry)
        this.lod.addLevel(lowRes0Mesh, 314 * this.radius * Settings.distanceScale)

        // GEOMETRY //
        this.geometry = geometry
        this.geometry.scale(equatorialRadius, polarRadius, equatorialRadius)

        this.mesh = new THREE.Mesh()
        this.realMesh = new THREE.Mesh(geometry, material)
        for (const key in children) {
            const object = children[key];
            this.mesh.add(object)
        }
        this.lod.addLevel(this.realMesh, 0)
        this.mesh.add(this.lod)

        if (this.name != "Sun") {
            this.realMesh.receiveShadow = true
            this.realMesh.castShadow = true
        }

        // ROTATE MESH //
        // TODO: Implement axial tilt
        // const axisVector = new THREE.Vector3(0, 0, 1)
        // const axisRadians = this.axialTilt * Math.PI / 180
        const rotMat3 = Rotation_EQD_ECL(new Date())

        const mat3 = convertRotationMatrix3(rotMat3)
        const mat4 = convertRotationMatrix4(rotMat3)
        this.realMesh.rotation.setFromRotationMatrix(mat4)

        const angleX = angleBetweenZeroVectorForComponent(ComponentEnum.x, mat3)
        const angleY = angleBetweenZeroVectorForComponent(ComponentEnum.y, mat3)
        const angleZ = angleBetweenZeroVectorForComponent(ComponentEnum.z, mat3)
        this.realMesh.rotation.setFromVector3(new Vector3(-angleX, -angleZ, -angleY))
        for (let i = 0; i < children.length; i++) {
            const element = children[i];
            const rot = element.rotation
            const x = rot.x - angleX
            const y = rot.y - angleZ
            const z = rot.z - angleY
            element.rotation.setFromVector3(new Vector3(x, y, z))
        }

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
     * @param calledByTimer - whether the function is called by a timer. useful if calculating things every second or so.
     */
    animate(calledByTimer: boolean = false) {
        // Since earth's rotation speed is not noticable, it will be calculated when called by a timer
        const notMoonOrEarth = this.name !== "Moon" && this.name !== "Earth"
        const isEarthAndCalledByTimer = this.name == "Earth" && calledByTimer
        if (notMoonOrEarth || isEarthAndCalledByTimer) {
            this.rotate()
        }

        let date = new Date()
        let coordinates = this.getPositionForDate(date)
        this.position.set(coordinates.x, coordinates.y, coordinates.z)

        this.mesh.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelText.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelCircle.position.set(coordinates.x, coordinates.y, coordinates.z)
    }

    /**
     * Rotates the planet to match current rotation.
     * @param time - the time elapsed since start in seconds
     */
    rotate() {
        // this.realMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1 / 10000)
    }

    /**
     * Traces out the planet's orbit onto the scene.
     * @param data orbit data and information
     * @param scene
     */
    displayOrbit(data: Orbit, scene: THREE.Scene) {
        const curve = new THREE.CatmullRomCurve3()
        curve.points = data.points

        const points = curve.getPoints(500)
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
        const line = new THREE.Line(geometry, material)
        line.renderOrder = -1

        const isMoon = this.id == "moon"
        const isJupiterMoon = ["io", "ganymede", "europa", "callisto"].includes(this.id)
        if (isMoon) {
            Planets.earth.mesh.add(line)
        } else if (isJupiterMoon) {
            Planets.jupiter.mesh.add(line)
        } else {
            scene.add(line)
        }
    }

    /**
     * Add label to the scene.
     * @param scene 
     */
    displayLabel(scene: THREE.Scene) {
        scene.add(this.labelCircle)
        scene.add(this.labelText)
    }

    /**
     * Hide labels when camera is far enough to bunch labels in one place.
     * @param camera used to get distance from the sun
     */
    updateLabel(camera: THREE.Camera): void {
        let inner = ["mercury", "venus", "earth", "mars", "ceres"]
        let outer = ["jupiter", "saturn", "uranus", "neptune", "pluto"]

        let dist = new Vector3(0, 0, 0).distanceTo(camera.position) / Settings.distanceScale
        this.labelText.element.textContent = this.name
        this.labelCircle.element.style.backgroundColor = 'white'

        let removeInner = inner.includes(this.name.toLowerCase()) && dist > 2000000000
        let removeOuter = outer.includes(this.name.toLowerCase()) && dist > 20000000000

        if (removeInner || removeOuter) {
            this.labelText.element.textContent = ''
        }

        this.updateLabelRemoveTarget(camera)
        this.labelText.element.style.color = 'white'
    }
    updateLabelRemoveTarget(camera: THREE.Camera): void {
        let removeTarget = (Settings.lookAt as Planet).id == this.id
            ? this.position.distanceTo(camera.position) / Settings.distanceScale < this.radius * 10
            : false;
        if (removeTarget) {
            this.labelText.element.textContent = ''
            this.labelCircle.element.style.backgroundColor = 'transparent'
        }
    }

    /**
     * Get planet radius in game scale
     */
    getRadius(): number {
        return this.radius * Settings.distanceScale
    }

    /**
     * Get planet distance from sun in game scale
     */
    getDistance(): number {
        return this.distance * Settings.distanceScale
    }

    getMesh(): Mesh {
        return this.mesh
    }

    getPosition(): Vector3 {
        return this.position
    }

    getPositionAsString(): String {
        return this.position.x.toFixed(0) + "," + this.position.y.toFixed(0) + "," + this.position.z.toFixed(0)
    }

    /**
     * Calculates a scaled vector from the center of the Sun to the given body at the given time.
     * @param date the date in which to calculate the planet's position
     * @returns a heliocentric vector pointing to the planet's position
     */
    getPositionForDate(date: Date): Vector {
        let pos = this.getPositionForDateNotScaled(date)
        return new Vector(
            pos.x * Settings.AUtoKM * Settings.distanceScale,
            pos.y * Settings.AUtoKM * Settings.distanceScale,
            pos.z * Settings.AUtoKM * Settings.distanceScale,
            pos.t
        )
    }

    /**
     * Calculates a non-scaled vector from the center of the Sun to the given body at the given time.
     * @param date the date in which to calculate the planet's position
     * @returns a heliocentric vector pointing to the planet's position
     * @note this is a copy of the function found in scripts/calculate_orbits.ts
     */
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

    /**
     * Calculates the right ascension and declination of the planet given the observer's gps location
     * @param date the date in which to calculate the planet's equatorial coordinates
     * @param gpsLocation the observer's gps location on Earth
     * @returns equatorial coordinates of the planet (right ascension and declination)
     */
    getEquatorialCoordinates(date: Date, gpsLocation: GeolocationPosition): EquatorialCoordinates | null {
        if (navigator.geolocation) {
            let observer = new Observer(gpsLocation.coords.latitude, gpsLocation.coords.longitude, gpsLocation.coords.altitude ?? 0)
            let equator = Equator(Body[this.name], date, observer, true, true)
            return equator
        } else {
            return null
        }
    }

    /**
     * Calculates the azimuth and altitude of the planet given the observer's gps location
     * @param date the date in which to calculate the planet's horizontal coordinates
     * @param gpsLocation the observer's gps location on Earth
     * @returns horizontal coordinates of the planet (azimuth and altitude)
     */
    getHorizontalCoordinates(date: Date, gpsLocation: GeolocationPosition): HorizontalCoordinates | null {
        if (navigator.geolocation) {
            let observer = new Observer(gpsLocation.coords.latitude, gpsLocation.coords.longitude, gpsLocation.coords.altitude ?? 0)
            let equator = Equator(Body[this.name], date, observer, true, true)
            let horizontal = Horizon(date, observer, equator.ra, equator.dec)
            return horizontal
        } else {
            return null
        }
    }

    getConstellation(date: Date, gpsLocation: GeolocationPosition): ConstellationInfo | null {
        if (navigator.geolocation) {
            let equator = this.getEquatorialCoordinates(date, gpsLocation)
            let constellation = Constellation(equator.ra, equator.dec)
            return constellation
        } else {
            return null
        }
    }

    /**
     * Get a value from the planet's JSON object provided by https://api.le-systeme-solaire.net/en/
     * @param key the key used to fetch a value from the json.
     * @param planetId examples: "sun", "earth", and etc.
     * @returns value of `any` type.
     */
    static getJSONValue(key: String, planetId: String) {
        return objectsJson[planetId.toLowerCase()][key]
    }

    /**
     * Get a path to a planet's texture for the given quality
     * @param id the planet's identifier
     * @param quality the resolution of the texture
     * @param args any additional suffixes applied to the texture (ex: saturn_rings, args = ["rings"])
     * @returns a path to the texture
     */
    static getTexturePath(id: string, quality?: Quality, args: string[] = [], extension: string = "jpeg"): string {
        quality = quality ? quality : Settings.quality
        const texture = id + (args.length > 0 ? "_" : "") + args.join("_")
        const path = "assets/images/textures/" + id + "/" + resFields[texture][quality] + "_" + texture + "." + extension
        return path
    }

    static comparator(a: Planet, b: Planet): number {
        if (a.id > b.id) {
            return 1;
        } else if (a.id < b.id) {
            return -1;
        }
        return 0;
    };
}
export default Planet;