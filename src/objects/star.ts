/*
 *   star.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/4/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Settings from "../settings";

// Kilometers in 1 parsec
let distanceKm = 3.262 * Math.pow(10, 13); // 1 parsec = 3.262 light-years = 3.262 * 10^13 kilometers

export interface StarData {
    StarID: number, HIP: number, HD: number, HR: number, Gliese: number, BayerFlamsteed: number,
    ProperName: string, RA: number, Dec: number, Distance: number, PMRA: number, PMDec: number,
    RV: number, Mag: number, AbsMag: number, Spectrum: string, ColorIndex: number,
    X: number, Y: number, Z: number, VX: number, VY: number, VZ: number
}

export interface StarDataMini {
    StarID: number, ProperName: string, RA: number, Dec: number, Distance: number,
    Mag: number, AbsMag: number, X: number, Y: number, Z: number,
}

export class Star {
    data: StarDataMini
    position: THREE.Vector3
    x: number; y: number; z: number;

    constructor(data: StarDataMini) {
        this.data = data
        this.position = Star.scaleVectorNumbers(this.getX(), this.getY(), this.getZ())
        this.x = this.position.x
        this.y = this.position.y
        this.z = this.position.z
    }

    private getX(): number { return -this.data.Y }
    private getY(): number { return this.data.Z }
    private getZ(): number { return -this.data.X }

    getPosition() {
        return this.position
    }

    static scalePosition(position: number): number {
        return (position * distanceKm * Settings.distanceScale)
    }
    static scaleVectorNumbers(x: number, y: number, z: number): THREE.Vector3 {
        return Star.scaleVector(new THREE.Vector3(x, y, z))
    }
    static scaleVector(v: THREE.Vector3): THREE.Vector3 {
        return new THREE.Vector3(Star.scalePosition(v.x), Star.scalePosition(v.y), Star.scalePosition(v.z))
    }

    static empty(): Star {
        return new Star({
            StarID: -1, ProperName: "NULL", RA: -1, Dec: -1, Distance: -1,
            Mag: -1, AbsMag: -1, X: -1, Y: -1, Z: -1
        })
    }
}
export default Star