import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LevelHandler } from './Level.js';
import { SceneGame, SceneLevelCreate, SceneLevelSelect, SceneMainMenu, ScenePauseMenu, SceneSettingsMenu } from './Scene.js';
import { ButtonStates } from './Button.js';
import { m_SELECTED_LEVEL } from './Scene.js';
import { KeyStates } from './Controls.js';

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
    #m_ScenePauseMenu;

    constructor() {
        this.#m_SceneActive = [];
        this.#SetupObjects();
        this.#SetupGameScenes();
    
        this.#SwitchTo(this.#m_SceneMainMenu);
    }

    // Called every frame from main.js
    Update(time) {
        this.#GetDeltaTime(time);
        this.#CheckButtons();
        this.#CheckInputs();

        this.#m_SceneActive[this.#m_SceneActive.length - 1].Update(this.#f_DeltaTime);
    }

    // Called every frame from main.js
    Draw() {
        this.#m_SceneActive[this.#m_SceneActive.length - 1].Draw();
    }

    #LoadLevel(i_Level) {
        this.#m_Level.Load(i_Level);
        this.#UpdateLevelDiv();
        this.#m_SceneGame = new SceneGame("gameCanvas", this.#m_Level);
        this.#m_SceneGame.LoadLevel();
        this.#SwitchTo(this.#m_SceneGame);
    }

    #CheckInputs() {
        // If game is active
        if (KeyStates.esc) {
            if (this.#m_SceneActive[this.#m_SceneActive.length -1] == this.#m_SceneGame) {
                this.#SwitchTo(this.#m_ScenePauseMenu);            
            }
            else if (this.#m_SceneActive[this.#m_SceneActive.length - 1] == this.#m_ScenePauseMenu) {
                this.#RemoveCurrentSceneFromSceneActiveArray();
            }
            KeyStates.esc = false;
        }
    }

    // Used to check if buttons are pressed from Update()
    #CheckButtons() {
        if (m_SELECTED_LEVEL.level > 0) {
            if (this.#m_SceneLevelSelect.b_CreateButton) {
                if (m_SELECTED_LEVEL.level == 1 || this.#m_Level.a_Levels[m_SELECTED_LEVEL.level - 1].b_Completed) {
                    this.#LoadLevel(m_SELECTED_LEVEL.level);
                }
            }

            else {
                this.#m_Level = this.#m_SceneLevelCreate.m_Level;
                this.#m_Level.m_ActiveLevel.i_Level = m_SELECTED_LEVEL.level;
                this.#m_Level.Save();
                this.#m_SceneLevelSelect.ShowCreateButton();
                this.#RemoveCurrentSceneFromSceneActiveArray();
                this.#RemoveCurrentSceneFromSceneActiveArray();
                this.#RemoveCurrentSceneFromSceneActiveArray();
                this.#SwitchTo(this.#m_SceneLevelSelect);
            }
            m_SELECTED_LEVEL.level = 0;
        }
    
        if (ButtonStates.Play) {
            this.#m_SceneLevelSelect.ShowCreateButton();
            this.#SwitchTo(this.#m_SceneLevelSelect);
            ButtonStates.Play = false;
        }

        else if (ButtonStates.Back) {
            if (!this.#m_SceneLevelSelect.b_CreateButton) {
                this.#m_SceneLevelSelect.ShowCreateButton();
            }
            this.#RemoveCurrentSceneFromSceneActiveArray();
            ButtonStates.Back = false;
        }        
    
        else if (ButtonStates.Create) {
            this.#SwitchTo(this.#m_SceneLevelCreate);
            this.#m_SceneLevelCreate.ResetCreationGrid();
            ButtonStates.Create = false;
        }

        else if (ButtonStates.BackLevelCreate) {
            this.#m_SceneLevelSelect.ShowCreateButton();
            this.#RemoveCurrentSceneFromSceneActiveArray();
            ButtonStates.BackLevelCreate = false;
        }
        
        else if (ButtonStates.SaveLevel) {
            this.#m_SceneLevelSelect.HideCreateButton();
            this.#SwitchTo(this.#m_SceneLevelSelect);
            ButtonStates.SaveLevel = false;
        }

        else if (ButtonStates.QuitPauseMenu) {
            this.#RemoveCurrentSceneFromSceneActiveArray();
            this.#RemoveCurrentSceneFromSceneActiveArray();
            ButtonStates.QuitPauseMenu = false;
        }

        else if (ButtonStates.ContinuePauseMenu) {
            this.#RemoveCurrentSceneFromSceneActiveArray();
            ButtonStates.ContinuePauseMenu = false;
        }
    }

    // Used to switch between scenes
    #SwitchTo(scene) {
        this.#m_SceneActive[this.#m_SceneActive.length - 1].Disable();
        this.#m_SceneActive.push(scene);
        this.#m_SceneActive[this.#m_SceneActive.length - 1].Enable();
    }

    #RemoveCurrentSceneFromSceneActiveArray() {
        this.#m_SceneActive[this.#m_SceneActive.length - 1].Disable();
        this.#m_SceneActive.pop();
        this.#m_SceneActive[this.#m_SceneActive.length - 1].Enable();
    }

    // Called from constructor
    #SetupGameScenes() {
        this.#m_Level.Load(63);
        this.#m_Level.Save();

        this.#m_SceneMainMenu = new SceneMainMenu(this.#m_Level, "mainMenuCanvas");
        this.#m_SceneLevelSelect = new SceneLevelSelect(this.#m_Level);
        this.#m_SceneLevelCreate = new SceneLevelCreate();
        this.#m_ScenePauseMenu = new ScenePauseMenu();

        this.#m_SceneActive.push(this.#m_SceneMainMenu);
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
        this.#m_Level = new LevelHandler();
    }
    
    #UpdateLevelDiv() {
        let text = "";
        if (this.#m_Level.m_ActiveLevel.i_Level > 0 && !this.#m_Level.b_Hidden) {
            text = `LEVEL:${this.#m_Level.m_ActiveLevel.i_Level}`;
        }
        document.getElementById("level").innerHTML = text;
    }
}