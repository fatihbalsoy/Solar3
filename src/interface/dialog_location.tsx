/*
 *   location_dialog.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/21/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { mdiCrosshairsGps, mdiMapMarker } from "@mdi/js"
import Icon from "@mdi/react"
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import React, { RefObject } from "react"
import { Component } from "react"
import { Vector2, Vector3 } from "three"
import AppLocation from "../models/location"
import Settings, { Quality } from "../settings"

interface LocationDialogProps {
    open: boolean
    onClose: () => void
    onSave?: (position: AppLocation) => void
    onLocationUpdate?: (position: AppLocation) => void
}
interface LocationDialogState {
    open: boolean
    locationLoading: boolean
    locationField: { lat: string, lon: string, alt: string }
    location2D: Vector2
    locationGeo: AppLocation // lat, lon, alt
}

class LocationDialog extends Component<LocationDialogProps, LocationDialogState> {
    state: LocationDialogState = {
        open: false,
        locationLoading: false,
        locationField: { lat: "", lon: "", alt: "" },
        location2D: new Vector2(0, 0),
        locationGeo: Settings.geolocation ?? new AppLocation(0, 0, 0),
    }
    topLeftLat = 90.0;
    topLeftLon = -180.0;
    bottomRightLat = -90.0;
    bottomRightLon = 180.0;

    textureDomId = 'earth-texture'

    constructor(props: LocationDialogProps) {
        super(props)

        this.clickedOnMap = this.clickedOnMap.bind(this)
        this.changedLatitude = this.changedLatitude.bind(this)
        this.changedLongitude = this.changedLongitude.bind(this)
        this.changedAltitude = this.changedAltitude.bind(this)
        this.onLocationGetCoordinates = this.onLocationGetCoordinates.bind(this)
        this.onClose = this.onClose.bind(this)
        this.onSaveAndClose = this.onSaveAndClose.bind(this)
    }

    componentDidMount(): void {
        if (this.props.open) {
            this.setState({
                open: true
            })
        }

        if (Settings.geolocation) {
            const loc = Settings.geolocation
            this.setState({
                locationField: {
                    lat: loc.latitude.toString(),
                    lon: loc.longitude.toString(),
                    alt: loc.altitude.toString()
                }
            })
        }

        // if (Settings.geolocation) {
        //     const coords = Settings.geolocation
        //     this.setLocation(coords.latitude, coords.longitude, coords.altitude)
        // }
    }

    componentDidUpdate(prevProps: Readonly<LocationDialogProps>, prevState: Readonly<LocationDialogState>, snapshot?: any): void {
        if (this.props.onLocationUpdate && prevState.locationGeo != this.state.locationGeo) {
            this.props.onLocationUpdate(this.state.locationGeo)
        }
    }

    clickedOnMap(event) {
        const rect: DOMRect = event.target.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // Normalize the XY coordinates
        const normalizedX = x / rect.width;
        const normalizedY = y / rect.height;

        // Map the normalized XY values to latitude and longitude range
        const lat = this.topLeftLat - (this.topLeftLat - this.bottomRightLat) * normalizedY;
        const lon = this.topLeftLon + (this.bottomRightLon - this.topLeftLon) * normalizedX;

        this.setState({
            locationField: {
                lat: lat.toString(), lon: lon.toString(),
                alt: this.state.locationGeo.altitude.toString()
            },
            location2D: new Vector2(x, y),
            locationGeo: new AppLocation(lat, lon, this.state.locationGeo.altitude)
        })
    }

    textureRect(): DOMRect {
        return document.getElementById(this.textureDomId).getBoundingClientRect()
    }

    setLocation(lat?: number, lon?: number, alt?: number) {
        var location2DLocal = this.state.location2D
        var locationGeoLocal = this.state.locationGeo

        if (lat || lat == 0) {
            const height = this.textureRect().height;
            const normalizedLat = (lat - this.bottomRightLat) / (this.topLeftLat - this.bottomRightLat)

            const y = (1 - normalizedLat) * height;
            location2DLocal.setY(y)
            locationGeoLocal.latitude = lat
        }

        if (lon || lon == 0) {
            const width = this.textureRect().width;
            const normalizedLon = (lon - this.topLeftLon) / (this.bottomRightLon - this.topLeftLon)

            const x = normalizedLon * width;
            location2DLocal.setX(x)
            locationGeoLocal.longitude = lon
        }

        if (alt || alt == 0) {
            locationGeoLocal.altitude = alt
        }

        this.setState({
            location2D: location2DLocal,
            locationGeo: locationGeoLocal
        })
    }

    changedLatitude(event) {
        const lat = parseFloat(event.target.value)
        this.setLocation(lat, null, null)

        var loc = this.state.locationField
        loc.lat = event.target.value
        this.setState({
            locationField: loc
        })
    }

    changedLongitude(event) {
        const lon = parseFloat(event.target.value)
        this.setLocation(null, lon, null)

        var loc = this.state.locationField
        loc.lon = event.target.value
        this.setState({
            locationField: loc
        })
    }

    changedAltitude(event) {
        const alt = parseFloat(event.target.value)
        this.setLocation(null, null, alt)

        var loc = this.state.locationField
        loc.alt = event.target.value
        this.setState({
            locationField: loc
        })
    }

    onLocationGetCoordinates() {
        if (navigator.geolocation) {
            this.setState({
                locationLoading: true
            })
            navigator.geolocation.getCurrentPosition(
                (value) => {
                    this.setState({
                        locationLoading: false,
                        locationField: {
                            lat: (value.coords.latitude ?? 0).toString(),
                            lon: (value.coords.longitude ?? 0).toString(),
                            alt: (value.coords.altitude ?? 0).toString()
                        }
                    })
                    this.setLocation(value.coords.latitude, value.coords.longitude, value.coords.altitude)
                }, (error) => {
                    this.setState({
                        locationLoading: false
                    })
                    console.log(error)
                }
            )
        }
    }

    onClose() {
        this.setState({
            open: false
        })
        this.props.onClose()
    }

    onSaveAndClose() {
        Settings.geolocation = this.state.locationGeo
        localStorage.setItem('location', this.state.locationGeo.stringify())
        this.props.onSave(this.state.locationGeo)
        this.onClose()
    }

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.onClose}
                scroll='paper'
                maxWidth='md'
            >
                <DialogTitle>Location</DialogTitle>
                <DialogContent sx={{ padding: 0 }} dividers={true}>
                    <div id={this.textureDomId} onClick={this.clickedOnMap}>
                        <img
                            style={{
                                maxWidth: '100%',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                            src={
                                // TODO: How should this act if user is only setting for ra/dec,alt/az?
                                //     : Have two separate locations in Settings? Earth & Other Planets
                                !Settings.cameraLocation ? "" : Settings.cameraLocation.id == "earth"
                                    ? "assets/images/textures/earth/2k/basic.jpeg"
                                    // TODO: These textures do not map with spherical coordinates
                                    : Settings.cameraLocation.getTexturePath(Quality.low)
                            }
                        />
                        <Icon
                            style={{
                                position: 'absolute',
                                left: this.state.location2D.x - 12,
                                top: this.state.location2D.y + 42,
                                pointerEvents: 'none',
                            }}
                            size={1}
                            color="#383838"
                            path={mdiMapMarker}
                        />
                    </div>
                    <Box sx={{ '& > :not(style)': { m: 1, marginBottom: '12px', width: '25ch' }, display: 'flex', justifyContent: 'center' }}>
                        <TextField label="Latitude" variant="outlined" value={this.state.locationField.lat} onChange={this.changedLatitude} />
                        <TextField label="Longitude" variant="outlined" value={this.state.locationField.lon} onChange={this.changedLongitude} />
                        <TextField label="Altitude" variant="outlined" value={this.state.locationField.alt} onChange={this.changedAltitude} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex' }}>
                    {
                        navigator.geolocation
                            ? <div>
                                <Button onClick={this.onLocationGetCoordinates}>Use Current Location</Button>
                                {
                                    this.state.locationLoading ? <CircularProgress size={20} sx={{ leftMargin: '20px' }} /> : null
                                }
                            </div>
                            : <Button disabled>GPS is not supported on this device</Button>
                    }
                    <div style={{ flexGrow: '100' }} />
                    <Button onClick={this.onClose}>Discard</Button>
                    <Button onClick={this.onSaveAndClose}>Save</Button>
                </DialogActions>
            </Dialog>
        )
    }

}
export default LocationDialog
