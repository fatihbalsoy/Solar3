import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import GUIMovableObject from './gui/movable_3d_object'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { distanceScale } from './settings'

import Sun from './objects/sun'
import Mercury from './objects/planets/mercury'
import Venus from './objects/planets/venus'
import Earth from './objects/planets/earth'
import Moon from './objects/moons/earth_moon'
import Mars from './objects/planets/mars'
import Jupiter from './objects/planets/jupiter'
import Saturn from './objects/planets/saturn'
import Uranus from './objects/planets/uranus'
import Neptune from './objects/planets/neptune'
import Pluto from './objects/dwarf_planets/pluto'
import { Stars } from './objects/stars'
import Ceres from './objects/dwarf_planets/ceres'

// Loading
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

// Debug
const gui = new dat.GUI()

/**
 ** --  Sizes -- *
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    cssRenderer.setSize(sizes.width, sizes.height)

})

/**
 ** -- Canvas & Renderer -- *
 */
const canvas: HTMLElement = document.querySelector('canvas.webgl')!
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    // powerPreference: "high-performance",
    // stencil: false,
    // depth: false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

const cssRenderer = new CSS2DRenderer()
cssRenderer.setSize(sizes.width, sizes.height)
cssRenderer.domElement.style.position = 'absolute'
cssRenderer.domElement.style.top = '0px'
cssRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(cssRenderer.domElement)

// Scene
const scene = new THREE.Scene()

// Objects

//? -- SUN -- ?//
const objects = {
    sun: new Sun(),
    mercury: new Mercury(),
    venus: new Venus(),
    earth: new Earth(),
    moon: new Moon(),
    mars: new Mars(),
    jupiter: new Jupiter(),
    saturn: new Saturn(),
    uranus: new Uranus(),
    neptune: new Neptune(),
    pluto: new Pluto(),
    ceres: new Ceres(),
}
objects.sun.light.shadow.camera.far = objects.pluto.distance;
for (const key in objects) {
    if (Object.prototype.hasOwnProperty.call(objects, key)) {
        const object = objects[key];

        scene.add(object.mesh)
        object.displayLabel(scene)

        if (key !== "sun") {
            object.displayOrbit(objects.sun.mesh, scene)
            objects.sun.mesh.add(object.mesh)
        }
    }
}

// * -- STARS -- * //
let stars = new Stars()

// * -- LIGHTS -- * //

// const pointLightHelper = new PointLightHelper(sunLight, 1, 0xffff00)
// scene.add(pointLightHelper)

/**
 ** --  Camera -- *
 */
// Base camera
const near = 0.0001
const far = 10000 * (objects.pluto.distance / distanceScale)
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, near, far)
const initCameraPos = objects.earth.mesh.position
const initCameraPosRadius = objects.earth.getRadius()
camera.position.set(initCameraPos.x + initCameraPosRadius, initCameraPos.y, initCameraPos.z + initCameraPosRadius)
const initCameraRot = new THREE.Vector3(0, 0, 0)
camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
scene.add(camera)

stars.displayReal(scene, camera)

const cameraGUI = new GUIMovableObject();
cameraGUI._addGUI(gui, 'Camera', camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
/**
 ** -- Post Processing -- *
 */
// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new EffectPass(camera, new BloomEffect()));

// TODO: Texture does not look good for galaxy, (maybe try adding stars individually?)
const galaxyTexture = textureLoader.load('assets/images/textures/galaxy/4k_milky_way_nostars.png', () => {
    const rt = new THREE.WebGLCubeRenderTarget(galaxyTexture.image.height);
    rt.fromEquirectangularTexture(renderer, galaxyTexture);
    scene.background = rt.texture;
})
/**
 ** -- Animate -- *
 */

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

// const windowHalfX = window.innerWidth / 2;
// const windowHalfY = window.innerHeight / 2;

const onDocumentMouseMove = (event) => {
    // mouseX = (event.clientX - windowHalfX)
    // mouseY = (event.clientY - windowHalfY)
    mouseX = (event.clientX)
    mouseY = (event.clientY)
}
document.addEventListener('mousemove', onDocumentMouseMove)

const clock = new THREE.Clock()

//* Set camera position *//
scene.remove(camera)
var positionToLookAt: THREE.Vector3 = objects.earth.mesh.position
// const plaRadius = positionToLookAt.radius
const plaCamPosition = positionToLookAt
camera.position.set(plaCamPosition.x, plaCamPosition.y, plaCamPosition.z)
controls.target = positionToLookAt
controls.center = positionToLookAt

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    let planetKeys = {
        48: objects.sun.mesh.position, // 0
        49: objects.mercury.mesh.position, // 1
        50: objects.venus.mesh.position, // 2
        51: objects.earth.mesh.position, // 3
        52: objects.mars.mesh.position, // 4
        53: objects.jupiter.mesh.position, // 5
        54: objects.saturn.mesh.position, // 6
        55: objects.uranus.mesh.position, // 7
        56: objects.neptune.mesh.position, // 8
        57: objects.pluto.mesh.position, // 9
        65: stars.getStarByName("Antares").position, // a
        67: objects.ceres.mesh.position, // c
        77: objects.moon.mesh.position, // m
        79: stars.getStarByName("Polaris").position, // o
        80: stars.getStarByName("Proxima Centauri").position, // p
        82: stars.getStarByName("Rigil Kentaurus").position // r
    }
    positionToLookAt = planetKeys[keyCode] ?? positionToLookAt
    controls.target = positionToLookAt
    controls.center = positionToLookAt
};
document.addEventListener("keydown", onDocumentKeyDown, false);
// camera.position.z = 100
// camera.position.x = -100
// camera.fov = 20
// camera.zoom = 10
// camera.position.z = 1.37
// camera.position.x = -13.43
// camera.fov = 13.6
// camera.zoom = 1
// camera.fov = 1
// camera.zoom = 200

var didPrint = false
const tick = () => {

    camera.updateProjectionMatrix() // for GUI controls
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    // const elapsedTime = clock.getElapsedTime()
    const elapsedTime = clock.startTime + clock.getElapsedTime()

    // Update objects
    const LOCK_CAMERA_TO_MOUSE = false
    if (LOCK_CAMERA_TO_MOUSE) {
        camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
        camera.rotation.x += .05 * targetY
        camera.rotation.y += .05 * targetX
        camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.z)
        camera.position.x += -.01 * targetX
        camera.position.y += .01 * targetY
    }

    for (const key in objects) {
        if (Object.prototype.hasOwnProperty.call(objects, key)) {
            const object = objects[key];

            object.animate()
            object.updateLabel(camera)
        }
    }
    objects.moon.mesh.lookAt(objects.earth.mesh.position)

    camera.lookAt(positionToLookAt)

    if (!didPrint) {
        console.log("sun: ", objects.sun.getPositionAsString())
        console.log("mercury: ", objects.mercury.getPositionAsString())
        console.log("venus: ", objects.venus.getPositionAsString())
        console.log("earth: ", objects.earth.getPositionAsString())
        console.log("moon: ", objects.moon.getPositionAsString())
        console.log("mars: ", objects.mars.getPositionAsString())
        console.log("jupiter: ", objects.jupiter.getPositionAsString())
        console.log("saturn: ", objects.saturn.getPositionAsString())
        console.log("uranus: ", objects.uranus.getPositionAsString())
        console.log("neptune: ", objects.neptune.getPositionAsString())
        console.log("pluto: ", objects.pluto.getPositionAsString())
        console.log("ceres: ", objects.ceres.getPositionAsString())
        didPrint = true
    }

    // Update Orbital Controls
    controls.update()

    // Render
    cssRenderer.render(scene, camera)
    renderer.render(scene, camera)
    // composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()