/*
 *   drawer.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/14/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Component, ReactNode } from 'react';
import './drawer.scss'
import { Divider, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import React from 'react';
import Icon from '@mdi/react';
import { mdiBookOpen, mdiBookOpenVariant, mdiGiftOutline, mdiGithub, mdiLicense, mdiMapMarkerOutline, mdiShieldAccountOutline, mdiShieldLockOutline, mdiTune, mdiWeb } from '@mdi/js';

class DrawerContent extends Component<{ open?: boolean }> {

    constructor(props) {
        super(props)
    }

    divider() {
        return (<Divider sx={{ marginTop: '15px', marginBottom: '15px' }}></Divider>)
    }

    listItem(name: string, icon: string, action?: () => void, subtitle?: string) {
        return (
            <ListItem disablePadding key={name.toLowerCase()}>
                <ListItemButton disabled={action == null} onClick={action}>
                    <ListItemIcon>
                        <Icon size={1} path={icon}></Icon>
                    </ListItemIcon>
                    <ListItemText primary={name} secondary={subtitle} />
                </ListItemButton>
            </ListItem>
        )
    }

    render(): ReactNode {
        const website = "fatih.bal.soy"
        const paypalLink = "paypal.me/fatihbalsoy"
        const githubLink = "fatihbalsoy/solarsystem.3js"

        return (
            <div className="drawer">
                <h2>SolarSystem.3js</h2>
                {this.divider()}
                {this.listItem("Location", mdiMapMarkerOutline)}
                {this.listItem("Settings", mdiTune)}
                {this.divider()}
                <h3>About</h3>
                {this.listItem("Website", mdiWeb, () => { window.open("https://" + website, "_blank") }, website)}
                {this.listItem("Donate", mdiGiftOutline, () => { window.open("https://" + paypalLink, "_blank") }, paypalLink)}
                {this.listItem("Github", mdiGithub, () => { window.open("https://github.com/" + githubLink, "_blank") }, githubLink)}
                {this.listItem("Licenses", mdiBookOpenVariant)}
                {this.listItem("Privacy Policy", mdiShieldAccountOutline)}
            </div>
        )
    }
}
export default DrawerContent