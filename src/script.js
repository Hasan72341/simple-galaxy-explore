import * as THREE from 'three'
// import GUI from 'lil-gui'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'
import { ScrollTrigger } from 'gsap/all'
// Register only available plugins
gsap.registerPlugin(ScrollTrigger, SplitText)

const splitGalaxy = SplitText.create(".galaxy", {
    type: "chars"
})

gsap.from(splitGalaxy.chars, {
    y: (idx) => idx % 2 === 0 ? -300 : 300,
    color: (idx) => idx % 2 === 0 ? "#ff0000" : "#0000ff",
    opacity: 0,
    stagger: {
        each: 0.05
    },
    scrollTrigger: {
        markers: true,
        trigger: ".galaxy",
        start: "top 80%",
        toggleActions: "restart none restart reset",
    }
})

const splitMail = SplitText.create(".mail", {
    type: "chars"
})

gsap.from(splitMail.chars, {
    y: (idx) => Math.sin(idx) * 300,
    color: (idx) => idx % 2 === 0 ? "#59f809ff" : "#b4e70aff",
    opacity: 0,
    stagger: {
        each: 0.05
    },
    scrollTrigger: {
        markers: true,
        trigger: ".Mail",
        start: "top 90%",
        toggleActions: "restart none restart reset",
    }
})

gsap.from(".description", {
    x: (idx) => idx % 2 === 0 ? -300 : 300,
    y: (idx) => Math.sin(idx) * 300,
    color: (idx) => idx % 2 === 0 ? "#59f809ff" : "#b4e70aff",
    stagger: {
        each: 0.05
    },
    scrollTrigger: {
        markers: true,
        trigger: ".description",
        start: "top 90%",
        scrub: true,
    }
})







/**
 * Debug
 */
// const gui = new GUI()

// const parameters = {
//     materialColor: '#ffeded'
// }

// const colorController = gui.addColor(parameters, 'materialColor')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




const textureLoader = new THREE.TextureLoader()

const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
// Improve toon shading: no mipmaps and nearest filtering to avoid banding blur
gradientTexture.generateMipmaps = false
gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter


const material = new THREE.MeshToonMaterial({
    gradientMap: gradientTexture,
})

material.color = new THREE.Color("#e2f9ff")

const objectDistance = 5

//torus

const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100)
const torus = new THREE.Mesh(torusGeometry, material)
torus.position.y = -objectDistance * 0

scene.add(torus)

const cursor = {}
cursor.x = null
cursor.y = null

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX/ sizes.width - 0.5
    cursor.y = event.clientY/ sizes.height - 0.5
    console.log(cursor)
})

//cone

const coneGeometry = new THREE.ConeGeometry(0.3, 1, 32)
const cone = new THREE.Mesh(coneGeometry, material)
cone.position.y = -objectDistance * 1

// camera.position.y = window.scrollY * 0.001

scene.add(cone)

//torusKnot

const torusKnotGeometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16)
const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.y = -objectDistance * 2

scene.add(torusKnot)

const particleMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})
const particleCount = 10000
const positions = new Float32Array(particleCount * 3)

// Distribute particles in a jittered cylinder around the scene (less "cube" looking)
const minY = Math.min(torus.position.y, cone.position.y, torusKnot.position.y) - 5
const maxY = Math.max(torus.position.y, cone.position.y, torusKnot.position.y) + 5
const radialMax = 20 // cylinder radius

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const angle = Math.random() * Math.PI * 2
    const r = radialMax * (Math.random()) 

    positions[i3 + 0] = Math.cos(angle) * r + (Math.random() - 0.5) * 2
    positions[i3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 2

    positions[i3 + 1] = THREE.MathUtils.lerp(minY, maxY, Math.random())
}

const particleGeometry = new THREE.BufferGeometry()

particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

// Lights (MeshToonMaterial needs lighting)
const ambientLight = new THREE.AmbientLight('#ffffff', 0.4)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(1, 1, 0.5)
scene.add(directionalLight)
/**
 * Sizes
 */

const collection = [torus, cone, torusKnot]

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
const camGroup = new THREE.Group()
scene.add(camGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
camGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.fov = 35

window.addEventListener("resize", () => {
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

window.addEventListener("mousemove" , (event) => {
    console.log(event.clientX, event.clientY)
}) 


/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0


//sectioning
let currentSection = 0
let newSection = 0



window.addEventListener('scroll', () => {
    const scrollY = window.scrollY
    const sectionHeight = sizes.height
    newSection = Math.round(scrollY / sizes.height)
    if (newSection !== currentSection) {
        currentSection = newSection
        
        gsap.to(collection[currentSection].rotation, {
            x: `+= ${Math.PI * 2}`,
            y: `+= ${Math.PI * 2}`,
            duration: 1,
            ease: 'bounce.in'
        })


    }

})




const tick = () =>
    
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - prevTime
    prevTime = elapsedTime

    camGroup.position.y = -window.scrollY / sizes.height * objectDistance
    const parallelX =  -cursor.x * 0.5
    const parallelY = cursor.y * 0.5
    camera.position.x += (parallelX - camera.position.x)* deltaTime * 5
    camera.position.y += (parallelY - camera.position.y)* deltaTime * 5

    for(const mesh of collection) {
        mesh.rotation.x += deltaTime * 0.4
        mesh.rotation.y += deltaTime * 0.4

    }

    
    // Render
    renderer.render(scene, camera)


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()