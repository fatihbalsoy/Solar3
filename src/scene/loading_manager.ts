/*
 *   loading_manager.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/10/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";

class SceneLoadingManager extends THREE.LoadingManager {
    constructor() {
        super()

        const loadingScreenImage = document.getElementById('loading-screen') as HTMLDivElement

        this.onStart = function (url, itemsLoaded, itemsTotal) {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        }

        this.onLoad = function () {
            // console.log('Loading complete!');
            if (loadingScreenImage) {
                loadingScreenImage.style.opacity = '0'
                loadingScreenImage.style.visibility = 'hidden'
            }
        }

        this.onProgress = function (url, itemsLoaded, itemsTotal) {
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        }

        this.onError = function (url) {
            // console.log('There was an error loading ' + url);
        }
    }
}
export default SceneLoadingManager