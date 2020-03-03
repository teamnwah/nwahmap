import * as THREE from 'three';
import {Color, Group} from 'three';
import {ShapeCollection} from "./ShapeCollection";

export class HeadRenderer {
    constructor() {
        this.shapes = {};
        this.renderQueue = [];
        this.isRendering = false;
        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.canvas = null;
    }

    init(width = window.innerWidth, height = window.innerHeight) {
        if (window.OffscreenCanvas !== undefined) {
            this.canvas = new OffscreenCanvas(width, height);
        } else {
            let canvasElement = document.createElement("canvas");
            canvasElement.width = width;
            canvasElement.height = height;
            this.canvas = canvasElement;
        }

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true
        });

        this.renderer.setSize(width, height);

        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 200);
        this.camera.position.z = 40;

        this.scene = new THREE.Scene();

        let light = new THREE.PointLight(0xffffff, 1);
        light.position.set(1, 1, 2);

        // Make sure light follow the camera
        this.camera.add(light);

        // Add camera to scene so light gets rendered
        this.scene.add(this.camera);

        let ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(ambientLight);
    }

    async draw() {
        this.renderer.render(this.scene, this.camera);

        return new Promise(async (res, rej) => {
            window.requestAnimationFrame(async () => {
                if (this.canvas.convertToBlob) {
                    await this.canvas.convertToBlob({
                        type: 'image/png'
                    }).then(res, rej);
                } else {
                    this.canvas.toBlob((blob) => {
                        if (blob) return res(blob);
                        return rej();
                    }, 'image/png')
                }
            })
        })
    }

    render(objects) {
        return new Promise(async (res) => {
            this.renderQueue.push([objects, res]);

            if (!this.isRendering) {
                await this.startRender();
            }
        })
    }

    async startRender() {
        if (this.isRendering) return;
        this.isRendering = true;

        this.clear();
        while (this.renderQueue.length > 0) {
            let [objects, res] = this.renderQueue.shift();
            console.log(objects, res);
            let shapePromises = objects.map(async x => {
                let req = await fetch(`blob/shape/${x}.json`);
                let json = await req.json();
                let shapeColl = await ShapeCollection.forceLoad(json, 'blob/texture/');
                this.add(shapeColl);
            });
            await Promise.all(shapePromises);
            this.rotate(-5 * (Math.PI / 180), -30 * (Math.PI / 180), 0);
            res(await this.draw());
            this.clear();
        }

        this.isRendering = false;
    }

    add(shapeCollection) {
        this.shapes[shapeCollection.id] = shapeCollection;
        this.scene.add(shapeCollection.getGroup());
    }

    remove(shapeCollection) {
        delete this.shapes[shapeCollection.id];
        this.scene.remove(shapeCollection.getGroup());
    }

    clear() {
        for (let shape of Object.values(this.shapes)) {
            this.remove(shape)
        }
    }

    expose() {
        window.scene = this.scene;
        window.camera = this.camera;
        window.renderer = this.renderer;
    }

    rotate(x, y, z) {
        for (let shape of Object.values(this.shapes)) {

            let group = shape.getGroup();
            group.rotateX(x);
            group.rotateY(y);
            group.rotateZ(z);
        }
    }
}