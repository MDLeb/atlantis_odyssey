import { _decorator, director, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { A3DBoundary } from "./A3DBoundary";
import { OctreeNode } from "./OctreeNode";

@ccclass('Octree')
export class Octree {
    root: OctreeNode;

    constructor(boundary: A3DBoundary, capacity: number) {
        this.root = new OctreeNode(boundary, capacity);
    }

    insert(object: Node): void {
        this.root.insert(object);
    }

    query(range: A3DBoundary): Node[] {
        return this.root.query(range);
    }
}
