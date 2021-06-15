import * as THREE from "three";
import OrbitControls from "three-orbitcontrols";
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

import {
    ROTATION_START_COLOR,
    ROTATION_CHANGE_COLOR,
    ROTATION_END_COLOR,
} from "./constants";

// const sceneSizes = {
//     width: window.innerWidth,
//     height: window.innerHeight,
// }

const sceneSizes = {
    width: 800,
    height: 300,
};

class Three {
    constructor({canvasContainer, meshColor, meshColorChange, autoRotate}) {
        this.initScene();
        this.initCamera();
        this.initRenderer(canvasContainer);
        this.initOrbitControls(meshColorChange, autoRotate);
        this.renderRect(meshColor);
        this.render();
        this.animate();
    }

    initRenderer(canvasContainer) {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(sceneSizes.width, sceneSizes.height);

        canvasContainer.appendChild(this.renderer.domElement);
    }

    initOrbitControls(meshColorChange, autoRotate) {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.controls.autoRotate = autoRotate;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // this.controls.maxPolarAngle = -Math.PI / 2;
        // this.controls.minPolarAngle = Math.PI / 2;

        this.controls.addEventListener("start", () =>
            meshColorChange(ROTATION_START_COLOR)
        );
        this.controls.addEventListener("change", () =>
            meshColorChange(ROTATION_CHANGE_COLOR)
        );
        this.controls.addEventListener("end", () =>
            meshColorChange(ROTATION_END_COLOR)
        );
    }

    initScene() {
        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color("white");
    }

    initCamera() {
        const near = -400;
        const far = 400;

        this.camera = new THREE.OrthographicCamera(
            sceneSizes.width / -2,
            sceneSizes.width / 2,
            sceneSizes.height / 2,
            sceneSizes.height / -2,
            near,
            far
        );

        this.camera.position.set(0, 0, 1); // Обязательно нужно для работы OrbitControls
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    renderRect(color) {

        for (let i = 0; i <= 5000; i++) {
            const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

            const material = new THREE.MeshBasicMaterial({color});

            this.box = new THREE.Mesh(boxGeometry, material);

            // this.box.position.x = 200;
            // this.box.position.y = 0;
            // this.box.position.z = -100;

            this.box.position.x = Math.floor(Math.random() * 200);
            this.box.position.y = Math.floor(Math.random() * 200);
            this.box.position.z = Math.floor(Math.random() * 200);

            this.scene.add(this.box);
        }

    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.controls.update(); // Чтобы эффекты работали

        this.render();
    }
    //
    // meshColorChange(meshColor) {
    //     // Меняем цвет квадратов
    //     this.box.material.color.set(meshColor);
    //     this.plane.material.color.set(meshColor);
    //
    //     // Запускаем рендеринг (отобразится квадрат с новым цветом)
    //     this.render();
    // }
    //
    // autoRotateChange(autoRotate) {
    //     this.controls.autoRotate = autoRotate;
    // }
    //
    // autoRotateSpeedChange(autoRotateSpeed) {
    //     this.controls.autoRotateSpeed = autoRotateSpeed;
    // }
    //
    // enableDampingChange(enableDamping) {
    //     this.controls.enableDamping = enableDamping;
    // }
}

export default Three;
