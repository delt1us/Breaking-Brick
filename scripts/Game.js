import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Grid } from './Grid.js'
import { Bat } from './Bat';
import { Frame } from './Frame.js';

export class Game {
    // Grid object 
    #m_Grid;
    // Bat object
    #m_Bat;
    // Threejs PointLight object
    #m_Light;
    // Threejs Scene object
    #m_Scene;
    // Threejs Renderer obejct
    #m_Renderer;
    // Threejs Camera object
    #m_Camera;
    // Threejs m_GLTFLoader object 
    #m_GLTFLoader;
    #vec3_CameraPosition;
    #m_BorderObject;

    // Helpers 
    #m_LightHelper;
    #m_GridHelper;
    #m_Controls;

    constructor() {
        this.#SetupScene();
        this.#SetupRenderer();
        this.#SetupCamera();
        this.#MakeBorderObject();
        this.#Initialize();
        // this.#LoadContent();
        this.#SetupHelpers();
    }

    // Run once from constructor
    #MakeBorderObject() {
        this.#m_BorderObject = new Frame(this.#m_Scene);
    }

    // Run once from constructor
    #SetupHelpers() {
        // Light helper shows where the light is
        this.#m_LightHelper = new THREE.PointLightHelper(this.#m_Light);
        // Draws 2D grid 
        this.#m_GridHelper = new THREE.GridHelper(200, 50);
        this.#m_Scene.add(this.#m_LightHelper, this.#m_GridHelper);

        // Controls
        this.#m_Controls = new OrbitControls(this.#m_Camera, this.#m_Renderer.domElement);
    }

    // Run once from constructor
    #Initialize() {
        this.#m_Grid = new Grid(this.#m_Scene);
        this.#m_Bat = new Bat();

        // Lighting
        this.#m_Light = new THREE.PointLight(0xffffff);
        this.#m_Light.position.set(this.#m_BorderObject.m_WallBack.x - 200, this.#m_BorderObject.m_WallBack.y, this.#m_BorderObject.m_WallBack.z);
        var ambientLight = new THREE.AmbientLight(0xffffff);
        this.#m_Scene.add(this.#m_Light, ambientLight);
    }

    // Run once from constructor
    #SetupScene() {
        this.#m_Scene = new THREE.Scene();
    }

    // Run once from constructor
    #SetupRenderer() {
        // Renderer
        this.#m_Renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this.#m_Renderer.setPixelRatio(window.devicePixelRatio);
        this.#m_Renderer.setSize(window.innerWidth, window.innerHeight);
        // Adds renderer to the html document
        document.body.appendChild(this.#m_Renderer.domElement);
    }

    // Run once from constructor
    #SetupCamera() {
        // https://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
        var width = 1920;
        var dist = 1100;
        var aspect = 1920 / 1080;
        // var fov = 2 * Math.atan( height / ( 2 * dist ) ) * ( 180 / Math.PI );
        var fov = 2 * Math.atan((width / aspect) / (2 * dist)) * (180 / Math.PI);

        // Camera
        this.#m_Camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.#vec3_CameraPosition = new THREE.Vector3(0, 100, dist);
        this.#m_Camera.position.set(this.#vec3_CameraPosition.x, this.#vec3_CameraPosition.y, this.#vec3_CameraPosition.z);
    }

    // Run once from constructor
    //This doesn't run, it is from when I was going to use models imported from blender
    #LoadContent() {
        // Copied from three js docs
        this.#m_GLTFLoader = new GLTFLoader();
        this.#m_GLTFLoader.load('models/frame.glb', (glb) => {
            // Object3D object 
            this.#m_BorderObject = glb.scene;
            // https://stackoverflow.com/questions/36201880/threejs-rotate-on-y-axis-to-face-camera
            // Slightly changed to rotate it 90 degrees so it actually faces camera
            // this.#m_BorderObject.rotation.y = Math.atan2((this.#m_Camera.position.x - this.#m_BorderObject.position.x), (this.#m_Camera.position.z - this.#m_BorderObject.position.z)) + Math.PI * 0.5;
            // Rotates 90 degrees
            this.#m_BorderObject.rotation.y -= Math.PI * 0.5
            this.#m_BorderObject.scale.set(1.5, 1.5, 1.5);
            this.#m_Scene.add(this.#m_BorderObject);
        });
        // End of copied code
    }

    // Run every frame
    Update() {
        this.#m_Grid.Update();
    }

    // Run every frame
    Draw() {
        this.#m_Renderer.render(this.#m_Scene, this.#m_Camera);
    }
}