import { _decorator, CCInteger, Component, Enum, Node, Pool, tween, v3 } from 'cc';
import { GameEvent } from '../enums/GameEvent';
import { gameEventTarget } from '../GameEventTarget';
import { CollectPoint } from '../CollectPoint';
import { CollectableItems } from '../CollectableItems';
import { ResourseSize } from '../ResourseSize';
import { Bubble } from '../Bubble';
import { MoneyGenerator } from '../MoneyGenerator';
const { ccclass, property } = _decorator;

enum tableStates { NONE, ORDER, PAY };

@ccclass('ExchangingArea2')
export class ExchangingArea2 extends Component {

    @property(CollectPoint)
    collectPoint: CollectPoint = null;

    @property(Bubble)
    bubbleCounter: Bubble = null;

    @property(MoneyGenerator)
    moneyGenerator: MoneyGenerator = null;

    @property(CCInteger)
    count: number = 10;

    @property({ type: Enum(CollectableItems) })
    receivingItem: CollectableItems = CollectableItems.NONE;


    private _state: tableStates = tableStates.ORDER;

    // private _isReceiving: boolean = false;//???
    private _orderedResource: CollectableItems = CollectableItems.ORANGE;
    private _isTweenActive: boolean = false;
    private _count: number = 10;

    onEnable() {
        this._subscribeEvents(true);
        this._count = this.count;
        this.setOrderedResource(this.receivingItem, this.count);
    }

    onDisable() {
        this._subscribeEvents(false);
    }

    setOrderedResource(resource: CollectableItems, count: number) {
        this._orderedResource = resource;
        this._count = count;
        this.bubbleCounter.setCounter(0, count)

    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.INTERACTION, this.onInteraction, this)
        gameEventTarget[func](GameEvent.INTERACTION_END, this.onInteractionEnd, this)
        gameEventTarget[func](GameEvent.RESOURCE_RECEIVE, this.onResourceReceive, this)
    }

    onInteraction(node: Node) {
        if (this.node !== node) return;

        if (this._state === tableStates.ORDER) {
            gameEventTarget.emit(GameEvent.RESOURCE_EXCHANGE, this.node, this._orderedResource);
        }

        if (this._state === tableStates.PAY) {
            gameEventTarget.emit(GameEvent.COLLECT_MONEY, this._count, this.collectPoint.node);
            this._state = tableStates.NONE //???
            this._onExchangeComplete();
        }
    }

    onResourceReceive(node: Node, resourceNode: Node, pool: Pool<Node>, cb: Function) {
        if (this.node !== node || this._isTweenActive || !resourceNode) return;

        this._isTweenActive = true;
        this.collectPoint.setItemSize(resourceNode.getComponentInChildren(ResourseSize).getSize());

        cb && cb();
        tween(resourceNode)
            .to(0.2, { position: this.collectPoint.getNextPosition() }, {
                onComplete: () => {
                    this.collectPoint.node.addChild(resourceNode);
                    this.bubbleCounter.setCounter(this.collectPoint.node.children.length, this._count)
                    this._isTweenActive = false;

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
        this._state = tableStates.NONE;
        this.moneyGenerator && this.moneyGenerator.onExchangeReady();
        this.bubbleCounter.toggle(false);
        this.collectPoint.node.removeAllChildren();


        this.scheduleOnce(() => {
            this._state = tableStates.PAY;
        }, 1)

    }

    _onExchangeComplete() {
        this.moneyGenerator && this.moneyGenerator.onExchangeComplete();
        this.bubbleCounter.setCounter(0, this._count);

        this.scheduleOnce(() => {
            this._state = tableStates.ORDER;
            console.log('+++++');
            
            this.bubbleCounter.toggle(true);
        }, 1.5)
    }

    onResourceExchange() {

    }

    onInteractionEnd(node: Node) {
        if (this.node !== node) return;

        // this._isReceiving = false;

    }

}


