import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, MeshBasicMaterial, PointLightHelper, Uniform, Vector3 } from 'three'
import GUIMovableObject from './gui/movable_3d_object'
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { distanceScale } from './settings'

import Sun from './objects/sun'
import Earth from './objects/earth'

// Loading
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

// Debug
const gui = new dat.GUI()

// Canvas
const canvas: HTMLElement = document.querySelector('canvas.webgl')!

// Scene
const scene = new THREE.Scene()

// Objects

//? -- SUN -- ?//
const sun = new Sun()
scene.add(sun.mesh)
sun.addGUI(gui)

//? -- EARTH -- ?//
const earth = new Earth();
earth.displayOrbit(sun.mesh, scene)
sun.mesh.add(earth.mesh)

// * -- LIGHTS -- * //

// const pointLightHelper = new PointLightHelper(sunLight, 1, 0xffff00)
// scene.add(pointLightHelper)

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
})

/**
 ** --  Camera -- *
 */
// Base camera
const near = 0.0001
const far = 999999999
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, near, far)
const initCameraPos = earth.mesh.position
const initCameraPosRadius = earth.getRadius()
camera.position.set(initCameraPos.x + initCameraPosRadius, initCameraPos.y, initCameraPos.z + initCameraPosRadius)
const initCameraRot = new THREE.Vector3(0, 0, 0)
camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
scene.add(camera)

const cameraGUI = new GUIMovableObject();
cameraGUI._addGUI(gui, 'Camera', camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false

/**
 ** -- Renderer -- *
 */
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
sun.light.shadow.camera.far = 9999999

/**
 ** -- Post Processing -- *
 */
// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));
// composer.addPass(new EffectPass(camera, new BloomEffect()));

/**
 ** -- Animate -- *
 */

const clock = new THREE.Clock()

//* Set camera position *//
scene.remove(camera)
var positionToLookAt: Vector3 = earth.mesh.position
// const plaRadius = positionToLookAt.radius
const plaCamPosition = positionToLookAt
camera.position.set(plaCamPosition.x, plaCamPosition.y, plaCamPosition.z)
controls.target = positionToLookAt
controls.center = positionToLookAt

function onDocumentKeyDown(event) {
    var keyCode = event.which;
    let planetKeys = {
        48: sun.mesh.position, // 0
        51: earth.mesh.position, // 3
    }
    positionToLookAt = planetKeys[keyCode] ?? positionToLookAt
    controls.target = positionToLookAt
    controls.center = positionToLookAt
};
document.addEventListener("keydown", onDocumentKeyDown, false);

var didPrint = false
const tick = () => {

    camera.updateProjectionMatrix() // for GUI controls

    // const elapsedTime = clock.getElapsedTime()
    const elapsedTime = clock.startTime + clock.getElapsedTime()

    // Update objects

    earth.animate(elapsedTime, sun.mesh); earth.updateShader(camera.position, sun.mesh.position)

    camera.lookAt(positionToLookAt)

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)
    // composer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()