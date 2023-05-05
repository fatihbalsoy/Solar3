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
import SceneCamera from './scene/camera'
import SearchBar from './interface/search'

class AppScene extends Component {
    private mount: HTMLDivElement
    private clock: THREE.Clock
    private scene: THREE.Scene
    static camera: SceneCamera
    static controls: OrbitControls
    private renderer: THREE.WebGLRenderer
    private cssRenderer: CSS2DRenderer
    private frameId: number
    private loadingManager: THREE.LoadingManager
    private textureLoader: THREE.TextureLoader
    private statistics: Stats

    private orbits: Orbits
    private stars: Stars

    componentDidMount() {
        const width = this.mount?.clientWidth || 0
        const height = this.mount?.clientHeight || 0

        this.clock = new THREE.Clock()
        this.scene = new THREE.Scene()
        AppScene.camera = new SceneCamera(75, width / height, 0.0001, (60000000000 * Settings.distanceScale) * 5)
        AppScene.controls = new OrbitControls(AppScene.camera, this.mount)
        this.renderer = new THREE.WebGLRenderer({ antialias: true, depth: true })
        this.cssRenderer = new CSS2DRenderer()
        this.loadingManager = new THREE.LoadingManager()
        this.textureLoader = new THREE.TextureLoader(this.loadingManager)
        this.statistics = new Stats()

        this.orbits = new Orbits()
        this.stars = new Stars()

        this.scene.add(AppScene.camera)

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
        // document.body.appendChild(this.statistics.dom)

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
        this.orbits.addOrbits((Planets.array() as Planet[]).slice(1, 10), this.scene) // Mercury to Pluto
        for (const key in Planets) {
            const object = Planets[key] as Planet;

            this.scene.add(object.mesh)
            object.displayLabel(this.scene)

            if (key !== "sun") {
                Planets.sun.mesh.add(object.mesh)
            }
        }

        // * -- STARS --  * //
        this.stars.parseData()

        // * -- CONTROLS -- * //
        Settings.lookAt = Planets.earth
        AppScene.controls.enableDamping = true
        AppScene.controls.enablePan = false
        AppScene.controls.maxDistance = (Planets.pluto.distance * Settings.distanceScale) * 3
        this.lookAt(Settings.lookAt.getPosition())

        // * -- GALAXY -- * //
        const galaxyTexture = this.textureLoader.load('assets/images/textures/galaxy/8k_stars_milky_way.jpeg', () => {
            const rt = new THREE.WebGLCubeRenderTarget(galaxyTexture.image.height);
            rt.fromEquirectangularTexture(this.renderer, galaxyTexture);
            this.scene.background = rt.texture;
        })

        window.addEventListener('resize', this.handleResize)

        if (this.mount) {
            this.mount.appendChild(this.renderer.domElement)
        }

        this.start()
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        this.stop()

        if (this.mount && this.renderer) {
            this.mount.removeChild(this.renderer.domElement)
        }
    }

    lookAt(position: THREE.Vector3) {
        AppScene.controls.target = position
        // AppScene.camera.lookAt(position)
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

        if (AppScene.camera) {
            AppScene.camera.aspect = width / height
            AppScene.camera.updateProjectionMatrix()
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

    didFlyToStart = false
    animate = () => {
        this.statistics.begin()

        const elapsedTime = this.clock.startTime + this.clock.getElapsedTime()

        for (const key in Planets) {
            const object: Planet = Planets[key];

            object.animate(this.clock.getElapsedTime())
            object.updateLabel(AppScene.camera)
        }
        Planets.moon.mesh.lookAt(Planets.earth.mesh.position)

        this.lookAt(Settings.lookAt.getPosition())
        AppScene.controls.update()
        if (!this.didFlyToStart) {
            AppScene.camera.flyTo(Planets.earth, 0)
            this.didFlyToStart = true
        }

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
        TWEEN.update()

        this.statistics.end()
    }

    renderScene = () => {
        if (this.renderer && this.cssRenderer && this.scene && AppScene.camera) {
            this.renderer.render(this.scene, AppScene.camera)
            this.cssRenderer.render(this.scene, AppScene.camera)
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
