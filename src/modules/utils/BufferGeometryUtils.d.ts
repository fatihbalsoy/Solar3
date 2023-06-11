/*
 *   BufferGeometryUtils.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

// https://threejs.org/docs/?q=buffergeome#examples/en/utils/BufferGeometryUtils

import {
    BufferAttribute,
    BufferGeometry,
    InterleavedBufferAttribute,
    TrianglesDrawModes,
    Mesh,
    Line,
    Points,
} from '../../../src/Three';

export function deepCloneAttribute(attribute: BufferAttribute): BufferAttribute;
export function mergeBufferGeometries(geometries: BufferGeometry[], useGroups?: boolean): BufferGeometry;
export function mergeBufferAttributes(attributes: BufferAttribute[]): BufferAttribute;
export function interleaveAttributes(attributes: BufferAttribute[]): InterleavedBufferAttribute;
export function estimateBytesUsed(geometry: BufferGeometry): number;
export function mergeVertices(geometry: BufferGeometry, tolerance?: number): BufferGeometry;
export function toTrianglesDrawMode(geometry: BufferGeometry, drawMode: TrianglesDrawModes): BufferGeometry;
export function computeMorphedAttributes(object: Mesh | Line | Points): object;
export function computeMikkTSpaceTangents(
    geometry: BufferGeometry,
    MikkTSpace: unknown,
    negateSign?: boolean,
): BufferGeometry;
export function mergeGroups(geometry: BufferGeometry): BufferGeometry;
export function deinterleaveAttribute(geometry: BufferGeometry): void;
export function deinterleaveGeometry(geometry: BufferGeometry): void;

/**
 * Creates a new, non-indexed geometry with smooth normals everywhere except faces that meet at an angle greater than the crease angle.
 *
 * @param geometry The input geometry.
 * @param creaseAngle The crease angle.
 */
export function toCreasedNormals(geometry: BufferGeometry, creaseAngle?: number): BufferGeometry;
