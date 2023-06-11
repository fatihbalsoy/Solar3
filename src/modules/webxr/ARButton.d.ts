/*
 *   ARButton.d.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/11/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import { WebGLRenderer } from '../../../src/Three';

export interface ARButtonSessionInit extends XRSessionInit {
    domOverlay: { root: HTMLElement };
}

export namespace ARButton {
    function createButton(renderer: WebGLRenderer, sessionInit?: Partial<ARButtonSessionInit>): HTMLElement;
}
