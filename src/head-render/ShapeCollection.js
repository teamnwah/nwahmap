import {Shape} from "./Shape";
import {Group} from "three";
import {uuidv4} from "../utils";

export class ShapeCollection {
    constructor({shapes = [], name = ""}, filePrefix = "", onLoad = () => {
    }, forceLoad = false) {
        this.id = uuidv4();
        let loaded = 0;
        this.shapes = shapes.map((s) => new Shape(s, filePrefix, () => {
            loaded++;

            if (loaded === shapes.length) {
                this.isLoaded = true;
                this.onLoad();
            }
        }, forceLoad));

        this.isLoaded = false;
        this.onLoad = onLoad;
        this.group = null;

        if (this.shapes.length === 0) {
            this.onLoad();
            this.isLoaded = true;
        }
    }

    static forceLoad(shapeCollection, filePrefix) {
        return new Promise((res, rej) => {
            let shapeColl = new ShapeCollection(shapeCollection, filePrefix, () => {
                res(shapeColl)
            }, true)
        });
    }

    getGroup() {
        if (this.group) {
            return this.group;
        }

        // Create group for all shapes
        this.group = new Group();

        for (let shape of this.shapes) {
            this.group.add(shape.getMesh())
        }

        return this.group
    }
}