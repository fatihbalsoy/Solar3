/*
 *   drawer.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/14/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Component, ReactNode } from 'react';
import './drawer.scss'
import { Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import React from 'react';
import Icon from '@mdi/react';
import { mdiBookOpenVariant, mdiBug, mdiChartTimelineVariantShimmer, mdiGiftOutline, mdiGithub, mdiMapMarkerOutline, mdiShieldAccountOutline, mdiTune, mdiWeb } from '@mdi/js';
import LicenseDialog from './dialog_license';
import LocationDialog from './dialog_location';
import AppLocation from '../models/location';
import Settings from '../settings';
import Stars from '../objects/stars';
import AppScene from '../scene';

interface DrawerContentState {
    location: AppLocation
    locationDialogOpen: boolean
    licenseDialogOpen: boolean,
    constellationsVisible: boolean
}

class DrawerContent extends Component<{}, DrawerContentState> {
    state: DrawerContentState = {
        location: Settings.geolocation,
        locationDialogOpen: false,
        licenseDialogOpen: false,
        constellationsVisible: Stars.constellationsVisible ?? false
    }

    constructor(props: {}) {
        super(props)

        this.onLocationDialogOpen = this.onLocationDialogOpen.bind(this)
        this.onLocationDialogClose = this.onLocationDialogClose.bind(this)
        this.onLocationSave = this.onLocationSave.bind(this)

        this.onLicenseDialogOpen = this.onLicenseDialogOpen.bind(this)
        this.onLicenseDialogClose = this.onLicenseDialogClose.bind(this)

        this.onToggleConstellations = this.onToggleConstellations.bind(this)
    }

    divider() {
        return (<Divider sx={{ marginTop: '15px', marginBottom: '15px' }}></Divider>)
    }

    listItem(name: string, icon: string, action?: () => void, subtitle?: string, trailing?: JSX.Element) {
        return (
            <ListItem disablePadding key={name.toLowerCase()}>
                <ListItemButton disabled={action == null} onClick={action}>
                    <ListItemIcon>
                        <Icon size={1} path={icon}></Icon>
                    </ListItemIcon>
                    <ListItemText primary={name} secondary={subtitle} />
                    {trailing}
                </ListItemButton>
            </ListItem>
        )
    }

    onLocationDialogOpen() {
        this.setState({
            locationDialogOpen: true
        })
    }

    onLocationDialogClose() {
        this.setState({
            locationDialogOpen: false
        })
    }

    onLocationSave(position: AppLocation) {
        this.setState({
            location: position
        })
    }

    locationSubtitle(): string {
        if (!this.state.location) { return "Setup" }

        const lat = parseFloat(this.state.location.latitude.toFixed(2))
        const lon = parseFloat(this.state.location.longitude.toFixed(2))
        const alt = parseFloat(this.state.location.altitude.toFixed(2))
        const latSymbol = lat >= 0 ? "N" : "S"
        const lonSymbol = lon >= 0 ? "E" : "W"

        return `${lat}° ${latSymbol}, ${lon}° ${lonSymbol}, ${alt} meters`
    }

    constellationsSwitch() {
        return <Switch
            key={this.state.constellationsVisible ? "constellationsVisible" : "constellationsNotVisible"}
            checked={this.state.constellationsVisible}
            style={{ pointerEvents: 'none' }}
        />
    }

    onLicenseDialogOpen() {
        this.setState({
            licenseDialogOpen: true
        })
    }

    onLicenseDialogClose() {
        this.setState({
            licenseDialogOpen: false
        })
    }

    // TODO: Switch does not update when triggered with the 'c' key at src/scene.tsx
    onToggleConstellations() {
        Stars.toggleConstellations(AppScene.constellations)
        this.setState({
            constellationsVisible: Stars.constellationsVisible
        })
    }

    render(): ReactNode {
        const website = "fatih.bal.soy"
        const paypalLink = "paypal.me/fatihbalsoy"
        const githubLink = "fatihbalsoy/Solar3"

        return (
            <div className="drawer">
                {/* Location Dialog */}
                <LocationDialog
                    key={this.state.locationDialogOpen ? "locationDialog1" : "locationDialog0"}
                    open={this.state.locationDialogOpen}
                    onClose={this.onLocationDialogClose}
                    onSave={this.onLocationSave}
                />
                {/* License Dialog */}
                <LicenseDialog
                    key={this.state.licenseDialogOpen ? "licenseDialog1" : "licenseDialog0"}
                    open={this.state.licenseDialogOpen}
                    onClose={this.onLicenseDialogClose}
                />
                <h2>Solar3</h2>
                {this.divider()}
                {this.listItem("Location", mdiMapMarkerOutline, this.onLocationDialogOpen, this.locationSubtitle())}
                {this.listItem("Constellations", mdiChartTimelineVariantShimmer, this.onToggleConstellations, null, this.constellationsSwitch())}
                {this.listItem("Settings", mdiTune)}
                {this.divider()}
                <h3>About</h3>
                {this.listItem("Website", mdiWeb, () => { window.open("https://" + website, "_blank") }, website)}
                {this.listItem("Donate", mdiGiftOutline, () => { window.open("https://" + paypalLink, "_blank") }, paypalLink)}
                {this.listItem("Github", mdiGithub, () => { window.open("https://github.com/" + githubLink, "_blank") }, githubLink)}
                {this.listItem("Report Issues", mdiBug, () => { window.open("https://github.com/" + githubLink + "/issues", "_blank") })}
                {this.listItem("Licenses", mdiBookOpenVariant, this.onLicenseDialogOpen)}
                {this.listItem("Privacy Policy", mdiShieldAccountOutline, () => { window.open("https://" + website + "/privacy-policy?solar3", "_blank") })}
            </div>
        )
    }
}
export default DrawerContent