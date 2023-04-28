/*
 *   utils.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/27/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Matrix4 } from "three";
import { RotationMatrix } from "./services/astronomy";

export function convertRotationMatrix4(m: RotationMatrix): Matrix4 {
    const rotMatrix = new Matrix4()
    return rotMatrix.fromArray(m.rot[0].concat([0]).concat(m.rot[1]).concat([0]).concat(m.rot[2]).concat([0]).concat([0, 0, 0, 0]))
}