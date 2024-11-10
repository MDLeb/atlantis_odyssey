import { _decorator, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('A3DBoundary')
export class A3DBoundary {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;

    constructor(x: number, y: number, z: number, width: number, height: number, depth: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }

    contains(object: Node): boolean {
        const pos = object.worldPosition;
        
        return (
            pos.x >= this.x - this.width / 2 && pos.x <= this.x + this.width / 2 &&
            pos.y >= this.y - this.height / 2 && pos.y <= this.y + this.height / 2 &&
            pos.z >= this.z - this.depth / 2 && pos.z <= this.z + this.depth / 2
        );
    }

    intersects(range: A3DBoundary): boolean {
        return (
            this.x < range.x + range.width &&
            this.x + this.width > range.x &&
            this.y < range.y + range.height &&
            this.y + this.height > range.y &&
            this.z < range.z + range.depth &&
            this.z + this.depth > range.z
        );
    }
}
