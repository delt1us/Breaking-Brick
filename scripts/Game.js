import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LevelHandler } from './Level.js';
import { SceneGame, SceneGameFinished, SceneLevelCreate, SceneLevelSelect, SceneMainMenu, ScenePauseMenu, SceneSettingsMenu } from './Scene.js';
import { ButtonStates } from './Button.js';
import { m_SELECTED_LEVEL } from './Scene.js';
import { KeyStates } from './Controls.js';

export class Game {
    // Level object
    #m_Level;
    #f_DeltaTime;
    #f_TimeAtPreviousFrame;

    // GameScenes
    #a_SceneActive;
    #m_SceneGame;
    #m_SceneMainMenu;
    #m_SceneLevelSelect;
    #m_SceneLevelCreate;
    #m_ScenePauseMenu;
    #m_SceneGameFinished;

    constructor() {
        this.#a_SceneActive = [];
        this.#SetupObjects();
        this.#SetupGameScenes();
    
        this.#SwitchTo(this.#m_SceneMainMenu);
    }

    // Called every frame from main.js
    Update(time) {
        this.#GetDeltaTime(time);
        this.#CheckButtons();
        this.#CheckInputs();

        this.#a_SceneActive[this.#a_SceneActive.length - 1].Update(this.#f_DeltaTime);

        if (this.#m_SceneGame != null && this.#m_SceneGame.b_Won && this.#a_SceneActive[this.#a_SceneActive.length - 1] != this.#m_SceneGameFinished) {
            this.#m_SceneGameFinished.SetScore(this.#m_SceneGame.m_ScoreCounter.i_Score);
            this.#m_Level.LoadAllLevels();
            this.#m_SceneLevelSelect.UpdateColours();
            this.#SwitchTo(this.#m_SceneGameFinished);
        }
    }

    // Called every frame from main.js
    Draw() {
        this.#a_SceneActive[this.#a_SceneActive.length - 1].Draw();
    }

    #LoadLevel(i_Level) {
        this.#m_Level.Load(i_Level);
        this.#UpdateLevelDiv();
        this.#m_SceneGame = new SceneGame("gameCanvas", this.#m_Level);
        this.#m_SceneGame.m_Grid.LoadLevel(this.#m_SceneGame.m_Scene, this.#m_SceneGame.m_Level);

        this.#SwitchTo(this.#m_SceneGame);
    }

    #CheckInputs() {
        // If game is active
        if (KeyStates.esc) {
            if (this.#a_SceneActive[this.#a_SceneActive.length -1] == this.#m_SceneGame) {
                this.#SwitchTo(this.#m_ScenePauseMenu);            
            }
            else if (this.#a_SceneActive[this.#a_SceneActive.length - 1] == this.#m_ScenePauseMenu) {
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

            // If was in level creation
            else {
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
            ButtonStates.Play = false;
            this.#m_SceneLevelSelect.ShowCreateButton();
            this.#SwitchTo(this.#m_SceneLevelSelect);
        }

        else if (ButtonStates.Back) {
            ButtonStates.Back = false;
            if (!this.#m_SceneLevelSelect.b_CreateButton) {
                this.#m_SceneLevelSelect.ShowCreateButton();
            }
            this.#RemoveCurrentSceneFromSceneActiveArray();
        }        
    
        else if (ButtonStates.Create) {
            ButtonStates.Create = false;
            this.#SwitchTo(this.#m_SceneLevelCreate);
            this.#m_SceneLevelCreate.ResetCreationGrid();
        }

        else if (ButtonStates.BackLevelCreate) {
            ButtonStates.BackLevelCreate = false;
            this.#m_SceneLevelSelect.ShowCreateButton();
            this.#RemoveCurrentSceneFromSceneActiveArray();
        }
        
        else if (ButtonStates.SaveLevel) {
            ButtonStates.SaveLevel = false;
            this.#m_SceneLevelSelect.HideCreateButton();
            this.#SwitchTo(this.#m_SceneLevelSelect);
        }

        else if (ButtonStates.QuitPauseMenu) {
            ButtonStates.QuitPauseMenu = false;
            this.#RemoveCurrentSceneFromSceneActiveArray();
            this.#RemoveCurrentSceneFromSceneActiveArray();
        }

        else if (ButtonStates.ContinuePauseMenu) {
            ButtonStates.ContinuePauseMenu = false;
            this.#RemoveCurrentSceneFromSceneActiveArray();
        }

        // !Game crashes if you retry the same level and then press back. Don't know what causes this bug
        // WebGL warning: uniform setter: UniformLocation is not from the current active Program. (32 times)
        else if (ButtonStates.BackFinishedMenu) {
            ButtonStates.BackFinishedMenu = false;
            this.#RemoveCurrentSceneFromSceneActiveArray();
            this.#RemoveCurrentSceneFromSceneActiveArray();
            this.#m_SceneGame = null;
        }
    }

    // Used to switch between scenes
    #SwitchTo(scene) {
        this.#a_SceneActive[this.#a_SceneActive.length - 1].Disable();
        this.#a_SceneActive.push(scene);
        this.#a_SceneActive[this.#a_SceneActive.length - 1].Enable();
    }

    #RemoveCurrentSceneFromSceneActiveArray() {
        this.#a_SceneActive[this.#a_SceneActive.length - 1].Disable();
        this.#a_SceneActive.pop();
        this.#a_SceneActive[this.#a_SceneActive.length - 1].Enable();
    }

    // Called from constructor
    #SetupGameScenes() {
        this.#m_SceneMainMenu = new SceneMainMenu(this.#m_Level, "mainMenuCanvas");
        this.#m_SceneMainMenu.m_Grid.LoadLevel(this.#m_SceneMainMenu.m_Scene, this.#m_SceneMainMenu.m_Level);
        this.#m_SceneLevelSelect = new SceneLevelSelect(this.#m_Level);
        this.#m_SceneLevelCreate = new SceneLevelCreate(this.#m_Level);
        this.#m_ScenePauseMenu = new ScenePauseMenu();
        this.#m_SceneGameFinished = new SceneGameFinished();

        this.#a_SceneActive.push(this.#m_SceneMainMenu);
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