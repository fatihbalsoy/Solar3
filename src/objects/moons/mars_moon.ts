/*
 *   mars_moon.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/20/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Body, ConstellationInfo, EquatorialCoordinates, HelioVector, HorizontalCoordinates, Vector } from "astronomy-engine";
import Planet from "../planet";

class MarsMoon extends Planet {
    animate() {
        let date = new Date()
        let coordinates = this.getPositionForDate(date)
        this.position.set(coordinates.x, coordinates.y, coordinates.z)
        // this.mesh.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelText.position.set(coordinates.x, coordinates.y, coordinates.z)
        this.labelCircle.position.set(coordinates.x, coordinates.y, coordinates.z)
    }

    getPositionForDateNotScaled(date: Date): Vector {
        // let helioCoords = HelioVector(Body[this.name], date)
        let marsHelioCoords = HelioVector(Body.Mars, date)

        // z,x,y
        return new Vector(
            -marsHelioCoords.y, // x
            marsHelioCoords.z,  // y
            -marsHelioCoords.x, // z
            marsHelioCoords.t
        )
    }

    getEquatorialCoordinates(date: Date, gpsLocation: GeolocationPosition): EquatorialCoordinates {
        return null
    }

    getHorizontalCoordinates(date: Date, gpsLocation: GeolocationPosition): HorizontalCoordinates {
        return null
    }

    getConstellation(date: Date, gpsLocation: GeolocationPosition): ConstellationInfo {
        return null
    }
}
export default MarsMoon