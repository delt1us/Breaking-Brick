import * as THREE from 'three';
import { Grid } from './Grid.js'
import { Bat } from './Bat';
import { Frame } from './Frame.js';
import { Ball } from './Ball.js';
import { Timer } from './Timer.js';
import { ScoreCounter } from './Score.js';

class Scene {
    // Threejs scene
    _m_Scene;
    // Threejs Camera
    _m_Camera;
    // Threejs PointLight object
    _m_Light;
    // Threejs AmbientLight object
    _m_AmbientLight;
    // Threejs Renderer obejct
    _m_Renderer;
    // Threejs Camera object
    _vec3_CameraPosition;

    // Helpers 
    _m_LightHelper;
    _m_GridHelper;
    _m_Controls;

    constructor() {
        this._SetupScene();
        this._SetupRenderer();
        this._SetupCamera();   
        this._SetupLighting();
    }
    
    Update(timeNow) { 
        
    }

    Draw() {
        this._m_Renderer.render(this._m_Scene, this._m_Camera);
    }

    // Run once from constructor
    _SetupCamera() {
        // https://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
        var width = 1920;
        var dist = 1100;
        var aspect = 1920 / 1080;
        // var fov = 2 * Math.atan( height / ( 2 * dist ) ) * ( 180 / Math.PI );
        var fov = 2 * Math.atan((width / aspect) / (2 * dist)) * (180 / Math.PI) + 7;

        // Camera
        this._m_Camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        this._vec3_CameraPosition = new THREE.Vector3(960, 620, dist - 200);
        this._m_Camera.position.set(this._vec3_CameraPosition.x, this._vec3_CameraPosition.y, this._vec3_CameraPosition.z);
    }

    // Called from constructor
    _SetupLighting() {
        // Lighting
        this._m_Light = new THREE.PointLight(0xbbbbbb);
        this._m_Light.position.set(this._m_Camera.position.x, this._m_Camera.position.y, this._m_Camera.position.z + 5);
        this._m_AmbientLight = new THREE.AmbientLight(0x909090);
        this._m_Scene.add(this._m_Light, this._m_AmbientLight);
    }

    // Run once from constructor
    _SetupScene() {
        this._m_Scene = new THREE.Scene();
    }

    // Run once from constructor
    _SetupRenderer() {
        // Renderer
        this._m_Renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#bg'),
        });
        this._m_Renderer.setPixelRatio(window.devicePixelRatio);
        this._m_Renderer.setSize(window.innerWidth, window.innerHeight);
        // Adds renderer to the html document
        document.body.appendChild(this._m_Renderer.domElement);
    }

    // Run once from constructor
    _SetupHelpers() {
        // Light helper shows where the light is
        this._m_LightHelper = new THREE.PointLightHelper(this._m_Light);
        // Draws 2D grid 
        this._m_GridHelper = new THREE.GridHelper(200, 50);
        this._m_Scene.add(this._m_LightHelper, this._m_GridHelper);

        // OrbitControls messes with camera movement, only enable this if necessary
        this._m_Controls = new OrbitControls(this._m_Camera, this._m_Renderer.domElement);
    }
}

export class SceneMainMenu extends Scene {
    
    constructor() {
        super();
    }

    Update() {

    }

    Draw() {

    }
}

export class SceneGame extends Scene {
    // Threejs Renderer
    // Grid object 
    #m_Grid;
    // Bat object
    #m_Bat;
    // Ball object
    #m_Ball;
    // Frame object
    #m_Frame;
    // Timer object 
    #m_Timer;
    #m_ScoreCounter;
    #m_Level;
    #f_DeltaTime;

    constructor(level) {
        super();
        this._SetupCamera();
        this.#Initialize(level);
    }
    
    // Run every frame
    Update(deltaTime) {
        this.#f_DeltaTime = deltaTime;

        this.#m_Bat.Update(this.#f_DeltaTime);
        this.#m_Ball.Update(this.#f_DeltaTime);

        this.#m_Grid.Update();
        this.#m_Timer.Update(this.#f_DeltaTime);
        this.#m_ScoreCounter.Update();
    }

    // Run once from constructor
    #Initialize(level) {
        this.#m_Level = level;

        this.#m_Grid = new Grid(this._m_Scene);
        this.#m_Grid.LoadLevel(this._m_Scene, this.#m_Level);
        
        this.#m_Bat = new Bat(this._m_Scene);
        this.#m_Frame = new Frame(this._m_Scene);
        this.#m_Timer = new Timer("timer");    
        this.#m_ScoreCounter = new ScoreCounter("score");
        
        this.#m_Ball = new Ball(this._m_Scene, this.#m_Grid, this.#m_Frame, this.#m_Bat, this.#m_Timer, this.#m_ScoreCounter);
    }
}