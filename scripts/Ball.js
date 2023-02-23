import * as THREE from 'three';

// Class for ball
export class Ball {
    #i_RADIUS;
    // Sphere, THREE.Mesh object
    #m_BallSphere;
    // Rotation in radians
    #f_Rotation;
    #f_Speed;
    // The grid object used for brick collision
    #m_Grid;

    constructor(scene, batLocation, grid) {
        this.#i_RADIUS = 30;
        // Facing up
        this.#f_Rotation = Math.PI / 2;
        this.#f_Speed = 0.5;
        this.#m_Grid = grid;

        this.#MakeBallSpehere(scene, batLocation);
    }

    // Called every frame from Game.Update()
    Update(f_TimeSincePreviousFrame) {
        this.#UpdateLocation(f_TimeSincePreviousFrame);
    }

    #UpdateLocation(f_TimeSincePreviousFrame) {
        // DeltaTime is always NaN on the first frame
        if (!f_TimeSincePreviousFrame) { return; }
        
        let translation = this.#CalculateTranslation(f_TimeSincePreviousFrame);

        // Updates sphere location
        this.#m_BallSphere.position.x += translation[0];
        this.#m_BallSphere.position.y += translation[1];        

        let collision = this.#CheckForCollision();
        if (!collision) {
            return;
        }
        else {
            // Undos movement of ball
            this.#m_BallSphere.position.x -= translation[0];
            this.#m_BallSphere.position.y -= translation[1];        
        }
    }

    // Calculates new location for sphere
    #CalculateTranslation(f_TimeSincePreviousFrame) {
        // Displaces angle so that rotation = 0 is facing up
        var f_Angle = this.#f_Rotation; 
        // Gets angle to work with (needs to be smaller than 90)
        while (f_Angle - Math.PI / 2 > 0) {
            f_Angle -= Math.PI / 2;
        }

        // Length of hypotenuse
        var f_hypotenuse = this.#f_Speed * f_TimeSincePreviousFrame;
        // Gets X change
        var f_XChange = Math.round(f_hypotenuse * Math.cos(f_Angle));
        // Gets Y change
        var f_YChange = Math.round(f_hypotenuse * Math.sin(f_Angle));
        return [f_XChange, f_YChange];
    }

    #CheckForCollision() {
        let collided = null;
        for (let row = 0; row < this.#m_Grid.a_GridArray.length; row++) {
            for (let brick = 0; brick < this.#m_Grid.a_GridArray[row].length; brick++) {
                if (this.#CollidesWith(this.#m_Grid.a_GridArray[row][brick])) {
                    collided = this.#m_Grid.a_GridArray[row][brick];
                    break;
                }
            }
            if (collided) {
                break;
            }
        }
        return collided;
    }

    // Called from foreach in UpdateLocation. Returns boolean. object is object3d from threejs
    #CollidesWith(brick) {
        // Checks distance from center of sphere to other objects, a lot like raycasting but more 2D
        // This is effectively 2D collision because the ball will never travel in the z axis so it can be ignored
         
        // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
        // Really smart way of doing it that can be applied here since the sphere never moves in the z axis so it can be treated as a 2d circle

        let circleDistance = new THREE.Vector2();

        circleDistance.x = Math.abs(this.#m_BallSphere.position.x - brick.m_Cube.position.x);
        circleDistance.y = Math.abs(this.#m_BallSphere.position.y - brick.m_Cube.position.y);
    
        if (circleDistance.x > (brick.vec3_BOX_SIZE.x/2 + this.#i_RADIUS)) { return false; }
        if (circleDistance.y > (brick.vec3_BOX_SIZE.y/2 + this.#i_RADIUS)) { return false; }
    
        if (circleDistance.x <= (brick.vec3_BOX_SIZE.x/2)) { return true; } 
        if (circleDistance.y <= (brick.vec3_BOX_SIZE.y/2)) { return true; }
    
        let cornerDistance_sq = (circleDistance.x - brick.vec3_BOX_SIZE.x/2)^2 + (circleDistance.y - brick.vec3_BOX_SIZE.y/2)^2;
    
        return (cornerDistance_sq <= (this.#i_RADIUS^2));
    }

    // Called once from constructor
    #MakeBallSpehere(scene, batLocation) {
        const geometry = new THREE.SphereGeometry(this.#i_RADIUS);
        const texture = new THREE.MeshStandardMaterial({color: 0x808080});
        this.#m_BallSphere = new THREE.Mesh(geometry, texture)
        this.#m_BallSphere.position.set(batLocation.x, batLocation.y + this.#i_RADIUS, batLocation.z);
        scene.add(this.#m_BallSphere);
    }
}