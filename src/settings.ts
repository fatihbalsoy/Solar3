/*
 *   settings.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/5/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

export enum Quality {
    high = 2,
    medium = 1,
    low = 0
}
export let quality: Quality = Quality.medium

// Scale
// TODO: Change to 1/10000
export let distanceScale: number = 10000
export let sizeScale: number = 10000

// Astronomical Units to Kilometers
export let AUtoKM = 1.496e+8