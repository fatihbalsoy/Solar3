import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, PointLightHelper, Uniform, Vector3 } from 'three'
import * as glsl from 'glslify'
import Earth from './objects/earth'
import Moon from './objects/moon'
import Sun from './objects/sun'
import GUIMovableObject from './gui/movable_3d_object'
import Mars from './objects/mars'
import Jupiter from './objects/jupiter'

// Loading
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

//? -- EARTH -- ?//
const earth = new Earth();
scene.add(earth.mesh)
earth.addGUI(gui)

//? -- MOON -- ?//
const moon = new Moon();
scene.add(moon.mesh)
moon.addGUI(gui)

//? -- MARS -- ?//
const mars = new Mars();
scene.add(mars.mesh)
mars.addGUI(gui)

//? -- JUPITER -- ?//
const jupiter = new Jupiter();
scene.add(jupiter.mesh)
jupiter.addGUI(gui)

//? -- SUN -- ?//
const sun = new Sun()
scene.add(sun.mesh)
let sunFolder = sun.addGUI(gui)

// * -- LIGHTS -- * //
const sunLight = new THREE.PointLight(0xffffff, 3)
// 2, 2.5, 5.5
// 3, 5.2, 3.5
// pointLight.position.set(3, 5.2, 3.5)
sunLight.position.set(0, 0, 0)
sun.mesh.add(sunLight)

const lightFolder = sunFolder.addFolder('Light')
lightFolder.add(sunLight, 'intensity', 0, 100, 0.01)

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
const near = 0.001
const far = 50000
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, near, far)
// 0, 0.798, 2
// -0.298, 0.989, 2
const initCameraPos = new THREE.Vector3(-0.298, 0.989, 2)
camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.z)
// -0.408, 0, 0
// -0.463, -0.217, 0
const initCameraRot = new THREE.Vector3(-0.463, -0.217, 0)
camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
scene.add(camera)

const cameraGUI = new GUIMovableObject();
cameraGUI._addGUI(gui, 'Camera', camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 ** -- Renderer -- *
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const galaxyTexture = textureLoader.load('/textures/galaxy/8k/milky_way.jpeg', () => {
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

scene.remove(camera)
earth.mesh.add(camera)
console.log(moon.mesh.position)

// camera.zoom = 10
const distanceScale = 10000
const tick = () => {
    camera.updateProjectionMatrix() // for GUI controls
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

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

    // Update planetary objects and cameras
    earth.realMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0001)

    earth.orbit(sun.mesh, elapsedTime)
    moon.orbit(earth.mesh, elapsedTime)
    moon.mesh.lookAt(earth.mesh.position) // not the correct face
    mars.orbit(sun.mesh, elapsedTime)
    jupiter.orbit(sun.mesh, elapsedTime)

    camera.lookAt(earth.mesh.position)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()