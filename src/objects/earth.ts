/*
 *   earth.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Planet from "./planet";
import { Quality, quality } from "../settings";
// var glsl = require('glslify');

class Earth extends Planet {

    constructor() {
        //? -- TEXTURES -- ?//
        const today = new Date()
        const month = today.getMonth()
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)

        const res = quality == Quality.high ? '8k' : '2k'

        const earthTexture = textureLoader.load('assets/images/textures/earth/' + res + '/month/' + monthNames[month] + '.jpeg')
        const earthNormal = textureLoader.load('assets/images/textures/earth/' + res + '/normal.jpeg')
        const earthRoughness = textureLoader.load('assets/images/textures/earth/' + res + '/roughness.jpeg')
        const earthSpecular = textureLoader.load('assets/images/textures/earth/' + res + '/specular.jpeg')
        const earthEmission = textureLoader.load('assets/images/textures/earth/' + res + '/night_dark.jpeg')
        const earthCloudsTexture = textureLoader.load('assets/images/textures/earth/2k/clouds.png')

        //? -- MATERIAL -- ?//
        // const earthMaterial = new THREE.ShaderMaterial({
        //     // vertexShader: `
        //     // attribute vec3 aPosition;

        //     // varying vec3 vPosition;

        //     // void main() {
        //     //     gl_Position = vec4(aPosition, 1.0);
        //     //     vPosition = aPosition;
        //     // }
        //     // `,
        //     // fragmentShader: `
        //     // uniform vec3 uSunPos;

        //     // void main() {
        //     //     color = 1.0 - exp(-1.0 * color);
        //     //     gl_FragColor = vec4(color, 1);
        //     // }
        //     // `,
        //     vertexShader: glsl('shaders/atmosphere.v.vert'),
        //     fragmentShader: glsl('shaders/atmosphere.v.frag'),
        //     uniforms: {
        //         "uSunPos": {
        //             "value": new THREE.Uniform(new THREE.Vector3(3, 5.2, 3.5))
        //         }
        //     }
        // })

        // const earthMaterial = new THREE.MeshStandardMaterial({
        //     normalMap: earthNormal,
        //     emissiveMap: earthEmission,
        //     lightMap: earthEmission,
        //     lightMapIntensity: 1.5,
        //     roughnessMap: earthRoughness,
        //     map: earthTexture,
        // })

        // const earthMaterial = new THREE.MeshPhongMaterial({
        //     normalMap: earthNormal,
        //     emissiveMap: earthEmission,
        //     bumpMap: earthRoughness,
        //     map: earthTexture,
        //     specularMap: earthSpecular,
        //     // lightMap: earthEmission
        // })

        //? -- SHADER -- ?//
        const earthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                planetRadius: Planet.getJSONValue('meanRadius', 'earth'),
                cameraPos: { value: new THREE.Vector3(0, 0, 0) },
                planetPos: { value: new THREE.Vector3(0, 0, 0) },
                sunPos: { value: new THREE.Vector3(0, 0, 0) }
            },
            vertexShader: `
            varying vec3 vPosition;
            varying mat4 pMatrix;
            varying mat4 vMatrix;
            varying mat4 mMatrix;

            void main() {
                vPosition = position; // * vec3(1.5, 1.5, 1.5);
                pMatrix = projectionMatrix;
                vMatrix = viewMatrix;
                mMatrix = modelMatrix;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
            }
            `,
            fragmentShader: `
            varying vec3 vPosition;
            uniform float planetRadius;
            uniform vec3 cameraPos;
            uniform vec3 sunPos;
            uniform vec3 planetPos;

            in vec3 fragmentPosition;

            varying mat4 pMatrix;
            varying mat4 vMatrix;
            varying mat4 mMatrix;

            void main() {
                // Get the pixel's coordinates in window space.
                vec4 windowPosition = vec4(fragmentPosition, 0.0, 1.0);
              
                // Convert the pixel's coordinates from window space to clip space.
                vec4 clipPosition = projectionMatrix * windowPosition;
              
                // Convert the pixel's coordinates from clip space to camera space.
                vec4 cameraPosition = inverse(projectionMatrix) * clipPosition;
              
                // Convert the pixel's coordinates from camera space to world space.
                vec4 worldPosition = inverse(viewMatrix) * cameraPosition;
              
                // Set the fragment color to the world position.
                gl_FragColor = worldPosition;
            }
        `,
        })

        // var vertexShader = [
        //     'varying vec3 vNormal;',
        //     'varying vec3 vPosition;',
        //     'void main() {',
        //     'vNormal = normalize( normalMatrix * normal );',

        //     'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        //     'vPosition = gl_Position.xyz;',
        //     '}'
        // ].join('\n')

        // var fragmentShader = [
        //     'varying vec3 vNormal;',
        //     'varying vec3 vPosition;',

        //     'void main() {',
        //     'vec3 lightPosition = vec3(-10.0, 10.0, 0.0);',
        //     'vec3 lightDirection = normalize(lightPosition - vPosition);',
        //     'float dotNL = clamp(dot(lightDirection, vNormal), 0.0, 1.0);',
        //     'float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 12.0 );',
        //     'gl_FragColor = vec4( 1, 1.0, 1.0, 1.0 ) * intensity * dotNL;',
        //     '}'
        // ].join('\n')

        // const earthMaterial = new THREE.ShaderMaterial({
        //     vertexShader: vertexShader,
        //     fragmentShader: fragmentShader
        // })

        const cloudMaterial = new THREE.MeshStandardMaterial({
            map: earthCloudsTexture,
            transparent: true
        })

        const materials = [earthMaterial, cloudMaterial]

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)
        // geometry.addGroup(0, Infinity, 1)

        // * Add second UV for light map * //
        // Get existing `uv` data array
        const uv1Array = geometry.getAttribute("uv").array;

        // Use this array to create new attribute named `uv2`
        geometry.setAttribute('uv2', new THREE.BufferAttribute(uv1Array, 2));
        // * Second UV End * //

        super("earth", materials, geometry);
    }

    updateShader(cameraPos: THREE.Vector3, sunPos: THREE.Vector3) {
        (this.material[0] as THREE.ShaderMaterial).uniforms = {
            cameraPos: { value: cameraPos },
            sunPos: { value: sunPos },
            planetPos: { value: this.mesh.position }
        };
        (this.material[0] as THREE.ShaderMaterial).uniformsNeedUpdate = true
    }
}

export default Earth;