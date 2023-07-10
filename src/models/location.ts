/*
 *   location.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/21/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

class AppLocation {
    /**
     * A `number` representing the latitude of the position in decimal degrees.
     */
    latitude: number
    /**
     * The value in `longitude` is the geographical longitude of the location 
     * on Earth described by the `Coordinates` object, in decimal degrees. The 
     * value is defined by the World Geodetic System 1984 specification (WGS 84).
     */
    longitude: number
    /**
     * A `double` representing the altitude of the position in meters above the 
     * [WGS84](https://gis-lab.info/docs/nima-tr8350.2-wgs84fin.pdf) ellipsoid.
     */
    altitude: number

    constructor(latitude: number = 0, longitude: number = 0, altitude: number = 0) {
        this.init(latitude, longitude, altitude)
    }

    init(latitude: number = 0, longitude: number = 0, altitude: number = 0) {
        this.latitude = latitude
        this.longitude = longitude
        this.altitude = altitude
    }

    stringify(): string {
        return JSON.stringify(this)
    }

    setFromString(data: string): AppLocation {
        JSON.parse(data, (key, value) => {
            this[key] = value
        })
        return this
    }

    toGeolocationPosition(): GeolocationPosition {
        return {
            coords: {
                latitude: this.latitude,
                longitude: this.longitude,
                altitude: this.altitude
            },
        } as GeolocationPosition
    }

    fromGeolocationPosition(geoPosition: GeolocationPosition) {
        const coords = geoPosition.coords
        this.init(coords.latitude, coords.longitude, coords.altitude)
    }

    equals(to: AppLocation | null): boolean {
        return to != null && this.latitude == to.latitude && this.longitude == to.longitude && this.altitude == to.altitude
    }
}
export default AppLocation