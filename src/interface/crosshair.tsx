/*
 *   crosshair.tsx
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/14/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import React from "react";
import { Component } from "react";
import Settings from "../settings";
import Star from "../objects/star";
import './stylesheets/crosshair.scss'

class Crosshair extends Component {
    render() {
        return (<div>
            {(Settings.lookAt instanceof Star) ? <div className="crosshair center">⌖</div> : null}
        </div>)
    }
}
export default Crosshair