import * as THREE from 'three';

// Class for ball
export class Ball {
    #m_BallSphere;

    constructor(scene, batLocation) {
        this.#MakeBallSpehere(scene, batLocation);
    }

    // Called every frame from Game.Update()
    Update(f_TimeSincePreviousFrame) {

    }

    // Called once from constructor
    #MakeBallSpehere(scene, batLocation) {
        const radius = 30;
        const geometry = new THREE.SphereGeometry(radius);
        const texture = new THREE.MeshStandardMaterial({color: 0x808080});
        this.#m_BallSphere = new THREE.Mesh(geometry, texture)
        this.#m_BallSphere.position.set(batLocation.x, batLocation.y + radius, batLocation.z);
        scene.add(this.#m_BallSphere);
    }
}