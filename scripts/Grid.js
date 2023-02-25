import { Vector3 } from "three";
import { L1Brick } from "./Brick.js";

// Grid that will be used to hold bricks
export class Grid {
    a_GridArray;
    #vec3_GRID_START_LOCATION;
    constructor(m_Scene) {
        this.#vec3_GRID_START_LOCATION = new Vector3(190, 980, 0)
        this.a_GridArray = [];
    }

    // Called every frame from Game.js
    Update() {
        // Updates all bricks
        this.a_GridArray.forEach(brick => brick.Update());
    }

    // Loads bricks in Level object as actual Brick objects
    LoadLevel(scene, level) {
        for (let index = 0; index < level.a_Bricks.length; index++) {
            let brick = level.a_Bricks[index];
            let brickLocation = [this.#vec3_GRID_START_LOCATION.x + brick.vec_GridLocation.x * 140, this.#vec3_GRID_START_LOCATION.y - brick.vec_GridLocation.y * 80];

            // For now there is only 1 type of brick but later there will be more types
            let thisBrick;
            switch (brick.str_BrickType) {
                case "L1":
                    thisBrick = new L1Brick(scene, brickLocation);
                    break;
            }
            this.a_GridArray.push(thisBrick);
        }
    }

    // Old method of making the grid, see Level.js
    // // !Temporarily set to make 11x6 grid 
    // // Called from constructor to load the level
    // #MakeBricks(m_Scene) {
    //     let nextBrickY = this.#vec3_GRID_START_LOCATION.y;
    //     for (let row = 0; row < 6; row++) {
    //         let nextBrickX = this.#vec3_GRID_START_LOCATION.x;
    //         for (let column = 0; column < 12; column++) {
    //             let location = [nextBrickX, nextBrickY];
    //             var thisBrick = new L1Brick(m_Scene, location);
    //             this.a_GridArray.push(thisBrick);
    //             nextBrickX += thisBrick.vec3_BOX_SIZE.x + 20;
    //         }            
    //         nextBrickY -= thisBrick.vec3_BOX_SIZE.y + 20;
    //     }   
    // }
}