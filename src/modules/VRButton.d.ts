/*
 *   VRButton.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { WebGLRenderer } from '../../../src/Three';

export namespace VRButton {
    function createButton(renderer: WebGLRenderer): HTMLElement;
}
