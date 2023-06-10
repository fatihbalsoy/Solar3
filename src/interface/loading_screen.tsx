/*
 *   loading_screen.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/10/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import React from "react";
import { Component } from "react";
import "./loading_screen.scss";
import { LinearProgress } from "@mui/material";

class LoadingScreen extends Component {

    render() {
        return (
            <div id="loading-screen">
                <img className="loading-screen-image" src="assets/images/galaxy_loading_screen.jpg"></img>
                <div className="loading-screen-content">
                    <h1 className="loading-screen-title">SolarSystem.3js</h1>
                    <LinearProgress />
                </div>
            </div>
        )
    }
}
export default LoadingScreen