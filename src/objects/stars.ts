/*
 *   stars.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/23/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Star, StarData } from "./star";
import '../utils/extensions';

export class Stars {
    // Parsed HYG star database
    static database: Star[]
    static indexedDatabase: { [key: string]: Star } = {}
    static indexedTree: string[] = []
    dataParsed: boolean = false

    constructor() { }

    // Function to parse and process the star data
    parseData(): Star[] {
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v2/hygxyz.csv')
        fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg_v33.csv')
            // fetch('data/stars_hyg_v33.csv')
            .then(response => response.text())
            .then(data => {
                const stars: Star[] = [];
                const lines = data.split('\n');
                // const headers = lines[0].split(',');

                for (let i = 1; i < lines.length; i++) {
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

                    let starObj = new Star(star)
                    stars.push(starObj);
                    if (star.ProperName) {
                        Stars.indexedDatabase[star.ProperName.toLowerCase()] = starObj
                        if (star.ProperName != "\"\"") {
                            Stars.indexedTree.push(star.ProperName.toLowerCase())
                        }
                    }
                }

                Stars.database = stars
                Stars.indexedTree = Stars.indexedTree.sort()
                this.dataParsed = true
                return stars;
            });
        return []
    }

    getStarByName(name: string): Star {
        if (!this.dataParsed) { return Star.empty() } // TODO: Async instead of returning null star
        return Stars.indexedDatabase[name] ?? Star.empty()
    }

    getStarById(id: number): Star {
        return Stars.database[id]
    }
}
export default Stars;