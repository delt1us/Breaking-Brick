import * as THREE from 'three';

// Brick superclass
class Brick {
    vec3_BOX_SIZE;
    m_Cube;
    _i_Health;
    constructor(m_Scene) {
        this.vec3_BOX_SIZE = new THREE.Vector3(120, 60, 60);
        // Health gets changed in every subclass
        this._i_Health = 999;

        var BrickColour = { color: 0x00ff00 };
        var BoxGeometry = new THREE.BoxGeometry(this.vec3_BOX_SIZE.x, this.vec3_BOX_SIZE.y, this.vec3_BOX_SIZE.z);
        var BoxMaterial = new THREE.MeshStandardMaterial(BrickColour);
        this.m_Cube = new THREE.Mesh(BoxGeometry, BoxMaterial);
        m_Scene.add(this.m_Cube);
    }

    // Called every frame from Grid.js
    Update() {
    }

    // Destroys the brick and removes it from the grid
    Destroy(grid, scene) {
        // Finds and removes brick from grid array 
        grid.splice(grid.indexOf(this), 1);
        scene.remove(this.m_Cube);
        this.m_Cube.geometry.dispose();
        this.m_Cube.material.dispose();
        this.m_Cube = undefined;
    }
}

// L1Brick has 1 health and does nothing special
export class L1Brick extends Brick {
    constructor(m_Scene, location) {
        super(m_Scene);
        this._i_Health = 1;
        // Moves brick to proper location on grid
        this.m_Cube.position.set(location[0], location[1], 0);
        // Sets colour of L1Brick to purple
        // !To get more colours, change hue for this 
        var BrickColour = { color: 0x89a9ff };
        this.m_Cube.material = new THREE.MeshStandardMaterial(BrickColour);
    }
}