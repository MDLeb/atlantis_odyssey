import { _decorator, CCInteger, Component, Enum, Node, Pool, tween, v3, Vec3 } from 'cc';
import { GameEvent } from '../enums/GameEvent';
import { gameEventTarget } from '../GameEventTarget';
import { HeapCounter } from '../HeapCounter';
import { CollectableItems } from '../CollectableItems';
import { ResourseSize } from '../ResourseSize';
import { Bubble } from '../Bubble';
import { MoneyGenerator } from '../MoneyGenerator';
const { ccclass, property } = _decorator;

export enum areaStates { NONE, RECEIVE, PAY };

@ccclass('ExchangingArea2')
export class ExchangingArea2 extends Component {

    @property(HeapCounter)
    collectPoint: HeapCounter = null;

    @property(Bubble)
    bubbleCounter: Bubble = null;

    @property(MoneyGenerator)
    moneyGenerator: MoneyGenerator = null;

    @property(CCInteger)
    count: number = 10;

    @property({ type: Enum(CollectableItems) })
    receivingItem: CollectableItems = CollectableItems.NONE;


    protected _state: areaStates = areaStates.RECEIVE;
    protected _count: number = 10;
    private _orderedResource: CollectableItems = CollectableItems.ORANGE;
    private _isTweenActive: boolean = false;

    onEnable() {
        this._subscribeEvents(true);
        this._count = this.count;
        this._setOrderedResource(this.receivingItem, this.count);
    }

    onDisable() {
        this._subscribeEvents(false);
    }

    private _setOrderedResource(resource: CollectableItems, count: number) {
        this._orderedResource = resource;
        this._count = count;
        this.bubbleCounter.setCounter(0, count)

    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.INTERACTION, this.onInteraction, this)
        gameEventTarget[func](GameEvent.RESOURCE_RECEIVE, this.onResourceReceive, this)
    }

    onInteraction(node: Node) {
        if (this.node !== node) return;

        if (this._state === areaStates.RECEIVE) {
            gameEventTarget.emit(GameEvent.RESOURCE_EXCHANGE, this.node, this._orderedResource);
        }

        if (this._state === areaStates.PAY) {
            gameEventTarget.emit(GameEvent.COLLECT_MONEY, this._count, this.collectPoint.node);
            this._state = areaStates.NONE
            this._onExchangeComplete();
        }
    }

    onResourceReceive(node: Node, resourceNode: Node, pool: Pool<Node>, cb: Function) {
        if (this.node !== node || this._isTweenActive || !resourceNode) return;

        this._isTweenActive = true;
        this.collectPoint.setItemSize(resourceNode.getComponentInChildren(ResourseSize).getSize());

        cb && cb();

        let startPos: Vec3 = resourceNode.worldPosition.clone();
        let nextPos: Vec3 = this.collectPoint.getNextPosition();

        tween(resourceNode)
            .to(0.05, { scale: v3(1.2, 1.2, 1.2) }, {
                onStart: () => {
                    this.collectPoint.node.addChild(resourceNode);
                    resourceNode.worldPosition = startPos;
                },
            })
            .to(0.1, { scale: v3(1, 1, 1), position: nextPos }, {
                onUpdate: (newResource, ratio) => {
                    const amplitude = 2;
                    const offsetY = Math.sin(ratio * Math.PI) * amplitude;

                    newResource.position = v3(
                        newResource.position.x,
                        startPos.y + (nextPos.y - startPos.y) * ratio + offsetY,
                        newResource.position.z
                    );
                },
                onComplete: () => {
                    this.bubbleCounter.setCounter(this.collectPoint.node.children.length, this._count);
                    this._isTweenActive = false;


                    if (resourceNode.name === 'money') {
                        gameEventTarget.emit(GameEvent.CHANGE_MONEY_COUNTER, -1);
                    }

                    if (this.collectPoint.node.children.length >= this._count) {
                        let length = this.collectPoint.node.children.length;
                        for (let i = 0; i < length; i++) {
                            pool.free(this.collectPoint.node.children[i]);
                        }
                        this._onExchangeReady();
                    }
                }
            })
            .start();
    }

    _onExchangeReady() {
        this._state = areaStates.NONE;
        this.moneyGenerator && this.moneyGenerator.onExchangeReady();
        this.bubbleCounter.toggle(false);
        this.collectPoint.node.removeAllChildren();


        this.scheduleOnce(() => {
            this._state = areaStates.PAY;
        }, 0.5)

    }

    _onExchangeComplete() {
        this.moneyGenerator && this.moneyGenerator.onExchangeComplete();
        this.bubbleCounter.setCounter(0, this._count);

        this.scheduleOnce(() => {
            this._state = areaStates.RECEIVE;

            this.bubbleCounter.toggle(true);
        }, 1.5)
    }

}


