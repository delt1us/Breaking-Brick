import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Level } from './Level.js';
import { SceneGame, SceneLevelCreate, SceneLevelSelect, SceneMainMenu, SceneSettingsMenu } from './Scene.js';
import { ButtonStates } from './Button.js';
import { m_SELECTED_LEVEL } from './Scene.js';

export class Game {
    // Level object
    #m_Level;
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    // GameScenes
    #m_SceneActive;
    #m_SceneGame;
    #m_SceneMainMenu;
    #m_SceneLevelSelect;
    #m_SceneLevelCreate;

    constructor() {
        this.#m_SceneActive;
        this.#SetupObjects();
        this.#SetupGameScenes();
    
        this.#SwitchTo(this.#m_SceneMainMenu);
    }

    // Called every frame from main.js
    Update(time) {
        this.#GetDeltaTime(time);
        this.#CheckButtons();

        this.#m_SceneActive.Update(this.#f_DeltaTime);
    }

    // Called every frame from main.js
    Draw() {
        this.#m_SceneActive.Draw();
    }

    // Used to check if buttons are pressed from Update()
    #CheckButtons() {
        if (m_SELECTED_LEVEL.level > 0) {
            this.#StartGame(m_SELECTED_LEVEL.level);    
            m_SELECTED_LEVEL.level = 0;
        }
    
        if (ButtonStates.Play) {
            this.#SwitchTo(this.#m_SceneLevelSelect);
            ButtonStates.Play = false;
        }

        else if (ButtonStates.Back) {
            this.#SwitchTo(this.#m_SceneMainMenu);
            ButtonStates.Back = false;
        }        
    
        else if (ButtonStates.Create) {
            this.#SwitchTo(this.#m_SceneLevelCreate);
            ButtonStates.Create = false;
        }
        else if (ButtonStates.BackLevelCreate) {
            this.#SwitchTo(this.#m_SceneLevelSelect);
            ButtonStates.BackLevelCreate = false;
        }
    }

    #StartGame(level) {
        this.#CreateLevel(level);
        this.#LoadLevel(level);
        this.#SwitchTo(this.#m_SceneGame);
    }

    // Used to switch between scenes
    #SwitchTo(scene) {
        this.#m_SceneActive.Disable();
        this.#m_SceneActive = scene;
        this.#m_SceneActive.Enable();
    }

    // Called from constructor
    #SetupGameScenes() {
        localStorage.clear();
        let level = 7;
        this.#CreateLevel(level);
        this.#LoadLevel(level);
        this.#m_SceneMainMenu = new SceneMainMenu(this.#m_Level, "mainMenuCanvas");
        this.#m_SceneLevelSelect = new SceneLevelSelect();
        this.#m_SceneGame = new SceneGame("gameCanvas", this.#m_Level);
        // This has to be here since SceneMainMenu inherits from SceneGame and it breaks if this is in SceneGame's constructor.
        this.#m_SceneGame.Disable();
        this.#m_SceneLevelCreate = new SceneLevelCreate();
    
        this.#m_SceneActive = this.#m_SceneMainMenu;
    }

    // Called from Update
    #GetDeltaTime(timeNow) {
        // Gets time since last frame and then sets the time at previous frame to current time
        // Works because the function is then called by window.requestAnimationFrame(gameLoop);
        this.#f_DeltaTime = timeNow - this.#f_TimeAtPreviousFrame;
        this.#f_TimeAtPreviousFrame = timeNow;
    }
    
    // Called from constructor
    #SetupObjects() {
        this.#m_Level = new Level();
    }
    
    #CreateLevel(level) {
        this.#m_Level.CreateTempLevel(level);
        this.#m_Level.Save(level);
    }
    
    #LoadLevel(level) {
        this.#m_Level.Load(level);
        this.#UpdateLevelDiv();
    }

    #UpdateLevelDiv() {
        let text = "";
        if (this.#m_Level.i_Level > 0 && !this.#m_Level.b_Hidden) {
            text = `LEVEL:${this.#m_Level.i_Level}`;
        }
        document.getElementById("level").innerHTML = text;
    }
}