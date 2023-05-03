/*
 *   orbit_points.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/30/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three"
import Planet from "../objects/planet"
import { Settings } from "../settings"

export interface Orbit {
    name: string
    length: number
    points: THREE.Vector3[]
}

export class Orbits {

    parseData(data: string, planet: string): Orbit {
        var orbit: Orbit

        let fileLines = data.split("\n")
        // let fileDate = new Date(fileLines[0])
        let planetNames = fileLines[1].split(",")
        let planetIndex = fileLines[2].split(",")

        let i = planetNames.indexOf(planet)
        let name = planetNames[i].toLowerCase();
        let index = parseInt(planetIndex[i]);
        let length = parseInt(fileLines[index - 1])
        let vLines: string[] = fileLines.slice(index, index + length)
        var vectors: THREE.Vector3[] = []

        for (let v = 0; v < vLines.length; v++) {
            let element = vLines[v];
            let coords: string[] = element.split(",")
            let x = parseFloat(coords[0]) * Settings.AUtoKM * Settings.distanceScale
            let y = parseFloat(coords[1]) * Settings.AUtoKM * Settings.distanceScale
            let z = parseFloat(coords[2]) * Settings.AUtoKM * Settings.distanceScale

            let vector = new THREE.Vector3(x, y, z)
            vectors.push(vector)
        }

        orbit = {
            name: name,
            length: vectors.length,
            points: vectors
        }

        return orbit
    }

    addOrbits(planets: Planet[], scene: THREE.Scene) {
        fetch('data/orbit_points.txt')
            .then(response => response.text())
            .then(data => {
                for (let c in planets) {
                    let planet = planets[c]
                    let orbit = this.parseData(data, planet.name)
                    planet.displayOrbit(orbit, scene)
                }
            })
    }
}