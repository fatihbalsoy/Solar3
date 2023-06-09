/*
 *   mars.js
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Earth from "./earth";
import Planet from "../planet";
import { Quality, Settings, resFields } from "../../settings";

class Saturn extends Planet {

    constructor() {
        const id = "saturn"

        //? -- TEXTURES -- ?//
        const loadingManager = new THREE.LoadingManager()
        const textureLoader = new THREE.TextureLoader(loadingManager)
        const texture = textureLoader.load(Planet.getTexturePath(id))
        const lowResTexture = textureLoader.load(Planet.getTexturePath(id, Quality.low))
        const ringTexture = textureLoader.load('assets/images/textures/saturn/' + resFields[id][Settings.quality] + '_saturn_ring_alpha.png')

        //? -- MATERIAL -- ?//
        const material = new THREE.MeshStandardMaterial({
            map: texture,
        })

        //? -- GEOMETRY -- ?//
        const geometry = new THREE.SphereGeometry(1, 64, 64)
        geometry.clearGroups()
        geometry.addGroup(0, Infinity, 0)

        //* RING MATERIAL *//
        const ringMaterial = new THREE.MeshToonMaterial({
            color: new THREE.Color(0xffffff),
            side: THREE.DoubleSide,
            map: ringTexture,
            transparent: true,
            // opacity: 1,
            // shininess: 100,
            // reflectivity: 100,
            // refractionRatio: 0.5
        })

        //* RING GEOMETRY + MESH *//
        const ringGeometry = new THREE.RingGeometry(66900, 180000, 96, 1)
        ringGeometry.scale(Settings.sizeScale, Settings.sizeScale, Settings.sizeScale)

        var ringPos = ringGeometry.attributes.position;
        var ringV3 = new THREE.Vector3();
        for (let i = 0; i < ringPos.count; i++) {
            ringV3.fromBufferAttribute(ringPos, i);

            ringGeometry.attributes.uv.setXY(i, i < ringPos.count / 2 ? 0 : 1, 1);
        }

        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = 90 * Math.PI / 180
        // ringMesh.renderOrder = 1000000
        ringMesh.castShadow = true
        ringMesh.receiveShadow = true

        super(id, [material], geometry, lowResTexture, [ringMesh]);
    }
}

export default Saturn;