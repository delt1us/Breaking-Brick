import { Grid } from './Grid.js'
import { Bat } from './Bat';
import { Frame } from './Frame.js';
import { Ball } from './Ball.js';
import { Timer } from './Timer.js';
import { ScoreCounter } from './Score.js';

class Scene {
    constructor() {

    }
    
    Update(timeNow) { 

    }

    Draw() {

    }
}

export class SceneGame extends Scene {
    // Grid object 
    #m_Grid;
    // Bat object
    #m_Bat;
    // Ball object
    #m_Ball;
    // Frame object
    #m_Frame;
    // Timer object 
    #m_Timer;
    #m_ScoreCounter;
    #m_Level;
    #f_DeltaTime;

    // Threejs scene object passed in as argument
    #m_Scene

    constructor(level, scene) {
        super();
        this.#m_Scene = scene;
        this.#Initialize(level);
    }
    
    // Run every frame
    Update(deltaTime) {
        this.#f_DeltaTime = deltaTime;

        this.#m_Bat.Update(this.#f_DeltaTime);
        this.#m_Ball.Update(this.#f_DeltaTime);

        this.#m_Grid.Update();
        this.#m_Timer.Update(this.#f_DeltaTime);
        this.#m_ScoreCounter.Update();
    }
    
    // Run once from constructor
    #Initialize(level) {
        this.#m_Level = level;
        
        this.#m_Grid = new Grid(this.#m_Scene);
        this.#m_Grid.LoadLevel(this.#m_Scene, this.#m_Level);
        
        this.#m_Bat = new Bat(this.#m_Scene);
        this.#m_Frame = new Frame(this.#m_Scene);
        this.#m_Timer = new Timer("timer");    
        this.#m_ScoreCounter = new ScoreCounter("score");
        
        this.#m_Ball = new Ball(this.#m_Scene, this.#m_Grid, this.#m_Frame, this.#m_Bat, this.#m_Timer, this.#m_ScoreCounter);
    }
}