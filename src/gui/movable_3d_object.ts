/*
 *   gui_movable.ts
 *   3d-portfolio
 * 
 *   Created by Fatih Balsoy on 4/22/22
 *   Last Modified by Fatih Balsoy on 4/22/22
 *   Copyright © 2022 Fatih Balsoy. All rights reserved.
 */

import * as dat from 'dat.gui'
import { Camera, Light, Object3D, PerspectiveCamera } from 'three'

class GUIMovableObject {
    constructor() { }

    _addGUI(gui: dat.GUI, name: String, object: Object3D): dat.GUI {
        const folder = gui.addFolder(name)
        const posFolder = folder.addFolder('Position')
        posFolder.add(object.position, 'x').step(0.01)
        posFolder.add(object.position, 'y').step(0.01)
        posFolder.add(object.position, 'z').step(0.01)
        const rotFolder = folder.addFolder('Rotation')
        rotFolder.add(object.rotation, 'x').step(0.01)
        rotFolder.add(object.rotation, 'y').step(0.01)
        rotFolder.add(object.rotation, 'z').step(0.01)
        if (object instanceof PerspectiveCamera) {
            const camera = object as PerspectiveCamera
            folder.add(camera, 'fov').step(0.01).min(1).max(180)
            folder.add(camera, 'zoom').step(0.01).min(1).max(10000)
            folder.add(camera, 'zoom').step(0.01).min(1).max(100)
        }
        if (object instanceof Light) {
            const light = object as Light
            folder.add(light, 'intensity', 0, 100, 0.01)
        }
        return folder
    }
}
export default GUIMovableObject;