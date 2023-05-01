/*
 *   jupiter_moon.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/1/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { JupiterMoons, JupiterMoonsInfo, StateVector } from "astronomy-engine";
import Planet from "../planet";
import { AUtoKM, distanceScale } from "../../settings";
import Jupiter from "../planets/jupiter";

class JupiterMoon extends Planet {
    static moonsInfo: JupiterMoonsInfo
    static updating: boolean = false
    static jupiter: Jupiter

    updateJupiterMoons(date: Date): JupiterMoonsInfo | null {
        if (!JupiterMoon.updating) {
            JupiterMoon.updating = true
            JupiterMoon.moonsInfo = JupiterMoons(date)
            JupiterMoon.updating = false
        }
        return JupiterMoon.moonsInfo
    }

    // TODO: Uses too many resources (Large numbers + distance)
    animate(time: number): void {
        let date = new Date()
        let infos = this.updateJupiterMoons(date)
        if (infos != null) {
            let coordinates: StateVector = (infos as JupiterMoonsInfo)[this.id]

            let jPos = JupiterMoon.jupiter.getPosition()
            let x = jPos.x + (-coordinates.y * AUtoKM / distanceScale)
            let y = jPos.y + (coordinates.z * AUtoKM / distanceScale)
            let z = jPos.z + (-coordinates.x * AUtoKM / distanceScale)

            this.mesh.position.set(x, y, z)
            this.labelText.position.set(x, y, z)
            this.labelCircle.position.set(x, y, z)
        }
    }

    updateLabel(camera: THREE.Camera): void {
        let dist = JupiterMoon.jupiter.getPosition().distanceTo(camera.position) * distanceScale
        if (dist < 15000000) {
            this.labelText.element.textContent = this.name
        } else {
            this.labelText.element.textContent = ''
        }
        this.labelText.element.style.color = 'white'
    }
}
export default JupiterMoon