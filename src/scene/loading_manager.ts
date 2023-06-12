/*
 *   loading_manager.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 6/10/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

import * as THREE from "three";
import Settings from "../settings";

class SceneLoadingManager extends THREE.LoadingManager {
    constructor() {
        super()

        const loadingScreen = document.getElementById('loading-screen') as HTMLDivElement

        this.onStart = function (url, itemsLoaded, itemsTotal) {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
        }

        this.onLoad = function () {
            // console.log('Loading complete!');
            if (loadingScreen) {
                if (Settings.haltLoadingScreen()) {
                    console.log("The function Settings.haltLoadingScreen() is returning true, " +
                        "indicating that the program is currently halted at the loading " +
                        "screen for debugging and development purposes. ")
                } else {
                    loadingScreen.style.opacity = '0'
                    setTimeout(() => {
                        loadingScreen.style.visibility = 'hidden'
                        loadingScreen.style.display = 'none'
                    }, 1100);
                }
            } else {
                console.log("Error, could not find loading screen html element.")
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