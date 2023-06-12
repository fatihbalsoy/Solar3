/*
 *   search-xr.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Color, Object3D } from "three";
import * as ThreeMeshUI from 'three-mesh-ui';

import FontJSON from '../../public/assets/fonts/Roboto-msdf.json';
import FontImage from '../../public/assets/fonts/Roboto-msdf.png';

class XRSearchBar extends Object3D {

    constructor() {
        super()

        var panel = new ThreeMeshUI.Block({
            width: 2,
            height: 0.25,
            justifyContent: 'center',
            contentDirection: 'row-reverse',
            fontFamily: JSON.stringify(FontJSON),
            fontTexture: FontImage,
            padding: 0.02,
            borderRadius: 0.25 / 2
            // backgroundColor: new Color(0x0000ff)
        });
        // TODO: Create a VRUI class and set positions there
        panel.position.set(0, -0.6 * 2, -1.2 * 2)
        panel.rotation.x = -0.55
        this.add(panel)

        const text = new ThreeMeshUI.Text({
            content: 'Search',
            fontSize: 0.055,
        })
        panel.add(text)
    }

}
export default XRSearchBar;