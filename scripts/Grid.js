import * as THREE from 'three';
import { LoaderUtils, Vector3 } from "three";
import { Brick } from './Brick';

// Grid that will be used to hold bricks
export class Grid {
    a_GridArray;
    #vec3_GRID_START_LOCATION;
    #d_Textures;
    constructor(m_Scene) {
        this.#vec3_GRID_START_LOCATION = new Vector3(190, 980, 0)
        this.a_GridArray = [];
        this.#LoadColours();
    }

    // Called every frame from Game.js
    Update() {
        // Updates all bricks
        this.a_GridArray.forEach(brick => brick.Update());
    }

    // Called from constructor, loads colours for bricks
    #LoadColours() {
        this.#d_Textures = {
            "Blue": new THREE.MeshStandardMaterial({ color: 0x89a9ff }),
            "Pink": new THREE.MeshStandardMaterial({ color: 0xE589FF }),
            "Lime": new THREE.MeshStandardMaterial({ color: 0xA3FF89 }),
            "Green": new THREE.MeshMatcapMaterial({ color: 0x89FFBA }),
            "Purple": new THREE.MeshStandardMaterial({ color: 0x898DFF }),
            "Hot Pink": new THREE.MeshStandardMaterial({ color: 0xFF89B3 }),
            "Yellow": new THREE.MeshStandardMaterial({ color: 0xFFED89 }),
            "Orange": new THREE.MeshStandardMaterial({ color: 0xFF834B }),
            "Grey": new THREE.MeshStandardMaterial({ color: 0x808080 }),
            "White": new THREE.MeshStandardMaterial({ color: 0xffffff })
        };
    }

    // Loads bricks in Level object as actual Brick objects
    LoadLevel(scene, level) {
        for (let index = 0; index < level.a_Bricks.length; index++) {
            let brick = level.a_Bricks[index];
            let brickLocation = [this.#vec3_GRID_START_LOCATION.x + brick.vec_GridLocation.x * 140, this.#vec3_GRID_START_LOCATION.y - brick.vec_GridLocation.y * 80];
            this.a_GridArray.push(new Brick(scene, brickLocation, this.#d_Textures, brick.i_Health));
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