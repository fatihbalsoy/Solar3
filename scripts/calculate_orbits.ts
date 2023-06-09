/*
 *   calculate_orbits.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/30/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as fs from "fs";
import * as ast from "astronomy-engine"
import * as objectsJson from '../src/data/objects.json';
import * as readline from 'readline';

const supported_bodies = [
    ast.Body.Mercury,
    ast.Body.Venus,
    ast.Body.Earth,
    ast.Body.Mars,
    ast.Body.Jupiter,
    ast.Body.Saturn,
    ast.Body.Uranus,
    ast.Body.Neptune,
    ast.Body.Pluto
]

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

/**
 * Calculates a non-scaled vector from the center of the Sun to the given body at the given time.
 * @param date the date in which to calculate the planet's position
 * @returns a heliocentric vector pointing to the planet's position
 * @note this is a copy of the function found in src/objects/planet.ts
 */
function getPositionForDateNotScaled(body: string, date: Date): ast.Vector {
    let helioCoords = ast.HelioVector(body as ast.Body, date)
    // z,x,y
    return new ast.Vector(
        -helioCoords.y, // x
        helioCoords.z,  // y
        -helioCoords.x, // z
        helioCoords.t
    )
}

// define start date
const startDate = new Date();

// calculate and store orbit points for each planet
var orbitPoints: string[] = []
var indexNames: string = ""
var indexLines: string = ""

process.stdout.write("\n--- Calculating Orbits ---")
process.stdout.write("\n" + startDate.toISOString())
let showCalculations = false
for (let key in supported_bodies) {
    let planet: ast.Body = supported_bodies[key];
    if (typeof planet == "string") {
        process.stdout.write("\n" + planet)

        let obj = objectsJson[planet.toLowerCase()]
        let name: string = obj.name
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
            let pos = getPositionForDateNotScaled(name, date);
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