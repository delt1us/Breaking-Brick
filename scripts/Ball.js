import * as THREE from 'three';

// Class for ball
export class Ball {
    // Sphere, THREE.Mesh object
    #m_BallSphere;
    // Rotation in radians
    #f_Rotation;
    #f_Speed;

    constructor(scene, batLocation) {
        // Facing up
        this.#f_Rotation = Math.PI / 2;
        this.#f_Speed = 0.5;

        this.#MakeBallSpehere(scene, batLocation);
    }

    // Called every frame from Game.Update()
    Update(f_TimeSincePreviousFrame) {
        this.#UpdateLocation(f_TimeSincePreviousFrame);
    }

    #UpdateLocation(f_TimeSincePreviousFrame) {
        // DeltaTime is always NaN on the first frame
        if (!f_TimeSincePreviousFrame) { return; }

        // Displaces angle so that rotation = 0 is facing up
        var f_Angle = this.#f_Rotation; 
        // Gets angle to work with (needs to be smaller than 90)
        while (f_Angle - Math.PI / 2 > 0) {
            f_Angle -= Math.PI / 2;
        }

        // Length of hypotenuse
        var f_hypotenuse = this.#f_Speed * f_TimeSincePreviousFrame;
        // Gets Y change
        var f_YChange = Math.round(f_hypotenuse * Math.sin(f_Angle));
        // Gets X change
        var f_XChange = Math.round(f_hypotenuse * Math.cos(f_Angle));

        // Updates sphere location
        this.#m_BallSphere.position.x += f_XChange;
        this.#m_BallSphere.position.y += f_YChange;        
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