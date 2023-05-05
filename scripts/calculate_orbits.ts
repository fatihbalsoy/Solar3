/*
 *   calculate_orbits.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/30/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as fs from "fs";
import Planet from "../src/objects/planet";
import * as objectsJson from '../src/data/objects.json';
import * as readline from 'readline';
import Planets from '../src/objects/planets'

/** Planets **/
import Mercury from '../src/objects/planets/mercury'
import Venus from '../src/objects/planets/venus'
import Earth from '../src/objects/planets/earth'
import Mars from '../src/objects/planets/mars'
import Jupiter from '../src/objects/planets/jupiter'
import Saturn from '../src/objects/planets/saturn'
import Uranus from '../src/objects/planets/uranus'
import Neptune from '../src/objects/planets/neptune'
/** Dwarf Planets **/
import Pluto from '../src/objects/dwarf_planets/pluto'

declare global {
    interface Array<T> {
        insert(index: number, ...items: T[]): void;
    }
}

Array.prototype.insert = function <T>(this: T[], index: number, ...items: T[]): void {
    this.splice(index, 0, ...items);
};

function rprint(s: string) {
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0, undefined)
    process.stdout.write(s)
}

// define start date
const startDate = new Date();

// calculate and store orbit points for each planet
var orbitPoints: string[] = []
var indexNames: string = ""
var indexLines: string = ""

new Planets({
    mercury: new Mercury(), venus: new Venus(), earth: new Earth(), mars: new Mars(),
    jupiter: new Jupiter(), saturn: new Saturn(), uranus: new Uranus(), neptune: new Neptune(),
    pluto: new Pluto(), // ceres: new Ceres(),
})

process.stdout.write("\n--- Calculating Orbits ---")
process.stdout.write("\n" + startDate.toISOString())
let showCalculations = false
for (let key in Planets) {
    let planet: Planet = Planets[key];
    if (planet) {
        process.stdout.write("\n" + planet.name)

        let obj = objectsJson[key]
        let name = obj.name
        let orbitalPeriod = obj.sideralOrbit
        let lines = Math.floor(366 * (orbitalPeriod / 365))
        orbitPoints.push(lines.toString())
        process.stdout.write("\n- orbital period: " + orbitalPeriod)
        process.stdout.write("\n- vector lines: " + lines)

        let index = 3 + orbitPoints.length
        indexNames = indexNames.concat(name + ",")
        indexLines = indexLines.concat((index).toString() + ",")
        process.stdout.write("\n- index: " + index + "\n")

        rprint("-- Calculating Orbit...")
        let orbit: string[] = [];
        for (let i = 0; i < lines; i++) {
            let date = new Date(startDate.getFullYear(), 0, i);
            let pos = planet.getPositionForDateNotScaled(date);
            let sigFigs = 5
            let posString = `${pos.x.toPrecision(sigFigs)},${pos.y.toPrecision(sigFigs)},${pos.z.toPrecision(sigFigs)}`
            orbit.push(posString);
            if (showCalculations) {
                rprint("-- Day: " + i + "\t" + posString)
            }
        }
        rprint("-- Calculated Orbit.")
        if (orbit.length != 0) {
            orbitPoints = orbitPoints.concat(orbit)
        }
    }
}

orbitPoints.insert(0, startDate.toISOString())
orbitPoints.insert(1, indexNames.slice(0, indexNames.length - 1))
orbitPoints.insert(2, indexLines.slice(0, indexLines.length - 1))

// write to file
fs.writeFileSync("./public/data/orbit_points.txt", orbitPoints.join("\n"));
process.stdout.write("\nDone. " + orbitPoints.length + " lines generated.\n");