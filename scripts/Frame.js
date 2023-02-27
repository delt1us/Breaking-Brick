import * as THREE from 'three';

// Class to hold Object3Ds
export class Frame {
    // THREE.Mesh objects
    m_WallLeft;
    m_WallRight;
    m_WallTop;
    m_WallBack;

    m_LeftBoundingBox;
    m_RightBoundingBox;
    m_TopBoundingBox;

    vec_WallSideSize;
    vec_WallTopSize;

    constructor(scene) {
        // Material gets re used for walls and ceiling
        const m_Material = new THREE.MeshStandardMaterial({ color: 0x1a2749 });

        // Size gets re used for left and right walls
        this.vec_WallSideSize = new THREE.Vector3(200, 1080, 60);
        // Size for ceiling
        this.vec_WallTopSize = new THREE.Vector3(1920, 100, 60);

        this.#CreateWallLeft(m_Material);
        this.#CreateWallRight(m_Material);
        this.#CreateWallTop(m_Material);
        this.#CreateWallBack(m_Material);

        this.#CreateBoundingBoxes();

        scene.add(this.m_WallLeft, this.m_WallRight, this.m_WallTop, this.m_WallBack);
    }
    #CreateBoundingBoxes() {
        // Makes bounding boxes
        this.m_LeftBoundingBox = new THREE.Box3().setFromObject(this.m_WallLeft);
        this.m_RightBoundingBox = new THREE.Box3().setFromObject(this.m_WallRight);
        this.m_TopBoundingBox = new THREE.Box3().setFromObject(this.m_WallTop);
    }
 
    // Called from constructor
    #CreateWallLeft(material) {
        const geometry = new THREE.BoxGeometry(this.vec_WallSideSize.x, this.vec_WallSideSize.y, this.vec_WallSideSize.z);
        this.m_WallLeft = new THREE.Mesh(geometry, material);
        this.m_WallLeft.position.set(0, 590, 0);
    }
    // Called from constructor
    #CreateWallRight(material) {
        const geometry = new THREE.BoxGeometry(this.vec_WallSideSize.x, this.vec_WallSideSize.y, this.vec_WallSideSize.z);
        this.m_WallRight = new THREE.Mesh(geometry, material);
        this.m_WallRight.position.set(1920, 590, 0);
    }
    // Called from constructor
    #CreateWallTop(material) {
        const geometry = new THREE.BoxGeometry(this.vec_WallTopSize.x, this.vec_WallTopSize.y, this.vec_WallTopSize.z);
        this.m_WallTop = new THREE.Mesh(geometry, material);
        this.m_WallTop.position.set(960, 1080, 0);
    }
    // Called from constructor
    #CreateWallBack() {
        const material = new THREE.MeshStandardMaterial({ color: 0x0e1734 });
        const geometry = new THREE.BoxGeometry(1920, 1080, 100);
        this.m_WallBack = new THREE.Mesh(geometry, material);
        this.m_WallBack.position.set(960, 590, -90);
    }
}