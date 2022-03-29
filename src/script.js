import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, PointLightHelper } from 'three'

import { Shaders } from './shaders/planet.js'

const today = new Date()
const month = today.getMonth()
const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

// Loading
const textureLoader = new THREE.TextureLoader()

const resolution = '2k'

const earthTexture = textureLoader.load('/textures/' + resolution + '_earth/month/' + resolution + '_earth_' + monthNames[month] + '.jpeg')
const earthNormal = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_normal_map.jpeg')
const earthRoughness = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_roughness_map.jpeg')
const earthSpecular = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_specular_map.jpeg')
const earthEmission = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_emission_map.jpeg')
const earthCloudsTexture = textureLoader.load('/textures/2k_earth_clouds/2k_earth_clouds.png')

const moonTexture = textureLoader.load('/textures/' + resolution + '_moon/' + resolution + '_moon.jpeg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 64, 64)
geometry.clearGroups()
geometry.addGroup(0, Infinity, 0)
geometry.addGroup(0, Infinity, 1)

const moonGeometry = new THREE.SphereBufferGeometry(0.27, 64, 64)

// * -- MATERIALS -- * //
//? -- EARTH -- ?//
const earthMaterial = new THREE.MeshStandardMaterial()
// - material.specularMap = earthSpecular
// - material.lightMap = earthSpecular
earthMaterial.normalMap = earthNormal
earthMaterial.emissiveMap = earthEmission
earthMaterial.roughnessMap = earthRoughness
earthMaterial.map = earthTexture
// earthMaterial.color = new THREE.Color(0xff0000)

const cloudMaterial = new THREE.MeshStandardMaterial()
cloudMaterial.map = earthCloudsTexture
cloudMaterial.transparent = true

//? -- MOON -- ?//
const moonMaterial = new THREE.MeshStandardMaterial()
moonMaterial.map = moonTexture

// * -- MESH -- * //
//? -- EARTH -- ?//
const materials = [earthMaterial, cloudMaterial]
const earth = new THREE.Mesh(geometry, earthMaterial)
const earthAxisVector = new THREE.Vector3(0, 0, 1)
const earthAxisRadians = 23 * Math.PI / 180
earth.setRotationFromAxisAngle(earthAxisVector, earthAxisRadians)
scene.add(earth)

const earthFolder = gui.addFolder('Earth')
const earthPosFolder = earthFolder.addFolder('Position')
earthPosFolder.add(earth.position, 'x').step(0.01)
earthPosFolder.add(earth.position, 'y').step(0.01)
earthPosFolder.add(earth.position, 'z').step(0.01)
const earthRotFolder = earthFolder.addFolder('Rotation')
earthRotFolder.add(earth.rotation, 'x').step(0.01)
earthRotFolder.add(earth.rotation, 'y').step(0.01)
earthRotFolder.add(earth.rotation, 'z').step(0.01)

//? -- MOON -- ?//
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
scene.add(moon)

const moonFolder = gui.addFolder('Moon')
const moonPosFolder = moonFolder.addFolder('Position')
moonPosFolder.add(moon.position, 'x').step(0.01)
moonPosFolder.add(moon.position, 'y').step(0.01)
moonPosFolder.add(moon.position, 'z').step(0.01)
const moonRotFolder = moonFolder.addFolder('Rotation')
moonRotFolder.add(moon.rotation, 'x').step(0.01)
moonRotFolder.add(moon.rotation, 'y').step(0.01)
moonRotFolder.add(moon.rotation, 'z').step(0.01)


// * -- LIGHTS -- * //
const pointLight = new THREE.PointLight(0xffffff, 3)
// 2, 2.5, 5.5
// 3, 5.2, 3.5
pointLight.position.set(3, 5.2, 3.5)
scene.add(pointLight)

const lightFolder = gui.addFolder('Light')
lightFolder.add(pointLight.position, 'x')
lightFolder.add(pointLight.position, 'y')
lightFolder.add(pointLight.position, 'z')
lightFolder.add(pointLight, 'intensity', 0, 100, 0.01)

const pointLightHelper = new PointLightHelper(pointLight, 1, 0xffff00)
scene.add(pointLightHelper)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// 0, 0.798, 2
// -0.298, 0.989, 2
const initCameraPos = new THREE.Vector3(-0.298, 0.989, 2)
camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.z)
// -0.408, 0, 0
// -0.463, -0.217, 0
const initCameraRot = new THREE.Vector3(-0.463, -0.217, 0)
camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
scene.add(camera)

const cameraFolder = gui.addFolder('Camera')
const cameraPosFolder = cameraFolder.addFolder('Position')
cameraPosFolder.add(camera.position, 'x').step(0.001)
cameraPosFolder.add(camera.position, 'y').step(0.001)
cameraPosFolder.add(camera.position, 'z').step(0.001)
const cameraRotFolder = cameraFolder.addFolder('Rotation')
cameraRotFolder.add(camera.rotation, 'x').step(0.001)
cameraRotFolder.add(camera.rotation, 'y').step(0.001)
cameraRotFolder.add(camera.rotation, 'z').step(0.001)

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

const galaxyTexture = textureLoader.load('/textures/8k_galaxy/8k_stars_milky_way.jpeg', () => {
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

const tick = () => {
    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    camera.rotation.set(initCameraRot.x, initCameraRot.y, initCameraRot.z)
    camera.rotation.x += .05 * targetY
    camera.rotation.y += .05 * targetX
    camera.position.set(initCameraPos.x, initCameraPos.y, initCameraPos.z)
    camera.position.x += -.01 * targetX
    camera.position.y += .01 * targetY
    earth.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0001)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()