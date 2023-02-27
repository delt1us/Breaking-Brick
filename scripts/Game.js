import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Level } from './Level.js';
import { SceneGame, SceneLevelCreate, SceneLevelSelect, SceneMainMenu, SceneSettingsMenu } from './Scene.js';
import { ButtonStates } from './Button.js';
import { m_SELECTED_LEVEL } from './Scene.js';

const enum_GameState = {
    Main: Symbol("main"),
    Game: Symbol("game"),
    Level: Symbol("level"),
    Create: Symbol("create")
};

export class Game {
    // Level object
    #m_Level;
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    // GameScenes
    #enum_State;
    #m_SceneGame;
    #m_SceneMainMenu;
    #m_SceneLevelSelect;
    #m_SceneLevelCreate;

    constructor() {
        this.#enum_State;
        this.#SetupObjects();
        this.#SetupGameScenes();
    
        this.#SwitchTo(enum_GameState.Main);
        this.#SwitchTo(enum_GameState.Create);
    }

    // Called every frame from main.js
    Update(timeNow) {
        this.#UpdateTimeSincePreviousFrame(timeNow);
        this.#CheckButtons();

        switch (this.#enum_State) {
            case enum_GameState.Main:
                this.#m_SceneMainMenu.Update(this.#f_DeltaTime);
                break;

            case enum_GameState.Game:
                this.#m_SceneGame.Update(this.#f_DeltaTime);
                break;
            case enum_GameState.Level:
                this.#m_SceneLevelSelect.Update(this.#f_DeltaTime);
                break;
        }
    }

    // Called every frame from main.js
    Draw() {
        switch (this.#enum_State) {
            case enum_GameState.Main:
                this.#m_SceneMainMenu.Draw();
                break;
            case enum_GameState.Game:
                this.#m_SceneGame.Draw();
                break;
            case enum_GameState.Level:
                this.#m_SceneLevelSelect.Draw();
                break;
        }
    }

    // Used to check if buttons are pressed from Update()
    #CheckButtons() {
        if (m_SELECTED_LEVEL.level > 0) {
            this.#StartGame(m_SELECTED_LEVEL.level);    
            m_SELECTED_LEVEL.level = 0;
        }
    
        if (ButtonStates.Play) {
            this.#SwitchTo(enum_GameState.Level);
            ButtonStates.Play = false;
        }

        else if (ButtonStates.Back) {
            this.#SwitchTo(enum_GameState.Main);
            ButtonStates.Back = false;
        }        
    
        else if (ButtonStates.Create) {
            this.#SwitchTo(enum_GameState.Create);
            ButtonStates.Create = false;
        }
        else if (ButtonStates.BackLevelCreate) {
            this.#SwitchTo(enum_GameState.Level);
            ButtonStates.BackLevelCreate = false;
        }
    }

    #StartGame(level) {
        this.#CreateLevel(level);
        this.#LoadLevel(level);
        this.#SwitchTo(enum_GameState.Game);
    }

    // Used to switch between scenes
    #SwitchTo(state) {
        // Disables previous scene
        switch (this.#enum_State) {
            case enum_GameState.Main:
                this.#m_SceneMainMenu.Disable();
                break;
            case enum_GameState.Level:
                this.#m_SceneLevelSelect.Disable();
                break;
            case enum_GameState.Game:
                this.#m_SceneGame.Disable();
                break;
            case enum_GameState.Create:
                this.#m_SceneLevelCreate.Disable();
                break;
        }

        // Enables new scene
        switch (state) {
            case enum_GameState.Main:
                this.#m_SceneMainMenu.Enable();
                this.#enum_State = enum_GameState.Main;
                break;
            case enum_GameState.Level:
                this.#m_SceneLevelSelect.Enable();
                this.#enum_State = enum_GameState.Level;
                break;
            case enum_GameState.Game:
                this.#m_SceneGame.Enable();
                this.#enum_State = enum_GameState.Game;
                break;
            case enum_GameState.Create:
                this.#m_SceneLevelCreate.Enable();
                this.#enum_State = enum_GameState.Create;
            }
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
        this.#m_SceneGame.Disable();
        this.#m_SceneLevelCreate = new SceneLevelCreate(this.#m_Level);    
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