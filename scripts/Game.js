import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Level } from './Level.js';
import { SceneGame, SceneMainMenu } from './Scene.js';

const enum_GameState = {
    Main: Symbol("main"),
    Game: Symbol("game")
};

export class Game {
    // Level object
    #m_Level;
    // Threejs PointLight object
    #m_Light;
    // Threejs AmbientLight object
    #m_AmbientLight;
    // Threejs Scene object
    #m_Scene;
    // Threejs Renderer obejct
    #m_Renderer;
    // Threejs Camera object
    #m_Camera;
    #vec3_CameraPosition;
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;
    // Helpers 
    #m_LightHelper;
    #m_GridHelper;
    #m_Controls;

    // GameScenes
    enum_State;
    m_SceneGame;
    m_SceneMainMenu;

    constructor() {
        this.#SetupScene();
        this.#SetupRenderer();
        this.#SetupCamera();   
        this.#SetupLighting();
        this.#SetupObjects();
        this.#SetupGameScenes();
    }

    // Called every frame from main.js
    Update(timeNow) {
        this.#UpdateTimeSincePreviousFrame(timeNow);
    
        switch (this.enum_State) {
            case enum_GameState.Main:
                this.m_SceneMainMenu.Update();
                break;

            case enum_GameState.Game:
                this.m_SceneGame.Update(this.#f_DeltaTime);
                break;
        }
    }

    // Called every frame from main.js
    Draw() {
        this.#m_Renderer.render(this.#m_Scene, this.#m_Camera);

        switch (this.enum_State) {
            case enum_GameState.Main:
                this.m_SceneMainMenu.Draw();
                break;

            case enum_GameState.Game:
                this.m_SceneGame.Draw();
                break;
        }
    }

    // Called from constructor
    #SetupGameScenes() {
        this.enum_State = enum_GameState.Main;
        
        let level = 4;
        this.#CreateLevel(level);
        this.#LoadLevel(level);
        
        this.m_SceneMainMenu = new SceneMainMenu();    
        this.m_SceneGame = new SceneGame(this.#m_Level, this.#m_Scene);
        
    }

    // Called from Update
    #UpdateTimeSincePreviousFrame(timeNow) {
        // Gets time since last frame and then sets the time at previous frame to current time
        // Works because the function is then called by window.requestAnimationFrame(gameLoop);
        this.#f_DeltaTime = timeNow - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = timeNow;
    }
    
    // Called from constructor
    #SetupObjects() {
        this.#m_Level = new Level();
    }
    
    // Called from constructor
    #SetupLighting() {
        // Lighting
        this.#m_Light = new THREE.PointLight(0xbbbbbb);
        this.#m_Light.position.set(this.#m_Camera.position.x, this.#m_Camera.position.y, this.#m_Camera.position.z + 5);
        this.#m_AmbientLight = new THREE.AmbientLight(0x909090);
        this.#m_Scene.add(this.#m_Light, this.#m_AmbientLight);
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
        var fov = 2 * Math.atan((width / aspect) / (2 * dist)) * (180 / Math.PI) + 7;

        // Camera
        this.#m_Camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.#vec3_CameraPosition = new THREE.Vector3(960, 620, dist - 200);
        this.#m_Camera.position.set(this.#vec3_CameraPosition.x, this.#vec3_CameraPosition.y, this.#vec3_CameraPosition.z);
    }

    // Run once from constructor
    #SetupHelpers() {
        // Light helper shows where the light is
        this.#m_LightHelper = new THREE.PointLightHelper(this.#m_Light);
        // Draws 2D grid 
        this.#m_GridHelper = new THREE.GridHelper(200, 50);
        this.#m_Scene.add(this.#m_LightHelper, this.#m_GridHelper);

        // OrbitControls messes with camera movement, only enable this if necessary
        this.#m_Controls = new OrbitControls(this.#m_Camera, this.#m_Renderer.domElement);
    }
 
    #CreateLevel(level) {
        this.#m_Level.CreateTempLevel(level);
        this.#m_Level.Save(level);
    }
    
    #LoadLevel(level) {
        this.#m_Level = this.#m_Level.Load(level);
        this.#UpdateLevelDiv();
    }

    #UpdateLevelDiv() {
        let text = "";
        if (this.#m_Level.i_Level != 0) {
            text = `LEVEL:${this.#m_Level.i_Level}`;
        }
        document.getElementById("level").innerHTML = text;
    }
}