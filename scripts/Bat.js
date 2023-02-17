import * as THREE from 'three';
import { KeyStates } from './Controls';

// Bat is what the player controls
export class Bat {
    #m_BatCuboid;
    #m_Speed;
    constructor(scene) {
        this.#m_Speed = 1;
        this.#MakeCuboid(scene);
    }

    // Called every frame from Game.js Update()
    Update(f_TimeSincePreviousFrame) {
        if (KeyStates.a) {
            this.#m_BatCuboid.translateX(-1 * f_TimeSincePreviousFrame * this.#m_Speed)
        }

        if (KeyStates.d) {
            this.#m_BatCuboid.translateX(f_TimeSincePreviousFrame * this.#m_Speed)
        }
    }

    #MakeCuboid(scene) {
        const geometry = new THREE.BoxGeometry(200, 40, 60);
        const texture = new THREE.MeshStandardMaterial({color: 0x808080});
        this.#m_BatCuboid = new THREE.Mesh(geometry, texture);
        this.#m_BatCuboid.position.set(960, 200, 0);
        scene.add(this.#m_BatCuboid);
    }
}