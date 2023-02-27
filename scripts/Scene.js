import * as THREE from 'three';
import { Grid } from './Grid.js'
import { Bat } from './Bat';
import { Frame } from './Frame.js';
import { Ball } from './Ball.js';
import { Timer } from './Timer.js';
import { ScoreCounter } from './Score.js';

export const m_SELECTED_LEVEL = {
    level: 0
};

// Used to convert index into number for css class ids in level select scene
function toWord (integer) {
    let string;
    switch (integer){
        case 1:
            string = "one";
            break;
        case 2:
            string = "two";
            break;
        case 3: 
            string = "three";
            break;
        case 4:
            string = "four";
            break;
        case 5:
            string = "five";
            break;
        case 6:
            string = "six"; 
            break;
    }
    return string;
}

class Scene {
    // Threejs scene
    _m_Scene;
    // Threejs Camera
    _m_Camera;
    // Threejs PointLight object
    _m_Light;
    // Threejs AmbientLight object
    _m_AmbientLight;
    // Threejs Renderer obejct
    _m_Renderer;
    // Threejs Camera object
    _vec3_CameraPosition;

    // Helpers 
    _m_LightHelper;
    _m_GridHelper;
    _m_Controls;

    constructor() {
    }

    Update(timeNow) { 

    }

    Draw() {
    }

    _SetupThree(canvasID) {
        this._SetupScene();
        this._SetupRenderer(canvasID);
        this._SetupCamera();   
        this._SetupLighting();
    }

    // Run once from constructor
    _SetupCamera() {
        // https://stackoverflow.com/questions/14614252/how-to-fit-camera-to-object
        var width = 1920;
        var dist = 1100;
        var aspect = 1920 / 1080;
        // var fov = 2 * Math.atan( height / ( 2 * dist ) ) * ( 180 / Math.PI );
        var fov = 2 * Math.atan((width / aspect) / (2 * dist)) * (180 / Math.PI) + 7;

        // Camera
        this._m_Camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 10000);
        this._vec3_CameraPosition = new THREE.Vector3(960, 620, dist - 200);
        this._m_Camera.position.set(this._vec3_CameraPosition.x, this._vec3_CameraPosition.y, this._vec3_CameraPosition.z);
    }

    // Called from constructor
    _SetupLighting() {
        // Lighting
        this._m_Light = new THREE.PointLight(0xbbbbbb);
        this._m_Light.position.set(this._m_Camera.position.x, this._m_Camera.position.y, this._m_Camera.position.z + 5);
        this._m_AmbientLight = new THREE.AmbientLight(0x909090);
        this._m_Scene.add(this._m_Light, this._m_AmbientLight);
    }

    // Run once from constructor
    _SetupScene() {
        this._m_Scene = new THREE.Scene();
    }

    // Run once from constructor
    _SetupRenderer(canvasID) {
        this._m_Canvas = document.getElementById(canvasID);
        // Renderer
        this._m_Renderer = new THREE.WebGLRenderer({
            canvas: this._m_Canvas,
        });
        // Adds renderer to the html document
        document.body.appendChild(this._m_Renderer.domElement);
        this._m_Canvas.width = window.innerWidth;
        this._m_Canvas.height = window.innerHeight;
        this._m_Renderer.setSize(this._m_Canvas.width, this._m_Canvas.height);
    }

    // Run once from constructor
    _SetupHelpers() {
        // Light helper shows where the light is
        this._m_LightHelper = new THREE.PointLightHelper(this._m_Light);
        // Draws 2D grid 
        this._m_GridHelper = new THREE.GridHelper(200, 50);
        this._m_Scene.add(this._m_LightHelper, this._m_GridHelper);

        // OrbitControls messes with camera movement, only enable this if necessary
        this._m_Controls = new OrbitControls(this._m_Camera, this._m_Renderer.domElement);
    }
}

export class SceneGame extends Scene {
    // Threejs Renderer
    // Grid object 
    _m_Grid;
    // Bat object
    _m_Bat;
    // Ball object
    m_Ball;
    // Frame object
    _m_Frame;
    // Timer object 
    _m_Timer;
    _m_ScoreCounter;
    _m_Level;
    _f_DeltaTime;
    _m_Canvas;

    constructor(canvasID, level) {
        super();
        this._m_Canvas;
        this._m_Level = level;
        this._SetupThree(canvasID);
        this.#Initialize();
    }
    
    // Run every frame
    Update(deltaTime) {
        this._f_DeltaTime = deltaTime;

        this._m_Bat.Update(this._f_DeltaTime);
        this.m_Ball.Update(this._f_DeltaTime);

        this._m_Grid.Update();
        this._m_Timer.Update(this._f_DeltaTime);
    }

    Enable() {
        document.getElementById("gameui").style.display = "block";
        document.getElementById("gameCanvas").style.display = "block";
        this.LoadLevel();
        this._m_ScoreCounter.UpdateDiv();
    }

    Disable() {
        document.getElementById("gameui").style.display = "none";
        document.getElementById("gameCanvas").style.display = "none";
    }

    Draw() {
        this._m_Renderer.render(this._m_Scene, this._m_Camera);
    }

    GetCamera() {
        return this._m_Camera;
    }

    LoadLevel() {
        this._m_Grid.LoadLevel(this._m_Scene, this._m_Level);
    }

    // Run once from constructor
    #Initialize() {
        this._m_Grid = new Grid(this._m_Scene);
        
        this._m_Bat = new Bat(this._m_Scene);
        this._m_Frame = new Frame(this._m_Scene);
        this._m_Timer = new Timer("timer");    
        this._m_ScoreCounter = new ScoreCounter("score");
        
        this.m_Ball = new Ball(this._m_Scene, this._m_Grid, this._m_Frame, this._m_Bat, this._m_Timer, this._m_ScoreCounter);
    }
}

export class SceneMainMenu extends SceneGame {
    constructor(level, canvasID) {
        super(canvasID, level);
        this.LoadLevel();
        this.m_Ball.b_Simulation = true;
    }
    
    Update(deltaTime) {
        this._m_Bat.m_BatCuboid.position.x = this.m_Ball.m_BallSphere.position.x;
        super.Update(deltaTime);
    }
    
    Disable() {
        this.#Hide();
    }

    Enable() {
        this.#Unhide();
        this.#HideUI();
    }
   
    // Run once from constructor
    _SetupRenderer(canvasID) {
        this._m_Canvas = document.getElementById(canvasID);
   
        this._m_Canvas.setAttribute("width", "1200px");
        this._m_Canvas.setAttribute("height", "675px");
        
        // Renderer
        this._m_Renderer = new THREE.WebGLRenderer({
            canvas: this._m_Canvas,
        });
        // Adds renderer to the html document
        document.body.appendChild(this._m_Renderer.domElement);
    }

    #HideUI() {
        document.getElementById("gameui").style.display = "none";
    }

    #Hide() {
        document.getElementById("mainmenu").style.display = "none";
        document.getElementById("mainMenuCanvas").style.display = "none";
    }
    
    #Unhide() {
        document.getElementById("mainmenu").style.display = "block";
        document.getElementById("mainMenuCanvas").style.display = "block";
    }
}

export class SceneSettingsMenu extends Scene {
    constructor() {
        super();
    }
}

export class SceneLevelSelect extends Scene {
    #a_Grid;
    constructor() {
        super();

        // Make a 5 row grid (1 for each season)
        // Add each level name as a breaking bad episode
        // Add html object for each level 
        // Group them by season
        // Change colours based on seasons
        this.#MakeGrid();
        // Starts off disabled
        this.Disable();
    }

    Enable() {
        document.getElementById("levelselect").style.display = "block";
    }

    Disable() {
        document.getElementById("levelselect").style.display = "none";
    }

    #MakeGrid() {
        let season1 = [
            {
                Name: "Pilot",
                Abbreviation: "Pi"},
            {
                Name: "The Cat's in the Bag",  
                Abbreviation: "Cb"},
            {
                Name: "And the Bag's in the River",
                Abbreviation: "Br"},
            {
                Name: "Cancer Man",
                Abbreviation: "Cm"},
            {
                Name: "Gray Matter",
                Abbreviation: "Gm"},
            {
                Name: "Crazy Handful of Nothin'",
                Abbreviation: "Ch"},
            {
                Name: "A No-Rough-Stuff-Type Deal",
                Abbreviation: "Nr"},
        ];

        let season2 = [
            {
                Name: "Seven Thirty-Seven",
                Abbreviation: "Sv"},
            {
                Name: "Grilled",
                Abbreviation: "G"},
            {
                Name: "Bit by a Dead Bee",
                Abbreviation: "Bb"},
            {
                Name: "Down",
                Abbreviation: "Dn"},
            {
                Name: "Breakage",
                Abbreviation: "Bk"},
            {
                Name: "Peekaboo",
                Abbreviation: "Pkb"},
            {
                Name: "Negro y Azul",
                Abbreviation: "Na"},
            {
                Name: "Better Call Saul",
                Abbreviation: "Bcs"},
            {
                Name: "4 Days Out",
                Abbreviation: "Do"},
            {
                Name: "Over",
                Abbreviation: "O"},
            {
                Name: "Mandala",
                Abbreviation: "M"},
            {
                Name: "Phoenix",
                Abbreviation: "P"},
            {
                Name: "ABQ",
                Abbreviation: "Abq"},
        ];

        let season3 = [
            {
                Name: "No Mas",
                Abbreviation: "Nm"},
            {
                Name: "Caballo Sin Nombre",
                Abbreviation: "Cn"},
            {
                Name: "I.F.T",
                Abbreviation: "If"},
            {
                Name: "Green Light",
                Abbreviation: "Gl"},
            {
                Name: "Mas",
                Abbreviation: "Ma"},
            {
                Name: "Sunset",
                Abbreviation: "S"},
            {
                Name: "One Minute",
                Abbreviation: "Om"},
            {
                Name: "I See You",
                Abbreviation: "Icu"},
            {
                Name: "Kafkaesque",
                Abbreviation: "K"},
            {
                Name: "Fly",
                Abbreviation: "F"},
            {
                Name: "Abiquiu",
                Abbreviation: "Ab"},
            {
                Name: "Half Measures",
                Abbreviation: "Hm"},
            {
                Name: "Full Measure",
                Abbreviation: "Fm"},
        ];

        let season4 = [
            {
                Name: "Box Cutter",
                Abbreviation: "Bc"},
            {
                Name: "Thirty-Eight Snub",
                Abbreviation: "Ts"},
            {
                Name: "Open House",
                Abbreviation: "Oh"},
            {
                Name: "Bullet Points",
                Abbreviation: "Bp"},
            {
                Name: "Shotgun",
                Abbreviation: "Sg"},
            {
                Name: "Cornered",
                Abbreviation: "C"},
            {
                Name: "Problem Dog",
                Abbreviation: "Pd"},
            {
                Name: "Hermanos",
                Abbreviation: "H"},
            {
                Name: "Bug",
                Abbreviation: "B"},
            {
                Name: "Salud",
                Abbreviation: "Sa"},
            {
                Name: "Crawl Space",
                Abbreviation: "Cs"},
            {
                Name: "End Times",
                Abbreviation: "Et"},
            {
                Name: "Face Off",
                Abbreviation: "Fo"},
        ];

        let season5 = [
            {
                Name: "Live Free or Die",
                Abbreviation: "Lfd"},
            {
                Name: "Madrigal",
                Abbreviation: "Ml"},
            {
                Name: "Hazard Pay",
                Abbreviation: "Hp"},
            {
                Name: "Fifty One",
                Abbreviation: "Fio"},
            {
                Name: "Dead Freight",
                Abbreviation: "Df"},
            {
                Name: "Buyout",
                Abbreviation: "Bo"},
            {
                Name: "Say My Name",
                Abbreviation: "Smn"},
            {
                Name: "Gliding Over All",
                Abbreviation: "Go"},
            {
                Name: "Blood Money",
                Abbreviation: "Blm"},
            {
                Name: "Buried",
                Abbreviation: "Bu"},
            {
                Name: "Confessions",
                Abbreviation: "Co"},
            {
                Name: "Rabid Dog",
                Abbreviation: "Rd"},
            {
                Name: "To'hajilee",
                Abbreviation: "Th"},
            {
                Name: "Ozymandias",
                Abbreviation: "Ozy"},
            {
                Name: "Granite State",
                Abbreviation: "Gs"},
            {
                Name: "Felina",
                Abbreviation: "Fe"},
        ];

        // Iterated through 
        let seasons = [
            season1,
            season2,
            season3,
            season4,
            season5
        ];

        let table = document.getElementById("table");
        let level = 0;
        
        for (let seasonIndex = 0; seasonIndex < seasons.length; seasonIndex++) {
            let season = seasons[seasonIndex];
            
            for (let index = 0; index < season.length; index++) {
                level += 1;

                // Makes elements in form:
                // <div class="period 1">
                //     <div class="period-inner">
                //         <div class="title">L1</div>
                //         <div class="desc">Level1</div>
                //     </div>
                // </div>
                let period = document.createElement("div")
                period.setAttribute("class", "period " + toWord(seasonIndex + 1));
                let period_inner = document.createElement("div")
                period_inner.setAttribute("class", "period-inner");

                let title = document.createElement("div")
                title.setAttribute("class", "title");
                title.innerHTML = season[index].Abbreviation;
                let desc = document.createElement("div")
                desc.setAttribute("class", "desc"); 
                desc.innerHTML = "Level " + level;

                period_inner.appendChild(title);
                period_inner.appendChild(desc);
             
                period_inner.setAttribute("level", level)
                period_inner.onclick = function(event) {
                    m_SELECTED_LEVEL.level = Number(event.currentTarget.getAttribute("level"));
                    console.log(m_SELECTED_LEVEL.level);
                };

                period.appendChild(period_inner);
                table.appendChild(period);
            }
        }

        // Makes empty spaces 
        for (let index = 0; index < 4; index++) {
            let gap = document.createElement("div");
            gap.setAttribute("class", "empty-space-" + (index + 1));
            table.appendChild(gap);
        }        
    }
}

// {
//     Name: "",
//     Abbreviation: ""},