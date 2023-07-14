/*
 *   utils.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 4/27/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { Matrix3, Matrix4 } from "three";
import { RotationMatrix } from 'astronomy-engine';

export function convertRotationMatrix3(m: RotationMatrix): Matrix3 {
    const mat3 = new Matrix3()
    mat3.set(
        m.rot[0][0], m.rot[0][1], m.rot[0][2],
        m.rot[1][0], m.rot[1][1], m.rot[1][2],
        m.rot[2][0], m.rot[2][1], m.rot[2][2],
    )
    return mat3
}
export function convertRotationMatrix4(m: RotationMatrix): Matrix4 {
    return new Matrix4().setFromMatrix3(convertRotationMatrix3(m))
}

export function convertHourToHMS(h: number, fixed: number = -1): string {
    let hour = Math.floor(h)
    let m = (h - hour) * 60
    let minute = Math.floor(m)
    let s = (m - minute) * 60
    let seconds = fixed > -1 ? s.toFixed(fixed) : s
    return `${hour}h ${minute}m ${seconds}s`
}

export enum ComponentEnum {
    x = 0,
    y = 1,
    z = 2
}
/**
 * Measures the angle between a given component and its zero variant
 * @param component x, y, or z
 * @param matrix matrix to measure angle between zero variant
 * @returns angle in radians of type `number`
 */
export function angleBetweenZeroVectorForComponent(component: ComponentEnum, matrix: Matrix3): number {
    const elements = matrix.elements

    // Extract the y-axis components from the matrices
    var axis1 = [elements[component], elements[component + 3], elements[component + 6]];
    var axis2 = [component == 0 ? 1 : 0, component == 1 ? 1 : 0, component == 2 ? 1 : 0];

    // Calculate the dot product between the two y-axes
    var dotProduct = axis1[0] * axis2[0] + axis1[1] * axis2[1] + axis1[2] * axis2[2];

    // Calculate the magnitudes of the y-axes
    var magnitude1 = Math.sqrt(axis1[0] * axis1[0] + axis1[1] * axis1[1] + axis1[2] * axis1[2]);
    var magnitude2 = Math.sqrt(axis2[0] * axis2[0] + axis2[1] * axis2[1] + axis2[2] * axis2[2]);

    // Calculate the angle between the two y-axes using the dot product and magnitudes
    var angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
    return angle
}