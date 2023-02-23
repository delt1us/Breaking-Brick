import * as THREE from 'three';

// Class for ball
export class Ball {
    #i_RADIUS;
    // Sphere, THREE.Mesh object
    #m_BallSphere;
    // Rotation in radians
    #f_Rotation;
    #f_Speed;
    #vec_Velocity;
    // The grid object used for brick collision
    #m_Grid;
    #m_Scene;
    #m_Frame;
    #m_Bat;

    constructor(scene, batLocation, grid, frame, bat) {
        this.#i_RADIUS = 20;
        // Facing up
        this.#f_Rotation = Math.PI / 2;
        this.#f_Speed = 0.5;
        this.#vec_Velocity = new THREE.Vector3(0, 1, 0);
        this.#m_Grid = grid;
        this.#m_Scene = scene;
        this.#m_Frame = frame;
        this.#m_Bat = bat;

        this.#MakeBallSpehere(scene, batLocation);
    }

    // Called every frame from Game.Update()
    Update(f_TimeSincePreviousFrame) {
        this.#UpdateLocation(f_TimeSincePreviousFrame);
    }

    #UpdateLocation(f_TimeSincePreviousFrame) {
        // DeltaTime is always NaN on the first frame
        if (!f_TimeSincePreviousFrame) { return; }
        
        // Updates sphere location
        // Annoying that this is so long because position is readonly. If it wasn't you could just add the vectors 
        this.#m_BallSphere.position.set(
            this.#m_BallSphere.position.x + this.#vec_Velocity.x * this.#f_Speed * f_TimeSincePreviousFrame,
            this.#m_BallSphere.position.y + this.#vec_Velocity.y * this.#f_Speed * f_TimeSincePreviousFrame, 
            this.#m_BallSphere.position.z + this.#vec_Velocity.z * this.#f_Speed * f_TimeSincePreviousFrame
        );

        this.#HandleCollisions();
    }
    
    // Called from UpdateLocation
    #BounceOffBrick(objectCollidedWith, objectSize) {
        // If object is above or below
        if (objectCollidedWith.position.y - objectSize.y / 2 > this.#m_BallSphere.position.y || objectCollidedWith.position.y + objectSize.y / 2 < this.#m_BallSphere.position.y) {
            this.#vec_Velocity.y *= -1;
        }
        else {
            this.#vec_Velocity.x *= -1;
        }
    }
    
    #HandleCollisions() {
        // TODO: change so that the ball will travel the correct distance in frames where it bounces
        // Brick collision
        let collision = this.#CheckBrickCollision();
        // If collision happened
        if (collision) {
            // Destroys brick what was hit
            this.#BounceOffBrick(collision.m_Cube, collision.vec3_BOX_SIZE);
            collision.Destroy(this.#m_Grid.a_GridArray, this.#m_Scene);
        }
    
        // Wall collision
        this.#HandleWallCollision();
        // Bat collision
        if (this.#CollidesWith(this.#m_Bat.m_BatCuboid, this.#m_Bat.vec_BoundingBoxSize)) {
            console.log("Bat hit");
            this.#HandleBatCollision();
        }
    }
    
    // Called from UpdateLocation
    #HandleWallCollision() {
        // Checks each wall in m_Frame
        // Top wall
        if (this.#CollidesWith(this.#m_Frame.m_WallTop, this.#m_Frame.vec_WallTopSize)) {
            this.#vec_Velocity.y *= -1;
        }
        // Side walls
        else if (this.#CollidesWith(this.#m_Frame.m_WallRight, this.#m_Frame.vec_WallSideSize) || this.#CollidesWith(this.#m_Frame.m_WallLeft, this.#m_Frame.vec_WallSideSize)) {
            this.#vec_Velocity.x *= -1;
        }
    }

    // Called from UpdateLocation
    #HandleBatCollision() {
        /*
        Ball bounce angle is determined based on where it landed on the bat
        It can bounce at an angle of 90 degrees centred at the middle of the bat (45 degrees on each side of the normal to the bat)
        */
        let ballLandingRelativeToBat = this.#m_BallSphere.position.x - this.#m_Bat.m_BatCuboid.position.x;
        let percentageOfBatBeforeLandingLocation = ballLandingRelativeToBat / this.#m_Bat.vec_BoundingBoxSize.x;
        let angleToBounceAt = -1 * Math.PI * 0.5 * percentageOfBatBeforeLandingLocation;
        // Offsets 0 pointing east
        angleToBounceAt += Math.PI * 0.5;
        this.#vec_Velocity.x = Math.cos(angleToBounceAt);
        this.#vec_Velocity.y = Math.sin(angleToBounceAt);
    }

    // Called from UpdateLocation
    #CheckBrickCollision() {
        let collided = null;
        for (let index = 0; index < this.#m_Grid.a_GridArray.length; index++) {
            if (this.#CollidesWith(this.#m_Grid.a_GridArray[index].m_Cube, this.#m_Grid.a_GridArray[index].vec3_BOX_SIZE)) {
                collided = this.#m_Grid.a_GridArray[index];
                break;
            }
            if (collided) {
                break;
            }
        }
        return collided;
    }

    // Called from CheckCollisions. Returns boolean. object is object3d from threejs
    #CollidesWith(object3d, objectSize) {
        // Checks distance from center of sphere to other objects, a lot like raycasting but more 2D
        // This is effectively 2D collision because the ball will never travel in the z axis so it can be ignored
         
        // https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
        // Really smart way of doing it that can be applied here since the sphere never moves in the z axis so it can be treated as a 2d circle
        let circleDistance = new THREE.Vector2();

        circleDistance.x = Math.abs(this.#m_BallSphere.position.x - object3d.position.x);
        circleDistance.y = Math.abs(this.#m_BallSphere.position.y - object3d.position.y);
    
        if (circleDistance.x > (objectSize.x/2 + this.#i_RADIUS)) { return false; }
        if (circleDistance.y > (objectSize.y/2 + this.#i_RADIUS)) { return false; }
    
        if (circleDistance.x <= (objectSize.x/2)) { return true; } 
        if (circleDistance.y <= (objectSize.y/2)) { return true; }
    
        let cornerDistance_sq = (circleDistance.x - objectSize.x/2)^2 + (circleDistance.y - objectSize.y/2)^2;
    
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