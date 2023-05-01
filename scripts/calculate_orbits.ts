/*
 *   calculate_orbits.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/30/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as fs from "fs";
import Planet, { bodies } from "../src/objects/planet";
import * as objectsJson from '../src/data/objects.json';
import { Body } from 'astronomy-engine';

declare global {
    interface Array<T> {
        insert(index: number, ...items: T[]): void;
    }
}

Array.prototype.insert = function <T>(this: T[], index: number, ...items: T[]): void {
    this.splice(index, 0, ...items);
};

// define start date
const startDate = new Date();

// range of objects to calculate orbits for
let start = bodies.sun
let stopAt = bodies.pluto

// calculate and store orbit points for each planet
var orbitPoints: string[] = []
var indexNames: string = ""
var indexLines: string = ""

process.stdout.write("\n--- Calculating Orbits ---")
process.stdout.write("\n" + startDate.toISOString())
let showCalculations = false
for (let key in bodies) {
    if (Object.prototype.hasOwnProperty.call(bodies, key)) {
        let planet: Body = bodies[key];
        process.stdout.write("\n" + key)

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

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("-- Calculating Orbit...")
        let orbit: string[] = [];
        for (let i = 0; i < lines; i++) {
            let date = new Date(startDate.getFullYear(), 0, i);
            let pos = Planet.getPositionForDateNotScaled(date, planet);
            let sigFigs = 5
            let posString = `${pos.x.toPrecision(sigFigs)},${pos.y.toPrecision(sigFigs)},${pos.z.toPrecision(sigFigs)}`
            orbit.push(posString);
            if (showCalculations) {
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write("-- Day: " + i + "\t" + posString)
            }
        }
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write("-- Calculated Orbit.");
        if (orbit.length != 0) {
            orbitPoints = orbitPoints.concat(orbit)
        }
        if (planet.valueOf() == stopAt.valueOf()) { break }
    }
}

orbitPoints.insert(0, startDate.toISOString())
orbitPoints.insert(1, indexNames.slice(0, indexNames.length - 1))
orbitPoints.insert(2, indexLines.slice(0, indexLines.length - 1))

// write to file
fs.writeFileSync("./public/data/orbit_points.txt", orbitPoints.join("\n"));
process.stdout.write("\nDone. " + orbitPoints.length + " lines generated.\n");