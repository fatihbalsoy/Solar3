/*
 *   jupiter_moon.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/1/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { JupiterMoons, JupiterMoonsInfo, StateVector, Vector, Body, AstroTime } from "astronomy-engine";
import Planet from "../planet";
import { Settings } from "../../settings";
import Planets from "../planets";

class JupiterMoon extends Planet {
    static moonsInfo: JupiterMoonsInfo
    static updating: boolean = false

    updateJupiterMoons(date: Date): JupiterMoonsInfo | null {
        if (!JupiterMoon.updating) {
            JupiterMoon.updating = true
            JupiterMoon.moonsInfo = JupiterMoons(date)
            JupiterMoon.updating = false
        }
        return JupiterMoon.moonsInfo
    }

    animate(): void {
        let pos = this.getPositionForDate(new Date())
        this.position.set(pos.x, pos.y, pos.z)
        this.mesh.position.set(pos.x, pos.y, pos.z)
        this.labelText.position.set(pos.x, pos.y, pos.z)
        this.labelCircle.position.set(pos.x, pos.y, pos.z)
    }

    getPositionForDate(date: Date): Vector {
        let pos = this.getPositionForDateNotScaled(date)
        let jPos = Planets.jupiter.getPosition()
        return new Vector(
            jPos.x + (pos.x * Settings.AUtoKM * Settings.distanceScale),
            jPos.y + (pos.y * Settings.AUtoKM * Settings.distanceScale),
            jPos.z + (pos.z * Settings.AUtoKM * Settings.distanceScale),
            pos.t
        )
    }

    getPositionForDateNotScaled(date: Date): Vector {
        let infos = this.updateJupiterMoons(date)
        let joviCoords: StateVector = (infos as JupiterMoonsInfo)[this.id]
        return new Vector(
            -joviCoords.y, // x
            joviCoords.z,  // y
            -joviCoords.x, // z
            new AstroTime(date)
        )
    }

    updateLabel(camera: THREE.Camera): void {
        let dist = Planets.jupiter.getPosition().distanceTo(camera.position) / Settings.distanceScale
        if (dist < 15000000) {
            this.labelText.element.textContent = this.name
        } else {
            this.labelText.element.textContent = ''
        }
        this.labelText.element.style.color = 'white'
    }
}
export default JupiterMoon