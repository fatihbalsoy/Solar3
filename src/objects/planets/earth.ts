/*
 *   earth.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Planet from "../planet";
import { Quality, Settings } from "../../settings";
import AppScene from "../../scene";
import * as dat from 'dat.gui';

class Earth extends Planet {

    londonCoords = {
        latitude: 51.5072,
        longitude: -0.1276
    }
    londonCartesianCoords: THREE.Vector3
    londonPointMesh: THREE.Mesh

    constructor() {
        const id = "earth"

        //? -- TEXTURES -- ?//
        const today = new Date()
        const month = today.getMonth()
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

        const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)

        const res = Settings.res2_8k[Settings.quality]
        const cloudRes = Settings.res2_4k[Settings.quality]

        const earthTexture = textureLoader.load('assets/images/textures/earth/' + res + '/month/' + monthNames[month] + '.jpeg')
        const earthLowResTexure = textureLoader.load('assets/images/textures/earth/2k/month/' + monthNames[month] + '.jpeg')
        const earthNormal = textureLoader.load('assets/images/textures/earth/' + res + '/normal.jpeg')
        const earthRoughness = textureLoader.load('assets/images/textures/earth/' + res + '/roughness.jpeg')
        const earthSpecular = textureLoader.load('assets/images/textures/earth/' + res + '/specular.jpeg')
        const earthEmission = textureLoader.load('assets/images/textures/earth/' + res + '/night_dark.jpeg')
        const earthCloudsTexture = textureLoader.load('assets/images/textures/earth/' + cloudRes + '/clouds.png')

        // Offset texture by 270 degrees in order to match latitude and longitude calculations
        // earthTexture.wrapS = THREE.RepeatWrapping
        // earthTexture.offset.x = 270 / 360
        // earthLowResTexure.wrapS = earthTexture.wrapS
        // earthLowResTexure.offset.x = earthTexture.offset.x

        //? -- MATERIAL -- ?//
        const earthMaterial = new THREE.MeshStandardMaterial({
            normalMap: earthNormal,
            emissiveMap: earthEmission,
            lightMap: earthEmission,
            lightMapIntensity: 1.5,
            roughnessMap: earthRoughness,
            map: earthTexture,
        })

        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: earthCloudsTexture,
            transparent: true
        })

        const materials = [earthMaterial, cloudMaterial]

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        geometry.addGroup(0, Infinity, 1)

        // * Add second UV for light map * //
        // Get existing `uv` data array
        const uv1Array = geometry.getAttribute("uv").array;

        // Use this array to create new attribute named `uv2`
        geometry.setAttribute('uv2', new THREE.BufferAttribute(uv1Array, 2));
        // * Second UV End * //

        super(id, materials, geometry, earthLowResTexure);

        // * London Coordinates * //
        const londonPointGeo = new THREE.SphereGeometry(100 * Settings.sizeScale, 8, 8)
        const londonPointMesh = new THREE.Mesh(londonPointGeo)
        this.londonPointMesh = londonPointMesh
        this.realMesh.add(this.londonPointMesh)

        if (Settings.isDev) {
            const gui = new dat.GUI()

            const earthFolder = gui.addFolder("Earth")
            earthFolder.add(this.londonCoords, "latitude", -90, 90, 0.01)
            earthFolder.add(this.londonCoords, "longitude", -180, 180, 0.01)
        }
    }

    animate() {
        super.animate()

        const lat = this.londonCoords.latitude * Math.PI / 180
        const lon = this.londonCoords.longitude * Math.PI / 180
        const x = (this.radius * Settings.sizeScale) * Math.cos(lat) * Math.cos(lon)
        const y = (this.radius * Settings.sizeScale) * Math.cos(lat) * Math.sin(lon)
        const z = (this.radius * Settings.sizeScale) * Math.sin(lat)

        const rX = +x // -y
        const rY = +z
        const rZ = -y // -x

        this.londonCartesianCoords = new THREE.Vector3(x, y, z)
        this.londonPointMesh.position.set(rX, rY, rZ)
    }
}

export default Earth;