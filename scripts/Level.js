import * as THREE from 'three';

export class LevelHandler {
    a_Bricks;
    i_Level;
    b_Hidden;
    #a_Levels;
    constructor() {
        this.#a_Levels = [];
        this.a_Bricks = [];
        this.i_Level = 0;
        this.b_Hidden = false;
        this.#LoadAllLevels();
    }

    // Make empty levels
    // Save them
    // Load all levels
    // Allow saving over individual levels

    // Called from constructor
    #LoadAllLevels() {
        this.#a_Levels = JSON.parse(localStorage.getItem("levels"));
    }

    // Usually not run
    #SetAllLevelsEmpty() {
        this.#a_Levels = [];
        for (let index = 0; index < 62; index++) {
            let level = index + 1;
            this.#a_Levels.push(new Level([], level));
        }
        this.Save();
    }

    // Saving uses localstorage which is similar to cookies but they do not expire. Called from Game.Initialize() 
    Save() {
        let level = new Level(this.a_Bricks, this.i_Level);
        this.#a_Levels[this.i_Level - 1] = level;
        // Converts this level to a JSON string
        let json = JSON.stringify(this.#a_Levels);
        // Creates item in localstorage
        localStorage.setItem("levels", json);
    }

    // Loads from localstorage, called from Game.Initiliaze()
    Load(i_LevelIndex) {
        this.i_Level = i_LevelIndex;
        this.a_Bricks = this.#a_Levels[i_LevelIndex - 1].a_Bricks;
    }    

    CreateSimulationLevel() {
        let brickHealth = 7;
        this.i_Level = 63;
        let a_Bricks = [];
        for (let row = 0; row < 6; row++) {
            for (let column = 0; column < 12; column++) {
                let location = new THREE.Vector2(column, row);
                a_Bricks.push(new Brick(location, brickHealth));
            }
        }
        this.#a_Levels[this.i_Level - 1] = new Level(a_Bricks, this.i_Level);
    }
}

class Level {
    a_Bricks;
    i_Level;

    constructor(a_BricksArray, i_Level) {
        this.a_Bricks = a_BricksArray;
        this.i_Level = i_Level;
    }
}

export class Brick {
    vec_GridLocation;
    i_Health;
    constructor(gridLocation, health) {
        this.vec_GridLocation = gridLocation;
        this.i_Health = health;
    }
}