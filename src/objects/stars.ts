/*
 *   stars.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/23/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Star, StarDataMini } from "./star";
import '../utils/extensions';
import constellations from '../data/constellations.json';
import * as THREE from "three";
import AppScene from "../scene";

export class Stars {
    // Parsed HYG star database
    static database: Star[]
    static indexedDatabase: { [key: string]: Star } = {}
    static indexedDatabaseByHIP: { [key: number]: Star } = {}
    static indexedTree: string[] = []

    constructor() { }

    // Function to parse and process the star data
    async parseData(): Promise<Star[]> {
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v2/hygxyz.csv')
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg_v33.csv')
        const response = await fetch('data/stars_hyg_v35.csv')
        const data = await response.text()
        const stars: Star[] = [];
        const lines = data.split('\n');
        // const headers = lines[0].split(',');

        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(',');
            const star: StarDataMini = {
                StarID: parseInt(fields[0]),
                HIP: parseInt(fields[1]),
                ProperName: fields[2],
                RA: parseFloat(fields[3]),
                Dec: parseFloat(fields[4]),
                Distance: parseFloat(fields[5]),
                Mag: parseFloat(fields[6]),
                AbsMag: parseFloat(fields[7]),
                X: parseFloat(fields[8]),
                Y: parseFloat(fields[9]),
                Z: parseFloat(fields[10])
            };

            let starObj = new Star(star)
            stars.push(starObj)
            if (star.ProperName) {
                Stars.indexedDatabase[star.ProperName.toLowerCase()] = starObj
                if (star.ProperName != "\"\"") {
                    Stars.indexedTree.push(star.ProperName.toLowerCase())
                }
            }

            if (star.HIP) {
                Stars.indexedDatabaseByHIP[star.HIP] = starObj
            }
        }

        Stars.database = stars
        Stars.indexedTree = Stars.indexedTree.sort()
        return stars
    }

    // TODO: Must normalize points onto sphere and add line mesh onto camera
    displayConstellations() {
        for (var constellation in constellations) {
            const trace: (String | number)[] = constellations[constellation]
            var points = []

            for (var starIndex in trace) {
                const star = trace[starIndex]
                if (typeof star == "string") {
                    if (star.startsWith("HIP")) {
                        const hip = parseInt(star.split(" ")[1])
                        const starObj = this.getStarByHIP(hip)
                        points.push(starObj.position)
                    } else {
                        const starObj = this.getStarByName(star)
                        points.push(starObj.position)
                    }
                } else if (typeof star == "number") {
                    const s: string = trace[star] as string
                    const starObj = this.getStarByName(s)
                    points.push(starObj.position)
                }
            }

            const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            AppScene.scene.add(line)
        }
    }

    getStarByName(name: string): Star {
        return Stars.indexedDatabase[name.toLowerCase()] ?? Star.empty()
    }

    getStarByHIP(hip: number): Star {
        return Stars.indexedDatabaseByHIP[hip]
    }

    getStarById(id: number): Star {
        return Stars.database[id]
    }
}
export default Stars;