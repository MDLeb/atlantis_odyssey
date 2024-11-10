import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, OctreeInfo, physics, Prefab, Quat, RigidBody, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { config } from './test';
import { Octree } from './octree/Octree'; // Убедитесь, что пути правильные
import { A3DBoundary } from './octree/A3DBoundary';
import { Fruit } from './Fruit';

@ccclass('FruitGenerator')
export class FruitGenerator extends Component {
    @property(Prefab)
    fruit: Prefab = null;

    @property(Node)
    character: Node = null;

    @property(CCInteger)
    layers: number = 1;

    @property(CCFloat)
    offset: number = 1;

    private _borders: Node[];
    private _fruits: Node[] = [];
    private _octree: Octree;

    protected onEnable(): void {
        const borders = this.node.getChildByName('borders');
        this._borders = borders.children;
    }

    protected start(): void {
        const [left, right, top, bottom] = this._borders;
        const { x: x1 } = left.worldPosition;
        const { x: x2 } = right.worldPosition;
        const { z: z1 } = top.worldPosition;
        const { z: z2 } = bottom.worldPosition;

        const step = 0.5;
        let fruits = [];
        let oneLayer = [];

        for (let j = x1 + this.offset; j < x2 - this.offset; j += step) {
            for (let k = z1 + this.offset; k < z2 - this.offset; k += step) {
                fruits.push({ x: j, y: 0, z: k });
                oneLayer.push({ x: j, y: 0, z: k });
            }
        }

        if (this.layers > 1) {
            for (let i = 1; i < this.layers; i++) {
                oneLayer.forEach(item => {
                    fruits.push({ x: item.x, y: i * step, z: item.z });
                });
            }
        }

        fruits.forEach(item => {
            const fruit = instantiate(this.fruit);
            this._fruits.push(fruit);
            this.node.addChild(fruit);
            fruit.getComponentInChildren(Fruit).setCharacter(this.character);


            if (config.length) fruit.worldPosition = config.shift() as Vec3;
            if (config.length) fruit.worldRotation = config.shift() as Quat;
            fruit.getComponentInChildren(RigidBody).type = physics.ERigidBodyType.DYNAMIC;
        });
    }
}
