/*
 *   XRControllerModelFactory.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Group, Object3D, Texture } from '../../../src/Three';

import { GLTFLoader } from '../loaders/GLTFLoader';

export class XRControllerModel extends Object3D {
    constructor();

    motionController: any;

    envMap: Texture;

    setEnvironmentMap(envMap: Texture): XRControllerModel;
}

export class XRControllerModelFactory {
    constructor(gltfLoader?: GLTFLoader);
    gltfLoader: GLTFLoader | null;
    path: string;

    createControllerModel(controller: Group): XRControllerModel;
}
