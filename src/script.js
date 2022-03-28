import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()

const resolution = '2k'
const earthTexture = textureLoader.load('/textures/' + resolution + '_earth/month/' + resolution + '_earth_july.jpeg')
const earthNormal = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_normal_map.jpeg')
const earthRoughness = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_roughness_map.jpeg')
const earthSpecular = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_specular_map.jpeg')
const earthEmission = textureLoader.load('/textures/' + resolution + '_earth/' + resolution + '_earth_emission_map.jpeg')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial()
// material.specularMap = earthSpecular
material.normalMap = earthNormal
material.emissiveMap = earthEmission
material.roughnessMap = earthRoughness
material.map = earthTexture
// material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry, material)
sphere.setRotationFromAxisAngle(new THREE.Vector3(0, 0, 1), 23 * Math.PI / 180)
scene.add(sphere)

const earthFolder = gui.addFolder('Earth')
const earthPosFolder = earthFolder.addFolder('Position')
earthPosFolder.add(sphere.position, 'x').step(0.01)
earthPosFolder.add(sphere.position, 'y').step(0.01)
earthPosFolder.add(sphere.position, 'z').step(0.01)
const earthRotFolder = earthFolder.addFolder('Rotation')
earthRotFolder.add(sphere.rotation, 'x').step(0.01)
earthRotFolder.add(sphere.rotation, 'y').step(0.01)
earthRotFolder.add(sphere.rotation, 'z').step(0.01)

// Lights

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

/**
 * Sizes
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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// 0, 0.798, 2
// -0.298, 0.989, 2
camera.position.set(-0.298, 0.989, 2)
// -0.408, 0, 0
// -0.463, -0.217, 0
camera.rotation.set(-0.463, -0.217, 0)
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
 * Renderer
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
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.0001)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()