/*
 *   license_dialog.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/16/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { Component } from "react";

interface LicenseDialogProps {
    open: boolean
    onClose: () => void
}
interface LicenseDialogState {
    open: boolean
}

class LicenseDialog extends Component<LicenseDialogProps, LicenseDialogState> {
    state: LicenseDialogState = {
        open: false,
    }

    constructor(props: LicenseDialogProps) {
        super(props)

        this.onClose = this.onClose.bind(this)
    }

    componentDidMount(): void {
        if (this.props.open) {
            this.setState({
                open: true
            })
        }
    }

    listItem(text: string, subtitle?: string, url?: string) {
        return (
            <ListItemButton disabled={url == null} disableGutters component="a" href={url} target="_blank" rel="noopener noreferrer">
                <ListItemText primary={text} secondary={subtitle} />
            </ListItemButton>
        )
    }

    onClose() {
        this.setState({
            open: false
        })
        this.props.onClose()
    }

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.props.onClose}
                scroll='paper'
            >
                <DialogTitle>Licenses</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText>
                        {this.listItem("Solar3 by Fatih Balsoy", "AGPL v3.0", "https://github.com/fatihbalsoy/Solar3")}
                        {this.listItem("Astronomy Engine by Don Cross", "MIT", "https://github.com/cosinekitty/astronomy")}
                        {this.listItem("three.js by mrdoob", "MIT", "https://github.com/mrdoob/three.js/")}
                        {this.listItem("tween.js", "MIT", "https://github.com/tweenjs/tween.js")}
                        {this.listItem("Material UI by MUI", "MIT", "https://github.com/mui/material-ui")}
                        {this.listItem("React by Facebook", "MIT", "https://github.com/facebook/react")}
                        {this.listItem("stats.js by mrdoob", "MIT", "https://github.com/mrdoob/stats.js/")}
                        {this.listItem("Material Design Icons", "Apache 2.0, MIT", "https://github.com/Templarian/MaterialDesign-JS")}
                        {this.listItem("Galilean Moon Textures by Stellarium", "GPL v2.0", "https://github.com/Stellarium/stellarium")}
                        {this.listItem("HYG Stellar Database by David Nash", "CC BY-SA 2.5", "https://github.com/astronexus/HYG-Database")}
                        {this.listItem("Textures by Solar System Scope", "CC BY 4.0", "https://www.solarsystemscope.com/textures/")}
                        {this.listItem("Monthly Earth Images by NASA", "Public Domain", "https://visibleearth.nasa.gov/collection/1484/blue-marble")}
                        {this.listItem("High-res image of Io by USGS", "Public Domain", "https://pubs.usgs.gov/sim/3168/")}
                        {this.listItem("Basic Earth Textures by Tom Patterson", "Public Domain", "https://www.shadedrelief.com/natural3")}
                        {this.listItem("Computing Planetary Positions by Paul Schlyter", null, "https://www.stjarnhimlen.se/comp/tutorial.html")}
                        {this.listItem("Textures by James Hastings-Trew", null, "https://planetpixelemporium.com/planets.html")}
                        {this.listItem("Solar System Data by Christophe", null, "https://api.le-systeme-solaire.net/en/")}
                        {this.listItem("Ephemeris Data by NASA's Horizons System", null, "https://ssd.jpl.nasa.gov/horizons/app.html#/")}
                        {/* * Licenses for images used in the wiki/info card can be found [here](https://github.com/fatihbalsoy/Solar3/tree/master/src/data/generate_data.py). */}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.onClose}>Close</Button>
                </DialogActions>
            </Dialog>
        )
    }
}
export default LicenseDialog