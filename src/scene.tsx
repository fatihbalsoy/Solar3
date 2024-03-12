/*
 *   scene.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */

// Import necessary libraries and modules
import React, { Component } from 'react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { CSS2DRenderer } from './modules/CSS2DRenderer'
import Stats from 'stats.js'
import { Orbits } from './utils/orbit_points'
import Planets from './objects/planets'
import { OrbitControls } from './modules/OrbitControls'
import { Settings } from './settings'

// Import planet objects and other celestial bodies
import Planet from './objects/planet'
import Stars from './objects/stars'
/** Stars **/
import Sun from './objects/sun'
/** Planets **/
import Mercury from './objects/planets/mercury'
import Venus from './objects/planets/venus'
import Earth from './objects/planets/earth'
import Mars from './objects/planets/mars'
import Jupiter from './objects/planets/jupiter'
import Saturn from './objects/planets/saturn'
import Uranus from './objects/planets/uranus'
import Neptune from './objects/planets/neptune'
/** Dwarf Planets **/
import Pluto from './objects/dwarf_planets/pluto'
import Ceres from './objects/dwarf_planets/ceres'
/** Moons **/
import Moon from './objects/moons/earth_moon'
import JupiterMoon from './objects/moons/jupiter_moon';
import Io from './objects/moons/jupiter_io';
import Callisto from './objects/moons/jupiter_callisto';
import Europa from './objects/moons/jupiter_europa';
import Ganymede from './objects/moons/jupiter_ganymede';
import SceneCamera from './scene/camera'
import SearchBar from './interface/search'
import SceneLoadingManager from './scene/loading_manager'

// TODO: Preload textures to prevent lag during runtime
class AppScene extends Component {
    private mount: HTMLDivElement
    private clock: THREE.Clock
    static scene: THREE.Scene
    static camera: SceneCamera
    static controls: OrbitControls
    private renderer: THREE.WebGLRenderer
    private cssRenderer: CSS2DRenderer
    private frameId: number
    static loadingManager: SceneLoadingManager
    private textureLoader: THREE.TextureLoader
    private statistics: Stats

    private orbits: Orbits
    private stars: Stars
    static constellations: THREE.Line[]

    private timer: NodeJS.Timeout;

    componentDidMount() {
        // Get the dimensions of the rendering container
        const width = this.mount?.clientWidth || 0
        const height = this.mount?.clientHeight || 0

        // Initialize various scene components
        this.clock = new THREE.Clock()
        AppScene.scene = new THREE.Scene()
        AppScene.camera = new SceneCamera(75, width / height, 0.0001, (60000000000 * Settings.distanceScale) * 5)
        AppScene.controls = new OrbitControls(AppScene.camera, this.mount)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, depth: true })
        this.cssRenderer = new CSS2DRenderer()
        AppScene.loadingManager = new SceneLoadingManager()
        this.textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        this.statistics = new Stats()

        this.orbits = new Orbits()
        this.stars = new Stars()

        AppScene.scene.add(AppScene.camera)

        // * -- RENDERERS --  * //
        this.renderer.setClearColor('#000000')
        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFShadowMap
        this.cssRenderer.setSize(width, height)
        this.cssRenderer.domElement.style.position = 'absolute'
        this.cssRenderer.domElement.style.top = '0px'
        this.cssRenderer.domElement.style.pointerEvents = 'none'
        this.cssRenderer.domElement.style.zIndex = '1'
        const root = document.getElementById("root")
        root.insertBefore(this.cssRenderer.domElement, root.children[1])

        // * -- STATISTICS --  * //
        // Add FPS, Memory display to the bottom right corner.
        this.statistics.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        this.statistics.dom.style.inset = 'unset'
        this.statistics.dom.style.bottom = '0px'
        this.statistics.dom.style.right = '0px'
        this.statistics.dom.style.position = 'fixed'
        if (Settings.isDev) {
            document.body.appendChild(this.statistics.dom)
        }

        // * -- PLANETS --  * //
        new Planets({
            sun: new Sun(),
            // Inner Planets
            mercury: new Mercury(), venus: new Venus(), earth: new Earth(), mars: new Mars(),
            // Outer Planets
            jupiter: new Jupiter(), saturn: new Saturn(), uranus: new Uranus(), neptune: new Neptune(),
            // Dwarf Planets
            pluto: new Pluto(), // ceres: objArr[11],
            // Moons
            moon: new Moon(),
            io: new Io(), callisto: new Callisto(), europa: new Europa(), ganymede: new Ganymede()
        })
        // Adjust the range at which the shadow cast by the sun's light is visible.
        Planets.sun.light.shadow.camera.far = Planets.pluto.distance;
        // Add orbits for each planet and moon
        const plArray = Planets.array() as Planet[]
        this.orbits.addOrbits(plArray.slice(1, plArray.length), AppScene.scene) // Mercury to Pluto
        // Add labels, planets, and moons to the scene
        for (const key in Planets) {
            const object = Planets[key] as Planet;

            object.displayLabel(AppScene.scene)

            if (key !== "sun") {
                Planets.sun.mesh.add(object.mesh)
            } else {
                AppScene.scene.add(object.mesh)
            }
        }

        // * -- STARS --  * //
        this.stars.parseData().then(() => {
            AppScene.constellations = Stars.createConstellations()
            Stars.hideConstellations(AppScene.constellations)
        })

        // * -- CONTROLS -- * //
        // Set the camera's target
        Settings.lookAt = Planets.earth
        AppScene.controls.target = Settings.lookAt.getPosition()
        // Set to true to enable damping (inertia), 
        // which can be used to give a sense of weight to the controls.
        AppScene.controls.enableDamping = true
        // Prevents mobile users from moving planets around when panning
        AppScene.controls.enablePan = false
        // -
        // AppScene.controls.maxDistance = (Planets.pluto.distance * Settings.distanceScale) * 3

        // * -- GALAXY -- * //
        let galaxyRes = Settings.res2_8k[Settings.quality]
        // Load background texture with given resolution settings
        const galaxyTexture = this.textureLoader.load('assets/images/textures/galaxy/' + galaxyRes + '_stars_milky_way.jpeg', () => {
            const rt = new THREE.WebGLCubeRenderTarget(galaxyTexture.image.height);
            rt.fromEquirectangularTexture(this.renderer, galaxyTexture);
            AppScene.scene.background = rt.texture;
        })

        // * ---- * //

        window.addEventListener('resize', this.handleResize)
        window.addEventListener('keydown', this.handleKey, false)

        if (this.mount) {
            this.mount.appendChild(this.renderer.domElement)
        }

        // Calculate planets' positions and setup a timer 
        // to automatically update positions every second.
        this.calculatePositions(true)
        this.timer = setInterval(() => {
            this.calculatePositions(true)
        }, 1000);

        this.start()
        AppScene.camera.flyTo(Planets.earth, 0)
    }

    /**
     * Handle keys presses
     * @param event key press event
     * @returns void
     */
    handleKey(event) {
        // Ignore key press if the target is an input
        if ((event.target as Element).tagName.toLowerCase() === 'input') {
            return;
        }

        // k: Switch between surface and space camera
        // if (event.keyCode == 75) {
        //     if (AppScene.camera instanceof SceneSpaceCamera) {
        //         AppScene.camera.switchCamera(AppScene.surfaceCamera)
        //     } else {
        //         AppScene.camera.switchCamera(AppScene.spaceCamera)
        //     }
        // }

        // TODO: Switches at src/interface/drawer.tsx does not update when triggered with the 'c' key
        // c: Toggle constellations
        if (event.keyCode == 67) {
            Stars.toggleConstellations(AppScene.constellations)
        }

        // l: Toggle landscape
        // if (event.keyCode == 76) {
        //     AppScene.landscapeVisible = !AppScene.landscapeVisible
        // }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        this.stop()
        clearInterval(this.timer)

        if (this.mount && this.renderer) {
            this.mount.removeChild(this.renderer.domElement)
        }
    }

    // Handle resize event and update rendering dimensions
    handleResize = () => {
        const width = this.mount?.clientWidth || 0
        const height = this.mount?.clientHeight || 0

        if (this.renderer) {
            this.renderer.setSize(width, height)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }

        if (this.cssRenderer) {
            this.cssRenderer.setSize(width, height)
        }

        if (AppScene.camera) {
            AppScene.camera.aspect = width / height
            AppScene.camera.updateProjectionMatrix()
        }
    }

    // Start the animation loop
    start = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.animate)
        }
    }

    // Stop the animation loop
    stop = () => {
        if (this.frameId) {
            window.cancelAnimationFrame(this.frameId)
        }
    }

    /**
     * Calculate positions and perform animations
     * @param all Whether to calculate the position of all objects. Default is false.
     */
    calculatePositions(all: boolean = false) {
        if (all) {
            // Calculate and update all planets and labels
            for (const key in Planets) {
                const object: Planet = Planets[key];
                object.animate(true)
                object.updateLabel(AppScene.camera)
            }
        } else if (Settings.lookAt instanceof Planet) {
            // Calculate and update the camera's target
            if (Settings.lookAt instanceof JupiterMoon) {
                // If the camera's target is a Jovimoon, then animate Jupiter as well.
                // This prevents the jagged movements of Jovimoons. 
                Planets.jupiter.animate()
            }
            Settings.lookAt.animate()
            Settings.lookAt.updateLabel(AppScene.camera)
        }
        // Simulate tidal locking by making the Moon always face Earth.
        Planets.moon.mesh.lookAt(Planets.earth.mesh.position)
        // Only lock onto camera's target when not animating.
        // Examples of animation are when moving between  planet to another or changing targets.
        if (!AppScene.camera.isAnimating) {
            AppScene.controls.target = Settings.lookAt.getPosition()
        }
    }

    // Animation loop
    animate = () => {
        this.statistics.begin()

        this.calculatePositions()
        AppScene.controls.update()
        AppScene.camera.update()

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
        TWEEN.update()

        this.statistics.end()
    }

    renderScene = () => {
        if (this.renderer && this.cssRenderer && AppScene.scene && AppScene.camera) {
            this.renderer.render(AppScene.scene, AppScene.camera)
            this.cssRenderer.render(AppScene.scene, AppScene.camera)
        }
    }

    onClickScene() {
        SearchBar.hideSearchResults()
    }

    render() {
        return (
            <div
                className="webgl"
                onMouseDown={this.onClickScene}
                ref={mount => {
                    this.mount = mount
                }}
            />
        )
    }
}

export default AppScene
