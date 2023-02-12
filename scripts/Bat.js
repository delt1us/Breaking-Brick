import * as THREE from 'three';

// Bat is what the player controls
export class Bat {
    #m_BatCuboid;
    constructor(scene) {
        this.#MakeCuboid(scene);
    }

    // Called every frame from Game.js Update()
    Update() {

    }

    #MakeCuboid(scene) {
        const geometry = new THREE.BoxGeometry(200, 40, 60);
        const texture = new THREE.MeshStandardMaterial({color: 0x808080});
        this.#m_BatCuboid = new THREE.Mesh(geometry, texture);
        this.#m_BatCuboid.position.set(960, 200, 0);
        scene.add(this.#m_BatCuboid);
    }
}