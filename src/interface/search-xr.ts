/*
 *   search-xr.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Object3D } from "three";
import * as ThreeMeshUI from 'three-mesh-ui';

class XRSearchBar extends Object3D {

    constructor() {
        super()

        const panel = new ThreeMeshUI.Block({
            width: 4,
            height: 1 / 2,
            justifyContent: 'center',
            contentDirection: 'row-reverse',
            // fontFamily: FontJSON,
            // fontTexture: FontImage,
            fontSize: 0.5,
            padding: 0.02,
            borderRadius: 0.25
        });
        // TODO: Create a VRUI class and set positions
        panel.position.set(0, -0.6 * 2, -1.2 * 2)

        const text = new ThreeMeshUI.Text({
            content: 'Search'
        })
        panel.add(text)

        this.add(panel)
    }

}
export default XRSearchBar;