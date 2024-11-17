import { _decorator, animation, CCBoolean, CCInteger, Component, Enum, instantiate, Node, ParticleSystem, Pool, Prefab, tween, v3, Vec3 } from 'cc';
import { GameEvent } from './enums/GameEvent';
import { gameEventTarget } from './GameEventTarget';
import { CollectableItems } from './CollectableItems';
import { ResourseSize } from './ResourseSize';
const { ccclass, property } = _decorator;


@ccclass('CollectableMap')
class CollectableMap {
    @property({ type: Enum(CollectableItems) })
    itemName: CollectableItems = CollectableItems.NONE

    @property(Prefab)
    prefab: Prefab
}

@ccclass('CollectPoint2')
export class CollectPoint2 extends Component {

    @property([CollectableMap])
    collectableMap: CollectableMap[] = []

    @property(CCInteger)
    maxCount: number = 15;

    @property(CCBoolean)
    isAnimationControlPoint: boolean = false;

    @property(ParticleSystem)
    maxParticle: ParticleSystem = null;

    @property({
        visible: function () { return this.isAnimationControlPoint ?? false },
        type: animation.AnimationController
    })
    animationController: animation.AnimationController = null;

    // private _resource: CollectableItems = null;
    private _resourcePool: Map<CollectableItems, Pool<Node>> = new Map();
    private _isTweenActive: boolean = false;
    private _characterIsMoving: boolean = false;
    private _itemsLength: number = 0;
    private _soundPlay: boolean = false;

    onEnable() {
        this._subscribeEvents(true);
    }

    onDisable() {
        this._subscribeEvents(false);
    }


    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.COLLECT_ITEM, this.onCollectItem, this);
        gameEventTarget[func](GameEvent.COLLECT_MONEY, this.onCollectMoney, this);

        gameEventTarget[func](GameEvent.JOYSTICK_MOVE, this.onJoystickMove, this);
        gameEventTarget[func](GameEvent.JOYSTICK_MOVE_END, this.onJoystickMoveEnd, this);

        gameEventTarget[func](GameEvent.RESOURCE_EXCHANGE, this.onResourceExchange, this)
    }

    onResourceExchange(node: Node, orderedresource: CollectableItems) {
        if (!this._resourcePool.has(orderedresource)) return;
        if (!this.node.children.length || this._itemsLength === 0) {
            if (this.animationController) {
                this.animationController.setValue('IsKeeping', false);
            }
            return;
        }
        const resourceNode = this.node.children[this._itemsLength - 1];
        const pool = this._resourcePool.get(orderedresource);
        gameEventTarget.emit(GameEvent.RESOURCE_RECEIVE, node, resourceNode, pool, () => { this._itemsLength-- });
    }

    onJoystickMove() {
        this._characterIsMoving = true
    }
    onJoystickMoveEnd() {
        this._characterIsMoving = false
    }

    onCollectItem(item: CollectableItems) {
        if (this._isTweenActive || !this._characterIsMoving) return;
        if (this.node.children.length >= this.maxCount) {
            this.maxParticle && this.maxParticle.play();
            if (!this._soundPlay) {
                this._soundPlay = true;
                this.scheduleOnce(() => {
                    gameEventTarget.emit(GameEvent.MAX_ITEMS);
                    this._soundPlay = false;
                }, 1.);
            }
            return
        }

        const resource = this.collectableMap.find(i => i.itemName === item);
        if (!resource) return;

        const { prefab, itemName } = resource;
        this._isTweenActive = true;

        //если пул для текущего ресурса еще не создан в мапе
        if (!this._resourcePool.has(item)) {
            this._resourcePool.set(item, new Pool<Node>(() => {
                return instantiate(prefab);
            }, 5))
        }

        const pool = this._resourcePool.get(item);
        const newResource = pool.alloc();
        const size = newResource.getComponentInChildren(ResourseSize).getSize();
        const prevPos = this.node.children[this.node.children.length - 1]?.position;
        const nextPos = prevPos ? prevPos.clone().add(v3(0, size.y, 0)) : v3(0, 0, 0);

        this.node.addChild(newResource);
        newResource.position = nextPos
        this._itemsLength++;
        tween(newResource)
            .to(0.2, { scale: v3(2, 2, 2) }, {
                onStart: () => {
                    if (this.isAnimationControlPoint) {
                        this.animationController.setValue('IsKeeping', true)
                    }
                },
                onComplete: () => {
                    gameEventTarget.emit(GameEvent.COLLECT_ITEM_SOUND);
                    this._isTweenActive = false;
                }
            })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }

    onCollectMoney(count: number, node: Node) {
        const resource = this.collectableMap.find(i => i.itemName === CollectableItems.MONEY);
        if (!resource || this._isTweenActive) return;

        this._isTweenActive = true;

        const { prefab, itemName } = resource;
        if (!this._resourcePool.has(itemName)) {
            this._resourcePool.set(itemName, new Pool<Node>(() => {
                return instantiate(prefab);
            }, 5))
        }
        const pool = this._resourcePool.get(itemName);

        for (let i = 0; i < count; i++) {
            const newResource = pool.alloc();
            const size = newResource.getComponentInChildren(ResourseSize).getSize();
            const nextPos = v3(0, 0, 0).add(v3(0, size.y * this._itemsLength, 0));

            this._itemsLength++;

            let startPos: Vec3;
            tween(newResource)
                .delay(i * 0.1)
                .to(0.1, { scale: v3(2, 2, 2) }, {
                    onStart: () => {
                        this.node.addChild(newResource);
                        newResource.worldPosition = node.worldPosition;
                        startPos = newResource.position
                    },
                })
                .to(0.3, { scale: v3(1, 1, 1), position: nextPos }, {
                    onComplete: () => {
                        if (i >= count - 1) {
                            this._isTweenActive = false;
                        }
                    },
                    onUpdate: (newResource, ratio) => {
                        const amplitude = 2;
                        const offsetY = Math.sin(ratio * Math.PI) * amplitude;

                        newResource.position = v3(
                            newResource.position.x,
                            startPos.y + (nextPos.y - startPos.y) * ratio + offsetY,
                            newResource.position.z
                        );
                    }
                })
                .start();
        }
    }

}


