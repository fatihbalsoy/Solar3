/*
 *   stars.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/23/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import { distanceScale } from "../settings";

// Kilometers in 1 parsec
let distanceKm = 3.262 * Math.pow(10, 13); // 1 parsec = 3.262 light-years = 3.262 * 10^13 kilometers

interface StarData {
    StarID: number, HIP: number, HD: number, HR: number, Gliese: number, BayerFlamsteed: number,
    ProperName: string, RA: number, Dec: number, Distance: number, PMRA: number, PMDec: number,
    RV: number, Mag: number, AbsMag: number, Spectrum: string, ColorIndex: number,
    X: number, Y: number, Z: number, VX: number, VY: number, VZ: number
}

export class Star {
    data: StarData
    position: THREE.Vector3
    x: number; y: number; z: number;

    constructor(data: StarData) {
        this.data = data
        this.position = Star.scaleVectorNumbers(this.getX(), this.getY(), this.getZ())
        this.x = this.position.x
        this.y = this.position.y
        this.z = this.position.z
    }

    private getX(): number { return -this.data.Y }
    private getY(): number { return this.data.Z }
    private getZ(): number { return -this.data.X }

    static scalePosition(position: number): number {
        return (position * distanceKm / distanceScale)
    }
    static scaleVectorNumbers(x: number, y: number, z: number): THREE.Vector3 {
        return Star.scaleVector(new THREE.Vector3(x, y, z))
    }
    static scaleVector(v: THREE.Vector3): THREE.Vector3 {
        return new THREE.Vector3(Star.scalePosition(v.x), Star.scalePosition(v.y), Star.scalePosition(v.z))
    }

    static empty(): Star {
        return new Star({
            StarID: -1, HIP: -1, HD: -1, HR: -1, Gliese: -1, BayerFlamsteed: -1,
            ProperName: "NULL", RA: -1, Dec: -1, Distance: -1, PMRA: -1, PMDec: -1,
            RV: -1, Mag: -1, AbsMag: -1, Spectrum: "NULL", ColorIndex: -1,
            X: -1, Y: -1, Z: -1, VX: -1, VY: -1, VZ: -1
        })
    }
}

export class Stars {

    // Parsed HYG star database
    database: Star[]
    dataParsed: boolean = false
    // Star points
    // points: THREE.Points

    constructor() { }

    // Function to parse and process the star data
    parseData(): Star[] {
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v2/hygxyz.csv')
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg_v32.csv')
        fetch('data/stars_hyg_v33.csv')
            .then(response => response.text())
            .then(data => {
                const stars: Star[] = [];
                const lines = data.split('\n');
                const headers = lines[0].split(',');

                // skip the sun
                for (let i = 2; i < lines.length; i++) {
                    const fields = lines[i].split(',');
                    const star: StarData = {
                        StarID: parseInt(fields[0]),
                        HIP: parseInt(fields[1]),
                        HD: parseInt(fields[2]),
                        HR: parseInt(fields[3]),
                        Gliese: parseInt(fields[4]),
                        BayerFlamsteed: parseInt(fields[5]),
                        ProperName: fields[6],
                        RA: parseFloat(fields[7]),
                        Dec: parseFloat(fields[8]),
                        Distance: parseFloat(fields[9]),
                        PMRA: parseFloat(fields[10]),
                        PMDec: parseFloat(fields[11]),
                        RV: parseFloat(fields[12]),
                        Mag: parseFloat(fields[13]),
                        AbsMag: parseFloat(fields[14]),
                        Spectrum: fields[15],
                        ColorIndex: parseFloat(fields[16]),
                        X: parseFloat(fields[17]),
                        Y: parseFloat(fields[18]),
                        Z: parseFloat(fields[19]),
                        VX: parseFloat(fields[20]),
                        VY: parseFloat(fields[21]),
                        VZ: parseFloat(fields[22])
                    };

                    stars.push(new Star(star));
                }

                this.database = stars
                this.dataParsed = true
                return stars;
            });
        return []
    }

    // TODO: Index for faster search results
    getStarByName(name: string): Star {
        if (!this.dataParsed) { return Star.empty() } // TODO: Async instead of returning null star

        // Loop through each star in the database
        for (let i = 0; i < this.database.length; i++) {
            const star = this.database[i];

            // Check if the star's ProperName matches the input name
            if (star.data.ProperName === name) {
                // Create a vector for the star's position
                return star
            }
        }

        // If no star with the input name is found, return null
        return Star.empty();
    }

    getStarById(id: number): Star {
        return this.database[id]
    }
}
export default Stars;