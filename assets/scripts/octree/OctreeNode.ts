
import { _decorator, Node, Vec3, geometry, Color, Line } from 'cc';
import { A3DBoundary } from './A3DBoundary';
const { ccclass, property } = _decorator;
// const { } = geometry;

@ccclass('OctreeNode')
export class OctreeNode {
    boundary: A3DBoundary;
    capacity: number;
    objects: Node[] = [];
    children: OctreeNode[] = [];
    divided: boolean = false;

    constructor(boundary: A3DBoundary, capacity: number) {
        this.boundary = boundary;
        this.capacity = capacity;
    }



    // Метод для создания 8 дочерних узлов
    subdivide() {
        const { x, y, z, width, height, depth } = this.boundary;

        // Проверка на минимальный размер, чтобы избежать деления на слишком мелкие узлы
        if (width <= 0 || height <= 0 || depth <= 0) {
            console.warn("Octree subdivision skipped due to zero or negative dimensions.");
            return;
        }

        const halfWidth = width / 2;
        const halfHeight = height / 2;
        const halfDepth = depth / 2;
        const childCapacity = this.capacity;

        // Создаем 8 дочерних узлов
        this.children = [
            // Верхний передний левый
            new OctreeNode(
                new A3DBoundary(x - halfWidth / 2, y + halfHeight / 2, z - halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Верхний передний правый
            new OctreeNode(
                new A3DBoundary(x + halfWidth / 2, y + halfHeight / 2, z - halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Верхний задний левый
            new OctreeNode(
                new A3DBoundary(x - halfWidth / 2, y + halfHeight / 2, z + halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Верхний задний правый
            new OctreeNode(
                new A3DBoundary(x + halfWidth / 2, y + halfHeight / 2, z + halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Нижний передний левый
            new OctreeNode(
                new A3DBoundary(x - halfWidth / 2, y - halfHeight / 2, z - halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Нижний передний правый
            new OctreeNode(
                new A3DBoundary(x + halfWidth / 2, y - halfHeight / 2, z - halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Нижний задний левый
            new OctreeNode(
                new A3DBoundary(x - halfWidth / 2, y - halfHeight / 2, z + halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
            // Нижний задний правый
            new OctreeNode(
                new A3DBoundary(x + halfWidth / 2, y - halfHeight / 2, z + halfDepth / 2, halfWidth, halfHeight, halfDepth),
                childCapacity
            ),
        ];

        this.divided = true;
    }

    insert(object: Node): boolean {
        if (!this.boundary.contains(object)) {
            return false;
        }

        if (this.objects.length < this.capacity) {
            this.objects.push(object);
            return true;
        }

        if (!this.divided) {
            this.subdivide();
        }

        for (let child of this.children) {
            if (child.insert(object)) {
                return true;
            }
        }

        return false;
    }

    query(range: A3DBoundary, found: Node[] = []): Node[] {
        if (!this.boundary.intersects(range)) return found;
        
        for (const obj of this.objects) {
            if (range.contains(obj)) {
                found.push(obj);
            }
        }

        if (this.divided) {
            for (const child of this.children) {
                child.query(range, found);
            }
        }

        return found;
    }
}
