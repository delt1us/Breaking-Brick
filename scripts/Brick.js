// Brick superclass
class Brick {
    vec3_BOX_SIZE;
    m_Cube;
    m_BoundingBox;
    i_Health;
    #i_ScoreValue;
    #a_Textures;

    constructor(m_Scene, location, textures, health) {
        this.vec3_BOX_SIZE = new THREE.Vector3(120, 60, 60);
        this.#a_Textures = textures;
        this.#i_ScoreValue = 10 * health;
        this.i_Health = health;

        this.#MakeCuboid(m_Scene);
        this.#SetCuboidPosition(location);
        this.#UpdateColour();
    }

    #AddHealth(health) {
        this.i_Health += health;
        this.#UpdateColour();
    }

    // Determines what colur the brick should be
    #UpdateColour() {
        let colour;
        switch(this.i_Health) {
            default:
                colour = this.#a_Textures["Grey"];
                break;
            case 1:
                colour = this.#a_Textures["Purple"];
                break;
            case 2:
                colour = this.#a_Textures["Lime"];
                break;
            case 3:
                colour = this.#a_Textures["Pink"];
                break;
            case 4:
                colour = this.#a_Textures["Yellow"];
                break;
            case 5:
                colour = this.#a_Textures["Hot Pink"];
                break;
            case 6:
                colour = this.#a_Textures["Orange"];
                break;
            case 7:
                colour = this.#a_Textures["Blue"];
                break;
            case 8: 
                colour = this.#a_Textures["Green"];
                break;
        }
        this.m_Cube.material = colour;
    }

    // Called every frame from Grid.js
    Update() {
        this.m_BoundingBox.setFromObject(this.m_Cube);
    }
    
    Hit(grid, scene, scoreCounter) {
        this.#AddHealth(-1);
        if (this.i_Health == 0) {
            this.#Destroy(grid, scene, scoreCounter);
        }
    }

    #SetCuboidPosition(location) {
        // Moves brick to proper location on grid
        this.m_Cube.position.set(location[0], location[1], 0);
    }

    #MakeCuboid(m_Scene) {
        let BoxGeometry = this.#MakeGeometry();
        this.m_Cube = new THREE.Mesh(BoxGeometry, this.#a_Textures["White"]);
        m_Scene.add(this.m_Cube);
    
        this.m_BoundingBox = new THREE.Box3().setFromObject(this.m_Cube);
    }

    #MakeGeometry() {
        let BoxGeometry = new THREE.BoxGeometry(this.vec3_BOX_SIZE.x, this.vec3_BOX_SIZE.y, this.vec3_BOX_SIZE.z);
        return BoxGeometry;
    }

    // Destroys the brick and removes it from the grid
    #Destroy(grid, scene, scoreCounter) {
        scoreCounter.Add(this.#i_ScoreValue);
        // Finds and removes brick from grid array 
        grid.splice(grid.indexOf(this), 1);
        scene.remove(this.m_Cube);
        this.m_Cube.geometry.dispose();
        this.m_Cube.material.dispose();
        this.m_Cube = undefined;
    }
}

// // Got these shaders from https://stackoverflow.com/questions/16287547/multiple-transparent-textures-on-the-same-mesh-face-in-three-js
// function fragmentShader() {
//     return `
//         #ifdef GL_ES
//         precision highp float;
//         #endif
        
//         uniform sampler2D tOne;
//         uniform sampler2D tSec;
        
//         varying vec2 vUv;
        
//         void main(void)
//         {
//             vec3 c;
//             vec4 Ca = texture2D(tOne, vUv);
//             vec4 Cb = texture2D(tSec, vUv);
//             c = Ca.rgb * Ca.a + Cb.rgb * Cb.a * (1.0 - Ca.a);  // blending equation
//             gl_FragColor= vec4(c, 1.0);
//         }
//     `
// }

// function vertexShader() {
//     return `
//         varying vec2 vUv;

//         void main()
//         {
//             vUv = uv;
//             vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//             gl_Position = projectionMatrix * mvPosition;
//         }
//     `
// }