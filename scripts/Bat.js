import * as THREE from 'three';
import { KeyStates } from './Controls';

// Bat is what the player controls
export class Bat {
    // THREE.Mesh object
    m_BatCuboid;
    // THREE.Box3 object
    #m_BoundingBox;
    // Vector3
    vec_BoundingBoxSize;
    #f_Speed;

    constructor(scene) {
        this.#f_Speed = 1;
        this.#MakeCuboid(scene);
    }

    // Called every frame from Game.js Update()
    Update(f_TimeSincePreviousFrame) {
        this.#UpdateLocation(f_TimeSincePreviousFrame);
    }
    
    // Called every frame from Update
    #UpdateLocation(f_TimeSincePreviousFrame) {
        if (KeyStates.a) {
            this.m_BatCuboid.translateX(-1 * f_TimeSincePreviousFrame * this.#f_Speed);

            // Checks if bat is on edge of map
            if (this.m_BatCuboid.position.x <= 100 + this.vec_BoundingBoxSize.x / 2) {
                this.m_BatCuboid.position.x = 100 + this.vec_BoundingBoxSize.x / 2;
            }
        }
    
        if (KeyStates.d) {
            this.m_BatCuboid.translateX(f_TimeSincePreviousFrame * this.#f_Speed);
            
            // Checks if bat is on edge of map
            if (this.m_BatCuboid.position.x >= 1820 - this.vec_BoundingBoxSize.x / 2) {
                this.m_BatCuboid.position.x = 1820 - this.vec_BoundingBoxSize.x / 2;
            }
        }
    }

    // Used whenever the size of the bat is changed 
    #UpdateBoundingBoxSize() { 
        this.#m_BoundingBox.getSize(this.vec_BoundingBoxSize);
    }
    
    #MakeCuboid(scene) {
        const geometry = new THREE.BoxGeometry(200, 40, 40);
        const texture = new THREE.MeshStandardMaterial({color: 0x89a9ff});
        this.m_BatCuboid = new THREE.Mesh(geometry, texture);
        this.m_BatCuboid.position.set(960, 200, 0);
        scene.add(this.m_BatCuboid);
        
        // Bounding box
        this.#m_BoundingBox = new THREE.Box3();
        this.#m_BoundingBox.setFromObject(this.m_BatCuboid);
        this.vec_BoundingBoxSize = new THREE.Vector3(); 
        this.#UpdateBoundingBoxSize();
    }
}