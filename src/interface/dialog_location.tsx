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
import React from "react"
import { Component } from "react"
import { Vector2, Vector3 } from "three"
import AppLocation from "../models/location"
import Settings from "../settings"

interface LocationDialogProps {
    open: boolean
    onClose: () => void
    onSave?: (position: AppLocation) => void
    onLocationUpdate?: (position: AppLocation) => void
}
interface LocationDialogState {
    open: boolean
    locationLoading: boolean
    location2D: Vector2
    locationGeo: AppLocation // lat, lon, alt
}

// TODO: Pressing 'current location' causes entire dialog to rebuild and texture size becomes small, therefore the map marker is misplaced.
class LocationDialog extends Component<LocationDialogProps, LocationDialogState> {
    state: LocationDialogState = {
        open: false,
        locationLoading: false,
        location2D: new Vector2(0, 0),
        locationGeo: Settings.geolocation ?? new AppLocation(0, 0, 0),
    }
    topLeftLat = 90.0;
    topLeftLon = -180.0;
    bottomRightLat = -90.0;
    bottomRightLon = 180.0;

    constructor(props: LocationDialogProps) {
        super(props)

        this.clickedOnMap = this.clickedOnMap.bind(this)
        this.changedLatitude = this.changedLatitude.bind(this)
        this.changedLongitude = this.changedLongitude.bind(this)
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
    }

    componentDidUpdate(prevProps: Readonly<LocationDialogProps>, prevState: Readonly<LocationDialogState>, snapshot?: any): void {
        if (prevState.locationGeo != this.state.locationGeo) {
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
            location2D: new Vector2(x, y),
            locationGeo: new AppLocation(lat, lon, this.state.locationGeo.altitude)
        })
    }

    textureRect(): DOMRect {
        return document.getElementById('earth-texture').getBoundingClientRect()
    }

    setLocation(lat?: number, lon?: number, alt?: number) {
        var location2DLocal = this.state.location2D
        var locationGeoLocal = this.state.locationGeo

        if (lat) {
            const height = this.textureRect().height;
            const normalizedLat = (lat - this.bottomRightLat) / (this.topLeftLat - this.bottomRightLat)

            const y = (1 - normalizedLat) * height;
            location2DLocal.setY(y)
            locationGeoLocal.latitude = lat
        }

        if (lon) {
            const width = this.textureRect().width;
            const normalizedLon = (lon - this.topLeftLon) / (this.bottomRightLon - this.topLeftLon)

            const x = normalizedLon * width;
            location2DLocal.setX(x)
            locationGeoLocal.longitude = lon
        }

        if (alt) {
            locationGeoLocal.altitude = alt
        }

        this.setState({
            location2D: location2DLocal,
            locationGeo: locationGeoLocal
        })
    }

    changedLatitude(event) {
        const lat = event.target.value
        this.setLocation(lat, null, null)
    }

    changedLongitude(event) {
        const lon = event.target.value
        this.setLocation(null, lon, null)
    }

    changedAltitude(event) {
        const alt = event.target.value
        this.setLocation(null, null, alt)
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
                    <div id="earth-texture" onClick={this.clickedOnMap}>
                        <img
                            style={{
                                maxWidth: '100%',
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}
                            src="assets/images/textures/earth/2k/basic.jpeg"
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
                        <TextField label="Latitude" variant="outlined" value={this.state.locationGeo.latitude} onChange={this.changedLatitude} />
                        <TextField label="Longitude" variant="outlined" value={this.state.locationGeo.longitude} onChange={this.changedLongitude} />
                        <TextField label="Altitude" variant="outlined" value={this.state.locationGeo.altitude} onChange={this.changedAltitude} />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ display: 'flex' }}>
                    <Button onClick={this.onLocationGetCoordinates}>Use Current Location</Button>
                    {
                        this.state.locationLoading ? <CircularProgress size={20} sx={{ leftMargin: '20px' }} /> : null
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