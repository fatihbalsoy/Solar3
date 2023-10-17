/*
 *   scene.ts
 *   solar-system-3js
 * 
 *   Created by Fatih Balsoy on 5/2/23
 *   Copyright © 2023 Fatih Balsoy. All rights reserved.
 */
import React, { Component } from 'react'
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import { CSS2DRenderer } from './modules/CSS2DRenderer'
import Stats from 'stats.js'
import { Orbits } from './utils/orbit_points'
import Planets from './objects/planets'
import { OrbitControls } from './modules/OrbitControls'
import { Settings } from './settings'

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
import SceneSpaceCamera from './scene/space_camera'
import SearchBar from './interface/search'
import SceneLoadingManager from './scene/loading_manager'
import dat, { GUI } from 'dat.gui'
import SceneSurfaceCamera from './scene/surface_camera'
import SceneCamera from './scene/camera'

type SurfaceCameraProperties = {
    zoom: number
    fov: number
    altitude: number,
    azimuth: number
}

export type GeolocationConfig = {
    latOffset: number
    lonOffset: number
    altOffset: number
}

class AppScene extends Component {
    private mount: HTMLDivElement
    private clock: THREE.Clock
    static scene: THREE.Scene
    static camera: SceneCamera
    static spaceCamera: SceneSpaceCamera
    static surfaceCamera: SceneSurfaceCamera
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

    static surfaceCameraProps: SurfaceCameraProperties = {
        zoom: 1,
        fov: 100,
        altitude: 0,
        azimuth: 0
    }

    static cameraConfig = {
        camera: 'p' // c(space), p(rogramme), s(urface)
    }

    static geolocationConfig: GeolocationConfig = {
        latOffset: 0,
        lonOffset: 0,
        altOffset: 0,
    }

    componentDidMount() {
        const width = this.mount?.clientWidth || 0
        const height = this.mount?.clientHeight || 0

        this.clock = new THREE.Clock()
        AppScene.scene = new THREE.Scene()
        AppScene.spaceCamera = new SceneSpaceCamera(75, width / height, 0.0001, (60000000000 * Settings.distanceScale) * 5)
        AppScene.surfaceCamera = new SceneSurfaceCamera(100, width / height, 0.0000001, (60000000000 * Settings.distanceScale) * 5)
        AppScene.camera = AppScene.surfaceCamera
        AppScene.controls = new OrbitControls(AppScene.spaceCamera, this.mount)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, depth: true })
        this.cssRenderer = new CSS2DRenderer()
        AppScene.loadingManager = new SceneLoadingManager()
        this.textureLoader = new THREE.TextureLoader(AppScene.loadingManager)
        this.statistics = new Stats()

        this.orbits = new Orbits()
        this.stars = new Stars()

        AppScene.scene.add(AppScene.spaceCamera)
        const gui = new dat.GUI()

        // * -- DEV GUI -- * //
        if (Settings.isDev) {
            gui.add(AppScene.cameraConfig, 'camera', { Program: 'p', Space: 'c', Surface: 's' })
            gui.add(AppScene.geolocationConfig, 'latOffset', -180, 180)
            gui.add(AppScene.geolocationConfig, 'lonOffset', -180, 180)
            gui.add(AppScene.geolocationConfig, 'altOffset', 0, 1000, 1)
        }

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
            mercury: new Mercury(), venus: new Venus(), earth: new Earth(), mars: new Mars(),
            jupiter: new Jupiter(), saturn: new Saturn(), uranus: new Uranus(), neptune: new Neptune(),
            pluto: new Pluto(), // ceres: objArr[11],
            moon: new Moon(),
            io: new Io(), callisto: new Callisto(), europa: new Europa(), ganymede: new Ganymede()
        })
        Planets.sun.light.shadow.camera.far = Planets.pluto.distance;
        const plArray = Planets.array() as Planet[]
        this.orbits.addOrbits(plArray.slice(1, plArray.length), AppScene.scene) // Mercury to Pluto
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
        Settings.lookAt = Planets.earth
        AppScene.controls.enableDamping = true
        AppScene.controls.enablePan = false
        // AppScene.controls.maxDistance = (Planets.pluto.distance * Settings.distanceScale) * 3
        AppScene.controls.target = Settings.lookAt.getPosition()
        // AppScene.controls.zoomSpeed

        // * -- SURFACE CAMERA -- * //
        if (Settings.isDev) {
            gui.add(AppScene.surfaceCameraProps, 'zoom', 1, 1000)
            gui.add(AppScene.surfaceCameraProps, 'fov', 1, 179)
            gui.add(AppScene.surfaceCameraProps, 'altitude', -90, 90)
            gui.add(AppScene.surfaceCameraProps, 'azimuth', 0, 360)
        }
        Settings.cameraLocation = Planets.earth
        AppScene.surfaceCamera.init(Settings.cameraLocation)

        // * -- GALAXY -- * //
        let galaxyRes = Settings.res2_8k[Settings.quality]
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

        this.calculatePositions(true)
        this.timer = setInterval(() => {
            this.calculatePositions(true)
        }, 1000);

        this.start()
        AppScene.spaceCamera.animateFlyTo(Planets.earth, 0)
    }

    handleKey(event) {
        // console.log("HANDLEKEY")
        if (event.keyCode == 75) { // k
            // console.log("K")
            if (AppScene.camera instanceof SceneSpaceCamera) {
                AppScene.camera.switchCamera(AppScene.surfaceCamera)
            } else {
                AppScene.camera.switchCamera(AppScene.spaceCamera)
            }
        }
        // TODO: Switch at src/interface/drawer.tsx does not update when triggered with the 'c' key
        if (event.keyCode == 67) { // c
            Stars.toggleConstellations(AppScene.constellations)
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        this.stop()
        clearInterval(this.timer)

        if (this.mount && this.renderer) {
            this.mount.removeChild(this.renderer.domElement)
        }
    }

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

        if (AppScene.spaceCamera) {
            AppScene.spaceCamera.aspect = width / height
            AppScene.spaceCamera.updateProjectionMatrix()
        }

        if (AppScene.surfaceCamera) {
            AppScene.surfaceCamera.aspect = width / height
            AppScene.surfaceCamera.updateProjectionMatrix()
        }
    }

    start = () => {
        if (!this.frameId) {
            this.frameId = window.requestAnimationFrame(this.animate)
        }
    }

    stop = () => {
        if (this.frameId) {
            window.cancelAnimationFrame(this.frameId)
        }
    }

    calculatePositions(all: boolean = false) {
        if (AppScene.camera instanceof SceneSurfaceCamera) {
            AppScene.surfaceCamera.planet.animate(true)
        }

        if (all) {
            for (const key in Planets) {
                const object: Planet = Planets[key];
                object.animate(true)
                object.updateLabel(AppScene.camera)
            }
        } else if (Settings.lookAt instanceof Planet) {
            if (Settings.lookAt instanceof JupiterMoon) {
                Planets.jupiter.animate()
            }
            Settings.lookAt.animate()
            Settings.lookAt.updateLabel(AppScene.camera)
        }

        Planets.moon.mesh.lookAt(Planets.earth.mesh.position)

        if (!AppScene.spaceCamera.isAnimating) {
            AppScene.controls.target = Settings.lookAt.getPosition()
        }
    }

    animate = () => {
        this.statistics.begin()

        this.calculatePositions()
        AppScene.controls.update()
        AppScene.camera.update()
        // AppScene.spaceCamera.update()
        // AppScene.surfaceCamera.update()

        AppScene.surfaceCamera.zoom = AppScene.surfaceCameraProps.zoom
        AppScene.surfaceCamera.fov = AppScene.surfaceCameraProps.fov

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
        TWEEN.update()

        this.statistics.end()
    }

    getCamera() {
        return AppScene.cameraConfig.camera == 'c'
            ? AppScene.spaceCamera
            : AppScene.cameraConfig.camera == 's'
                ? AppScene.surfaceCamera
                : AppScene.camera
    }

    renderScene = () => {
        if (this.renderer && this.cssRenderer && AppScene.scene && AppScene.spaceCamera && AppScene.surfaceCamera) {
            this.renderer.render(AppScene.scene, this.getCamera())
            this.cssRenderer.render(AppScene.scene, this.getCamera())
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
