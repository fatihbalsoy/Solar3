/*
 *   settings.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/5/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Vector3 } from "three"
import { EnumDictionary } from "./utils/extensions"
import Planet from "./objects/planet"
import Star from "./objects/star"
import Planets from "./objects/planets"

export enum Quality {
    high = 2,
    medium = 1,
    low = 0
}
export class Settings {
    static lookAt: Planet | Star = Planets.sun // does not work well with stars

    // Graphics
    static quality: Quality = Quality.medium
    static readonly res2_4_8k: EnumDictionary<Quality, string> = {
        [Quality.high]: '8k',
        [Quality.medium]: '4k',
        [Quality.low]: '2k'
    }
    static readonly res4_8k: EnumDictionary<Quality, string> = {
        [Quality.high]: '8k',
        [Quality.medium]: '4k',
        [Quality.low]: '4k'
    }
    static readonly res2_8k: EnumDictionary<Quality, string> = {
        [Quality.high]: '8k',
        [Quality.medium]: '2k',
        [Quality.low]: '2k'
    }
    static readonly res2_4k: EnumDictionary<Quality, string> = {
        [Quality.high]: '4k',
        [Quality.medium]: '4k',
        [Quality.low]: '2k'
    }
    static readonly res1_2k: EnumDictionary<Quality, string> = {
        [Quality.high]: '2k',
        [Quality.medium]: '2k',
        [Quality.low]: '1k'
    }

    // Scale
    static readonly distanceScale: number = 1 / 10000
    static readonly sizeScale: number = 1 / 10000

    // Astronomical Units to Kilometers
    static readonly AUtoKM = 1.496e+8
}
export default Settings