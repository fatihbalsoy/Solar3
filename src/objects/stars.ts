/*
 *   stars.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/23/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Star, StarDataMini } from "./star";
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
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg_v33.csv')
        fetch('data/stars_hyg_v35.csv')
            .then(response => response.text())
            .then(data => {
                const stars: Star[] = [];
                const lines = data.split('\n');
                // const headers = lines[0].split(',');

                for (let i = 1; i < lines.length; i++) {
                    const fields = lines[i].split(',');
                    const star: StarDataMini = {
                        StarID: parseInt(fields[0]),
                        ProperName: fields[1],
                        RA: parseFloat(fields[2]),
                        Dec: parseFloat(fields[3]),
                        Distance: parseFloat(fields[4]),
                        Mag: parseFloat(fields[5]),
                        AbsMag: parseFloat(fields[6]),
                        X: parseFloat(fields[7]),
                        Y: parseFloat(fields[8]),
                        Z: parseFloat(fields[9])
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