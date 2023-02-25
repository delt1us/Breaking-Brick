import * as THREE from 'three';

export class Level {
    a_Bricks;
    constructor() {
        this.a_Bricks = [];
    }

    // Loads from localstorage, called from Game.Initiliaze()
    LoadLevel(levelName) {
        return JSON.parse(localStorage.getItem(levelName));
    }

    // Saving uses localstorage which is similar to cookies but they do not expire. Called from Game.Initialize() 
    SaveLevel(levelName) {
        // Converts this level to a JSON string
        let json = JSON.stringify(this);
        // Creates item in localstorage
        localStorage.setItem(levelName, json);
    }

    // Creates temp level, a 12x6 grid
    CreateTempLevel() {
        for (let row = 0; row < 6; row++) {
            for (let column = 0; column < 12; column++) {
                let location = new THREE.Vector2(column, row);
                let thisBrick = new Brick(location, "L1");
                this.a_Bricks.push(thisBrick);
            }
        }
    }
}

class Brick {
    vec_GridLocation;
    str_BrickType;
    constructor(gridLocation, brickType) {
        this.vec_GridLocation = gridLocation;
        this.str_BrickType = brickType;
    }
}