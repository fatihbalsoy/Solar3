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
import Venus from './objects/venus'
import Planet from './objects/planet'
import Mercury from './objects/mercury'
import Saturn from './objects/saturn'
import Uranus from './objects/uranus'
import Neptune from './objects/neptune'

// Loading
const textureLoader = new THREE.TextureLoader()

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects

//? -- SUN -- ?//
const sun = new Sun()
scene.add(sun.mesh)
sun.addGUI(gui)

//? -- MERCURY -- ?//
const mercury = new Mercury();
scene.add(mercury.mesh)
mercury.addGUI(gui)

//? -- VENUS -- ?//
const venus = new Venus();
scene.add(venus.mesh)
venus.addGUI(gui)

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

//? -- SATURN -- ?//
const saturn = new Saturn();
scene.add(saturn.mesh)
saturn.addGUI(gui)

//? -- URANUS -- ?//
const uranus = new Uranus();
scene.add(uranus.mesh)
uranus.addGUI(gui)

//? -- NEPTUNE -- ?//
const neptune = new Neptune();
scene.add(neptune.mesh)
neptune.addGUI(gui)

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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
sun.light.shadow.mapSize.width = 512;
sun.light.shadow.mapSize.height = 512;
sun.light.shadow.camera.near = 0.5;
sun.light.shadow.camera.far = 5000000000000000;

// TODO: Texture does not look good for galaxy, (maybe try adding stars individually?)
const galaxyTexture = textureLoader.load('/textures/galaxy/2k_milky_way.jpeg', () => {
    const rt = new THREE.WebGLCubeRenderTarget(galaxyTexture.image.height);
    rt.fromEquirectangularTexture(renderer, galaxyTexture);
    // rt.texture.offset.x = (90 * Math.PI) / 180
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
const planetToLookAt: Planet = earth
planetToLookAt.mesh.add(camera)
// camera.position.z = 100
// camera.position.x = -100
// camera.fov = 20
// camera.zoom = 10

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

    mercury.animate(elapsedTime)
    mercury.orbit(sun.mesh, elapsedTime)
    venus.animate(elapsedTime)
    venus.orbit(sun.mesh, elapsedTime)

    // Update planetary objects and cameras
    //earth.realMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0001)
    earth.animate(elapsedTime)
    earth.orbit(sun.mesh, elapsedTime)
    moon.orbit(earth.mesh, elapsedTime)
    moon.mesh.lookAt(earth.mesh.position)

    mars.animate(elapsedTime)
    mars.orbit(sun.mesh, elapsedTime)
    jupiter.animate(elapsedTime)
    jupiter.orbit(sun.mesh, elapsedTime)
    saturn.animate(elapsedTime)
    saturn.orbit(sun.mesh, elapsedTime)
    uranus.animate(elapsedTime)
    uranus.orbit(sun.mesh, elapsedTime)
    neptune.animate(elapsedTime)
    neptune.orbit(sun.mesh, elapsedTime)

    camera.lookAt(planetToLookAt.mesh.position)
    // console.log("Distance from sun: ", Math.sqrt(Math.pow(camera.position.y - 0, 2) + Math.pow(camera.position.x - 0, 2)))

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()