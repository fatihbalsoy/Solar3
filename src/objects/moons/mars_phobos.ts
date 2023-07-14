/*
 *   phobos.ts
 *   solar-system-3js
 *
 *   Created by Fatih Balsoy on 4/30/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

// import * as THREE from "three";
// import Planet from "../planet";
// import { Quality, quality } from "../../settings";

// class Phobos extends Planet {

//     constructor() {
//         //? -- TEXTURES -- ?//
//         const textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
//         const res = quality == Quality.high ? '8k' : '2k'
//         const texture = textureLoader.load('assets/images/textures/mars/' + res + '_mars.jpeg')

//         //? -- MATERIAL -- ?//
//         const material = new THREE.MeshStandardMaterial()
//         material.map = texture

//         //? -- GEOMETRY -- ?//
//         const geometry = new THREE.SphereGeometry(1, 64, 64)
//         geometry.clearGroups()
//         geometry.addGroup(0, Infinity, 0)
//         super("Phobos", [material], geometry);
//     }
// }

// export default Phobos;