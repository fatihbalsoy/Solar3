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
import { Observer, ObserverVector } from "astronomy-engine";

class Earth extends Planet {

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
            roughness: 0.5,
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
    }

    rotate() {
        // 0 degrees latitude, 0 degrees longitude
        const lat = 0
        const lon = 0

        // Convert geographic coordinates to cartesian coordinates
        // (Precomputed)
        const x = 1 * 1 // Math.cos(lat) * Math.cos(lon)
        const y = 1 * 0 // Math.cos(lat) * Math.sin(lon)
        const z = 0     // Math.sin(lat)

        // Coordinates in relation to texture and scene (universe)
        const rX = +x // -y
        const rY = +z
        const rZ = -y // -x

        // Real-time observer vector for location at current time
        const ob = new Observer(lat, lon, 0)
        const obVec = ObserverVector(new Date(), ob, true)

        // Coordinates in relation to scene (universe)
        const rObX = -obVec.y
        const rObY = +obVec.z
        const rObZ = -obVec.x

        // Angle between real-time coordinates and texture coordinates
        const numerator = rX * rObX + rY * rObY + rZ * rObZ
        const textureVectorDistance = Math.sqrt(Math.pow(rX, 2) + Math.pow(rY, 2) + Math.pow(rZ, 2))
        const realTimeVectorDistance = Math.sqrt(Math.pow(rObX, 2) + Math.pow(rObY, 2) + Math.pow(rObZ, 2))
        const denominator = textureVectorDistance * realTimeVectorDistance
        const angle = Math.acos(numerator / denominator)

        // Rotate mesh so the texture matches real-time rotation of planet
        this.realMesh.rotation.set(0, (rObZ > 0 ? -1 : +1) * angle, 0)
    }
}

export default Earth;