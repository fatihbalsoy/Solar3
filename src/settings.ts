/*
 *   settings.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/5/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { AmbientLight, AxesHelper, Color, Object3D, Scene } from "three"
import { EnumDictionary } from "./utils/extensions"
import Planet from "./objects/planet"
import Star from "./objects/star"
import Planets from "./objects/planets"
import { totalmem } from 'os'
import AppScene from "./scene"
import AppLocation from "./models/location"
var platform = require('platform');

export enum Quality {
    high = 2,
    medium = 1,
    low = 0
}

export class Settings {
    /**
     * Returns whether the current environment is not built for production.
     * Can be used to display things like an FPS counter when debugging.
     */
    static isDev = process.env.NODE_ENV !== 'production'

    // does not work well with stars when the camera range is limited
    static lookAt: Planet | Star = Planets.sun

    // * Geolocation * //
    static geolocation: AppLocation = localStorage.getItem('location')
        ? new AppLocation().setFromString(localStorage.getItem('location'))
        : null

    // * Graphics * //
    private static gigabyteToBytes = 1e+9
    static readonly quality: Quality =
        // Safari on iPhone only provides roughly 300mb of RAM. Therefore, load low-res textures instead. Same for low-end devices (2gb ram)
        (platform.layout == 'WebKit' && platform.product == 'iPhone') || totalmem() <= 3
            ? Quality.low
            // Load high-res textures on high-end devices (16gb ram)
            : totalmem() >= 15 * this.gigabyteToBytes
                ? Quality.high
                // Load medium-res textures on everything else
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

    // * Scale * //
    // The scale is extremely small so the program does not need to 
    // calculate large numbers and run into issues at far distances.
    // If both variables match, then the program is simulating the 
    // solar system at 1:1 scale.
    static readonly distanceScale: number = 1 / 10000
    static readonly sizeScale: number = 1 / 10000

    /**
     * Astronomical Units to Kilometers
     */
    static readonly AUtoKM = 1.496e+8

    // * Developer Settings * //
    /**
     * Stop the program from progressing after the loading screen
     */
    static dev_setHaltLoadingScreen: boolean = false
    static dev_haltLoadingScreen(): boolean {
        return Settings.isDev ? Settings.dev_setHaltLoadingScreen : false
    }
    /**
     * Add ambient light to see objects without shadows
     */
    static dev_ambientLightAdded = false
    static dev_addAmbientLight() {
        if (Settings.isDev) {
            const light = new AmbientLight(new Color(0xffffff), 1)
            AppScene.scene.add(light)
        }
    }
    /**
     * Add axes helper. The X axis is red. The Y axis is green. The Z axis is blue.
     * @param addTo To which scene or object to add the axes helper.
     */
    static dev_addAxesHelper(addTo: Scene | Object3D, size: number = 1) {
        if (Settings.isDev) {
            const axesHelper = new AxesHelper(size);
            addTo.add(axesHelper);
        }
    }
}

/**
 * The range of textures for each planet and their other properties.
 */
export const resFields: EnumDictionary<string, EnumDictionary<Quality, string>> = {
    "mercury": Settings.res2_4_8k,
    "venus_atmosphere": Settings.res2_4k,
    "venus_surface": Settings.res2_4_8k,
    "earth": Settings.res2_4_8k,
    "mars": Settings.res2_4_8k,
    "jupiter": Settings.res2_4k,
    "saturn": Settings.res2_4k,
    "saturn_ring_alpha": Settings.res2_4_8k,
    "uranus": Settings.res2k,
    "neptune": Settings.res2k,
    "pluto": Settings.res1_2k,
    "ceres": Settings.res2_4k,
    "moon": Settings.res2_4_8k,
    "io": Settings.res2_4_8k,
    "europa": Settings.res1k,
    "ganymede": Settings.res1k,
    "callisto": Settings.res1k,
    "galaxy": Settings.res2_4_8k
}

export default Settings
