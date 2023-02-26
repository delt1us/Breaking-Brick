import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KeyStates } from './Controls';

// Class for ball
export class Ball {
    #i_RADIUS;
    // Sphere, THREE.Mesh object
    m_BallSphere;
    // How fast the ball goes
    #f_Speed;
    // How fast the ball is going in each direction
    #vec_Velocity;
    // Boolean for if the ball has left the bat yet or not
    #b_Launched;
    // The grid object used for brick collision
    #m_Grid;
    #m_Scene;
    // Frame used for wall collision
    #m_Frame;
    // Bat used for bat collision
    #m_Bat;
    // Timer that needs to be started/stopped
    #m_Timer;

    // Score value 
    #m_ScoreCounter;

    #b_LivesHidden;
    b_Simulation;
    // Image for lives (hearts)
    #m_LivesImage;
    // Internal value for lives 
    #i_LivesInternal;
    // Prevents forgetting to update lives display whenever lives is changed
    set #i_Lives(newValue) {
        this.#i_LivesInternal = newValue;
        this.#UpdateLivesDisplay();
    }

    get #i_Lives() {
        return this.#i_LivesInternal;
    }

    constructor(scene, grid, frame, bat, timer, scoreCounter) {
        this.#i_RADIUS = 15;
        this.#f_Speed = 0.75;
        this.#vec_Velocity = new THREE.Vector3(0, 0, 0);
        this.#m_Grid = grid;
        this.#m_Scene = scene;
        this.#m_Frame = frame;
        this.#m_Bat = bat;
        this.#m_Timer = timer;
        this.#m_ScoreCounter = scoreCounter;
        this.#i_LivesInternal = 3;
        this.#b_Launched = false;
        this.#b_LivesHidden = false;
        this.b_Simulation = false;

        //this.#LoadBallModel();
        this.#LoadImage();
        this.#UpdateLivesDisplay();
        this.#MakeBallSpehere(scene);
        this.#ResetBallLocation();
    }

    HideLives() {
        this.#b_LivesHidden = true;
        this.#UpdateLivesDisplay();
    }

    // Loads image, called once from constructor 
    #LoadImage() {
        this.#m_LivesImage = document.createElement("img");
        // SetAttribute is faster than setting them manually
        this.#m_LivesImage.setAttribute("src", "textures/lives.png");
        this.#m_LivesImage.setAttribute("width", "72");
        this.#m_LivesImage.setAttribute("height", "60");
    }

    // Updates life display, called whenever lives are changed 
    #UpdateLivesDisplay() {
        let div = document.getElementById("lives");

        // Removes all lives from the list
        while (div.hasChildNodes()) {
            div.removeChild(div.children[0]);
        }

        if (!this.#b_LivesHidden) {
            // Adds correct number of lives to list
            for (let index = 0; index < this.#i_Lives; index++) {
                div.appendChild(this.#m_LivesImage.cloneNode(true));
            }
        }
    }

    // Loads a rocket league ball 3d model
    #LoadBallModel() {
        // Copied from three js docs
        let loader = new GLTFLoader();
        loader.load('models/ball.glb', (glb) => {
            this.m_BallSphere = glb.scene;
        });
        // End of copied code
    }

    // Called every frame from Game.Update()
    Update(f_DeltaTime) {
        // If ball is waiting to be launched and spacebar is pressed it will launch the ball
        if (KeyStates.space && !this.#b_Launched) {
            this.#LaunchBall();
        }
        
        // If ball is not in the frame then it removes a life and resets the ball
        if (!this.#CheckInFrame()) {
            this.#RemoveLife();
        }

        this.#UpdateLocation(f_DeltaTime);
        this.#HandleCollisions();
    }

    // Called when ball leaves the screen
    #RemoveLife() {
        this.#i_Lives -= 1;
        this.#ResetBallLocation();
        this.#ResetBallVelocity();
        this.#b_Launched = false;
        this.#m_Timer.Stop();
    }

    // Called from RemoveLife
    #ResetBallVelocity() {
        this.#vec_Velocity.x = 0;
        this.#vec_Velocity.y = 0;
    }

    // TODO allow player to aim ball when launching it
    // Called when player presses spacebar from Update()
    #LaunchBall() {
        this.#vec_Velocity.y = this.#f_Speed;
        this.#b_Launched = true;
        this.#m_Bat.b_CanMove = true;
        this.#m_Timer.Start();
    }

    LaunchBallAtRandomAngle() {
        this.#LaunchBall();
        this.#m_Bat.b_CanMove = false;
        let percentageOfBatBeforeLandingLocation = Math.random() * 2;
        let angleToBounceAt = -1 * Math.PI * 0.5 * percentageOfBatBeforeLandingLocation;
        this.#vec_Velocity.x = this.#f_Speed * Math.cos(angleToBounceAt);
        this.#vec_Velocity.y = this.#f_Speed * Math.sin(angleToBounceAt);
    }

    // Determines if ball is in frame or not
    #CheckInFrame() {
        if (this.m_BallSphere.position.y < 0) {
            return false;
        }
        else {
            return true;
        }
    }

    // Updates location, called from Update
    #UpdateLocation(f_DeltaTime) {
        // DeltaTime is always NaN on the first frame
        if (!f_DeltaTime || !this.#b_Launched) { return; }

        // Updates sphere location
        // Annoying that this is so long because position is readonly. If it wasn't you could just add the vectors 
        this.m_BallSphere.position.set(
            this.m_BallSphere.position.x + this.#vec_Velocity.x * this.#f_Speed * f_DeltaTime,
            this.m_BallSphere.position.y + this.#vec_Velocity.y * this.#f_Speed * f_DeltaTime,
            this.m_BallSphere.position.z + this.#vec_Velocity.z * this.#f_Speed * f_DeltaTime
        );
    }

    // Called from UpdateLocation
    #BounceOffBrick(objectCollidedWith, objectSize) {
        // Needs improvement, ball doesn't bounce properly off of edges. Would take too long for me to figure out so it's only if I have too much time
        // If object is above or below
        if (objectCollidedWith.position.y - objectSize.y / 2 > this.m_BallSphere.position.y || objectCollidedWith.position.y + objectSize.y / 2 < this.m_BallSphere.position.y) {
            this.#vec_Velocity.y *= -1;
        }
        else {
            this.#vec_Velocity.x *= -1;
        }
    }

    // Deals with all collision detection and handling
    #HandleCollisions() {
        // TODO: change so that the ball will travel the correct distance in frames where it bounces
        // Brick collision
        let collision = this.#CheckBrickCollision();
        // If collision happened
        if (collision) {
            // Destroys brick what was hit
            this.#BounceOffBrick(collision.m_Cube, collision.vec3_BOX_SIZE);
            collision.Hit(this.#m_Grid.a_GridArray, this.#m_Scene, this.#m_ScoreCounter);
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
        let ballLandingRelativeToBat = this.m_BallSphere.position.x - this.#m_Bat.m_BatCuboid.position.x;
        
        if (this.b_Simulation) {
            this.#vec_Velocity.y *= -1;
            return;
        }

        let percentageOfBatBeforeLandingLocation = ballLandingRelativeToBat / this.#m_Bat.vec_BoundingBoxSize.x;
        let angleToBounceAt = -1 * Math.PI * 0.5 * percentageOfBatBeforeLandingLocation;
        // Offsets 0 pointing east
        angleToBounceAt += Math.PI * 0.5;
        this.#vec_Velocity.x = this.#f_Speed * Math.cos(angleToBounceAt);
        this.#vec_Velocity.y = this.#f_Speed * Math.sin(angleToBounceAt);
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

        circleDistance.x = Math.abs(this.m_BallSphere.position.x - object3d.position.x);
        circleDistance.y = Math.abs(this.m_BallSphere.position.y - object3d.position.y);

        if (circleDistance.x > (objectSize.x / 2 + this.#i_RADIUS)) { return false; }
        if (circleDistance.y > (objectSize.y / 2 + this.#i_RADIUS)) { return false; }

        if (circleDistance.x <= (objectSize.x / 2)) { return true; }
        if (circleDistance.y <= (objectSize.y / 2)) { return true; }

        let cornerDistance_sq = (circleDistance.x - objectSize.x / 2) ^ 2 + (circleDistance.y - objectSize.y / 2) ^ 2;

        return (cornerDistance_sq <= (this.#i_RADIUS ^ 2));
    }

    // Resets ball location to the bat
    #ResetBallLocation() {
        this.#m_Bat.Reset();
        let batLocation = structuredClone(this.#m_Bat.m_BatCuboid.position);
        batLocation.y += this.#m_Bat.vec_BoundingBoxSize.y / 2;
        this.m_BallSphere.position.set(batLocation.x, batLocation.y + this.#i_RADIUS, batLocation.z);
        this.#m_Bat.b_CanMove = false;
    }

    // Called once from constructor
    #MakeBallSpehere(scene) {
        const geometry = new THREE.SphereGeometry(this.#i_RADIUS);
        const texture = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.m_BallSphere = new THREE.Mesh(geometry, texture)
        scene.add(this.m_BallSphere);
    }
}