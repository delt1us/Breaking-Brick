import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Level } from './Level.js';
import { SceneGame, SceneLevelSelect, SceneMainMenu } from './Scene.js';
import { ButtonStates } from './Button.js';

const enum_GameState = {
    Main: Symbol("main"),
    Game: Symbol("game"),
    Level: Symbol("level")
};

export const d_DISABLED_BUTTONS = {
    Play: false,
    Settings: false
};

export class Game {
    // Level object
    #m_Level;
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    // GameScenes
    enum_State;
    m_SceneGame;
    m_SceneMainMenu;
    m_SceneLevelSelect;

    constructor() {
        this.enum_State;
        this.#SetupObjects();
        this.#SetupGameScenes();
    
        this.#SwitchTo(enum_GameState.Main);
    }

    // Called every frame from main.js
    Update(timeNow) {
        this.#UpdateTimeSincePreviousFrame(timeNow);
        this.#CheckButtons();

        switch (this.enum_State) {
            case enum_GameState.Main:
                this.m_SceneMainMenu.Update(this.#f_DeltaTime);
                break;

            case enum_GameState.Game:
                this.m_SceneGame.Update(this.#f_DeltaTime);
                break;
            case enum_GameState.Level:
                this.m_SceneLevelSelect.Update(this.#f_DeltaTime);
                break;
        }
    }

    // Called every frame from main.js
    Draw() {
        switch (this.enum_State) {
            case enum_GameState.Main:
                this.m_SceneMainMenu.Draw();
                break;
            case enum_GameState.Game:
                this.m_SceneGame.Draw();
                break;
            case enum_GameState.Level:
                this.m_SceneLevelSelect.Draw();
                break;
        }
    }

    // Used to check if buttons are pressed from Update()
    #CheckButtons() {
        if (ButtonStates.Play) {
            this.#SwitchTo(enum_GameState.Level);
            ButtonStates.Play = false;
        }
    }

    // Used to switch between scenes
    #SwitchTo(state) {
        if (this.enum_State == enum_GameState.Main) {
            this.m_SceneMainMenu.Disable();
        }
        
        switch (state) {
            case enum_GameState.Main:
                this.m_SceneMainMenu.Enable();
                this.enum_State = enum_GameState.Main;
                break;
            case enum_GameState.Level:
                this.enum_State = enum_GameState.Level;
                break;
        }
    }

    // Called from constructor
    #SetupGameScenes() {
        let level = 7;
        this.#m_Level.b_Hidden = true;
        this.#CreateLevel(level);
        this.#LoadLevel(level);
        this.m_SceneMainMenu = new SceneMainMenu(this.#m_Level);
        this.m_SceneLevelSelect = new SceneLevelSelect();
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
        this.#m_Level = this.#m_Level.Load(level);
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