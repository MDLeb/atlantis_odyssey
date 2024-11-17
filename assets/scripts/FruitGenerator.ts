import { _decorator, CCBoolean, CCFloat, CCInteger, Collider, Component, instantiate, Line, MeshRenderer, Node, OctreeInfo, ParticleSystem, physics, Prefab, Quat, RigidBody, Script, tween, v3, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
import { configPosOranges } from './configPosOranges';
import { configPosWatermelon } from './configPosWatermelons';
// import { octree } from 'd3-octree';
import { Fruit } from './Fruit';
import Octree from './octree/octree';


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

    @property(CCFloat)
    step: number = 0.2;

    @property(CCBoolean)
    useConfig: boolean = false;

    @property(CCBoolean)
    useAnimation: boolean = false;


    private _borders: Node[];
    private _fruits: Node[] = [];
    private _fruitsComp: Fruit[] = [];
    private _line: Line;
    private _config: any[];
    private _particle: ParticleSystem;
    private _octree: Octree;
    // private _oldOctreeNodes: Set<Node>;
    // private _octreeNodes: Set<Node>;

    protected onEnable(): void {
        //@ts-ignore
        // console.log(physics.PhysicsSystem.instance);
        // this._line = this.node.getComponentInChildren(Line);
        // this._octree = new Octree(100, 8);

        this._particle = this.node.getComponentInChildren(ParticleSystem);
        const borders = this.node.getChildByName('borders');
        this._borders = borders.children;
        if (this.useConfig) {
            switch (this.fruit.name) {
                case ('orange'):
                    this._config = configPosOranges;
                    break;
                case ('watermelon'):
                    this._config = configPosWatermelon;
                    break;
            }
        }
    }

    protected start(): void {
        const [left, right, top, bottom] = this._borders;
        const { x: x1 } = left.position;
        const { x: x2 } = right.position;
        const { z: z1 } = top.position;
        const { z: z2 } = bottom.position;

        const { step } = this;
        let fruits = [];
        let oneLayer = [];

        for (let j = x1 + this.offset; j < x2 - this.offset; j += step) {
            for (let k = z1 + this.offset; k < z2 - this.offset; k += step) {
                fruits.push({ x: j, y: step, z: k });
                oneLayer.push({ x: j, y: step, z: k });
            }
        }

        if (this.layers > 1) {
            for (let i = 1; i < this.layers; i++) {
                oneLayer.forEach(item => {
                    fruits.push({ x: item.x, y: i * step, z: item.z });
                });
            }
        }

        fruits.forEach((item: any, i: number) => {
            const fruit = instantiate(this.fruit);
            this._fruits.push(fruit);
            this.node.addChild(fruit);

            const comp = fruit.getComponentInChildren(Fruit)
            comp.setCharacter(this.character);
            this._fruitsComp.push(comp);

            const rigidBody = fruit.getComponentInChildren(RigidBody)
            rigidBody.type = physics.ERigidBodyType.STATIC;

            if (this.useConfig && this._config) {
                if (this._config.length) fruit.worldPosition = this._config.shift() as Vec3;
                if (this._config.length) fruit.worldRotation = this._config.shift() as Quat;
            } else {
                const r = v3(
                    Math.random() * 0.001,
                    Math.random() * 0.001,
                    Math.random() * 0.001,
                )
                fruit.position = v3(item.x, item.y, item.z)
                    .add(r);
            }

            if (this.useAnimation) {
                fruit.children[0].scale = v3(0, 0, 0);

                this._particle && this._particle.play();
                tween(fruit.children[0])
                    .delay((z2 - item.z) * 0.1)
                    .to(0.2, { scale: v3(2, 2, 2) })
                    .to(0.1, { scale: v3(1, 1, 1) }, {
                        onComplete: () => {
                            rigidBody.type = physics.ERigidBodyType.DYNAMIC;
                        }
                    })
                    .start();
            } else {
                rigidBody.type = physics.ERigidBodyType.DYNAMIC;
            }


        });

        // this._octree.build(this._line, this._fruits, (fruit: Node) => {
        //     let meshRenderer = fruit.getComponentInChildren(MeshRenderer);
        //     if (meshRenderer) {
        //         meshRenderer.model.updateWorldBound();
        //         return meshRenderer.model.worldBounds;
        //     }
        // });
    }

    protected update(): void {
        // for (let [item] of this._oldOctreeNodes.entries()) {
        //     item.getComponentInChildren(Fruit).togglePhysics(false);
        // }

        // this._octreeNodes = this._octree.select(this.character.getComponentInChildren(Collider).worldBounds);
        // for (let [item] of this._octreeNodes.entries()) {
        //     item.getComponentInChildren(Fruit).togglePhysics(true);
        // }
        // this._oldOctreeNodes = this._octreeNodes;
    }


}
