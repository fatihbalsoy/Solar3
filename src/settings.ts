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
import { totalmem } from 'os'
var platform = require('platform');

export enum Quality {
    high = 2,
    medium = 1,
    low = 0
}

export class Settings {
    static isDev = process.env.NODE_ENV !== 'production'
    static lookAt: Planet | Star = Planets.sun // does not work well with stars

    // Graphics
    private static gigabyteToBytes = 1e+9
    static readonly quality: Quality =
        // Safari on iPhone only provides roughly 300mb of RAM
        platform.layout == 'WebKit' && platform.product == 'iPhone'
            ? Quality.low
            // Load 8k textures on high-end devices (16gb ram)
            : totalmem() >= 15 * this.gigabyteToBytes
                ? Quality.high
                : Quality.medium
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
    static readonly res2k: EnumDictionary<Quality, string> = {
        [Quality.high]: '2k',
        [Quality.medium]: '2k',
        [Quality.low]: '2k'
    }
    static readonly res1k: EnumDictionary<Quality, string> = {
        [Quality.high]: '1k',
        [Quality.medium]: '1k',
        [Quality.low]: '1k'
    }

    // Scale
    static readonly distanceScale: number = 1 / 10000
    static readonly sizeScale: number = 1 / 10000

    // Astronomical Units to Kilometers
    static readonly AUtoKM = 1.496e+8
}

export const resFields: EnumDictionary<string, EnumDictionary<Quality, string>> = {
    "mercury": Settings.res2_8k,
    "venus": Settings.res2_4k,
    "earth": Settings.res2_8k,
    "mars": Settings.res2_8k,
    "jupiter": Settings.res2_8k,
    "saturn": Settings.res2_8k,
    "uranus": Settings.res2k,
    "neptune": Settings.res2k,
    "pluto": Settings.res1_2k,
    "ceres": Settings.res2_4k,
    "moon": Settings.res2_8k,
    "io": Settings.res2_4_8k,
    "europa": Settings.res1k,
    "ganymede": Settings.res1k,
    "callisto": Settings.res1k,
}

export default Settings