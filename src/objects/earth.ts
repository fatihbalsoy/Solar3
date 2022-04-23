/*
 *   earth.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

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
        const earthEmission = textureLoader.load('/textures/earth/' + res + '/night_dark.jpeg')
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
            lightMap: earthEmission,
            lightMapIntensity: 1.5,
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

        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: earthCloudsTexture,
            transparent: true
        })

        const materials = [earthMaterial, cloudMaterial]

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        geometry.addGroup(0, Infinity, 1)

        // * Add second UV for light map * //
        // Get existing `uv` data array
        const uv1Array = geometry.getAttribute("uv").array;

        // Use this array to create new attribute named `uv2`
        geometry.setAttribute('uv2', new THREE.BufferAttribute(uv1Array, 2));
        // * Second UV End * //

        super("Earth", Earth.radius, Earth.distance, Earth.orbitalPeriod, materials, geometry);

        const earthAxisVector = new THREE.Vector3(0, 0, 1)
        const earthAxisRadians = 23 * Math.PI / 180
        this.realMesh.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
    }
}

export default Earth;