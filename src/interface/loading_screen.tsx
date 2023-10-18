/*
 *   loading_screen.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/10/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import React from "react";
import { Component } from "react";
import "./stylesheets/loading_screen.scss";
import { LinearProgress } from "@mui/material";

class LoadingScreen extends Component {
    isFirstTime: string = 'false'

    constructor() {
        super({})

        this.isFirstTime = localStorage.getItem('first-time') ?? 'true'
        localStorage.setItem('first-time', 'false')
    }

    render() {
        return (
            <div id="loading-screen">
                <img className="loading-screen-image" src="assets/images/galaxy_loading_screen.jpg"></img>
                <div className="loading-screen-content">
                    <h1 className="loading-screen-title">SolarSystem.3js</h1>
                    <LinearProgress />
                    {
                        this.isFirstTime == 'true'
                            ? <div>
                                <br />
                                <p>Loading textures tailored to your computer's specifications.</p>
                                <p>This will take approximately 30 seconds for the first time.</p>
                            </div>
                            : <div></div>
                    }
                </div>
            </div>
        )
    }
}
export default LoadingScreen