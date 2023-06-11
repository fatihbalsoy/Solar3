/*
 *   XRHandMeshModel.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Object3D } from '../../../src/Three';

export class XRHandMeshModel {
    controller: Object3D;
    handModel: Object3D;
    bones: Object3D[];

    constructor(handModel: Object3D, controller: Object3D, path: string, handedness: string);

    updateMesh(): void;
}
