/*
 *   objects.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import Planet from './planet'

/** Stars **/
import Sun from './sun'
/** Planets **/
import Mercury from './planets/mercury'
import Venus from './planets/venus'
import Earth from './planets/earth'
import Mars from './planets/mars'
import Jupiter from './planets/jupiter'
import Saturn from './planets/saturn'
import Uranus from './planets/uranus'
import Neptune from './planets/neptune'
/** Dwarf Planets **/
import Pluto from './dwarf_planets/pluto'
import Ceres from './dwarf_planets/ceres'
/** Moons **/
import Moon from './moons/earth_moon'
import JupiterMoon from './moons/jupiter_moon';
import Io from './moons/jupiter_io';
import Callisto from './moons/jupiter_callisto';
import Europa from './moons/jupiter_europa';
import Ganymede from './moons/jupiter_ganymede';

class Objects implements Iterable<Planet> {
    sun: Sun;
    mercury: Mercury; venus: Venus; earth: Earth; mars: Mars;
    jupiter: Jupiter; saturn: Saturn; uranus: Uranus; neptune: Neptune;
    pluto: Pluto;
    moon: Moon;
    io: Io; callisto: Callisto; europa: Europa; ganymede: Ganymede;

    constructor(objects: {}) {
        for (const key in objects) {
            const element = objects[key];
            this[key] = element
        }
    }

    array() {
        return [
            this.sun,
            this.mercury, this.venus, this.earth, this.mars,
            this.jupiter, this.saturn, this.uranus, this.neptune,
            this.pluto,
            this.moon,
            this.io, this.callisto, this.europa, this.ganymede
        ]
    }

    [Symbol.iterator](): Iterator<Planet> {
        let index = 0;
        let items = this.array

        return {
            next(): IteratorResult<Planet> {
                if (index >= items.length) {
                    return { done: true, value: null };
                }

                return { done: false, value: items[index++] };
            }
        };
    }
}
export default Objects