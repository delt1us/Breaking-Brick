import * as THREE from 'three';

export class Level {
    a_Bricks;
    i_Level;
    b_Hidden;
    constructor() {
        this.a_Bricks = [];
        this.i_Level = 0;
        this.b_Hidden = false;
    }

    // Loads from localstorage, called from Game.Initiliaze()
    Load(levelName) {
        this.a_Bricks = JSON.parse(localStorage.getItem(levelName));
    }

    // Saving uses localstorage which is similar to cookies but they do not expire. Called from Game.Initialize() 
    Save(levelName) {
        // Converts this level to a JSON string
        let json = JSON.stringify(this.a_Bricks);
        // Creates item in localstorage
        localStorage.setItem(levelName, json);
    }

    // Creates temp level, a 12x6 grid
    CreateTempLevel(brickHealth) {
        this.i_Level = brickHealth;
        this.a_Bricks = [];
        for (let row = 0; row < 6; row++) {
            for (let column = 0; column < 12; column++) {
                let location = new THREE.Vector2(column, row);
                this.a_Bricks.push(new Brick(location, brickHealth));
            }
        }
    }
}

class Brick {
    vec_GridLocation;
    i_Health;
    constructor(gridLocation, health) {
        this.vec_GridLocation = gridLocation;
        this.i_Health = health;
    }
}