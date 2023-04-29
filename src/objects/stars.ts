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
}

export class Stars {

    // Parsed HYG star database
    database: Star[]
    dataParsed: boolean = false
    // Star points
    // points: THREE.Points

    constructor() { }

    // Function to parse and process the star data
    parseStarData(data): Star[] {
        const stars: Star[] = [];
        const lines = data.split('\n');
        const headers = lines[0].split(',');

        // skip the sun
        for (let i = 2; i < lines.length; i++) {
            const fields = lines[i].split(',');
            const star: StarData = {
                StarID: fields[0],
                HIP: fields[1],
                HD: fields[2],
                HR: fields[3],
                Gliese: fields[4],
                BayerFlamsteed: fields[5],
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
    }

    // TODO: The star positions must be rotated. Star sizes are not accurate.
    displayReal(scene: THREE.Scene, camera: THREE.Camera) {
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v2/hygxyz.csv')
        fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg_v32.csv')
            .then(response => response.text())
            .then(data => {
                // Parse and process the star data
                const stars = this.parseStarData(data);

                // Create star geometry
                const starGeometry = new THREE.BufferGeometry();
                const positions = new Float32Array(stars.length * 3);
                const sizes = new Float32Array(stars.length);

                // Generate stars
                for (let i = 0; i < stars.length; i++) {
                    const star = stars[i];

                    // Convert star position from parsecs to kilometers and divide by distanceScale
                    const vector = star.position

                    // Set star position based on XYZ coordinates
                    positions[i * 3] = vector.x;
                    positions[i * 3 + 1] = vector.y;
                    positions[i * 3 + 2] = vector.z;

                    // Set star size based on magnitude
                    // sizes[i] = Math.pow(10, -star.Mag / 2.5); // Adjust size based on star's magnitude
                    // sizes[i] = Math.pow(2.512, -star.Mag) * (1 + star.Distance * distanceScale); // Star magnitude and distance to size factor
                    // sizes[i] = this.calculateStarSize(-star.data.Mag, star.data.Distance, this.minMagnitude, this.maxDistance, 40000000, 50000000000)
                    if (i <= 10) {
                        console.log(sizes[i])
                    }
                }

                // Set star attributes to star geometry
                starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                starGeometry.setAttribute('scale', new THREE.BufferAttribute(sizes, 1));

                // Create star material
                const starMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 50000000,
                    sizeAttenuation: true,
                    // vertexColors: THREE.VertexColors,
                    transparent: false,
                    blending: THREE.AdditiveBlending
                });

                // Create star points
                const points = new THREE.Points(starGeometry, starMaterial);
                scene.add(points);

                // this.addClickListener(points, stars, camera)
            });
    }

    // TODO: Index for faster search results
    getStarByName(name: string): Star {
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
        return null;
    }

    getStarById(id: number): Star {
        return this.database[id]
    }

    private calculateStarSize(magnitude: number, distance: number, maxMagnitude: number, maxDistance: number, minSize: number, maxSize: number): number {
        // Normalize magnitude and distance to values between 0 and 1
        const normalizedMagnitude = magnitude / maxMagnitude;
        const normalizedDistance = distance / maxDistance;

        // Use logarithmic scaling to balance the impact of magnitude and distance
        const logMagnitude = Math.log10(1 / normalizedMagnitude);
        const logDistance = Math.log10(1 / normalizedDistance);

        // Calculate combined size factor based on normalized magnitude and distance
        const sizeFactor = (logMagnitude + logDistance) / 2;

        // Scale size factor to desired size range
        const scaledSize = minSize + (maxSize - minSize) * sizeFactor;

        return scaledSize;
    }
}

// // Convert spherical coordinates to Cartesian coordinates
// const radius = (star.Distance * distanceKm / distanceScale) * scale; // Multiply distance by distanceScale
// const theta = star.RA; // Convert RA from degrees to radians
// const phi = star.Dec; // Convert Dec to polar angle in radians
// const x = radius * Math.sin(phi) * Math.cos(theta);
// const y = radius * Math.cos(phi);
// const z = radius * Math.sin(phi) * Math.sin(theta);

// // Normalize the coordinates to a unit sphere
// const length = Math.sqrt(x * x + y * y + z * z);
// const normX = x / length;
// const normY = y / length;
// const normZ = z / length;

// // Project the normalized coordinates onto a sphere of radius r
// const r = 1000
// const projectedX = normX * r;
// const projectedY = normY * r;
// const projectedZ = normZ * r;