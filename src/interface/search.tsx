/*
 *   search.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { mdiDirections, mdiMagnify, mdiMenu } from "@mdi/js";
import Icon from "@mdi/react";
import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import React, { KeyboardEventHandler } from "react";
import { Component } from "react";
import Stars, { Star } from "../objects/stars";
import { Settings } from "../settings";
import Planet from "../objects/planet";
import * as THREE from "three";
import Objects from "../objects/objects";
import './search.css';

class SearchBar extends Component {
    state = { value: '' }

    constructor(props: {}) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClickSearchIcon = this.onClickSearchIcon.bind(this);
    }

    searchAndLookAt(s: string) {
        let value = s.toLowerCase()
        let star: Star = Stars.indexedDatabase[value]
        let solObject: Planet = Objects[value]
        if (solObject) {
            console.log("Solar System object found:", solObject)
            let pos = solObject.getPositionForDate(new Date())
            Settings.lookAt = new THREE.Vector3(pos.x, pos.y, pos.z)
        } else if (star) {
            console.log("Star found:", star);
            Settings.lookAt = star.position
        } else {
            console.log("No such object:", value)
        }
    }

    handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ value: e.target.value });
    }

    onKeyDown(e) {
        if (e.key == "Enter") {
            this.searchAndLookAt(this.state.value)
        }
    }

    onClickSearchIcon() {
        this.searchAndLookAt(this.state.value)
    }

    render() {
        return (<Paper
            component="form"
            onSubmit={(e) => e.preventDefault()}
            className="search-bar"
        >
            {/* <IconButton sx={{ p: '10px' }} aria-label="menu">
                <Icon
                    size={1} path={mdiMenu}></Icon>
            </IconButton> */}
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                onKeyDown={this.onKeyDown}
                onChange={this.handleChange}
                value={this.state.value}
                inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton onClick={this.onClickSearchIcon} type="button" sx={{ p: '10px' }} aria-label="search">
                <Icon
                    size={1} path={mdiMagnify}></Icon>
            </IconButton>
            {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
                <Icon
                    size={1} path={mdiDirections}></Icon>
            </IconButton> */}
        </Paper>)
    }
}
export default SearchBar