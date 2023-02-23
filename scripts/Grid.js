import { Vector3 } from "three";
import { L1Brick } from "./Brick.js";

// Grid that will be used to hold bricks
export class Grid {
    a_GridArray;
    #vec3_GRID_START_LOCATION;
    constructor(m_Scene) {
        this.#vec3_GRID_START_LOCATION = new Vector3(350, 795, 0)
        this.a_GridArray = [];
        this.#MakeBricks(m_Scene);
    }

    // Called every frame from Game.js
    Update() {
        // Updates all bricks
        this.a_GridArray.forEach(brick => brick.Update());
    }

    // !Temporarily set to make a 13x4 grid of l1 bricks
    #MakeBricks(m_Scene) {
        var nextBrickY = this.#vec3_GRID_START_LOCATION.y;
        for (var row = 0; row < 4; row++) {
            var nextBrickX = this.#vec3_GRID_START_LOCATION.x;
            for (var column = 0; column < 10; column++) {
                // Make location work
                var location = [nextBrickX, nextBrickY];
                var thisBrick = new L1Brick(m_Scene, location);
                this.a_GridArray.push(thisBrick);
                nextBrickX += thisBrick.vec3_BOX_SIZE.x + 15;
            }
            nextBrickY -= thisBrick.vec3_BOX_SIZE.y + 15;
        }
    }
}