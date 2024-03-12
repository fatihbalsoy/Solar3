/*
 *   ios_warning.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 20 Jan 2024
 *   Copyright © 2024 Fatih Balsoy. All rights reserved.
 */

import React from "react";
import { Component } from "react";
import "./stylesheets/loading_screen.scss";

class LowEndDeviceWarningScreen extends Component {
    render() {
        return (
            <div id="loading-screen">
                <img className="loading-screen-image" src="assets/images/galaxy_loading_screen.jpg"></img>
                <div style={{ backdropFilter: "blur(5px)", height: "100%", width: "100%", position: "absolute", zIndex: "98", top: 0 }} />
                <div className="loading-screen-content">
                    <h1 className="loading-screen-title">Solar3</h1>
                    {
                        <div>
                            <br />
                            <p>Solar3 is not compatible with low-end or iOS devices, such as the iPhone 15 Pro Max or M-series iPads.</p>
                            <br />
                            <p>You may visit Solar3 on a device with more than 1GB of RAM, without browser restrictions.</p>
                            <br />
                            <p>{window.location.href}</p>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
export default LowEndDeviceWarningScreen