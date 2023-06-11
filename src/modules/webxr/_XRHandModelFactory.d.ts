/*
 *   XRHandModelFactory.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Group, Object3D } from '../../../src/Three';

import { XRHandPrimitiveModel, XRHandPrimitiveModelOptions } from './XRHandPrimitiveModel';
import { XRHandMeshModel } from './XRHandMeshModel';

export type XRHandModelHandedness = 'left' | 'right';

export class XRHandModel extends Object3D {
    constructor();

    motionController: XRHandPrimitiveModel | XRHandMeshModel;
}

export class XRHandModelFactory {
    constructor();
    path: string;

    setPath(path: string): XRHandModelFactory;

    createHandModel(
        controller: Group,
        profile?: 'spheres' | 'boxes' | 'mesh',
        options?: XRHandPrimitiveModelOptions,
    ): XRHandModel;
}
