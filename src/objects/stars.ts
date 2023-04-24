/*
 *   stars.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/23/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import { distanceScale } from "../settings";

interface Star {
    StarID: number, HIP: number, HD: number, HR: number, Gliese: number, BayerFlamsteed: number,
    ProperName: string, RA: number, Dec: number, Distance: number, PMRA: number, PMDec: number,
    RV: number, Mag: number, AbsMag: number, Spectrum: string, ColorIndex: number,
    X: number, Y: number, Z: number, VX: number, VY: number, VZ: number
}

export class Stars {

    // // Parsed HYG star database
    // database: Star[]
    // // Star points
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
            const star: Star = {
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

            stars.push(star);
        }

        return stars;
    }

    // TODO: The star positions must be rotated.
    displayReal(scene: THREE.Scene, scale: number, camera: THREE.Camera) {
        // fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v2/hygxyz.csv')
        fetch('https://raw.githubusercontent.com/astronexus/HYG-Database/master/hyg/v3/hyg.csv')
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
                    const distanceKm = 3.262 * Math.pow(10, 13); // 1 parsec = 3.262 light-years = 3.262 * 10^13 kilometers
                    const x = (star.X * distanceKm / distanceScale) * scale;
                    const y = (star.Y * distanceKm / distanceScale) * scale;
                    const z = (star.Z * distanceKm / distanceScale) * scale;

                    // Set star position based on XYZ coordinates
                    positions[i * 3] = x;
                    positions[i * 3 + 1] = y;
                    positions[i * 3 + 2] = z;

                    // Set star size based on magnitude
                    sizes[i] = Math.pow(10, -star.Mag / 2.5); // Adjust size based on star's magnitude
                    // sizes[i] = Math.pow(2.512, -star.Mag) * (1 + star.Distance * distanceScale); // Star magnitude and distance to size factor
                }

                // Set star attributes to star geometry
                starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

                // Create star material
                const starMaterial = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 50000000 * scale, // Adjust size to your liking
                    sizeAttenuation: true,
                    // vertexColors: THREE.VertexColors,
                    transparent: true,
                    blending: THREE.AdditiveBlending
                });

                // Create star points
                const points = new THREE.Points(starGeometry, starMaterial);
                scene.add(points);

                this.addClickListener(points, stars, camera)
            });
    }

    private addClickListener(points: THREE.Points, data: Star[], camera: THREE.Camera) {
        // Add event listener for mouse clicks
        window.addEventListener('click', onMouseClick, false);

        // Define the onMouseClick event handler
        function onMouseClick(event) {
            // Calculate mouse coordinates normalized to (-1 to 1) in both dimensions
            const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            console.log(mouseX)
            console.log(mouseY)

            // Create a raycaster and set its origin and direction
            const raycaster = new THREE.Raycaster();
            raycaster.params.Points.threshold = 50000000
            raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

            // Test for intersection with the points
            const intersects = raycaster.intersectObject(points);

            for (const intersect of intersects) {
                console.log('HI')
                if (intersect.object instanceof THREE.Points) {
                    // Access the clicked star's name from its userData
                    const starName = intersect.object.userData.name;
                    console.log("Clicked star name:", starName);
                }
            }

            // if (intersects.length > 0) {
            //     // Get the clicked point's index
            //     const clickedIndex = intersects[0].index;

            //     // Get the corresponding star object from the starData array
            //     const clickedStar = data[clickedIndex];

            //     // Print the clicked star's name to the console
            //     console.log('Clicked Star:', clickedStar.ProperName);
            // }
        }
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