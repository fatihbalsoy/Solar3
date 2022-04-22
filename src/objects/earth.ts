/*
 *   earth.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import { Mesh } from "three";
import THREE = require("three");
import Planet from "./planet";

class Earth extends Planet {
    static radius: number = 6371.07103
    static distance: number = 150367447
    static orbitalPeriod: number = 365.256363004

    constructor() {
        //? -- TEXTURES -- ?//
        const today = new Date()
        const month = today.getMonth()
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

        const textureLoader = new THREE.TextureLoader()

        const res = '2k'

        const earthTexture = textureLoader.load('/textures/earth/' + res + '/month/' + monthNames[month] + '.jpeg')
        const earthNormal = textureLoader.load('/textures/earth/' + res + '/normal.jpeg')
        const earthRoughness = textureLoader.load('/textures/earth/' + res + '/roughness.jpeg')
        const earthSpecular = textureLoader.load('/textures/earth/' + res + '/specular.jpeg')
        const earthEmission = textureLoader.load('/textures/earth/' + res + '/emission.jpeg')
        const earthCloudsTexture = textureLoader.load('/textures/earth/2k/clouds.png')

        //? -- MATERIAL -- ?//
        // const earthMaterial = new THREE.ShaderMaterial({
        //     vertexShader: glsl('/shaders/atmosphere.v.vert'),
        //     fragmentShader: glsl('/shaders/atmosphere.v.frag'),
        //     uniforms: {
        //         "uSunPos": {
        //             "value": new Uniform(new Vector3(3, 5.2, 3.5))
        //         }
        //     }
        // })

        const earthMaterial = new THREE.MeshStandardMaterial({
            normalMap: earthNormal,
            emissiveMap: earthEmission,
            // lightMap: earthEmission, // So I can see earth's dark side while working on it
            roughnessMap: earthRoughness,
            map: earthTexture,
        })

        // const earthMaterial = new THREE.MeshPhongMaterial({
        //     normalMap: earthNormal,
        //     emissiveMap: earthEmission,
        //     bumpMap: earthRoughness,
        //     map: earthTexture,
        //     specularMap: earthSpecular,
        //     // lightMap: earthEmission
        // })

        const cloudMaterial = new THREE.MeshStandardMaterial()
        cloudMaterial.map = earthCloudsTexture
        cloudMaterial.transparent = true

        const materials = [earthMaterial, cloudMaterial]

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        geometry.addGroup(0, Infinity, 1)

        super("Earth", Earth.radius, Earth.distance, Earth.orbitalPeriod, materials, geometry);

        const earthAxisVector = new THREE.Vector3(0, 0, 1)
        const earthAxisRadians = 23 * Math.PI / 180
        this.mesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }
}

export default Earth;