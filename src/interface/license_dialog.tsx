/*
 *   license_dialog.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/16/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemButton, ListItemText } from "@mui/material";
import React from "react";
import { Component } from "react";

class LicenseDialog extends Component {

    listItem(text: string, subtitle?: string, url?: string) {
        return (
            <ListItemButton disabled={url == null} disableGutters component="a" href={url} target="_blank" rel="noopener noreferrer">
                <ListItemText primary={text} secondary={subtitle} />
            </ListItemButton>
        )
    }

    render() {
        return (
            <div>
                <DialogTitle>Licenses</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText>
                        {this.listItem("SolarSystem.3js", "AGPL v3.0", "https://github.com/fatihbalsoy/SolarSystem.3js")}
                        {this.listItem("Astronomy Engine by Don Cross", "MIT", "https://github.com/cosinekitty/astronomy")}
                        {this.listItem("three.js by mrdoob", "MIT", "https://github.com/mrdoob/three.js/")}
                        {this.listItem("tween.js", "MIT", "https://github.com/tweenjs/tween.js")}
                        {this.listItem("Material UI by MUI", "MIT", "https://github.com/mui/material-ui")}
                        {this.listItem("React by Facebook", "MIT", "https://github.com/facebook/react")}
                        {this.listItem("stats.js by mrdoob", "MIT", "https://github.com/mrdoob/stats.js/")}
                        {this.listItem("Galilean Moon Textures by Stellarium", "GPL v2.0", "https://github.com/Stellarium/stellarium")}
                        {this.listItem("HYG Stellar Database by David Nash", "CC BY-SA 2.5", "https://github.com/astronexus/HYG-Database")}
                        {this.listItem("Textures by Solar System Scope", "CC BY 4.0", "https://www.solarsystemscope.com/textures/")}
                        {this.listItem("Monthly Earth Images by NASA", "Public Domain", "https://visibleearth.nasa.gov/collection/1484/blue-marble")}
                        {this.listItem("High-res image of Io by USGS", "Public Domain", "https://pubs.usgs.gov/sim/3168/")}
                        {this.listItem("Computing Planetary Positions by Paul Schlyter", null, "https://www.stjarnhimlen.se/comp/tutorial.html")}
                        {this.listItem("Textures by James Hastings-Trew", null, "https://planetpixelemporium.com/planets.html")}
                        {this.listItem("Solar System Data by Christophe", null, "https://api.le-systeme-solaire.net/en/")}
                        {this.listItem("Ephemeris Data by NASA's Horizons System", null, "https://ssd.jpl.nasa.gov/horizons/app.html#/")}
                        {/* * Licenses for images used in the wiki/info card can be found [here](https://github.com/fatihbalsoy/SolarSystem.3js/tree/master/src/data/generate_data.py). */}
                    </DialogContentText>
                </DialogContent>
            </div>
        )
    }
}
export default LicenseDialog